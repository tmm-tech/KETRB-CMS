import React from "react";
import { Link } from "react-router-dom";
import SideNav from "../Component/SideNav";
import HeaderNav from "../Component/HeaderNav";
import bgImage from "../Asset/bg.png";
import image1 from "../Asset/joseph.jpg";
import { Button } from '../Component/button';
import { Input } from '../Component/input';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuCheckboxItem } from '../Component/dropdown-menu';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink} from '../Component/breadcrumb';
import { Sheet, SheetTrigger, SheetContent } from '../Component/sheet';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../Component/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter} from '../Component/card';
import { Badge } from '../Component/badge';
const ImagePage = () => {
    return (
        <div className="flex min-h-screen w-full flex-col">
            <SideNav />
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14" style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: "center" }}>
                <HeaderNav />
                <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>News</CardTitle>
                                <CardDescription>Manage your news articles</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="text-4xl font-bold">89</div>
                                    <Button variant="outline" size="sm" className="h-8 gap-1">
                                        <PlusIcon className="h-3.5 w-3.5" />
                                        <span>Add News</span>
                                    </Button>
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
                                        <Badge variant="outline" className="bg-gray-500 text-gray-50">
                                            Draft
                                        </Badge>
                                    </div>
                                    <Button variant="outline" size="sm" className="h-8 gap-1">
                                        <FilePenIcon className="h-3.5 w-3.5" />
                                        <span>Manage</span>
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                    <Tabs defaultValue="news">
                        <div className="flex items-center">
                            <TabsList>
                                <TabsTrigger value="news">News</TabsTrigger>
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
                                <Button size="sm" variant="outline" className="h-8 gap-1">
                                    <DownloadIcon className="h-3.5 w-3.5" />
                                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Export</span>
                                </Button>
                            </div>
                        </div>
                        <TabsContent value="news">
                            <div className="grid gap-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>New Product Launch</CardTitle>
                                        <CardDescription>Published on August 15, 2023</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p>
                                            We are excited to announce the launch of our new product, the Acme Pro Controller. This
                                            cutting-edge device offers enhanced features and improved performance for the ultimate gaming
                                            experience.
                                        </p>
                                    </CardContent>
                                    <CardFooter>
                                        <div className="flex items-center justify-between">
                                            <Badge variant="outline" className="bg-green-500 text-green-50">
                                                Published
                                            </Badge>
                                            <div className="flex items-center gap-2">
                                                <Button variant="outline" size="sm" className="h-8 gap-1">
                                                    <FilePenIcon className="h-3.5 w-3.5" />
                                                    <span>Edit</span>
                                                </Button>
                                                <Button variant="outline" size="sm" className="h-8 gap-1">
                                                    <TrashIcon className="h-3.5 w-3.5" />
                                                    <span>Delete</span>
                                                </Button>
                                            </div>
                                        </div>
                                    </CardFooter>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>New Partnership Announcement</CardTitle>
                                        <CardDescription>Pending approval</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p>
                                            We are thrilled to announce our new partnership with Acme Inc. Together, we will be launching a
                                            series of innovative products that will revolutionize the industry.
                                        </p>
                                    </CardContent>
                                    <CardFooter>
                                        <div className="flex items-center justify-between">
                                            <Badge variant="outline" className="bg-yellow-500 text-yellow-50">
                                                Pending
                                            </Badge>
                                            <div className="flex items-center gap-2">
                                                <Button variant="outline" size="sm" className="h-8 gap-1">
                                                    <FilePenIcon className="h-3.5 w-3.5" />
                                                    <span>Edit</span>
                                                </Button>
                                                <Button variant="outline" size="sm" className="h-8 gap-1">
                                                    <TrashIcon className="h-3.5 w-3.5" />
                                                    <span>Delete</span>
                                                </Button>
                                            </div>
                                        </div>
                                    </CardFooter>
                                </Card>
                            </div>
                        </TabsContent>
                    </Tabs>
                </main>
            </div>
        </div>
    );
};

export default ImagePage;

function DownloadIcon(props) {
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
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" x2="12" y1="15" y2="3" />
      </svg>
    )
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
  
  
  function MenuIcon(props) {
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
        <line x1="4" x2="20" y1="12" y2="12" />
        <line x1="4" x2="20" y1="6" y2="6" />
        <line x1="4" x2="20" y1="18" y2="18" />
      </svg>
    )
  }
  
  
  function NewspaperIcon(props) {
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
        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
        <path d="M18 14h-8" />
        <path d="M15 18h-5" />
        <path d="M10 6h8v4h-8V6Z" />
      </svg>
    )
  }
  
  
  function Package2Icon(props) {
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
        <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
        <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
        <path d="M12 3v6" />
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
  
  
  function SettingsIcon(props) {
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
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
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
