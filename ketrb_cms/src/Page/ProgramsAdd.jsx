import React, { useState, useEffect } from "react";
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

const ProgramsAdd = () => {
    const [title, setTitle] = useState("");
    const [image, setImage] = useState(null);
    const [content, setContent] = useState("");
    const [publishedDate, setPublishedDate] = useState(new Date());
    const [author, setAuthor] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [isDraft, setIsDraft] = useState(true);
    const [loading, setLoading] = useState(false);
    const storedUser = localStorage.getItem('user');
    const user = JSON.parse(storedUser);

    useEffect(() => {
        if (user && user.name) {
            setAuthor(user.name);
        }
    }, [user]);

    const handleTitleChange = (e) => setTitle(e.target.value);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            setImage(file);
			console.log("File: ", image);
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
        setLoading(true);
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('publishedDate', publishedDate.toISOString().split('T')[0]);
        formData.append('author', author);
        formData.append('status', status);
        formData.append('image', image);

        try {
            const response = await fetch('https://ketrb-backend.onrender.com/programs/add', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                setAlertMessage("Program added successfully!");
                setTimeout(() => window.location.href = '/programs', 2000);
            } else {
                setAlertMessage("Failed to add program.");
            }
        } catch (error) {
            console.error('Error adding program:', error);
            setAlertMessage("An error occurred while adding the program.");
        } finally {
            setLoading(false);
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
                    <Card className="w-full max-w-2xl bg-white">
                        <CardHeader>
                            <CardTitle>Programs Add</CardTitle>
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
                                <div>
                                    <h2 className="text-xl font-bold mb-4">Add Programs</h2>
                                    <form className="space-y-6 w-[600px] mx-auto" encType="multipart/form-data">
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
                                                <Input type="file" onChange={handleImageChange} className="block w-full" required />
                                                {image && (
                                                    <img
                                                        src={URL.createObjectURL(image)}
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
                                                disabled={loading}
                                               variant="outline"
                                            >
                                                {loading ? "Saving..." : "Save as Draft"}
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
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ProgramsAdd;
