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
  const [activeTab, setActiveTab] = useState("news");
const [sortOption, setSortOption] = useState({ news: '', images: '', programs: '', users: '' });
  const [filterOptions, setFilterOptions] = useState({ news: [], images: [], programs: [], users: [] });
  const [currentPage, setCurrentPage] = useState({ news: 1, images: 1, programs: 1, users: 1 });
  const itemsPerPage = 5;

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

    // Sorting handler
  const handleSort = (option) => {
    setSortOption(prev => ({ ...prev, [activeTab]: option }));
  };

  // Filtering handler
  const handleFilterChange = (filterType, option) => {

    // For other tabs (news and programs), handle status filter
    setFilterOptions(prev => {
      const newFilters = prev[activeTab].includes(option)
        ? prev[activeTab].filter(filter => filter !== option)
        : [...prev[activeTab], option];
      return { ...prev, [activeTab]: newFilters };
    });
  
};
 

  // Sorting logic for each tab
const sortedData = {
  news: () => {
    return [...news]
      .sort((a, b) => {
        if (sortOption.news === 'latest') {
          return new Date(b.published_date) - new Date(a.published_date);
        } else if (sortOption.news === 'oldest') {
          return new Date(a.published_date) - new Date(b.published_date);
        }
        return 0; // No sorting if option is not set
      })
      .filter(article => (filterOptions.news.length === 0 ? true : filterOptions.news.includes(article.status)));
  },
  
  images: () => {
    return [...images]
      .sort((a, b) => {
        if (sortOption.images === 'latest') {
          return new Date(b.registered_at) - new Date(a.registered_at);
        } else if (sortOption.images === 'oldest') {
          return new Date(a.registered_at) - new Date(b.registered_at);
        }
        return 0; // No sorting if option is not set
      })
      .filter(image => (filterOptions.images.length === 0 ? true : filterOptions.images.includes(image.status)));
  },

  programs: () => {
    return [...programs]
      .sort((a, b) => {
        if (sortOption.programs === 'latest') {
          return new Date(b.published_date) - new Date(a.published_date);
        } else if (sortOption.programs === 'oldest') {
          return new Date(a.published_date) - new Date(b.published_date);
        }
        return 0; // No sorting if option is not set
      })
      .filter(program => (filterOptions.programs.length === 0 ? true : filterOptions.programs.includes(program.status)));
  },

  users: () => {
    return [...users]
      .sort((a, b) => {
        if (sortOption.users === 'latest') {
          return new Date(b.registered_at) - new Date(a.registered_at);
        } else if (sortOption.users === 'oldest') {
          return new Date(a.registered_at) - new Date(b.registered_at);
        }
        return 0; // No sorting if option is not set
      })
      .filter(user => (filterOptions.users.length === 0 ? true : filterOptions.users.includes(user.status)));
  },
};
 

  // Pagination logic
  const totalPages = {
    news: Math.ceil(sortedData.news().length / itemsPerPage),
    images: Math.ceil(sortedData.images().length / itemsPerPage),
    programs: Math.ceil(sortedData.programs().length / itemsPerPage),
    users: Math.ceil(sortedData.users().length / itemsPerPage),
  };

  const currentItems = {
    news: sortedData.news().slice((currentPage.news - 1) * itemsPerPage, currentPage.news * itemsPerPage),
    images: sortedData.images().slice((currentPage.images - 1) * itemsPerPage, currentPage.images * itemsPerPage),
    programs: sortedData.programs().slice((currentPage.programs - 1) * itemsPerPage, currentPage.programs * itemsPerPage),
    users: sortedData.users().slice((currentPage.users - 1) * itemsPerPage, currentPage.users * itemsPerPage),
  };

  // Pagination handler
 const handlePageChange = (tab, pageNumber) => {
    setCurrentPage(prev => ({
      ...prev,
      [tab]: pageNumber,
    }));
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
          <Tabs value={activeTab} onValueChange={setActiveTab}>
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" className="h-8 gap-1 bg-black text-white">
                      <ListOrderedIcon className="h-3.5 w-3.5" />
                      Sort by
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Sort</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleSort('latest')}>Latest</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSort('oldest')}>Oldest</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline" size="sm" className="h-8 gap-1 bg-transparent border-black text-black">
      <FilterIcon className="h-3.5 w-3.5" />
      Filter
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    {activeTab === "users" ? (
      <>
        <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={filterOptions[activeTab].includes('active')}
          onCheckedChange={() => handleFilterChange('status', 'active')}
        >
          Active
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={filterOptions[activeTab].includes('inactive')}
          onCheckedChange={() => handleFilterChange('status', 'inactive')}
        >
          Inactive
        </DropdownMenuCheckboxItem>
      </>
    ) : (
      <>
        <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={filterOptions[activeTab].includes('published')}
          onCheckedChange={() => handleFilterChange('status', 'published')}
        >
          Published
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={filterOptions[activeTab].includes('pending')}
          onCheckedChange={() => handleFilterChange('status', 'pending')}
        >
          Pending
        </DropdownMenuCheckboxItem>
        {activeTab !== "images" && ( // Ensure draft is not included for images
          <DropdownMenuCheckboxItem
            checked={filterOptions[activeTab].includes('draft')}
            onCheckedChange={() => handleFilterChange('status', 'draft')}
          >
            Draft
          </DropdownMenuCheckboxItem>
        )}
      </>
    )}
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
                      {currentItems.news.map((article) => (
                        <TableRow key={article.id}>
                          <TableCell className="hidden sm:table-cell">
                            <img
                              alt={article.title}
                              className="aspect-square rounded-md object-cover"
                              height="64"
                              src={article.imageUrl || "https://via.placeholder.com/150"}
                              width="64"
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            <Link to={`/news/edit news/${article.id}`} className="hover:underline">{article.title}</Link>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={`${article.status === "published"  ? "bg-green-500 text-green-50"  : article.status === "pending"  ? "bg-yellow-500 text-yellow-50" : "bg-gray-500 text-gray-50"} capitalize`}>
                              {article.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{article.author}</TableCell>
                          <TableCell className="hidden md:table-cell">{new Date(article.published_date).toLocaleString()}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                  <MoveHorizontalIcon className="h-4 w-4" />
                                  <span className="sr-only">Toggle menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel><Link to="/news" className="hover:underline">Actions</Link></DropdownMenuLabel>
                                <DropdownMenuItem><Link to={`/news/edit news/${article.id}`} className="hover:underline">View</Link></DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                 <Pagination className="flex items-center justify-center mt-4">
                      <PaginationContent className="flex items-center space-x-2">
                        {/* Previous Button */}
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={() => handlePageChange("news", Math.max(currentPage.news - 1, 1))}
                            disabled={currentPage.news === 1}
                            className={`flex items-center px-3 py-1 text-sm font-medium bg-transparent text-black rounded hover:bg-transparent transition-colors duration-200 ${
                              currentPage.news === 1 ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                          />
                        </PaginationItem>
                    
                        {/* Pagination Numbers */}
                        {[...Array(totalPages.news).keys()].map((number) => (
                          <PaginationItem key={number + 1}>
                            <PaginationLink
                              href="#"
                              onClick={() => handlePageChange("news", number + 1)}
                              className={`flex items-center px-3 py-1 text-sm font-medium rounded border transition-colors duration-200 ${
                                currentPage.news === number + 1
                                  ? "bg-black text-white border-black"
                                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                              }`}
                            >
                              {number + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                    
                        {/* Next Button */}
                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={() => handlePageChange("news", Math.min(currentPage.news + 1, totalPages.news))}
                            disabled={currentPage.news === totalPages.news}
                            className={`flex items-center px-3 py-1 text-sm font-medium bg-transparent text-black rounded hover:bg-transparent transition-colors duration-200 ${
                              currentPage.news === totalPages.news ? "opacity-50 cursor-not-allowed" : ""
                            }`}
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
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="hidden w-[100px] sm:table-cell">Thumbnail</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Status</TableHead>                        
                        <TableHead className="hidden md:table-cell">Published At</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                     {currentItems.images.map((image) => (
                      <TableRow key={image.id}>
                          <TableCell className="hidden sm:table-cell">
                            <img
                              alt={image.image}
                              className="aspect-square rounded-md object-cover"
                              height="64"
                              src={image.url || "https://via.placeholder.com/150"}
                              width="64"
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            <Link to="/images" className="hover:underline">{image.image}</Link>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={`${image.status === "published"  ? "bg-green-500 text-green-50"  : image.status === "pending"  ? "bg-yellow-500 text-yellow-50" : "bg-gray-500 text-gray-50"} capitalize`}>
                              {image.status}
                            </Badge>
                          </TableCell>
                         
                          <TableCell className="hidden md:table-cell">{new Date(image.registered_at).toLocaleString()}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                  <MoveHorizontalIcon className="h-4 w-4" />
                                  <span className="sr-only">Toggle menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel><Link to="/images" className="hover:underline">Actions</Link></DropdownMenuLabel>
                                <DropdownMenuItem><Link to="/images" className="hover:underline">View</Link></DropdownMenuItem>
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
                          onClick={() => handlePageChange("images", Math.max(currentPage.images - 1, 1))}
                          disabled={currentPage.images === 1}
                          className={`flex items-center px-3 py-1 text-sm bg-transparent text-black rounded hover:bg-transparent transition-colors duration-200 ${
                            currentPage.images === 1 ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        />
                    
                    </PaginationItem>
                    {[...Array(totalPages.images).keys()].map((number) => (
                      <PaginationItem key={number + 1}>
                        <PaginationLink
                          href="#"
                          onClick={() => handlePageChange("images", number + 1)}
                          className={`flex items-center px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 ${
                            currentPage.images === number + 1 ? "bg-black text-white border-black" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                          }`}
                        >
                          {number + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={() => handlePageChange("images", Math.min(currentPage.images + 1, totalPages.images))}
                      disabled={currentPage.images === totalPages.images}
                      className={`flex items-center px-3 py-1 text-sm bg-transparent text-black rounded hover:bg-transparent transition-colors duration-200 ${
                        currentPage.images === totalPages.images ? "opacity-50 cursor-not-allowed" : ""
                      }`}
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
                      {currentItems.programs.map((program) => (
                         <TableRow key={program.id}>
                          <TableCell className="hidden sm:table-cell">
                            <img
                              alt={program.title}
                              className="aspect-square rounded-md object-cover"
                              height="64"
                              src={program.imageUrl || "https://via.placeholder.com/150"}
                              width="64"
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            <Link to={`/programs/edit program/${program.id}`} className="hover:underline">{program.title}</Link>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={`${program.status === "published"  ? "bg-green-500 text-green-50"  : program.status === "pending"  ? "bg-yellow-500 text-yellow-50" : "bg-gray-500 text-gray-50"} capitalize`}>
                              {program.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{program.author}</TableCell>
                          <TableCell className="hidden md:table-cell">{new Date(program.published_date).toLocaleString()}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                  <MoveHorizontalIcon className="h-4 w-4" />
                                  <span className="sr-only">Toggle menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel><Link to="/programs" className="hover:underline">Actions</Link></DropdownMenuLabel>
                                <DropdownMenuItem><Link to={`/programs/edit program/${program.id}`} className="hover:underline">View</Link></DropdownMenuItem>
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
                            onClick={() => handlePageChange("programs", Math.max(currentPage.programs - 1, 1))}
                            disabled={currentPage.programs === 1}
                            className={`flex items-center px-3 py-1 text-sm bg-transparent text-black rounded hover:bg-transparent transition-colors duration-200 ${
                              currentPage.programs === 1 ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                          />
                           
                          </PaginationItem>
                          {[...Array(totalPages.programs).keys()].map((number) => (
                            <PaginationItem key={number + 1}>
                              <PaginationLink
                                href="#"
                                onClick={() => handlePageChange("programs", number + 1)}
                                className={`flex items-center px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 ${
                                  currentPage.programs === number + 1 ? "bg-black text-white border-black" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                                }`}
                              >
                                {number + 1}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={() => handlePageChange("programs", Math.min(currentPage.programs + 1, totalPages.programs))}
                            disabled={currentPage.programs === totalPages.programs}
                            className={`flex items-center px-3 py-1 text-sm bg-transparent text-black rounded hover:bg-transparent transition-colors duration-200 ${
                              currentPage.programs === totalPages.programs ? "opacity-50 cursor-not-allowed" : ""
                            }`}
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
                      {currentItems.users.map((user) => (
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
                                  <MoveHorizontalIcon className="h-4 w-4" />
                                  <span className="sr-only">Toggle menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel><Link to="/users" className="hover:underline">Actions</Link></DropdownMenuLabel>
                                <DropdownMenuItem><Link to={`/users/edit user/${user.id}`} className="hover:underline">View</Link></DropdownMenuItem>
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
                            onClick={() => handlePageChange("users", Math.max(currentPage.users - 1, 1))}
                            disabled={currentPage.users === 1}
                            className={`flex items-center px-3 py-1 text-sm bg-transparent text-black rounded hover:bg-transparent transition-colors duration-200 ${
                              currentPage.users === 1 ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                          />

                          </PaginationItem>
                          {[...Array(totalPages.users).keys()].map((number) => (
                            <PaginationItem key={number + 1}>
                              <PaginationLink
                                href="#"
                                onClick={() => handlePageChange("users", number + 1)}
                                className={`flex items-center px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 ${
                                  currentPage.users === number + 1 ? "bg-black text-white border-black" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                                }`}
                              >
                                {number + 1}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={() => handlePageChange("users", Math.min(currentPage.users + 1, totalPages.users))}
                            disabled={currentPage.users === totalPages.users}
                           
                            className={`flex items-center px-3 py-1 text-sm bg-transparent text-black rounded hover:bg-transparent transition-colors duration-200 ${
                              currentPage.users === totalPages.users ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                          />
                           
                        </PaginationItem>
                        </PaginationContent>
                    </Pagination>
      </CardContent>
    </Card>
  )}
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
