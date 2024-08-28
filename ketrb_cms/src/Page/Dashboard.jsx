import React from "react";
import SideNav from "../Component/SideNav";
import HeaderNav from "../Component/HeaderNav";
import { Button } from '../Component/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuCheckboxItem } from '../Component/dropdown-menu';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../Component/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../Component/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../Component/table';
import { Badge } from '../Component/badge';
import "./dashboard.css";
const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <SideNav />
      <div className="main-content">
        <HeaderNav />
        <main className="main-content-body">
          <Tabs defaultValue="news" className="tabs-container">
            <div className="tabs-header">
              <TabsList className="tabs-list">
                <TabsTrigger value="news" className="tab-trigger">News</TabsTrigger>
                <TabsTrigger value="images" className="tab-trigger">Images</TabsTrigger>
                <TabsTrigger value="programs" className="tab-trigger">Programs</TabsTrigger>
                <TabsTrigger value="users" className="tab-trigger hidden sm:flex">Users</TabsTrigger>
              </TabsList>
              <div className="actions-container">
                <Button size="sm" variant="outline" className="add-button">
                  <PlusIcon className="icon-small" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add</span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="filter-button">
                      <FilterIcon className="icon-small" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Filter</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                    <DropdownMenuCheckboxItem checked>Published</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>Pending Approval</DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <TabsContent value="news">
              <Card className="news-card">
                <CardHeader>
                  <CardTitle className="card-title">News Articles</CardTitle>
                  <CardDescription className="card-description">Manage your news articles and approve them for publishing.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table className="news-table">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Published At</TableHead>
                        <TableHead><span className="sr-only">Actions</span></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">New Product Launch</TableCell>
                        <TableCell>John Doe</TableCell>
                        <TableCell><Badge variant="outline">Pending Approval</Badge></TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoveHorizontalIcon className="icon-medium" />
                                <span className="sr-only">Toggle menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>Approve</DropdownMenuItem>
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Company Expansion Announcement</TableCell>
                        <TableCell>Jane Smith</TableCell>
                        <TableCell><Badge variant="outline">Published</Badge></TableCell>
                        <TableCell>2023-04-15</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoveHorizontalIcon className="icon-medium" />
                                <span className="sr-only">Toggle menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">New Sustainability Initiative</TableCell>
                        <TableCell>Michael Johnson</TableCell>
                        <TableCell><Badge variant="secondary">Draft</Badge></TableCell>
                        <TableCell>-</TableCell>
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
