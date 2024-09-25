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



const ProgramsEdit = () => {
    const { id } = useParams(); // Get program ID from route params
    const [program, setProgram] = useState(null);
    const [title, setTitle] = useState("");
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [content, setContent] = useState("");
    const [publishedDate, setPublishedDate] = useState(new Date());
    const [author, setAuthor] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [isDraft, setIsDraft] = useState(true);
    const [loading, setLoading] = useState(false);
    const [draftLoading, setDraftLoading] = useState(false);
    const [editMode, setEditMode] = useState(false); // Handle edit mode toggle
    const storedUser = localStorage.getItem('user');
    const user = JSON.parse(storedUser);

    useEffect(() => {
        // Fetch program data by ID and set state
        const fetchProgram = async () => {
            try {
                const response = await fetch(`https://ketrb-backend.onrender.com/programs/${id}`);
                const data = await response.json();
                setProgram(data);
                setTitle(data.title);
                setContent(data.content);
                    setPublishedDate(new Date(data.published_date));
                setAuthor(data.author);
                setPreviewUrl(data. imageUrl); // Assuming backend returns an image URL
                console.log("url: ",previewUrl);
            } catch (error) {
                console.error("Error fetching program:", error);
                setAlertMessage("Failed to load program data.");
            }
        };
        fetchProgram();
    }, [id]);

    const handleTitleChange = (e) => setTitle(e.target.value);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        } else {
            setAlertMessage("Please upload a valid image file.");
        }
    };

    const handleContentChange = (value) => setContent(value);
    const handlePublishedDateChange = (date) => setPublishedDate(date);

    const handleSaveDraft = async () => {
        setIsDraft(true);
        await handleSubmit('draft');
    };

    const handlePublish = async () => {
        setIsDraft(false);
        await handleSubmit(user?.roles === 'editor' ? 'pending' : 'published');
    };

    const handleSubmit = async (status) => {
        setDraftLoading(true);
        setLoading(true);
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('publishedDate', publishedDate.toISOString().split('T')[0]);
        formData.append('author', author);
        formData.append('status', status);
        if (image) formData.append('program', image); // Append new image if uploaded

        try {
            const response = await fetch(`https://ketrb-backend.onrender.com/programs/edit/${id}`, {
                method: 'PUT',
                body: formData,
            });

            if (response.ok) {
                setAlertMessage("Program updated successfully!");
                window.location.href = '/programs';
            } else {
                setAlertMessage("Failed to update program.");
            }
        } catch (error) {
            console.error('Error updating program:', error);
            setAlertMessage("An error occurred while updating the program.");
        } finally {
            setLoading(false);
            setDraftLoading(false);
        }
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
                    <Card className="w-full max-w-4xl bg-white">
                        <CardHeader>
                            <CardTitle>Edit Program</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {alertMessage && (
                                    <div className="fixed top-0 left-0 w-full z-50">
                                        <Alert className="max-w-md mx-auto mt-4">
                                            <AlertTitle>Notification</AlertTitle>
                                            <AlertDescription>{alertMessage}</AlertDescription>
                                        </Alert>
                                    </div>
                                )}

                                {/* Preview mode (default view) */}
                                {!editMode ? (
                           <div className="relative">
                        <Card className="p-6 bg-white rounded-md w-[700px]">
                            <CardHeader>
                                <CardTitle className="text-2xl font-bold mb-4">Program Preview</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-4">
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="w-full h-auto rounded-lg object-cover"
                                    />
                                </div>
                                <h3 className="text-xl font-semibold">{title}</h3>
                                <p className="text-muted-foreground my-2">{content}</p>
                                <p className="text-sm mt-4">Published Date: {publishedDate.toLocaleDateString()}</p>
                                <p className="text-sm">Author: {author}</p>
                            </CardContent>
                        </Card>

                        {/* Edit icon */}
                                        <button
                                            className="top-2 right-1 text-gray-500 hover:text-gray-700"
                                            onClick={() => setEditMode(true)}
                                        >
                                           <FilePenIcon className="h-4 w-4" />
                                        </button>
                    </div>
                                ) : (
                                    /* Edit mode (form view) */
                                    <div>
                                        <h2 className="text-xl font-bold mb-4">Edit Program</h2>
                                        <form className="space-y-6 w-[700px]" encType="multipart/form-data">
                                            <div>
                                                <label htmlFor="title" className="block text-sm font-medium text-muted-foreground">
                                                    Title
                                                </label>
                                                <Input
                                                    id="title"
                                                    type="text"
                                                    value={title}
                                                    onChange={handleTitleChange}
                                                    className="mt-1 block w-full"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="image" className="block text-sm font-medium text-muted-foreground">
                                                    Image
                                                </label>
                                                <div className="mt-1">
                                                    <Input type="file" onChange={handleImageChange} className="block w-full" accept="image/*" name="program" />
                                                    {previewUrl && (
                                                        <img
                                                            src={previewUrl}
                                                            alt="Uploaded Image"
                                                            width={300}
                                                            height={200}
                                                            className="mt-4 rounded-md"
                                                            style={{ aspectRatio: "300/200", objectFit: "cover" }}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <label htmlFor="content" className="block text-sm font-medium text-muted-foreground">
                                                    Content
                                                </label>
                                                <Textarea
                                                    id="content"
                                                    value={content}
                                                    onChange={(e) => handleContentChange(e.target.value)}
                                                    className="mt-1 block w-full"
                                                    rows={5}
                                                    required
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="publishedDate" className="block text-sm font-medium text-muted-foreground">
                                                        Published Date
                                                    </label>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button variant="outline" className="w-full text-left">
                                                                {publishedDate.toLocaleDateString()}
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="p-0">
                                                            <Calendar mode="single" selected={publishedDate} onSelect={handlePublishedDateChange} />
                                                        </PopoverContent>
                                                    </Popover>
                                                </div>
                                                <div>
                                                    <label htmlFor="author" className="block text-sm font-medium text-muted-foreground">
                                                        Author
                                                    </label>
                                                    <p>{author}</p>
                                                </div>
                                            </div>
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    onClick={handleSaveDraft}
                                                    disabled={draftLoading}
                                                    variant="outline"
                                                >
                                                    {draftLoading ? "Saving..." : "Save as Draft"}
                                                </Button>
                                                <Button
                                                    onClick={handlePublish}
                                                    disabled={loading}
                                                    variant="black"
                                                >
                                                    {loading ? "Publishing..." : "Publish"}
                                                </Button>
                                            </div>
                                        </form>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ProgramsEdit;

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
