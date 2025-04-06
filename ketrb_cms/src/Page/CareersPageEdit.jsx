import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Popover, PopoverTrigger, PopoverContent } from "../Component/popover";
import { Calendar } from "../Component/calendar";
import SideNav from "../Component/SideNav";
import HeaderNav from "../Component/HeaderNav";
import bgImage from "../Asset/bg.png";
import { Button } from '../Component/button';
import { Card, CardHeader, CardTitle, CardContent } from '../Component/card';
import { Input } from '../Component/input';
import { Textarea } from "../Component/textarea";
import { Alert, AlertDescription, AlertTitle } from "../Component/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../Component/select';
import { Label } from '../Component/label';
import { Badge } from '../Component/badge';

const CareerEdit = () => {
    const { id } = useParams(); // Get career ID from route params
    const [career, setCareer] = useState(null);
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
        posted_date: "",
    });
    const [alertType, setAlertType] = useState("success");
    const [alertMessage, setAlertMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [isDraft, setIsDraft] = useState(false);
    const [draftLoading, setDraftLoading] = useState(false);
    const [editMode, setEditMode] = useState(false); // Handle edit mode toggle
    const storedUser = localStorage.getItem('user');
    const user = JSON.parse(storedUser);
    const user_id = user.id;

    useEffect(() => {
        // Fetch career data by ID and set state
        const fetchCareer = async () => {
            try {
                const response = await fetch(`https://ketrb-backend.onrender.com/careers/${id}`);
                const data = await response.json();
                setCareer(data);
                setFormData({
                    title: data.title,
                    department: data.department,
                    location: data.location,
                    employment_type: data.job_type,
                    salary_range: data.salary_range,
                    description: data.description,
                    requirements: data.requirements,
                    responsibilities: data.responsibilities,
                    benefits: data.benefits,
                    status: data.status,
                    application_deadline: data.closing_date ? new Date(data.application_deadline) : new Date(),
                    posted_date: data.posted_date ? new Date(data.posted_at) : new Date()
                });
            } catch (error) {
                console.error("Error fetching career:", error);
                setAlertMessage("Failed to load career data.");
            }
        };
        fetchCareer();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSelectChange = (name, value) => {
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleDateChange = (name, date) => {
        setFormData(prevState => ({
            ...prevState,
            [name]: date
        }));
    };

    const handleSaveDraft = async () => {
        setDraftLoading(true);
        await handleSubmit('draft');
    };

    const handlePublish = async () => {
        const careerstatus = (user?.roles === 'administrator' && formData.status === 'pending') ? 'active' : formData.status;
        setLoading(true);
        await handleSubmit(careerstatus);
    };

    const handleSubmit = async (status) => {
        try {
            const response = await fetch(`https://ketrb-backend.onrender.com/careers/edit/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    status: status,
                    role: user.roles,
                    user_id,
                    posted_date: new Date().toISOString(),
                }),
            });

            if (response.ok) {
                setAlertType("success");
                setAlertMessage("Career posting updated successfully!");
                window.location.href = '/careers';
            } else {
                setAlertType("error");
                setAlertMessage("Failed to update career posting.");
            }
        } catch (error) {
            setAlertType("error");
            console.error('Error updating career posting:', error);
            setAlertMessage("An error occurred while updating the career posting.");
        } finally {
            setLoading(false);
            setDraftLoading(false);
        }
    };
    // Format date for display
    const formatDate = (date) => {
        if (!date) return "Not specified";
        return new Date(date).toLocaleDateString();
    };

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <SideNav />
            <div
                className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14"
                style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
                <HeaderNav />
                <div className="flex items-center justify-center min-h-screen bg-muted">
                    <Card className="w-[900px] bg-white">
                        <CardHeader>
                            <CardTitle>Career Posting</CardTitle>
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
                                            <CardTitle className="text-2xl font-bold mb-4">Career Posting Preview</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            {/* Edit button inside the card */}
                                            <button
                                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                                                onClick={() => setEditMode(true)}
                                            >
                                                <FilePenIcon className="w-5 h-5" />
                                            </button>

                                            {/* Career content */}
                                            <div className="space-y-6">
                                                <div>
                                                    <h3 className="text-2xl font-semibold">{formData.title}</h3>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <Badge
                                                            variant="outline"
                                                            className={`capitalize ${formData.status === "published"
                                                                ? "bg-green-500 text-green-50"
                                                                : formData.status === "pending"
                                                                    ? "bg-yellow-500 text-yellow-50"
                                                                    : "bg-gray-500 text-gray-50"
                                                                }`}
                                                        >
                                                            {formData.status}
                                                        </Badge>
                                                        <Badge variant="outline" className="bg-blue-500 text-blue-50 capitalize">
                                                            {formData.department}
                                                        </Badge>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-b py-4">
                                                    <div>
                                                        <h4 className="text-sm font-medium text-gray-500">Location</h4>
                                                        <p>{formData.location}</p>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-medium text-gray-500">Employment Type</h4>
                                                        <p className="capitalize">{formData.employment_type?.replace('_', ' ')}</p>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-medium text-gray-500">Salary Range</h4>
                                                        <p>{formData.salary_range || "Not specified"}</p>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-medium text-gray-500">Application Deadline</h4>
                                                        <p>{formatDate(formData.application_deadline)}</p>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h4 className="text-lg font-medium">Job Description</h4>
                                                    <p className="mt-2 whitespace-pre-line">{formData.description}</p>
                                                </div>

                                                {formData.requirements && (
                                                    <div>
                                                        <h4 className="text-lg font-medium">Requirements</h4>
                                                        <p className="mt-2 whitespace-pre-line">{formData.requirements}</p>
                                                    </div>
                                                )}

                                                {formData.responsibilities && (
                                                    <div>
                                                        <h4 className="text-lg font-medium">Responsibilities</h4>
                                                        <p className="mt-2 whitespace-pre-line">{formData.responsibilities}</p>
                                                    </div>
                                                )}

                                                {formData.benefits && (
                                                    <div>
                                                        <h4 className="text-lg font-medium">Benefits</h4>
                                                        <p className="mt-2 whitespace-pre-line">{formData.benefits}</p>
                                                    </div>
                                                )}
                                                <div className="text-sm text-gray-500">
                                                    <p>Posted on: {formatDate(formData.posted_date)}</p>
                                                </div>
                                            </div>
                                            <div className="flex justify-end gap-2 mt-6">
                                                {/* Show Approve Publish button only for pending careers if user is admin */}
                                                {user.roles === "administrator" && formData.status === "pending" && (
                                                    <Button size="sm" variant="black" onClick={handlePublish}>
                                                        Approve Publish
                                                    </Button>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    /* Edit mode (form view) */
                                    <Card className="relative p-6 bg-white rounded-md w-full">
                                        <CardHeader>
                                            <CardTitle className="text-2xl font-bold mb-4">Edit Career Posting</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            {/* Form for editing the career posting */}
                                            <form className="space-y-6">
                                                {/* Title Input */}
                                                <div>
                                                    <Label htmlFor="title">Job Title</Label>
                                                    <Input
                                                        id="title"
                                                        name="title"
                                                        value={formData.title}
                                                        onChange={handleChange}
                                                        className="mt-1 block w-full"
                                                        required
                                                    />
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                                                    {/* Location */}
                                                    <div>
                                                        <Label htmlFor="location">Location</Label>
                                                        <Input
                                                            id="location"
                                                            name="location"
                                                            value={formData.location}
                                                            onChange={handleChange}
                                                            className="mt-1 block w-full"
                                                            required
                                                        />
                                                    </div>

                                                    {/* Employment Type */}
                                                    <div>
                                                        <Label htmlFor="employment_type">Employment Type</Label>
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

                                                    {/* Salary Range */}
                                                    <div>
                                                        <Label htmlFor="salary_range">Salary Range</Label>
                                                        <Input
                                                            id="salary_range"
                                                            name="salary_range"
                                                            value={formData.salary_range}
                                                            onChange={handleChange}
                                                            className="mt-1 block w-full"
                                                        />
                                                    </div>

                                                    {/* Application Deadline */}
                                                    <div>
                                                        <Label htmlFor="application_deadline">Application Deadline</Label>
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <Button
                                                                    variant={"outline"}
                                                                    className={"w-full justify-start text-left font-normal"}
                                                                >
                                                                    {formData.application_deadline ? formatDate(formData.application_deadline) : "Select Date"}
                                                                </Button>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-auto p-0">
                                                                <Calendar
                                                                    mode="single"
                                                                    selected={formData.application_deadline}
                                                                    onSelect={(date) => handleDateChange("application_deadline", date)}
                                                                    initialFocus
                                                                />
                                                            </PopoverContent>
                                                        </Popover>
                                                    </div>
                                                </div>

                                                {/* Description */}
                                                <div>
                                                    <Label htmlFor="description">Job Description</Label>
                                                    <Textarea
                                                        id="description"
                                                        name="description"
                                                        value={formData.description}
                                                        onChange={handleChange}
                                                        rows={5}
                                                        className="mt-1 block w-full"
                                                        required
                                                    />
                                                </div>

                                                {/* Requirements */}
                                                <div>
                                                    <Label htmlFor="requirements">Requirements</Label>
                                                    <Textarea
                                                        id="requirements"
                                                        name="requirements"
                                                        value={formData.requirements}
                                                        onChange={handleChange}
                                                        rows={4}
                                                        className="mt-1 block w-full"
                                                    />
                                                </div>

                                                {/* Responsibilities */}
                                                <div>
                                                    <Label htmlFor="responsibilities">Responsibilities</Label>
                                                    <Textarea
                                                        id="responsibilities"
                                                        name="responsibilities"
                                                        value={formData.responsibilities}
                                                        onChange={handleChange}
                                                        rows={4}
                                                        className="mt-1 block w-full"
                                                    />
                                                </div>

                                                {/* Benefits */}
                                                <div>
                                                    <Label htmlFor="benefits">Benefits</Label>
                                                    <Textarea
                                                        id="benefits"
                                                        name="benefits"
                                                        value={formData.benefits}
                                                        onChange={handleChange}
                                                        rows={3}
                                                        className="mt-1 block w-full"
                                                    />
                                                </div>

                                                {/* Buttons */}
                                                <div className="flex justify-end gap-2 mt-6">
                                                    <Button onClick={() => setEditMode(false)} variant="outline">
                                                        Cancel
                                                    </Button>
                                                    <Button onClick={handleSaveDraft} disabled={draftLoading} variant="black">
                                                        {draftLoading ? "Saving Draft..." : "Save Draft"}
                                                    </Button>
                                                    {/* Conditionally render Approve & Publish button */}
                                                    {user.roles === 'administrator' && formData.status === 'pending' ? (
                                                        <Button onClick={() => handlePublish('published')} variant="black" disabled={loading}>
                                                            {loading ? "Approving..." : "Approve & Publish"}
                                                        </Button>
                                                    ) : (
                                                        <Button onClick={handlePublish} variant="black" disabled={loading}>
                                                            {loading ? "Publishing..." : "Publish"}
                                                        </Button>
                                                    )}
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
    );
};

export default CareerEdit;

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
    );
}