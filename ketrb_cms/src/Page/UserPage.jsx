import React, { useState, useEffect } from "react";
import SideNav from "../Component/SideNav";
import { Link } from "react-router-dom";
import HeaderNav from "../Component/HeaderNav";
import bgImage from "../Asset/bg.png";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../Component/table';
import { Button } from '../Component/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem, DropdownMenuRadioGroup, DropdownMenuRadioItem } from '../Component/dropdown-menu';
import { Tabs, TabsList, TabsTrigger } from '../Component/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../Component/card';
import { Badge } from '../Component/badge';
import { Alert, AlertDescription, AlertTitle } from "../Component/alert";
import { useNavigate } from "react-router-dom";
import LoadingPage from '../Page/LoadingPage';

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [alertMessage, setAlertMessage] = useState("");
  const [loading, setLoading] = useState(true);
   const [sortOption, setSortOption] = useState("date"); // default sorting by date
  const [statusFilter, setStatusFilter] = useState([]); // filter by status
  const [roleFilter, setRoleFilter] = useState([]); // filter by role
	
  const navigate = useNavigate();
  useEffect(() => {
    // Fetch users from backend
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://ketrb-backend.onrender.com/users/allusers");

        // Check if the response is OK (status code 200–299)
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Assuming the users' data is inside `data.data`
        if (data.success) {
          setUsers(data.data);
        } else {
          console.error('Error fetching users:', data.message);
        }

      } catch (error) {
        console.error('Error fetching users:', error);
      }
	     finally {
                setLoading(false);
            }
    };

    fetchUsers();  // Call the async function
  }, []);
 if (loading) {
    return <LoadingPage />;
  }
  const handleEdit = (userId) => {
    navigate(`/users/edit user/${userId}`); // Redirect to the edit page
  }
  const handleRefresh = async (userId) => {
    try {
      const response = await fetch(`https://ketrb-backend.onrender.com/users/activate/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        setAlertMessage('Failed to activate user');
      }

      const data = await response.json();
      if (data.success) {
        setAlertMessage('User account activated successfully');
        // Optionally, update the users list in the frontend to reflect the changes
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, status: 'active', isDeleted: false } : user
          )
        );
      } else {
        setAlertMessage('Error activating user');
      }
    } catch (error) {
      console.error('Error activating user:', error);
      setAlertMessage('An error occurred while activating the user.');
    }
  };


  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");

    if (confirmDelete) {
      try {
        // Call backend API to soft delete the user
        const response = await fetch(`https://ketrb-backend.onrender.com/users/delete/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          // Remove the user from the users state after successful deletion
          setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
          setAlertMessage('User deleted successfully');
        } else {
          setAlertMessage('Failed to delete user');
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        setAlertMessage('An error occurred while deleting the user.');
      }
    }
  };
 const filteredUsers = users
    .filter(user => 
      (statusFilter.length === 0 || statusFilter.includes(user.status)) &&
      (roleFilter.length === 0 || roleFilter.includes(user.roles))
    )
    .sort((a, b) => {
      if (sortOption === "asc") {
        return a.fullname.localeCompare(b.fullname);
      } else if (sortOption === "desc") {
        return b.fullname.localeCompare(a.fullname);
      } else if (sortOption === "date") {
        return new Date(b.registered_at) - new Date(a.registered_at);
      }
      return 0;
    });

  const handleStatusFilterChange = (status) => {
    setStatusFilter(prevFilter =>
      prevFilter.includes(status) ? prevFilter.filter(item => item !== status) : [...prevFilter, status]
    );
  };

  const handleRoleFilterChange = (role) => {
    setRoleFilter(prevFilter =>
      prevFilter.includes(role) ? prevFilter.filter(item => item !== role) : [...prevFilter, role]
    );
  };

  const handleSortChange = (sortOption) => {
    setSortOption(sortOption);
  };


  return (
    <div className="flex min-h-screen w-full flex-col">
      <SideNav />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14" style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: "center" }}>
        <HeaderNav />
		{alertMessage && (
		  <div className="fixed top-0 left-0 w-full z-50">
			<Alert className="max-w-md mx-auto mt-4">
			  <AlertTitle>Notification</AlertTitle>
			  <AlertDescription>{alertMessage}</AlertDescription>
			</Alert>
		  </div>
		)}
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Users</CardTitle>
                <CardDescription>Manage your users details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-4xl font-bold">{users.length}</div>

                </div>
              </CardContent>
              <CardFooter>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-green-500 text-green-50">
                      Published
                    </Badge>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
          <Tabs defaultValue="users">
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="users">User</TabsTrigger>
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
			      checked={statusFilter.includes('active')}
			      onCheckedChange={() => handleStatusFilterChange('active')}
			    >
			      Active
			    </DropdownMenuCheckboxItem>
			    <DropdownMenuCheckboxItem
			      checked={statusFilter.includes('inactive')}
			      onCheckedChange={() => handleStatusFilterChange('inactive')}
			    >
			      Inactive
			    </DropdownMenuCheckboxItem>
				  <DropdownMenuSeparator />
			    
			    {/* Filter by Role */}
			    <DropdownMenuLabel>Filter by Role</DropdownMenuLabel>
			    <DropdownMenuSeparator />
			    <DropdownMenuCheckboxItem
			      checked={roleFilter.includes('administrator')}
			      onCheckedChange={() => handleRoleFilterChange('administrator')}
			    >
			      Administrator
			    </DropdownMenuCheckboxItem>
			    <DropdownMenuCheckboxItem
			      checked={roleFilter.includes('editor')}
			      onCheckedChange={() => handleRoleFilterChange('editor')}
			    >
			      Editor
			    </DropdownMenuCheckboxItem>
			  </DropdownMenuContent>
		</DropdownMenu>
                <Link to="/users/add users">
                  <Button variant="outline" size="sm" className="h-8 gap-1 bg-black text-white">
                    <PlusIcon className="h-3.5 w-3.5" />
                    <span>Add User</span>
                  </Button>
                </Link>
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
	  {filteredUsers.length === 0 ? (
		    <TableRow>
		        <TableCell colSpan={5} className="text-center text-gray-500">
		          <p className="text-center text-gray-500">No Users available.</p>
		        </TableCell>
     	 	   </TableRow>
		) : (
                  filteredUsers.map(user => (
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
                        <div className="flex items-center gap-2">
                          {user.status === "inactive" ? (
                            <Button variant="outline" size="icon" onClick={() => handleRefresh(user.id)}>
                              <RefreshCwIcon className="h-4 w-4" />
                              <span className="sr-only">Refresh</span>
                            </Button>
                          ) : (
                            <>
                              <Button variant="outline" size="icon" onClick={() => handleEdit(user.id)}>
                                <FilePenIcon className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button variant="outline" size="icon" onClick={() => handleDelete(user.id)}>
                                <TrashIcon className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
    )}
                </TableBody>
              </Table>
            </div>
          </Tabs>
        </main>
      </div>
      

    </div>
  );
};

export default UserPage;



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

function RefreshCwIcon(props) {
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
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </svg>
  )
}
