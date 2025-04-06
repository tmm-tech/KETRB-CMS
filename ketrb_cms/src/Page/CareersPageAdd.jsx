import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SideNav from "../Component/SideNav";
import HeaderNav from "../Component/HeaderNav";
import bgImage from "../Asset/bg.png";
import { Button } from "../Component/button";
import { Input } from "../Component/input";
import { Textarea } from "../Component/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../Component/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../Component/card";
import { Alert, AlertDescription, AlertTitle } from "../Component/alert";
import { Label } from "../Component/label";


const CareerAddPage = () => {
  const [author, setAuthor] = useState("");
  const [isDraft, setIsDraft] = useState(true);
  const [draftloading, setdraftLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    location: "",
    employment_type: "",
    salary_range: "",
    description: "",
    requirements: "",
    responsibilities: "",
    benefits: "",
    status: "",
    application_deadline: "",
    created_by: "",
  });
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const storedUser = localStorage.getItem("user");
  const user = JSON.parse(storedUser);
  const user_id = user.id;

  useEffect(() => {
    if (user && user.fullname) {
      setAuthor(user.fullname);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSaveDraft = async () => {
    setIsDraft(true)
    setdraftLoading(true);
    await handleSubmit('draft');
  };

  const handlePublish = async () => {
    setLoading(true);
    await handleSubmit(user?.roles === 'editor' ? 'pending' : 'published');
  };

  const handleSubmit = async (estatus) => {

    try {
      const response = await fetch("https://ketrb-backend.onrender.com/careers/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          status: estatus,
          created_by: author,
          user_id: user_id,
          posted_date: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setAlertType("success");
        setAlertMessage("Career Post added successfully!");
        window.location.href = '/careers';
      } else {
        setAlertType("error");
        setAlertMessage("Failed to add career posting.");
      }
    } catch (error) {
      setAlertType("error");
      console.error("Error adding career posting:", error);
      setAlertMessage("An error occurred while adding the career posting.");
    } finally {
      setLoading(false);
      setdraftLoading(false);
    }
  };

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
            <h1 className="text-2xl font-bold">Add Career Posting</h1>
            <Link to="/careers">
              <Button variant="outline" size="sm">
                Back to Careers
              </Button>
            </Link>
          </div>
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Career Posting Details</CardTitle>
              <CardDescription>Fill in the details for the new career opportunity.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">
                      Job Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g. Senior Software Engineer"
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
                    <Label htmlFor="location">
                      Location <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g. New York, NY or Remote"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employment_type">
                      Employment Type <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      onValueChange={(value) => handleSelectChange("employment_type", value)}
                      value={formData.employment_type}
                    >
                      <SelectTrigger id="employment_type">
                        <SelectValue placeholder="Select employment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full_time">Full-time</SelectItem>
                        <SelectItem value="part_time">Part-time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="internship">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salary_range">Salary Range</Label>
                    <Input
                      id="salary_range"
                      name="salary_range"
                      value={formData.salary_range}
                      onChange={handleChange}
                      placeholder="e.g. 80,000 - 100,000 KES"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="application_deadline">Application Deadline</Label>
                    <Input
                      id="application_deadline"
                      name="application_deadline"
                      type="date"
                      value={formData.application_deadline}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Job Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={6}
                    placeholder="Provide a description of the role."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="requirements">Job Requirements</Label>
                  <Textarea
                    id="requirements"
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                    rows={6}
                    placeholder="List the qualifications required."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="responsibilities">Responsibilities</Label>
                  <Textarea
                    id="responsibilities"
                    name="responsibilities"
                    value={formData.responsibilities}
                    onChange={handleChange}
                    rows={6}
                    placeholder="List the responsibilities of the role."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="benefits">Benefits</Label>
                  <Textarea
                    id="benefits"
                    name="benefits"
                    value={formData.benefits}
                    onChange={handleChange}
                    rows={6}
                    placeholder="Describe the benefits offered."
                  />
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-end space-x-4">
              <Button
                variant="outline"
                onClick={handleSaveDraft}
                disabled={draftloading}
              >
                {draftloading ? "Saving..." : "Save as Draft"}
              </Button>
              <Button
                onClick={handlePublish}
                disabled={loading}
              >
                {loading ? "Publishing..." : "Publish"}
              </Button>
            </CardFooter>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default CareerAddPage;