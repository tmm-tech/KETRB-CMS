import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  FileText,
  CheckCircle,
  XCircle,
  MessageSquare,
  Clock,
  User,
  Globe,
  Linkedin,
} from "lucide-react";
import { Button } from "../../../Component/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../Component/tabs";
import { Badge } from "../../../Component/badge";
import { Separator } from "../../../Component/separator";
import { Textarea } from "../../../Component/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../Component/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../Component/select";

const ApplicationDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("details")
  const [notes, setNotes] = useState("")
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const [showInterviewDialog, setShowInterviewDialog] = useState(false)
  const [interviewDate, setInterviewDate] = useState("")
  const [interviewTime, setInterviewTime] = useState("")
  const [interviewType, setInterviewType] = useState("in-person")

  // Mock application data
  const application = {
    id: "APP-001",
    status: "reviewed",
    appliedDate: "2023-03-15",

    // Personal Information
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@example.com",
    phone: "+254 712 345 678",
    address: "123 Moi Avenue",
    city: "Nairobi",
    state: "Nairobi County",
    zipCode: "00100",
    country: "Kenya",

    // Professional Information
    resumeUrl: "#",
    coverLetter:
      "I am writing to express my interest in the Senior Engineering Technology Officer position at KETRB. With over 8 years of experience in engineering technology and a strong background in regulatory frameworks, I believe I am well-qualified for this role.",
    linkedinUrl: "https://linkedin.com/in/johnsmith",
    portfolioUrl: "https://johnsmith.com",
    currentEmployer: "ABC Engineering Ltd",
    currentJobTitle: "Engineering Technology Specialist",
    yearsOfExperience: "5-10 years",

    // Education
    highestEducation: "Masters Degree",
    fieldOfStudy: "Mechanical Engineering",
    schoolName: "University of Nairobi",
    graduationYear: "2015",

    // Job Details
    position: "Senior Engineering Technology Officer",
    department: "Engineering Registration",
    location: "Nairobi",
    willingToRelocate: "Yes",
    availableStartDate: "2023-04-15",
    salaryExpectation: "KES 150,000 - 180,000",

    // Legal Information
    authorizedToWork: true,
    requireSponsorship: false,

    // Application History
    history: [
      {
        date: "2023-03-15 09:23 AM",
        action: "Application Submitted",
        user: "System",
        notes: "Application received through online portal",
      },
      {
        date: "2023-03-16 02:45 PM",
        action: "Application Reviewed",
        user: "Jane Doe (HR)",
        notes: "Initial screening completed. Candidate meets basic qualifications.",
      },
    ],
  }

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending Review</Badge>
      case "reviewed":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Reviewed</Badge>
      case "shortlisted":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Shortlisted</Badge>
      case "interviewed":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Interviewed</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{status}</Badge>
    }
  }

  // Handle adding notes
  const handleAddNotes = () => {
    if (notes.trim()) {
      // In a real app, you would save this to your backend
      alert("Notes added: " + notes)
      setNotes("")
    }
  }

  // Handle reject application
  const handleReject = () => {
    if (rejectReason.trim()) {
      // In a real app, you would update the application status
      alert("Application rejected. Reason: " + rejectReason)
      setShowRejectDialog(false)
      // Navigate back to applications list
      // navigate("/admin/applications");
    }
  }

  // Handle schedule interview
  const handleScheduleInterview = () => {
    if (interviewDate && interviewTime) {
      // In a real app, you would schedule the interview
      alert(`Interview scheduled for ${interviewDate} at ${interviewTime} (${interviewType})`)
      setShowInterviewDialog(false)
    }
  }

  return (
    <div className="container px-4 mx-auto py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" className="mr-2" onClick={() => navigate("/admin/applications")}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Application {id}</h1>
          <div className="ml-4">{getStatusBadge(application.status)}</div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="bg-white">
            <Download className="h-4 w-4 mr-2" />
            Download Resume
          </Button>
          <Button className="bg-[#5b92e5] hover:bg-[#4a7fcf]">
            <CheckCircle className="h-4 w-4 mr-2" />
            Shortlist Candidate
          </Button>
        </div>
      </div>

      {/* Applicant Summary Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <div className="h-24 w-24 rounded-full bg-[#5b92e5]/10 flex items-center justify-center text-[#5b92e5] text-3xl font-medium">
              {application.firstName[0]}
              {application.lastName[0]}
            </div>
          </div>

          <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {application.firstName} {application.lastName}
              </h2>
              <p className="text-gray-600 mb-2">
                {application.currentJobTitle} at {application.currentEmployer}
              </p>

              <div className="flex flex-col gap-2 mt-4">
                <div className="flex items-center text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  <a href={`mailto:${application.email}`} className="hover:text-[#5b92e5]">
                    {application.email}
                  </a>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  <a href={`tel:${application.phone}`} className="hover:text-[#5b92e5]">
                    {application.phone}
                  </a>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>
                    {application.city}, {application.country}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center text-gray-600">
                <Briefcase className="h-4 w-4 mr-2" />
                <span>
                  Applied for: <strong>{application.position}</strong>
                </span>
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                <span>
                  Applied on: <strong>{formatDate(application.appliedDate)}</strong>
                </span>
              </div>
              <div className="flex items-center text-gray-600">
                <GraduationCap className="h-4 w-4 mr-2" />
                <span>
                  {application.highestEducation} in {application.fieldOfStudy}
                </span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="h-4 w-4 mr-2" />
                <span>
                  Experience: <strong>{application.yearsOfExperience}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="bg-white rounded-lg shadow-sm">
        <TabsList className="border-b p-0 h-auto">
          <TabsTrigger
            value="details"
            className={`px-6 py-3 rounded-none border-b-2 ${activeTab === "details" ? "border-[#5b92e5]" : "border-transparent"}`}
          >
            Application Details
          </TabsTrigger>
          <TabsTrigger
            value="resume"
            className={`px-6 py-3 rounded-none border-b-2 ${activeTab === "resume" ? "border-[#5b92e5]" : "border-transparent"}`}
          >
            Resume & Cover Letter
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className={`px-6 py-3 rounded-none border-b-2 ${activeTab === "history" ? "border-[#5b92e5]" : "border-transparent"}`}
          >
            Application History
          </TabsTrigger>
          <TabsTrigger
            value="notes"
            className={`px-6 py-3 rounded-none border-b-2 ${activeTab === "notes" ? "border-[#5b92e5]" : "border-transparent"}`}
          >
            Notes & Actions
          </TabsTrigger>
        </TabsList>

        {/* Application Details Tab */}
        <TabsContent value="details" className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium">
                    {application.firstName} {application.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email Address</p>
                  <p className="font-medium">{application.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="font-medium">{application.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium">
                    {application.address}, {application.city}, {application.state}, {application.zipCode},{" "}
                    {application.country}
                  </p>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-800 mt-8 mb-4">Professional Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Current Employer</p>
                  <p className="font-medium">{application.currentEmployer}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Current Job Title</p>
                  <p className="font-medium">{application.currentJobTitle}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Years of Experience</p>
                  <p className="font-medium">{application.yearsOfExperience}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">LinkedIn Profile</p>
                  <a
                    href={application.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-[#5b92e5] hover:underline flex items-center"
                  >
                    <Linkedin className="h-4 w-4 mr-1" />
                    View Profile
                  </a>
                </div>
                {application.portfolioUrl && (
                  <div>
                    <p className="text-sm text-gray-500">Portfolio Website</p>
                    <a
                      href={application.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-[#5b92e5] hover:underline flex items-center"
                    >
                      <Globe className="h-4 w-4 mr-1" />
                      View Portfolio
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Education</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Highest Level of Education</p>
                  <p className="font-medium">{application.highestEducation}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Field of Study</p>
                  <p className="font-medium">{application.fieldOfStudy}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">School/University</p>
                  <p className="font-medium">{application.schoolName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Graduation Year</p>
                  <p className="font-medium">{application.graduationYear}</p>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-800 mt-8 mb-4">Job Application Details</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Position Applied For</p>
                  <p className="font-medium">{application.position}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-medium">{application.department}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">{application.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Willing to Relocate</p>
                  <p className="font-medium">{application.willingToRelocate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Available Start Date</p>
                  <p className="font-medium">{formatDate(application.availableStartDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Salary Expectation</p>
                  <p className="font-medium">{application.salaryExpectation}</p>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-800 mt-8 mb-4">Legal Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Authorized to Work</p>
                  <p className="font-medium">{application.authorizedToWork ? "Yes" : "No"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Requires Sponsorship</p>
                  <p className="font-medium">{application.requireSponsorship ? "Yes" : "No"}</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Resume & Cover Letter Tab */}
        <TabsContent value="resume" className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Resume/CV</h3>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 flex flex-col items-center justify-center min-h-[400px]">
                <FileText className="h-16 w-16 text-gray-400 mb-4" />
                <p className="text-gray-500 mb-4">Resume preview not available</p>
                <Button className="bg-[#5b92e5] hover:bg-[#4a7fcf]">View Resume</Button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Cover Letter</h3>
              <div className="border border-gray-200 rounded-lg p-6 bg-gray-50 min-h-[400px]">
                <p className="text-gray-700 whitespace-pre-line">{application.coverLetter}</p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Application History Tab */}
        <TabsContent value="history" className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Application Timeline</h3>
          <div className="space-y-6">
            {application.history.map((item, index) => (
              <div key={index} className="flex">
                <div className="flex-shrink-0 mr-4">
                  <div className="h-10 w-10 rounded-full bg-[#5b92e5]/10 flex items-center justify-center text-[#5b92e5]">
                    {item.action.includes("Submitted") ? (
                      <FileText className="h-5 w-5" />
                    ) : item.action.includes("Reviewed") ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : item.action.includes("Interview") ? (
                      <Calendar className="h-5 w-5" />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </div>
                  <div
                    className="h-full w-0.5 bg-gray-200 mx-auto mt-2"
                    style={{ display: index === application.history.length - 1 ? "none" : "block" }}
                  ></div>
                </div>
                <div className="flex-grow pb-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-medium text-gray-800">{item.action}</h4>
                    <span className="text-sm text-gray-500">{item.date}</span>
                  </div>
                  <p className="text-gray-600 mt-1">{item.notes}</p>
                  <p className="text-sm text-gray-500 mt-1">By: {item.user}</p>
                </div>
              </div>
            ))}

            {/* Current status */}
            <div className="flex">
              <div className="flex-shrink-0 mr-4">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <CheckCircle className="h-5 w-5" />
                </div>
              </div>
              <div className="flex-grow">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-medium text-gray-800">
                    Current Status: {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </h4>
                  <span className="text-sm text-gray-500">Now</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Notes & Actions Tab */}
        <TabsContent value="notes" className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Notes</h3>
              <div className="space-y-4">
                <Textarea
                  placeholder="Add notes about this candidate..."
                  className="min-h-[150px]"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
                <Button onClick={handleAddNotes} disabled={!notes.trim()}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Add Note
                </Button>
              </div>

              <h3 className="text-lg font-semibold text-gray-800 mt-8 mb-4">Previous Notes</h3>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Jane Doe (HR)</span>
                    <span className="text-sm text-gray-500">March 16, 2023 - 2:45 PM</span>
                  </div>
                  <p className="text-gray-700">
                    Initial screening completed. Candidate meets basic qualifications. Strong technical background with
                    relevant experience in engineering technology.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Actions</h3>
              <div className="space-y-3">
                <Button className="w-full bg-[#5b92e5] hover:bg-[#4a7fcf] justify-start">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Shortlist Candidate
                </Button>
                <Button
                  className="w-full bg-purple-600 hover:bg-purple-700 justify-start"
                  onClick={() => setShowInterviewDialog(true)}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Interview
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => setShowRejectDialog(true)}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject Application
                </Button>
                <Separator className="my-4" />
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Candidate
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Download Application
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this application. This information will be used for internal records
              only.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Reason for rejection..."
              className="min-h-[100px]"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={handleReject}
              disabled={!rejectReason.trim()}
            >
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Interview Dialog */}
      <Dialog open={showInterviewDialog} onOpenChange={setShowInterviewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Interview</DialogTitle>
            <DialogDescription>
              Set up an interview with {application.firstName} {application.lastName} for the {application.position}{" "}
              position.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Interview Date</label>
              <Input type="date" value={interviewDate} onChange={(e) => setInterviewDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Interview Time</label>
              <Input type="time" value={interviewTime} onChange={(e) => setInterviewTime(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Interview Type</label>
              <Select value={interviewType} onValueChange={setInterviewType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select interview type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in-person">In-Person</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="video">Video Conference</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInterviewDialog(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#5b92e5] hover:bg-[#4a7fcf]"
              onClick={handleScheduleInterview}
              disabled={!interviewDate || !interviewTime}
            >
              Schedule Interview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ApplicationDetailPage