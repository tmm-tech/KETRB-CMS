import React, { useState, useEffect } from "react";
import SideNav from "../Component/SideNav";
import HeaderNav from "../Component/HeaderNav";
import bgImage from "../Asset/bg.png";
import { Button } from '../Component/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem } from '../Component/dropdown-menu';
import { Tabs, TabsList, TabsTrigger } from '../Component/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../Component/card';
import { Badge } from '../Component/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../Component/dialog";
import { Input } from "../Component/input";
import { Alert, AlertDescription, AlertTitle } from "../Component/alert";

const ImagePage = () => {
  const storedUser = localStorage.getItem('user');
  const user = JSON.parse(storedUser);
  const [status, setStatus] = useState(user.roles === 'editor' ? 'pending' : 'published');
  const [images, setImages] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('https://ketrb-backend.onrender.com/images/allimages');
        const result = await response.json();

        if (response.ok) {
          setImages(result.images);
        } else {
          setAlertMessage("Failed to fetch images.");
        }
      } catch (error) {
        console.log('Error fetching images:', error);
        setAlertMessage("An error occurred while fetching images.");
      }
    };

    fetchImages();
  }, []);

  const handleCancel = () => {
    setImageFile(null);
  };

// Handle image approval
const handleApprove = async (id) => {
  try {                      
    const response = await fetch(`https://ketrb-backend.onrender.com/images/update/${id}`, {
      method: 'PUT',                                                                 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'published' }), // Update status to 'published'
    });

    if (response.ok) {
      setAlertMessage("Image approved successfully!");
      // Optionally, you can refetch images or update UI state
      window.location.reload(); // Refresh the page or refetch images
    } else {
      setAlertMessage("Failed to approve the image.");
    }
  } catch (error) {
    console.error('Error approving image:', error);
    setAlertMessage("An error occurred while approving the image.");
  }
};

// Handle image deletion
const handleDelete = async (id) => {
  try {                     
    const response = await fetch(`https://ketrb-backend.onrender.com/images/delete/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setAlertMessage("Image deleted successfully!");
      // Optionally, you can refetch images or update UI state
      window.location.reload(); // Refresh the page or refetch images
    } else {
      setAlertMessage("Failed to delete the image.");
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    setAlertMessage("An error occurred while deleting the image.");
  }
};

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!imageFile) {
      setAlertMessage("No file selected.");
      return;
    }

    setLoading(true);
    setAlertMessage("");

    const formData = new FormData();
    console.log("Image: ", imageFile)
    formData.append('image', imageFile);
    formData.append('status', status);

    try {
      const response = await fetch('https://ketrb-backend.onrender.com/images/add', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setAlertMessage("Image uploaded successfully!");
        window.location.href = '/images';
      } else {
        setAlertMessage("Failed to upload image.");
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setAlertMessage("An error occurred while uploading the image.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file); // Save the actual file
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <SideNav />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14" style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: "center" }}>
        <HeaderNav />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {alertMessage && (
            <Alert>
              <AlertTitle>Notification</AlertTitle>
              <AlertDescription>{alertMessage}</AlertDescription>
            </Alert>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Images</CardTitle>
                <CardDescription>Manage your Gallery</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-4xl font-bold">{images.length}</div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-green-500 text-green-50">
                      Published
                    </Badge>
                    <Badge variant="outline" className="bg-yellow-500 text-yellow-50">
                      Pending
                    </Badge>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
          <Tabs defaultValue="image">
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="image">Images</TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                      <FilterIcon className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Filter</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem checked>Published</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>Pending</DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <Button variant="black" size="sm" className="h-8 gap-1">
                          <PlusIcon className="h-3.5 w-3.5" />
                          <span>Add Image</span>
                        </Button>
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Upload Image</DialogTitle>
                      <DialogDescription>Select an image to upload for the user profile.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpload} encType="multipart/form-data">
                      <div className="grid gap-4 py-4">
                        <Input
                          type="file"
                          accept="image/*"
						  multiple
                          onChange={handleImageSelect}
                          className="block w-full"
                          name="image"
                        />
                        {previewUrl && (
                          <img
                            src={previewUrl}
                            alt="Selected Image"
                            width={300}
                            height={300}
                            className="rounded-md"
                            style={{ aspectRatio: "1 / 1", objectFit: "cover" }}
                          />
                        )}
                      </div>
                      <DialogFooter>
                        {previewUrl && (
                          <Button onClick={handleCancel} variant="outline">Cancel</Button>
                        )}
                        <Button
                          type="submit"
                          variant="black"
                          disabled={loading}
                        >
                          {loading ? (
                            <span>Loading...</span>
                          ) : (
                            'Save Image'
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {images.length > 0 ? (
                images.map((image) => (
                  <div key={image.id} className="bg-background rounded-lg shadow-lg overflow-hidden">
                    <img
                      src={image.url}
                      alt={image.title || "Image"}
                      width={400}
                      height={300}
                      className="w-full h-48 object-cover"
                      style={{ aspectRatio: "400/300", objectFit: "cover" }}
                    />
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">{image.title || "Untitled"}</div>
                        <Badge
                          variant={image.status === 'pending' ? 'pending' : 'approved'}
                          className={image.status === 'pending' ? 'bg-yellow-500 text-yellow-50' : 'bg-green-500 text-green-50'}
                        >
                          {capitalizeFirstLetter(image.status)}
                        </Badge>
                      </div>
                      <div className="text-muted-foreground text-sm mt-1">
                        {`Uploaded ${new Date(image.registered_at).toLocaleDateString()}`}
                      </div>
                      <div className="flex items-center justify-end gap-2 mt-4">
                        <Button variant="outline" size="sm" onClick={() => handleDelete(image.id)}>
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                        {user.roles === 'administrator' && image.status === 'pending' && (
                          <Button size="sm" variant="black" onClick={() => handleApprove(image.id)}>Approve</Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full flex items-center justify-center">
                  <p className="text-center text-gray-500">No images available.</p>
                </div>
              )}
            </div>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default ImagePage;


function FilterIcon(props) {
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
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  )
}


function PlusIcon(props) {
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
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}


function TrashIcon(props) {
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
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  )
}
