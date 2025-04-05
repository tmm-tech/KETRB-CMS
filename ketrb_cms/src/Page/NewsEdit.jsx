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

const NewsEdit = () => {
    const { id } = useParams(); // Get news ID from route params
    const [news, setNews] = useState(null);
    const [title, setTitle] = useState("");
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [content, setContent] = useState("");
    const [publishedDate, setPublishedDate] = useState(new Date());
    const [author, setAuthor] = useState("");
    const [status, setStatus] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [isDraft, setIsDraft] = useState(false);
    const [loading, setLoading] = useState(false);
    const [draftLoading, setDraftLoading] = useState(false);
    const [editMode, setEditMode] = useState(false); // Handle edit mode toggle
    const storedUser = localStorage.getItem('user');
    const user = JSON.parse(storedUser);
    const user_id = user.id;

    useEffect(() => {
        // Fetch news data by ID and set state
        const fetchNews = async () => {
            try {
                const response = await fetch(`https://ketrb-backend.onrender.com/news/${id}`, {
                    method: "GET",
                    headers: {
                      "Content-Type": "application/json",
                    },
                  });
                const data = await response.json();
                setNews(data);
                setTitle(data.title);
                setContent(data.content);
                setPublishedDate(new Date(data.published_date));
                setAuthor(data.author);
                setPreviewUrl(data.imageUrl);
                setStatus(data.status);
                console.log("url: ", previewUrl);
            } catch (error) {
                console.error("Error fetching news:", error);
                setAlertMessage("Failed to load news data.");
            }
        };
        fetchNews();
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
        setDraftLoading(true);
        await handleSubmit('draft');
    };

    const handlePublish = async () => {
        const newStatus = (user?.roles === 'administrator' && status === 'pending') ? 'published' : status;
        setLoading(true);
        await handleSubmit(newStatus);
    };

    const handleSubmit = async (status) => {


        const formData = new FormData();
        console.log("url: ", image);
        formData.append('title', title);
        formData.append('content', content);
        formData.append('publishedDate', publishedDate.toISOString().split('T')[0]);
        formData.append('author', author);
        formData.append('status', status);
        formData.append('role', user.roles);
        formData.append('user_id', user_id);
        if (image) formData.append('news', image); // Append new image if uploaded

        try {
            const response = await fetch(`https://ketrb-backend.onrender.com/news/edit/${id}`, {
                method: 'PUT',
                body: formData,
            });

            if (response.ok) {
                setAlertMessage("News updated successfully!");
                window.location.href = '/news';
            } else {
                setAlertMessage("Failed to update news.");
            }
        } catch (error) {
            console.error('Error updating news:', error);
            setAlertMessage("An error occurred while updating the news.");
        } finally {
            setLoading(false);
            setDraftLoading(false);
        }
    };
    const handlePublished = async () => {
        try {
            const response = await fetch(`https://ketrb-backend.onrender.com/news/approve/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const updatedNews = await response.json();
                // Update state to reflect the published news
                setAlertMessage('News published successfully');
                window.location.href = '/news';
            } else {
                setAlertMessage('Failed to publish news');
            }
        } catch (error) {
            console.error("Error publishing news:", error);
            setAlertMessage('An error occurred while publishing the news.');
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
                    <Card className="w-[900px] bg-white">
                        <CardHeader>
                            <CardTitle>News</CardTitle>
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
                                    <Card className="relative p-6 bg-white rounded-md w-[700px]">
                                        <CardHeader>
                                            <CardTitle className="text-2xl font-bold mb-4">News Preview</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            {/* Edit button inside the card */}
                                            <button
                                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                                                onClick={() => setEditMode(true)}
                                            >
                                                <FilePenIcon className="w-5 h-5" />
                                            </button>

                                            {/* News content */}
                                            <div className="mb-4">
                                                <img
                                                    src={previewUrl}
                                                    alt="Preview"
                                                    className="w-full h-auto rounded-lg object-cover"
                                                />
                                            </div>
                                            <h3 className="text-xl font-semibold">{title}</h3>
                                            <p className="text-muted-foreground my-2">{content}</p>
                                            <p className="text-sm mt-4">{status === "published"
                                                ? `Published on ${publishedDate.toLocaleDateString()}`
                                                : status === "pending"
                                                    ? "Pending Approval"
                                                    : "Draft"}</p>
                                            <p className="text-sm">Author: {author}</p>
                                            <div className="flex justify-end gap-2 mt-6">
                                                {/* Show Approve Publish button only for pending news if user is admin */}
                                                {user.roles === "administrator" && status === "pending" && (
                                                    <Button size="sm" variant="black" onClick={() => handlePublished()}>
                                                        Approve Publish
                                                    </Button>
                                                )}
                                            </div>
                                        </CardContent>



                                    </Card>
                                ) : (
                                    /* Edit mode (form view) */
                                    <Card className="relative p-6 bg-white rounded-md w-[800px]">
                                        <CardHeader>
                                            <CardTitle className="text-2xl font-bold mb-4">Edit News</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            {/* Form for editing the news */}
                                            <div>

                                                <form className="space-y-6 w-[700px]" encType="multipart/form-data">
                                                    {/* Title Input */}
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

                                                    {/* Image Upload */}
                                                    <div>
                                                        <label htmlFor="image" className="block text-sm font-medium text-muted-foreground">
                                                            Image
                                                        </label>
                                                        <div className="mt-1">
                                                            <Input
                                                                type="file"
                                                                onChange={handleImageChange}
                                                                className="block w-full"
                                                                accept="image/*"
                                                                name="news"
                                                            />
                                                        </div>
                                                        {previewUrl && (
                                                            <div className="mt-4">
                                                                <img
                                                                    src={previewUrl}
                                                                    alt="Preview"
                                                                    className="w-full h-auto rounded-lg object-cover"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Content Input */}
                                                    <div>
                                                        <label htmlFor="content" className="block text-sm font-medium text-muted-foreground">
                                                            Content
                                                        </label>
                                                        <Textarea
                                                            id="content"
                                                            value={content}
                                                            onChange={(e) => handleContentChange(e.target.value)}
                                                            rows={4}
                                                            className="mt-1 block w-full"
                                                            required
                                                        />
                                                    </div>

                                                    {/* Published Date */}
                                                    <div>
                                                        <label htmlFor="publishedDate" className="block text-sm font-medium text-muted-foreground">
                                                            Published Date
                                                        </label>
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <Button
                                                                    variant={"outline"}
                                                                    className={"w-[280px] justify-start text-left font-normal"}
                                                                >
                                                                    {publishedDate ? publishedDate.toLocaleDateString() : "Select Date"}
                                                                </Button>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-auto p-0">
                                                                <Calendar
                                                                    mode="single"
                                                                    selected={publishedDate}
                                                                    onSelect={handlePublishedDateChange}
                                                                    initialFocus
                                                                />
                                                            </PopoverContent>
                                                        </Popover>
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
                                                        {user.roles === 'administrator' && status === 'pending' ? (
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
                                            </div>
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

export default NewsEdit;
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

