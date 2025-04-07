import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SideNav from "../Component/SideNav";
import HeaderNav from "../Component/HeaderNav";
import bgImage from "../Asset/bg.png";
import { Button } from "../Component/button";
import { Input } from "../Component/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../Component/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../Component/card";
import { Alert, AlertDescription, AlertTitle } from "../Component/alert";
import { Label } from "../Component/label";
import { RadioGroup, RadioGroupItem } from "../Component/radio-group";

const EmployeeAddPage = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    job_title: "",
    department: "",
    role_type: "other", // Default role type
    email: "",
    phone: "",
    hire_date: "",
    status: "",
    author: "",
    profile_image: null,
    profile_image_url: "",
  });
  const [loading, setLoading] = useState(false);
  const [isDraft, setIsDraft] = useState(true);
  const [draftloading, setdraftLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [author, setAuthor] = useState("");
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  const user = JSON.parse(storedUser);
  const user_id = user.id;
  useEffect(() => {
    if (user && user.fullname) {
      setAuthor(user.fullname);
    }
  }, [user]);
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

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData((prevState) => ({
        ...prevState,
        profile_image: file,
        profile_image_url: URL.createObjectURL(file),
      }))
      console.log("Image file selected:", file);
    }
    else {
      setAlertType("error")
      setAlertMessage("Please upload a valid image file.");
    }
  }
  const handleSaveDraft = async () => {
    setIsDraft(true);
    setdraftLoading(true);
    await handleSubmit('draft');
  };

  const handlePublish = async () => {
    setLoading(true);
    await handleSubmit(user?.roles === 'editor' ? 'pending' : 'published');
  };

  const handleSubmit = async (estatus) => {
    try {
      const response = await fetch("https://ketrb-backend.onrender.com/employees/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          status: estatus,
          author: author,
          profile_image: formData.profile_image,
          user_id: user_id,
          created_at: new Date().toISOString(),
        }),
      });
      console.log("Form data being sent:", formData);
      if (response.ok) {
        setAlertType("success")
        setAlertMessage("Employee added successfully.")

        // window.location.href = '/employees';
      } else {
        const errorData = await response.json()
        setAlertType("error")
        setAlertMessage(errorData.message || "Failed to add employee.")
      }
    } catch (error) {
      console.error("Error adding employee:", error)
      setAlertType("error")
      setAlertMessage("An error occurred while adding the employee.")
    } finally {
      setLoading(false);
      setdraftLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <SideNav />
      <div
        className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14"
        style={{ backgroundImage: `url(${bgImage})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <HeaderNav />
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
        <main className="flex-1 p-4 sm:px-6 sm:py-0">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Add Employee</h1>
            <Link to="/employees">
              <Button variant="outline" size="sm">
                Back to Employees
              </Button>
            </Link>
          </div>
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Employee Information</CardTitle>
              <CardDescription>Fill in the details for the new employee.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">
                      First Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="first_name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">
                      Last Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="last_name"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="job_title">
                      Job Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="job_title"
                      name="job_title"
                      value={formData.job_title}
                      onChange={handleChange}
                      placeholder="e.g. Software Engineer"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">
                      Department <span className="text-red-500">*</span>
                    </Label>
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
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="email@company.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. +1 (555) 123-4567"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hire_date">
                      Hire Date <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="hire_date"
                      name="hire_date"
                      type="date"
                      value={formData.hire_date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>
                      Role Type <span className="text-red-500">*</span>
                    </Label>
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profile_image">Profile Image</Label>
                  <div className="flex items-center gap-4">
                    {formData.profile_image_url && (
                      <div className="h-20 w-20 overflow-hidden rounded-full">
                        <img
                          src={formData.profile_image_url}
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
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => navigate("/employees")} disabled={loading}>
                Cancel
              </Button>
              <Button
                variant="outline"
                onClick={handleSaveDraft}
                disabled={draftloading}
              >
                {draftloading ? "Saving..." : "Save as Draft"}
              </Button>
              <Button onClick={handlePublish} disabled={loading}>
                {loading ? "Submitting..." : "Add Employee"}
              </Button>
            </CardFooter>
          </Card>
        </main>
      </div>
    </div>
  )
}

export default EmployeeAddPage