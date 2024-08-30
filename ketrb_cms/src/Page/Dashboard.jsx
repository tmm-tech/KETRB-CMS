import React from "react";
import { Link } from "react-router-dom";
import SideNav from "../Component/SideNav";
import HeaderNav from "../Component/HeaderNav";
import { Button } from '../Component/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuCheckboxItem } from '../Component/dropdown-menu';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../Component/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../Component/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../Component/table';
import { Badge } from '../Component/badge';
import bgImage from "../Asset/bg.png";

const Dashboard = () => {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <SideNav />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14" style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: "center" }}>
        <HeaderNav />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Users</CardTitle>
                <CardDescription>Total users registered</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">1,234</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Images</CardTitle>
                <CardDescription>Total images uploaded</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">567</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>News</CardTitle>
                <CardDescription>Total news articles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">89</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Events</CardTitle>
                <CardDescription>Total events created</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">23</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Programs</CardTitle>
                <CardDescription>Total programs listed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">45</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Projects</CardTitle>
                <CardDescription>Total projects uploaded</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">78</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Viewers</CardTitle>
                <CardDescription>Total viewers this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">12,345</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Pending</CardTitle>
                <CardDescription>Unpublished content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">27</div>
              </CardContent>
            </Card>
          </div>
          <Tabs defaultValue="news">
            <div className="flex items-center">
              <TabsList className="bg-gray-200 p-2 rounded-md">
                <TabsTrigger value="news">News</TabsTrigger>
                <TabsTrigger value="images">Images</TabsTrigger>
                <TabsTrigger value="programs">Programs</TabsTrigger>
                <TabsTrigger value="users" className="hidden sm:flex">
                  Users
                </TabsTrigger>
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
                    <DropdownMenuCheckboxItem>Archived</DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button size="sm" variant="outline" className="h-8 gap-1">
                  <DownloadIcon className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Export</span>
                </Button>
                <Button size="sm" className="h-8 gap-1 bg-black text-white">
                  <PlusIcon className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add New</span>
                </Button>

              </div>
            </div>
            <TabsContent value="news">
              <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                  <CardTitle>News</CardTitle>
                  <CardDescription>Manage your news content and view their performance.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="hidden w-[100px] sm:table-cell">
                          <span className="sr-only">Thumbnail</span>
                        </TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="hidden md:table-cell">Author</TableHead>
                        <TableHead className="hidden md:table-cell">Published At</TableHead>
                        <TableHead>
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="hidden sm:table-cell">
                          <img
                            alt="News thumbnail"
                            className="aspect-square rounded-md object-cover"
                            height="64"
                            src="https://via.placeholder.com/150"
                            width="64"
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          <Link to="#" className="hover:underline" prefetch={false}>
                            Acme Inc Announces New Product Launch
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-500 text-green-50">Published</Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">John Doe</TableCell>
                        <TableCell className="hidden md:table-cell">2023-07-12 10:42 AM</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoveHorizontalIcon className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>View</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="hidden sm:table-cell">
                          <img
                            alt="News thumbnail"
                            className="aspect-square rounded-md object-cover"
                            height="64"
                            src="https://via.placeholder.com/150"
                            width="64"
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          <Link to="#" className="hover:underline" prefetch={false}>
                            Acme Inc Wins Industry Award
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-500 text-green-50">Published</Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">Jane Doe</TableCell>
                        <TableCell className="hidden md:table-cell">2023-06-30 3:15 PM</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoveHorizontalIcon className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>View</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

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
  );
}

function MoveHorizontalIcon(props) {
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
      <polyline points="18 8 22 12 18 16" />
      <polyline points="6 8 2 12 6 16" />
      <line x1="2" x2="22" y1="12" y2="12" />
    </svg>
  );
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
  );
}

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