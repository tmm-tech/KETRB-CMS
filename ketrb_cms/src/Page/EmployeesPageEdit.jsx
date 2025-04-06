import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Popover, PopoverTrigger, PopoverContent } from "../Component/popover";
import { Calendar } from "../Component/calendar";
import SideNav from "../Component/SideNav";
import HeaderNav from "../Component/HeaderNav";
import bgImage from "../Asset/bg.png";
import { Button } from "../Component/button";
import { Card, CardHeader, CardTitle, CardContent } from "../Component/card";
import { Input } from "../Component/input";
import { Textarea } from "../Component/textarea";
import { Alert, AlertDescription, AlertTitle } from "../Component/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../Component/select";
import { Label } from "../Component/label";
import { Badge } from "../Component/badge";
import { RadioGroup, RadioGroupItem } from "../Component/radio-group";

const EmployeeEdit = () => {
  const { id } = useParams() // Get employee ID from route params
  const [employee, setEmployee] = useState(null)
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    job_title: "",
    department: "",
    role_type: "",
    email: "",
    phone: "",
    hire_date: new Date(),
    profile_image: null,
    profile_image_url: "",
  });
  const [alertType, setAlertType] = useState("success");
  const [alertMessage, setAlertMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [editMode, setEditMode] = useState(false) // Handle edit mode toggle
  const storedUser = localStorage.getItem("user")
  const user = JSON.parse(storedUser)
  const user_id = user.id

  useEffect(() => {
    // Fetch employee data by ID and set state
    const fetchEmployee = async () => {
      try {
        const response = await fetch(`https://ketrb-backend.onrender.com/employees/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json()
        setEmployee(data)
        setFormData({
          first_name: data.first_name,
          last_name: data.last_name,
          job_title: data.job_title,
          department: data.department,
          role_type: data.role_type,
          email: data.email,
          phone: data.phone || "",
          hire_date: data.hire_date ? new Date(data.hire_date) : new Date(),
          profile_image: data.profile_image || "",
        })
      } catch (error) {
        console.error("Error fetching employee:", error)
        setAlertMessage("Failed to load employee data.")
      }
    }
    fetchEmployee()
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleDateChange = (date) => {
    setFormData((prevState) => ({
      ...prevState,
      hire_date: date,
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData((prevState) => ({
        ...prevState,
        profile_image: file,
        profile_image_url: URL.createObjectURL(file),
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Create FormData object for file upload
      const formDataToSend = new FormData()

      // Append all text fields
      Object.keys(formData).forEach((key) => {
        if (key !== "profile_image" && key !== "profile_image_url") {
          if (key === "hire_date") {
            formDataToSend.append(key, formData[key].toISOString().split("T")[0])
          } else {
            formDataToSend.append(key, formData[key])
          }
        }
      })

      // Append the image file if it exists
      if (formData.profile_image) {
        formDataToSend.append("profile_image", formData.profile_image)
      }

      // Add updated_by and updated_at
      formDataToSend.append("updated_by", user_id)
      formDataToSend.append("updated_at", new Date().toISOString())

      const response = await fetch(`https://ketrb-backend.onrender.com/employees/edit/${id}`, {
        method: "PUT",
        body: formDataToSend, // Send as FormData, not JSON
      })

      if (response.ok) {
        setAlertType("success");
        setAlertMessage("Employee updated successfully!")
        window.location.href = "/employees"
      } else {
        setAlertType("error")
        const errorData = await response.json()
        setAlertMessage(errorData.message || "Failed to update employee.")
      }
    } catch (error) {
      setAlertType("error");
      console.error("Error updating employee:", error)
      setAlertMessage("An error occurred while updating the employee.")
    } finally {
      setLoading(false)
    }
  }

  // Format date for display
  const formatDate = (date) => {
    if (!date) return ""
    return new Date(date).toLocaleDateString()
  }

  // Get role type label
  const getRoleTypeLabel = (roleType) => {
    switch (roleType) {
      case "leadership":
        return "Leadership"
      case "management":
        return "Management"
      case "other":
        return "Staff"
      default:
        return roleType
    }
  }

  // Get role type badge color
  const getRoleTypeBadgeClass = (roleType) => {
    switch (roleType) {
      case "leadership":
        return "bg-purple-500 text-purple-50"
      case "management":
        return "bg-blue-500 text-blue-50"
      default:
        return "bg-gray-500 text-gray-50"
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <SideNav />
      <div
        className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14"
        style={{ backgroundImage: `url(${bgImage})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <HeaderNav />
        <div className="flex items-center justify-center min-h-screen bg-muted">
          <Card className="w-[900px] bg-white">
            <CardHeader>
              <CardTitle>Employee Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-8">
                {alertMessage && (
                  <div className="fixed top-0 left-0 w-full z-50">
                    <Alert
                      className={`max-w-md mx-auto mt-4 ${alertType === "error" ? "bg-red-100 border-red-500" : "bg-green-100 border-green-500"}`}
                    >
                      <AlertTitle>{alertType === "error" ? "Error" : "Success"}</AlertTitle>
                      <AlertDescription>{alertMessage}</AlertDescription>
                    </Alert>
                  </div>
                )}

                {/* Preview mode (default view) */}
                {!editMode ? (
                  <Card className="relative p-6 bg-white rounded-md w-full">
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold mb-4">Employee Profile</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {/* Edit button inside the card */}
                      <button
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        onClick={() => setEditMode(true)}
                      >
                        <FilePenIcon className="w-5 h-5" />
                      </button>

                      {/* Employee content */}
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Profile image */}
                        <div className="flex-shrink-0">
                          <div className="h-32 w-32 overflow-hidden rounded-full">
                            <img
                              src={formData.profile_image_url || "/placeholder.svg?height=128&width=128"}
                              alt={`${formData.first_name} ${formData.last_name}`}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </div>

                        {/* Profile details */}
                        <div className="flex-grow">
                          <div className="mb-4">
                            <h3 className="text-2xl font-semibold">
                              {formData.first_name} {formData.last_name}
                            </h3>
                            <p className="text-lg text-gray-600">{formData.job_title}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge
                                variant="outline"
                                className={`capitalize ${getRoleTypeBadgeClass(formData.role_type)}`}
                              >
                                {getRoleTypeLabel(formData.role_type)}
                              </Badge>
                              <Badge variant="outline" className="bg-green-500 text-green-50 capitalize">
                                {formData.department}
                              </Badge>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t py-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Email</h4>
                              <p>{formData.email}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Phone</h4>
                              <p>{formData.phone || "Not provided"}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Department</h4>
                              <p className="capitalize">{formData.department}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Hire Date</h4>
                              <p>{formatDate(formData.hire_date)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  /* Edit mode (form view) */
                  <Card className="relative p-6 bg-white rounded-md w-full">
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold mb-4">Edit Employee Profile</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {/* Form for editing the employee */}
                      <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* First Name */}
                          <div>
                            <Label htmlFor="first_name">First Name</Label>
                            <Input
                              id="first_name"
                              name="first_name"
                              value={formData.first_name}
                              onChange={handleChange}
                              className="mt-1 block w-full"
                              required
                            />
                          </div>

                          {/* Last Name */}
                          <div>
                            <Label htmlFor="last_name">Last Name</Label>
                            <Input
                              id="last_name"
                              name="last_name"
                              value={formData.last_name}
                              onChange={handleChange}
                              className="mt-1 block w-full"
                              required
                            />
                          </div>

                          {/* Job Title */}
                          <div>
                            <Label htmlFor="job_title">Job Title</Label>
                            <Input
                              id="job_title"
                              name="job_title"
                              value={formData.job_title}
                              onChange={handleChange}
                              className="mt-1 block w-full"
                              required
                            />
                          </div>

                          {/* Department */}
                          <div>
                            <Label htmlFor="department">Department</Label>
                            <Select
                              onValueChange={(value) => handleSelectChange("department", value)}
                              value={formData.department}
                            >
                              <SelectTrigger id="department">
                                <SelectValue placeholder="Select department" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="executive">Executive</SelectItem>
                                <SelectItem value="engineering">Engineering</SelectItem>
                                <SelectItem value="marketing">Marketing</SelectItem>
                                <SelectItem value="sales">Sales</SelectItem>
                                <SelectItem value="hr">Human Resources</SelectItem>
                                <SelectItem value="finance">Finance</SelectItem>
                                <SelectItem value="operations">Operations</SelectItem>
                                <SelectItem value="product">Product</SelectItem>
                                <SelectItem value="design">Design</SelectItem>
                                <SelectItem value="customer_support">Customer Support</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Email */}
                          <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleChange}
                              className="mt-1 block w-full"
                              required
                            />
                          </div>

                          {/* Phone */}
                          <div>
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                              id="phone"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              className="mt-1 block w-full"
                            />
                          </div>

                          {/* Hire Date */}
                          <div>
                            <Label htmlFor="hire_date">Hire Date</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant={"outline"} className={"w-full justify-start text-left font-normal"}>
                                  {formData.hire_date ? formatDate(formData.hire_date) : "Select Date"}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={formData.hire_date}
                                  onSelect={handleDateChange}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>

                          {/* LinkedIn URL */}
                          <div>
                            <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                            <Input
                              id="linkedin_url"
                              name="linkedin_url"
                              value={formData.linkedin_url}
                              onChange={handleChange}
                              className="mt-1 block w-full"
                            />
                          </div>

                          {/* Twitter URL */}
                          <div>
                            <Label htmlFor="twitter_url">Twitter URL</Label>
                            <Input
                              id="twitter_url"
                              name="twitter_url"
                              value={formData.twitter_url}
                              onChange={handleChange}
                              className="mt-1 block w-full"
                            />
                          </div>
                        </div>

                        {/* Role Type */}
                        <div className="space-y-2">
                          <Label>Role Type</Label>
                          <RadioGroup
                            value={formData.role_type}
                            onValueChange={(value) => handleSelectChange("role_type", value)}
                            className="flex flex-col space-y-1"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="leadership" id="leadership" />
                              <Label htmlFor="leadership" className="font-normal">
                                Leadership - Executive and C-level positions
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="management" id="management" />
                              <Label htmlFor="management" className="font-normal">
                                Management - Directors, Managers, Team Leads
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="other" id="other" />
                              <Label htmlFor="other" className="font-normal">
                                Other - Individual contributors and staff
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>

                        {/* Bio */}
                        <div>
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea
                            id="bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            rows={4}
                            className="mt-1 block w-full"
                          />
                        </div>

                        {/* Profile Image */}
                        <div className="space-y-2">
                          <Label htmlFor="profile_image">Profile Image</Label>
                          <div className="flex items-center gap-4">
                            {formData.profile_image_url && (
                              <div className="h-20 w-20 overflow-hidden rounded-full">
                                <img
                                  src={formData.profile_image_url || "/placeholder.svg"}
                                  alt="Profile preview"
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            )}
                            <Input
                              id="profile_image"
                              name="profile_image"
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="max-w-sm"
                            />
                          </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end gap-2 mt-6">
                          <Button onClick={() => setEditMode(false)} variant="outline" type="button">
                            Cancel
                          </Button>
                          <Button type="submit" variant="black" disabled={loading}>
                            {loading ? "Saving..." : "Save Changes"}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default EmployeeEdit

function FilePenIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z" />
    </svg>
  )
}