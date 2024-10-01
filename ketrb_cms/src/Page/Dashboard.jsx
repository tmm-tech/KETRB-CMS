import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SideNav from "../Component/SideNav";
import HeaderNav from "../Component/HeaderNav";
import { Button } from '../Component/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuCheckboxItem } from '../Component/dropdown-menu';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../Component/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../Component/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../Component/table';
import { Badge } from '../Component/badge';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext, PaginationLink, PaginationEllipsis } from '../Component/pagination'; // Import pagination components
import bgImage from "../Asset/bg.png";

const Dashboard = () => {
  const [news, setNews] = useState([]);
  const [images, setImages] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [users, setUsers] = useState([]);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Adjust number of items per page

  const storedUser = localStorage.getItem('user');
  const user = JSON.parse(storedUser);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newsResponse, imagesResponse, programsResponse, usersResponse] = await Promise.all([
          fetch("https://ketrb-backend.onrender.com/news/"),
          fetch("https://ketrb-backend.onrender.com/images/allimages"),
          fetch("https://ketrb-backend.onrender.com/programs/"),
          fetch("https://ketrb-backend.onrender.com/users/allusers")
        ]);
        const userdata = await usersResponse.json();
        const imagedata = await imagesResponse.json();
        setNews(await newsResponse.json());
        setImages(imagedata.images);
        setPrograms(await programsResponse.json());
        setUsers(userdata.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Calculate total pages
  const totalPages = Math.ceil(news.length / itemsPerPage);
  // Get current items
  const currentItems = news.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
                <div className="text-4xl font-bold">{users.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Images</CardTitle>
                <CardDescription>Total images uploaded</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{images.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                  <CardTitle>News & Events</CardTitle>
                <CardDescription>Total news articles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{news.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Programs & Projects</CardTitle>
                <CardDescription>Total programs listed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{programs.length}</div>
              </CardContent>
            </Card>
            
          </div>
          <Tabs defaultValue="news">
            <div className="flex items-center">
              <TabsList className="bg-gray-200 p-2 rounded-md">
                <TabsTrigger value="news">News</TabsTrigger>
                <TabsTrigger value="images">Images</TabsTrigger>
                <TabsTrigger value="programs">Programs</TabsTrigger>
                {user.roles === 'administrator' && (
                  <TabsTrigger value="users" className="hidden sm:flex">
                    Users
                  </TabsTrigger>
                )}
              </TabsList>
              <div className="ml-auto flex items-center gap-2">
                <Button size="sm" className="h-8 gap-1 bg-transparent text-black border border-black rounded-md">
                  <ListOrderedIcon className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Sort by</span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 gap-1 bg-black text-white">
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
                

              </div>
            </div>
          
            {/* News Tab */}
            <TabsContent value="news">
              <Card>
                <CardHeader>
                  <CardTitle>News</CardTitle>
                  <CardDescription>Manage your news content and view their performance.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="hidden w-[100px] sm:table-cell">Thumbnail</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="hidden md:table-cell">Author</TableHead>
                        <TableHead className="hidden md:table-cell">Published At</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentItems.map((article) => (
                        <TableRow key={article.id}>
                          <TableCell className="hidden sm:table-cell">
                            <img
                              alt={article.title}
                              className="aspect-square rounded-md object-cover"
                              height="64"
                              src={article.thumbnail || "https://via.placeholder.com/150"}
                              width="64"
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            <Link to="#" className="hover:underline">{article.title}</Link>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={`bg-${article.status === "published"  ? "bg-green-500 text-green-50"  : article.status === "pending"  ? "bg-yellow-500 text-yellow-50" : "bg-gray-500 text-gray-50"}-500 text-white capitalize`}>
                              {article.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{article.author}</TableCell>
                          <TableCell className="hidden md:table-cell">{new Date(article.published_date).toLocaleString()}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost">
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
                      ))}
                    </TableBody>
                  </Table>
                  <Pagination className="flex items-center justify-center mt-4">
                      <PaginationContent className="flex items-center space-x-2">
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="flex items-center px-3 py-1 text-sm font-medium text-white bg-black rounded hover:bg-black disabled:opacity-50"
                          />
                        </PaginationItem>
                    
                        {/* Page Numbers */}
                        {[...Array(totalPages).keys()].map(number => (
                          <PaginationItem key={number + 1}>
                            <PaginationLink
                              href="#"
                              onClick={() => setCurrentPage(number + 1)}
                              className={`flex items-center px-3 py-1 text-sm font-medium rounded hover:bg-black ${
                                currentPage === number + 1 ? 'bg-transparent text-black' : 'text-gray-700'
                              }`}
                            >
                              {number + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                    
                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="flex items-center px-3 py-1 text-sm font-medium text-white bg-black rounded hover:bg-black disabled:opacity-50"
                          />
                        </PaginationItem>
                      </PaginationContent>
                  </Pagination>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Images Tab */}
            <TabsContent value="images">
              <Card>
                <CardHeader>
                  <CardTitle>Images</CardTitle>
                  <CardDescription>Manage your images.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                     {images.map((image) => (
                      <div key={image.id}>
                        <img src={image.url  || "https://via.placeholder.com/150"} alt={image.image} className="w-full h-auto rounded-md" />
                      </div>
                    ))}
                  </div>
                  <Pagination className="flex items-center justify-center mt-4">
                      <PaginationContent className="flex items-center space-x-2">
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="flex items-center px-3 py-1 text-sm font-medium text-white bg-black rounded hover:bg-blue-700 disabled:opacity-50"
                          />
                        </PaginationItem>
                    
                        {/* Page Numbers */}
                        {[...Array(totalPages).keys()].map(number => (
                          <PaginationItem key={number + 1}>
                            <PaginationLink
                              href="#"
                              onClick={() => setCurrentPage(number + 1)}
                              className={`flex items-center px-3 py-1 text-sm font-medium rounded hover:bg-blue-200 ${
                                currentPage === number + 1 ? 'bg-transparent text-black' : 'text-gray-700'
                              }`}
                            >
                              {number + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                    
                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="flex items-center px-3 py-1 text-sm font-medium text-white bg-black rounded hover:bg-black disabled:opacity-50"
                          />
                        </PaginationItem>
                      </PaginationContent>
                  </Pagination>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Programs Tab */}
            <TabsContent value="programs">
              <Card>
                <CardHeader>
                  <CardTitle>Programs</CardTitle>
                  <CardDescription>Manage your programs.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                         <TableHead className="hidden w-[100px] sm:table-cell">Thumbnail</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="hidden md:table-cell">Author</TableHead>
                        <TableHead className="hidden md:table-cell">Published At</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {programs.map((program) => (
                         <TableRow key={program.id}>
                          <TableCell className="hidden sm:table-cell">
                            <img
                              alt={program.title}
                              className="aspect-square rounded-md object-cover"
                              height="64"
                              src={program.thumbnail || "https://via.placeholder.com/150"}
                              width="64"
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            <Link to="#" className="hover:underline">{program.title}</Link>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={`bg-${program.status === "published"  ? "bg-green-500 text-green-50"  : program.status === "pending"  ? "bg-yellow-500 text-yellow-50" : "bg-gray-500 text-gray-50"}-500 text-white capitalize`}>
                              {program.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{program.author}</TableCell>
                          <TableCell className="hidden md:table-cell">{new Date(program.published_date).toLocaleString()}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost">
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
                      ))}
                    </TableBody>
                  </Table>
                  <Pagination className="flex items-center justify-center mt-4">
                      <PaginationContent className="flex items-center space-x-2">
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="flex items-center px-3 py-1 text-sm font-medium text-white bg-black rounded hover:bg-blue-700 disabled:opacity-50"
                          />
                        </PaginationItem>
                    
                        {/* Page Numbers */}
                        {[...Array(totalPages).keys()].map(number => (
                          <PaginationItem key={number + 1}>
                            <PaginationLink
                              href="#"
                              onClick={() => setCurrentPage(number + 1)}
                              className={`flex items-center px-3 py-1 text-sm font-medium rounded hover:bg-blue-200 ${
                                currentPage === number + 1 ? 'bg-transparent text-black' : 'text-gray-700'
                              }`}
                            >
                              {number + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                    
                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="flex items-center px-3 py-1 text-sm font-medium text-white bg-black rounded hover:bg-black disabled:opacity-50"
                          />
                        </PaginationItem>
                      </PaginationContent>
                  </Pagination>
                </CardContent>
              </Card>
            </TabsContent>

            
              {/* Users Tab */}
<TabsContent value="users">
  {user.roles === 'administrator' && (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
        <CardDescription>Manage your users.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.fullname}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell> 
                    <Badge className="capitalize" variant={user.roles === "administrator" ? "admin" : user.roles === "editor" ? "editor" : "warning"}>
                          {user.roles}
                    </Badge>
                </TableCell>
                <TableCell>
                  <Badge className="capitalize" variant={user.status === "inactive" ? "danger" : "success"} >
                          {user.status}
                        </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
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
            ))}
          </TableBody>
        </Table>
        <Pagination className="flex items-center justify-center mt-4">
          <PaginationContent className="flex items-center space-x-2">
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center px-3 py-1 text-sm font-medium text-white bg-black rounded hover:bg-blue-700 disabled:opacity-50"
              />
            </PaginationItem>

            {/* Page Numbers */}
            {[...Array(totalPages).keys()].map(number => (
              <PaginationItem key={number + 1}>
                <PaginationLink
                  href="#"
                  onClick={() => setCurrentPage(number + 1)}
                  className={`flex items-center px-3 py-1 text-sm font-medium rounded hover:bg-transparent ${
                    currentPage === number + 1 ? 'bg-transparent text-black' : 'text-gray-700'
                  }`}
                >
                  {number + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex items-center px-3 py-1 text-sm font-medium text-white bg-black rounded hover:bg-black disabled:opacity-50"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardContent>
    </Card>
  )}
</TabsContent>
            
            )}
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
function ListOrderedIcon(props) {
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
      <line x1="10" x2="21" y1="6" y2="6" />
      <line x1="10" x2="21" y1="12" y2="12" />
      <line x1="10" x2="21" y1="18" y2="18" />
      <path d="M4 6h1v4" />
      <path d="M4 10h2" />
      <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
    </svg>
  )
}
