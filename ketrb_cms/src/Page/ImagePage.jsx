import React, { useState, useEffect } from "react";
import SideNav from "../Component/SideNav";
import HeaderNav from "../Component/HeaderNav";
import bgImage from "../Asset/bg.png";
import { Button } from '../Component/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem, DropdownMenuRadioGroup, DropdownMenuRadioItem } from '../Component/dropdown-menu';
import { Tabs, TabsList, TabsTrigger } from '../Component/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../Component/card';
import { Badge } from '../Component/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../Component/dialog";
import { Input } from "../Component/input";
import { Alert, AlertDescription, AlertTitle } from "../Component/alert";
import { ScrollArea, ScrollBar } from "../Component/scroll-area";
import LoadingPage from '../Page/LoadingPage';

const ImagePage = () => {
  const storedUser = localStorage.getItem('user');
  const user = JSON.parse(storedUser);
  const [status, setStatus] = useState(user.roles === 'editor' ? 'pending' : 'published');
  const [images, setImages] = useState([]);
  const [imageFile, setImageFile] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageloading, setimageLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState("");
  const [previewUrl, setPreviewUrl] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null); 
  const [sortOption, setSortOption] = useState("date"); // default sorting by date
  const [statusFilter, setStatusFilter] = useState([]); // filter by status
	const user_id=user.id;
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
      }finally {
                setimageLoading(false);
            }
    };

    fetchImages();
  }, []);
 if (imageloading) {
    return <LoadingPage />;
  }
const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };
	
const handleUpdateCaption = async (id, caption) => {
  try {
    const response = await fetch(`https://ketrb-backend.onrender.com/images/${id}/caption`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ caption }), 
    });

    if (!response.ok) {
      throw new Error('Failed to update the caption');
    }

    const updatedImage = await response.json();

    // Optionally update local state with the new caption
    setSelectedImage((prev) => ({
      ...prev,
      caption: updatedImage.caption,
    }));

    console.log('Caption updated successfully');
  } catch (error) {
    console.error('Failed to update the caption:', error);
  }
};

 const filteredImages = images
    .filter((image) =>
      statusFilter.length === 0 ? true : statusFilter.includes(image.status)
    )
    .sort((a, b) => {
      if (sortOption === "asc") {
        return a.title.localeCompare(b.title);
      } else if (sortOption === "desc") {
        return b.title.localeCompare(a.title);
      } else if (sortOption === "date") {
        return new Date(b.registered_at) - new Date(a.registered_at);
      }
      return 0;
    });

  // Handle status filter change
  const handleStatusFilterChange = (status) => {
    if (statusFilter.includes(status)) {
      setStatusFilter(statusFilter.filter((item) => item !== status));
    } else {
      setStatusFilter([...statusFilter, status]);
    }
  };

  // Handle sorting option change
  const handleSortChange = (sortOption) => {
    setSortOption(sortOption);
  };
  const handleCancel = () => {
    setImageFile(null);
  };
const handleViewImage = (image) => {
    setSelectedImage(image);
  };

  const handleCloseDialog = () => {
    setSelectedImage(null);
  };

// Handle image approval
const handleApprove = async (id) => {
  try {                      
    const response = await fetch(`https://ketrb-backend.onrender.com/images/update/${id}`, {
      method: 'PUT',                                                                 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'published',user_id }), // Update status to 'published'
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
	    headers: {
		'Content-Type': 'application/json',
	    },
	    body: JSON.stringify({ role: user.roles,user_id }) // Pass user role to the backend
	});


    if (response.ok) {
	if (user.roles === 'editor') {	
            setAlertMessage('Image marked for deletion. Admin approval required.');
		window.location.reload();
        } else {
            setAlertMessage("Image deleted successfully!");
            window.location.reload();
	    }	    
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
if (imageFile.length === 0) {
      setAlertMessage("No files selected.");
      return;
    }
    setLoading(true);
    setAlertMessage("");

    const formData = new FormData();
  // Append each image file to the form data
imageFile.forEach(file => formData.append('images', file)); // Assuming imageFile is an array

// Append other form data (like status)
formData.append('status', status);
formData.append('user_id', user_id);
setLoading(true);
setAlertMessage(""); // Reset any previous alert message

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
    const files = Array.from(event.target.files);
    
    // Check if adding new files would exceed the limit
    if (imageFile.length + files.length > 20) {
      setAlertMessage("You can only upload a maximum of 20 images.");
      return;
    }

    setImageFile(prevFiles => [...prevFiles, ...files]); // Save the actual files
    setPreviewUrl(prevUrls => [...prevUrls, ...files.map(file => URL.createObjectURL(file))]); // Generate preview URLs
  };

    const handleDeleteCancel = async (id) => {
        try {
            const response = await fetch(`https://ketrb-backend.onrender.com/images/cancledelete/${id}`, {
                method: 'PUT', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isdeleted: false,user_id }), // Set isDeleted to true
            });

            if (response.ok) {
                const updatedImages = await response.json();
              
                setAlertMessage('Image Delete Canceled successfully');
		window.location.href = '/images';
            } else {
                setAlertMessage('Failed to Cancel Image Delete');
            }
        } catch (error) {
            console.error("Error canceling Image delete:", error);
            setAlertMessage('An error occurred while canceling the image delete.');
        }
    };


  return (
    <div className="flex min-h-screen w-full flex-col">
      <SideNav />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14" style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: "center" }}>
        <HeaderNav />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {alertMessage && (
            <div className="fixed top-0 left-0 w-full z-50">
				<Alert className="max-w-md mx-auto mt-4">
				  <AlertTitle>Notification</AlertTitle>
				  <AlertDescription>{alertMessage}</AlertDescription>
				</Alert>
			</div>
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
			    <DropdownMenuLabel>Sort by</DropdownMenuLabel>
			    <DropdownMenuSeparator />
			
			    {/* Sorting Options with SVG Icons */}
			    <DropdownMenuRadioGroup value={sortOption} onValueChange={handleSortChange}>
			      <DropdownMenuRadioItem value="asc">
			        <span className="flex items-center gap-2">
			          A-Z (Ascending)
			          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			            <path d="M12 19V5M5 12l7-7 7 7" />
			          </svg>
			        </span>
			      </DropdownMenuRadioItem>
			
			      <DropdownMenuRadioItem value="desc">
			        <span className="flex items-center gap-2">
			          Z-A (Descending)
			          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			            <path d="M12 5v14M5 12l7 7 7-7" />
			          </svg>
			        </span>
			      </DropdownMenuRadioItem>
			
			      <DropdownMenuRadioItem value="date">
			        <span className="flex items-center gap-2">
			          Date
			          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			            <path d="M3 3h18M3 8h18M8 12v8m4-8v8m4-8v8M5 5h2m10 0h2" />
			          </svg>
			        </span>
			      </DropdownMenuRadioItem>
			    </DropdownMenuRadioGroup>
			
			    <DropdownMenuSeparator />
			    
			    {/* Filter by Status */}
			    <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
			    <DropdownMenuSeparator />
			    <DropdownMenuCheckboxItem
			      checked={statusFilter.includes('published')}
			      onCheckedChange={() => handleStatusFilterChange('published')}
			    >
			      Published
			    </DropdownMenuCheckboxItem>
			    <DropdownMenuCheckboxItem
			      checked={statusFilter.includes('pending')}
			      onCheckedChange={() => handleStatusFilterChange('pending')}
			    >
			      Pending
			    </DropdownMenuCheckboxItem>
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
			<ScrollArea className="h-[200px] w-[350px] rounded-md border p-4">
                      		<div className="grid gap-4 py-4">
				      <Input
				        type="file"
				        accept="image/*"
				        multiple
				        onChange={handleImageSelect}
				        className="block w-full"
				        name="image"
				      />
							     
				      {/* Image preview section */}
				      {Array.isArray(previewUrl) && previewUrl.map((url, index) => (
					   
				        	<img key={index} src={url} alt={`Preview ${index}`} className="rounded-md" />
					   
				      ))}
			      	</div>
			 </ScrollArea> 
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

  {filteredImages.length === 0 ? (
    <div className="col-span-full flex items-center justify-center">
      <p className="text-center text-gray-500">No images available.</p>
    </div>
  ) : (
    filteredImages.map((image) => (
      <div
  key={image.id}
  className={`bg-background rounded-lg shadow-lg overflow-hidden ${
    image.isdeleted === true && user.roles === "editor" ? "opacity-50 pointer-events-none" : ""
  }`}
>
	    {/* Display the image */}
        <img
          src={image.url}
          alt={image.title || "Image"}
          width={400}
          height={300}
          className="w-full h-48 object-cover"
          style={{ aspectRatio: "400/300", objectFit: "cover" }}
        />

        {/* Image details and actions */}
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">{image.title || "Untitled"}</div>
            
             <Badge
                                                         variant={image.status === "pending" ? "pending" : "approved"}
                                                        className={`capitalize ${
                                                            image.status === "published"
                                                                ? "bg-green-500 text-green-50"
                                                                : image.status === "pending"
                                                                ? "bg-yellow-500 text-yellow-50"
                                                                : "bg-gray-500 text-gray-50"
                                                        }`}
                                                    >
                                                        {image.status}
                                                    </Badge>
          </div>

          {/* Uploaded Date */}
          <div className="text-muted-foreground text-sm mt-1">
            {`Uploaded ${new Date(image.registered_at).toLocaleDateString()}`}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 mt-4">
		  {user.roles === 'administrator' && image.isdeleted === true ? (
			// Show Approve Delete button if the program is pending delete and user is an admin
			<>
				 <Button variant="outline" onClick={() => handleViewImage(image)}>
			             <FilePenIcon className="h-4 w-4" />         
				     View
			        </Button>
				<Button variant="black" size="sm" className="h-8 gap-1" onClick={() => handleDelete(image.id)}>
					<CheckIcon className="h-3.5 w-3.5" />
					<span>Approve Delete</span>
				</Button>
				<Button variant="black" size="sm" className="h-8 gap-1" onClick={() => handleDeleteCancel(image.id)}>
					<CheckIcon className="h-3.5 w-3.5" />
					<span>Cancle Delete</span>
				</Button>
			</>
			) : (
			// Otherwise, show Edit and Delete buttons
			<> 
			     <Button variant="outline" onClick={() => handleViewImage(image)}>
				     <FilePenIcon className="h-4 w-4" />         
				     View
			    </Button>
		 	    <Button variant="outline" size="sm" onClick={() => handleDelete(image.id)}>
		              <TrashIcon className="h-4 w-4" />
		            </Button>
			</>
		)}
		   
            {/* Only show approve button for pending images and if the user is an admin */}
            {user.roles === "administrator" && image.status === "pending" && (
              <Button size="sm" variant="black" onClick={() => handleApprove(image.id)}>
                Approve
              </Button>
            )}
          </div>
        </div>
      </div>
    ))
  )}
</div>
          </Tabs>
		<Dialog open={!!selectedImage} onOpenChange={handleCloseDialog}>
		  <DialogContent className="sm:max-w-[500px]">
		    <DialogHeader>
		      <DialogTitle>View Image</DialogTitle>
		    </DialogHeader>
		    {selectedImage && (
		      <>
		        <img src={selectedImage.url} alt={selectedImage.title} className="w-full h-auto" />
		        <div className="mt-4">
		          <label htmlFor="caption" className="block text-sm font-medium text-gray-700">
		            Caption
		          </label>
		          <textarea
		            id="caption"
		            rows="3"
		            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
		            value={selectedImage.caption || ""}
		            onChange={(e) => setSelectedImage({ ...selectedImage, caption: e.target.value })}
		          />
		        </div>
		      </>
		    )}
		    <DialogFooter>
		      <div className="flex items-center justify-end gap-2 mt-4">
		        <Button variant="black" onClick={handleCloseDialog}>Close</Button>
		        <Button variant="outline" size="sm" onClick={() => handleDelete(selectedImage.id)}>
		          <TrashIcon className="h-4 w-4" />
		        </Button>
		        {user.roles === "administrator" && status === "pending" && (
		          <Button size="sm" variant="black" onClick={() => handleApprove(selectedImage.id)}>
		            Approve
		          </Button>
		        )}
		        {/* Save Caption Button */}
		        <Button size="sm" variant="black" onClick={() => handleUpdateCaption(selectedImage.id, selectedImage.caption)}>
		          Save Caption
		        </Button>
		      </div>
		    </DialogFooter>
		  </DialogContent>
		</Dialog>

		
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

function CheckIcon(props) {
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
            <path d="M6 12l4 4L18 6" />
        </svg>
    );
} 

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
