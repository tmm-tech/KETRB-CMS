import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
import SideNav from "../Component/SideNav";
import HeaderNav from "../Component/HeaderNav";
import bgImage from "../Asset/bg.png";
import { Button } from '../Component/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem } from '../Component/dropdown-menu';
import { Tabs, TabsList, TabsTrigger } from '../Component/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../Component/card';
import { Badge } from '../Component/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../Component/dialog";
import { Input } from "../Component/input";
const ImagePage = () => {
  const storedUser = localStorage.getItem('user');
  const user = JSON.parse(storedUser);
  const [selectedImage, setSelectedImage] = useState(null);
  const [status, setStatus] = useState(user.roles === 'editor' ? 'Pending' : 'Published');
  const [images, setImages] = useState([]);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('https://ketrb-backend.onrender.com/images/allimages');
        const result = await response.json();
        console.log('Fetched images:', result); // Log the result to inspect the structure
        setImages(Array.isArray(result) ? result : []); 
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleCancel = () => {
    setSelectedImage(null);
  };
  const handleUpload = async () => {
    if (!imageFile) return;

    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('status', status);

    try {
      const response = await fetch('https://ketrb-backend.onrender.com/images/add', { // Replace with your backend URL
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (result.success) {
        alert('Image uploaded successfully!');
        setSelectedImage(null);
        setImageFile(null);
      } else {
        alert('Image upload failed.');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image.');
    }
  };
  return (
    <div className="flex min-h-screen w-full flex-col">
      <SideNav />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14" style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: "center" }}>
        <HeaderNav />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Images</CardTitle>
                <CardDescription>Manage your Gallery</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-4xl font-bold">89</div>

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
                    <div className="grid gap-4 py-4">
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="block w-full"
                      />
                      {selectedImage && (
                        <img
                          src={selectedImage}
                          alt="Selected Image"
                          width={300}
                          height={300}
                          className="rounded-md"
                          style={{ aspectRatio: "1 / 1", objectFit: "cover" }}
                        />
                      )}
                    </div>
                    <DialogFooter>
                      {selectedImage && (
                        <Button onClick={handleCancel} variant="outline">Cancel</Button>
                      )}
                      <Button type="submit" variant="black" onClick={handleUpload}>Save Image</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {images.map((image) => (
                <div key={image.id} className="bg-background rounded-lg shadow-lg overflow-hidden">
                  <img
                    src={image.url} // Assuming `image.url` holds the image URL
                    alt={image.title || "Image"} // Assuming `image.title` holds the image title
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover"
                    style={{ aspectRatio: "400/300", objectFit: "cover" }}
                  />
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">{image.title || "Untitled"}</div>
                      <Badge variant={image.status === 'Pending' ? 'pending' : 'approved'} className={image.status === 'Pending' ? 'bg-yellow-500 text-yellow-50' : 'bg-green-500 text-green-50'}>
                        {image.status}
                      </Badge>
                    </div>
                    <div className="text-muted-foreground text-sm mt-1">
                      {`Uploaded ${new Date(image.uploadDate).toLocaleDateString()}`}
                    </div>
                    <div className="flex items-center justify-end gap-2 mt-4">
                      <Button variant="outline" size="sm">
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                      {user.roles === 'administrator' && (
                        <Button size="sm" variant="black">Approve</Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Tabs>
        </main >
      </div >
    </div >
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
