import React, {useState} from "react";
import { Link } from "react-router-dom";
import SideNav from "../Component/SideNav";
import HeaderNav from "../Component/HeaderNav";
import bgImage from "../Asset/bg.png";
import { Button } from '../Component/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem } from '../Component/dropdown-menu';
import { Tabs, TabsList, TabsTrigger} from '../Component/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../Component/card';
import { Badge } from '../Component/badge';
const ImagePage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      setSelectedImage(file);
    }
  };

  const handleSave = () => {
    // Handle the save action here
    alert('Image saved!');
    setSelectedImage(null);
    setPreviewUrl(null);
  };

  const handleCancel = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
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
                <Button onClick={openModal}  variant="black" size="sm">
                  <PlusIcon className="h-3.5 w-3.5" />
                  <span>Add Images</span>
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <div className="bg-background rounded-lg shadow-lg overflow-hidden">
                <img
                  src="https://via.placeholder.com/150"
                  alt="Image"
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                  style={{ aspectRatio: "400/300", objectFit: "cover" }}
                />
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Image 1</div>
                    <Badge variant="pending" className="bg-yellow-500 text-yellow-50">Pending</Badge>
                  </div>
                  <div className="text-muted-foreground text-sm mt-1">Uploaded 2 days ago</div>
                  <div className="flex items-center justify-end gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="black">Approve</Button>
                  </div>
                </div>
              </div>
              <div className="bg-background rounded-lg shadow-lg overflow-hidden">
                <img
                  src="https://via.placeholder.com/150"
                  alt="Image"
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                  style={{ aspectRatio: "400/300", objectFit: "cover" }}
                />
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Image 2</div>
                    <Badge variant="published" className="bg-green-500 text-green-50">Published</Badge>
                  </div>
                  <div className="text-muted-foreground text-sm mt-1">Uploaded 1 week ago</div>
                  <div className="flex items-center justify-end gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="bg-background rounded-lg shadow-lg overflow-hidden">
                <img
                  src="https://via.placeholder.com/150"
                  alt="Image"
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                  style={{ aspectRatio: "400/300", objectFit: "cover" }}
                />
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Image 3</div>
                    <Badge variant="pending" className="bg-yellow-500 text-yellow-50">Pending</Badge>
                  </div>
                  <div className="text-muted-foreground text-sm mt-1">Uploaded 3 days ago</div>
                  <div className="flex items-center justify-end gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="black">Approve</Button>
                  </div>
                </div>
              </div>
              <div className="bg-background rounded-lg shadow-lg overflow-hidden">
                <img
                  src="https://via.placeholder.com/150"
                  alt="Image"
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                  style={{ aspectRatio: "400/300", objectFit: "cover" }}
                />
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Image 4</div>
                    <Badge variant="published" className="bg-green-500 text-green-50">Published</Badge>
                  </div>
                  <div className="text-muted-foreground text-sm mt-1">Uploaded 2 weeks ago</div>
                  <div className="flex items-center justify-end gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Tabs>
          {isModalOpen && (
            <>
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={closeModal}></div>
              <div className="fixed inset-0 flex items-center justify-center z-60">
                <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md relative">
                  <h2 className="text-lg font-semibold mb-4">Upload and Preview Image</h2>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange} 
                    className="mb-4"
                  />
                  {previewUrl && (
                    <div className="mb-4">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-auto object-cover rounded-lg"
                        style={{ aspectRatio: "16/9", objectFit: "cover" }}
                      />
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button onClick={handleCancel} variant="outline" className="flex-1">Cancel</Button>
                    <Button onClick={handleSave} className="flex-1">Save</Button>
                  </div>
                </div>
              </div>
            </>
          )}
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
