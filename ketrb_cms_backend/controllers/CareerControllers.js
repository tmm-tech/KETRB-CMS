const { query } = require('../config/sqlConfig');
const cloudinary = require('cloudinary').v2;

module.exports = {
  // Add a new job posting
  AddCareer: async (req, res) => {
    const { title, description, department, job_type, location, salary_range, closing_date } = req.body;

    try {
      const result = await query(
        `INSERT INTO careers (title, description, department, job_type, location, salary_range, closing_date) 
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [title, description, department, job_type, location, salary_range, closing_date]
      );

      res.status(201).json({ message: 'Job posting added successfully', career: result.rows[0] });
    } catch (error) {
      console.error('Error adding job posting:', error);
      res.status(500).json({ message: 'Server error while adding job posting.' });
    }
  },

  // Get all job postings (excluding deleted ones)
  GetAllCareers: async (req, res) => {
    try {
      const result = await query('SELECT * FROM careers WHERE isdeleted = false ORDER BY posted_date DESC');
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching job postings:', error);
      res.status(500).json({ message: 'Error fetching job postings.' });
    }
  },

  // Get a single job posting by ID
  GetCareerById: async (req, res) => {
    const { id } = req.params.id;
    console.log('ID: ', id);
    try {
      const result = await query('SELECT * FROM careers WHERE id = $1 AND isdeleted = false', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Job posting not found.' });
      }
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching job posting:', error);
      res.status(500).json({ message: 'Error fetching job posting.' });
    }
  },

  // Update a job posting
  UpdateCareer: async (req, res) => {
    const { id } = req.params;
    const { title, description, department, job_type, location, salary_range, closing_date } = req.body;

    try {
      const result = await query(
        `UPDATE careers SET title = $1, description = $2, department = $3, job_type = $4, 
        location = $5, salary_range = $6, closing_date = $7 WHERE id = $8 RETURNING *`,
        [title, description, department, job_type, location, salary_range, closing_date, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Job posting not found.' });
      }

      res.status(200).json({ message: 'Job posting updated successfully', career: result.rows[0] });
    } catch (error) {
      console.error('Error updating job posting:', error);
      res.status(500).json({ message: 'Error updating job posting.' });
    }
  },

  // Soft delete a job posting
  DeleteCareer: async (req, res) => {
    const { id } = req.params;
    try {
      const result = await query('UPDATE careers SET isdeleted = TRUE WHERE id = $1 RETURNING *', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Job posting not found.' });
      }
      res.status(200).json({ message: 'Job posting marked as deleted.', career: result.rows[0] });
    } catch (error) {
      console.error('Error deleting job posting:', error);
      res.status(500).json({ message: 'Error deleting job posting.' });
    }
  },
  ApproveCareer: async (req, res) => {
    const { id } = req.params;

    try {
      // Fetch the career posting by its ID
      const careerResult = await query('SELECT title FROM careers WHERE id = $1', [id]);

      // Check if the career exists
      if (careerResult.rows.length === 0) {
        return res.status(404).json({ message: 'Career posting not found.' });
      }

      const filename = careerResult.rows[0].title;

      // Check if there is an existing notification for this career
      const existingNotification = await query(
        'SELECT sender_id FROM notifications WHERE (notification_type = $1 OR notification_type = $2) AND item_id = $3',
        ['career_uploaded', 'career_updated', filename]
      );

      if (existingNotification.rows.length > 0) {
        // If an existing notification is found, use its sender_id
        const senderIdToUse = existingNotification.rows[0].sender_id;

        // Update the career status to 'approved' or 'published'
        const result = await query(
          'UPDATE careers SET status = $1 WHERE id = $2 RETURNING *',
          ['approved', id]
        );

        if (result.rows.length === 0) {
          return res.status(404).json({ message: 'Career posting not found.' });
        }

        // Create a notification for the career approval
        await query(
          'INSERT INTO notifications (notification_type, item_id, message, sender_id, target_role, is_read) VALUES ($1, $2, $3, $4, $5, $6)',
          [
            'career_approved',
            id,
            `Career posting has been approved for publishing.`,
            senderIdToUse,
            'admin',
            false
          ]
        );

        res.status(200).json({ message: 'Career posting approved successfully', career: result.rows[0] });
      } else {
        res.status(404).json({ message: 'No existing notification found for this career.' });
      }
    } catch (error) {
      console.error('Error approving career posting:', error);
      res.status(500).json({ message: 'Error approving the career posting.' });
    }
  },

  // Apply for a job
  ApplyForJob: async (req, res) => {
    const { career_id, first_name, last_name, email, phone, cover_letter } = req.body;
    const resumeFile = req.file;

    try {
      let resumeUrl = null;
      if (resumeFile) {
        const cloudinaryResult = await cloudinary.uploader.upload(resumeFile.path, { folder: 'resumes' });
        resumeUrl = cloudinaryResult.secure_url;
      }

      const result = await query(
        `INSERT INTO career_applications (career_id, first_name, last_name, email, phone, resume, cover_letter) 
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [career_id, first_name, last_name, email, phone, resumeUrl, cover_letter]
      );

      res.status(201).json({ message: 'Job application submitted successfully', application: result.rows[0] });
    } catch (error) {
      console.error('Error applying for job:', error);
      res.status(500).json({ message: 'Error submitting job application.' });
    }
  },

  // Get all job applications
  GetAllApplications: async (req, res) => {
    try {
      const result = await query('SELECT * FROM career_applications ORDER BY applied_date DESC');
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching job applications:', error);
      res.status(500).json({ message: 'Error fetching job applications.' });
    }
  }
};