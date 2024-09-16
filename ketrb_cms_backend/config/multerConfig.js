const multer = require('multer');
const path = require('path');
const fs = require('fs');


const rootDirectory = path.resolve(__dirname, '../');


const uploadFolderPath = path.join(rootDirectory, 'uploads');


if (!fs.existsSync(uploadFolderPath)) {
  fs.mkdirSync(uploadFolderPath, { recursive: true });
}


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolderPath); 
  },
  filename: (req, file, cb) => {
    const originalName = file.originalname;
    const nameWithoutExtension = originalName.split('.').slice(0, -1).join('.'); 
    const extension = path.extname(originalName);


    const truncatedName = nameWithoutExtension.substring(0, 10);
    const uniqueName = `ketrb_${Date.now()}-${truncatedName}${extension}`;

    cb(null, uniqueName);
  }
});


const upload = multer({ storage });

module.exports = upload;