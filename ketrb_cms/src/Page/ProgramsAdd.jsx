import React,{ useState } from "react"
import { Popover, PopoverTrigger, PopoverContent } from "../Component/popover";
import { Calendar } from "../Component/calendar";
import SideNav from "../Component/SideNav";
import HeaderNav from "../Component/HeaderNav";
import bgImage from "../Asset/bg.png";
import { Button } from '../Component/button';
import { Card, CardHeader, CardTitle,CardContent} from '../Component/card';
import { Input } from '../Component/input';
import { Textarea } from "../Component/textarea";


const ProgramsAdd = () => {
    const [title, setTitle] = useState("")
    const [image, setImage] = useState(null)
    const [content, setContent] = useState("")
    const [publishedDate, setPublishedDate] = useState(new Date())
    const [author, setAuthor] = useState("")
	const [status, setStatus] = useState(user.roles === 'editor' ? 'pending' : 'published');
    const [isDraft, setIsDraft] = useState(true)
    const handleTitleChange = (e) => setTitle(e.target.value)
    const handleImageChange = (e) => setImage(e.target.files[0])
    const handleContentChange = (value) => setContent(value)
    const handlePublishedDateChange = (date) => setPublishedDate(date)
    const handleAuthorChange = (e) => setAuthor(e.target.value)
    const handleSaveDraft = () => setIsDraft(true)
    const handlePublish = () => setIsDraft(false)
	
	const handleSaveDraft = async () => {
		setIsDraft(true);
			 
		const storedUser = localStorage.getItem('user');
		if (storedUser) {
			try {
				const user = JSON.parse(storedUser);
				setAuthor(user.name || "Unknown Author");
				await handleSubmit('draft'); // Pass 'draft' as status
				
			} catch (error) {
				console.error("Error parsing user data from localStorage", error);
			}
		}
	};

const handlePublish = async () => {
    setIsDraft(false);
    
    // Retrieve the user information from localStorage or state
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        try {
            const user = JSON.parse(storedUser);

            // Ensure `roles` can handle either a string or an array
            const isEditor = Array.isArray(user.roles)
                ? user.roles.includes('editor')
                : user.roles === 'editor';

            const status = isEditor ? 'pending' : 'published'; // Set status based on role
			setAuthor(user.name || "Unknown Author");
            await handleSubmit(status); // Pass dynamic status to handleSubmit
        } catch (error) {
            console.error("Error parsing user data from localStorage", error);
        }
    }
};


const handleSubmit = async (status) => {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('content', content);
  formData.append('publishedDate', publishedDate.toISOString().split('T')[0]); // Format date
  formData.append('author', author);
  formData.append('status', status);
  formData.append('image', image); // Image file

  try {
    const response = await fetch('https://ketrb-backend.onrender.com/programs/add', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      setAlertMessage("Program added successfully!");
      window.location.href = '/programs'; // Redirect after success
    } else {
      setAlertMessage("Failed to add program.");
    }
  } catch (error) {
    console.error('Error adding program:', error);
    setAlertMessage("An error occurred while adding the program.");
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
                                <div>
                                    <h2 className="text-xl font-bold mb-4">Add Programs</h2>
                                    <form className="space-y-6 w-[600px] mx-auto">
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
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="image" className="block text-sm font-medium text-muted-foreground">
                                                Image
                                            </label>
                                            <div className="mt-1">
                                                <Input id="image" type="file" onChange={handleImageChange} className="block w-full" />
                                                {image && (
                                                    <img
                                                        src="/placeholder.svg"
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
                                                <Input
                                                    id="author"
                                                    type="text"
                                                    value={author}
                                                    onChange={handleAuthorChange}
                                                    className="mt-1 block w-full"
													placeholder={user.fullname}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            <Button variant="outline" onClick={handleSaveDraft}>
                                                Save as Draft
                                            </Button>
                                            <Button variant="black" onClick={handlePublish}>Publish</Button>
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