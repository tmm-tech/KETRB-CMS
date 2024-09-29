import React, { useEffect, useState } from "react";     
import { Link } from "react-router-dom";
import SideNav from "../Component/SideNav";
import HeaderNav from "../Component/HeaderNav";
import bgImage from "../Asset/bg.png";
import { Button } from '../Component/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem, DropdownMenuRadioGroup, DropdownMenuRadioItem } from '../Component/dropdown-menu';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../Component/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter} from '../Component/card';
import { Badge } from '../Component/badge';
import { Alert, AlertDescription, AlertTitle } from "../Component/alert";
import { useNavigate } from "react-router-dom";
import LoadingPage from '../Page/LoadingPage';
const ProgramsPage = () => {
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alertMessage, setAlertMessage] = useState("");
    const [sortOption, setSortOption] = useState("date"); // default sorting by date
    const [statusFilter, setStatusFilter] = useState([]); // filter by status

const storedUser = localStorage.getItem('user');
  const user = JSON.parse(storedUser);
      const navigate = useNavigate();
    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const response = await fetch('https://ketrb-backend.onrender.com/programs/'); // Update with your API endpoint
                const data = await response.json();
                setPrograms(data); // Adjust according to your data structure
            } catch (error) {
                console.error("Error fetching programs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPrograms();
    }, []);
     if (loading) {
    return <LoadingPage />;
  }
 const handleEdit = (id) => {
    navigate(`/programs/edit program/${id}`); // Redirect to the edit page
  };
const filteredPrograms = programs
    .filter((program) =>
      statusFilter.length === 0 ? true : statusFilter.includes(program.status)
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
	// New handleCancel function
    const handleCancel = async (id) => {
        try {
            const response = await fetch(`https://ketrb-backend.onrender.com/programs/cancledelete/${id}`, {
                method: 'PUT', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isdeleted: false }), // Set isDeleted to true
            });

            if (response.ok) {
                const updatedProgram = await response.json();
              
                setAlertMessage('Program Delete Canceled successfully');
		window.location.href = '/programs';
            } else {
                setAlertMessage('Failed to Cancel Program Delete');
            }
        } catch (error) {
            console.error("Error canceling program delete:", error);
            setAlertMessage('An error occurred while canceling the program delete.');
        }
    };

const handleApprove = async (id) => {
    try {
        const response = await fetch(`https://ketrb-backend.onrender.com/programs/delete/${id}`, {
            method: 'DELETE', 
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            const updatedProgram = await response.json();
            // Update state to reflect the approved program
            setPrograms((prevPrograms) => 
                prevPrograms.map((program) => (program.id === id ? updatedProgram : program))
            );
            setAlertMessage('Program delete approved');
	 window.location.href = '/programs';
        } else {
            setAlertMessage('Failed to approve delete');
        }
    } catch (error) {
        console.error("Error approving delete:", error);
        setAlertMessage('An error occurred while approving delete.');
    }
};
const handlePublish = async (id) => {
    try {
        const response = await fetch(`https://ketrb-backend.onrender.com/programs/approve/${id}`, {
            method: 'PUT', 
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            const updatedProgram = await response.json();
            // Update state to reflect the published program
            setPrograms((prevPrograms) => 
                prevPrograms.map((program) => (program.id === id ? updatedProgram : program))
            );
            setAlertMessage('Program published successfully');
		window.location.href = '/programs';
        } else {
            setAlertMessage('Failed to publish program');
        }
    } catch (error) {
        console.error("Error publishing program:", error);
        setAlertMessage('An error occurred while publishing the program.');
    }
};


  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this program?");


  if (confirmDelete) {
    try {
      // Call backend API to delete or soft-delete the program
      const response = await fetch(`https://ketrb-backend.onrender.com/programs/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: user.roles }) // Pass user role to the backend
      });

      if (response.ok) {
        const data = await response.json();
        if (user.roles === 'editor') {
		
          setAlertMessage('Program marked for deletion. Admin approval required.');
	 
        } else {
          setPrograms((prevPrograms) => prevPrograms.filter((program) => program.id !== id));
          setAlertMessage('Program deleted successfully');
	window.location.href = '/programs';
        }
      } else {
        setAlertMessage('Failed to delete program');
      }
    } catch (error) {
      console.error("Error deleting program:", error);
      setAlertMessage('An error occurred while deleting the program.');
    }
  }
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Programs</CardTitle>
                                <CardDescription>Manage your programs</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="text-4xl font-bold">{programs.length}</div>
                                    
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
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                    <Tabs defaultValue="program">
                        <div className="flex items-center">
                            <TabsList>
                                <TabsTrigger value="program">Programs</TabsTrigger>
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
                                <Link to="/programs/add program">
                                    <Button variant="outline" size="sm" className="h-8 gap-1 bg-black text-white">
                                            <PlusIcon className="h-3.5 w-3.5" />
                                            <span>Add Programs</span>
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <TabsContent value="program">
                            <div className="grid gap-4">
                                { filteredPrograms.length === 0 ? (
                                    <div className="col-span-full flex items-center justify-center"> <p className="text-center text-gray-500">No programs available.</p></div>
                                ) : (
                                    filteredPrograms.map((program) => (
                                        <Card key={program.id} className={(program.isdeleted === true && user.roles === "editor") ? "opacity-50 pointer-events-none" : ""}>
                                            <CardHeader>
                                                <CardTitle>{program.title}</CardTitle>
                                                <CardDescription>
                                                    {program.status === "published"
                                                        ? `Published on ${new Date(program.published_date).toLocaleDateString()}`
                                                        : program.status === "pending" 
							? "Pending Approval"
							: "Draft"}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <p>{program.content}</p>
                                            </CardContent>     
                                            <CardFooter>
                                                <div className="flex items-center justify-between gap-2">
                                                   <Badge
						    variant="outline"
						    className={`capitalize ${
							program.status === "published"
							    ? "bg-green-500 text-green-50"
							    : program.status === "pending"
							    ? "bg-yellow-500 text-yellow-50"
							    : "bg-gray-500 text-gray-50"
						    }`}
						>
						    {program.status}
						</Badge>
						<div className="flex items-center gap-2">
							{/* Conditionally display buttons */}
							{user.roles === 'administrator' && program.isdeleted === true ? (
							// Show Approve Delete button if the program is pending delete and user is an admin
							<>
								<Button variant="outline" size="sm" className="h-8 gap-1" onClick={() => handleEdit(program.id)} >
									<FilePenIcon className="h-3.5 w-3.5" />
									<span>View</span>
								</Button>
								<Button variant="black" size="sm" className="h-8 gap-1" onClick={() => handleApprove(program.id)}>
									<CheckIcon className="h-3.5 w-3.5" />
									<span>Approve Delete</span>
								</Button>
								<Button variant="black" size="sm" className="h-8 gap-1" onClick={() => handleCancel(program.id)}>
									<CheckIcon className="h-3.5 w-3.5" />
									<span>Cancle Delete</span>
								</Button>
							</>
							) : (
							// Otherwise, show Edit and Delete buttons
							<>
								<Button variant="outline" size="sm" className="h-8 gap-1" onClick={() => handleEdit(program.id)}>
									<FilePenIcon className="h-3.5 w-3.5" />
									<span>View</span>
								</Button>
								<Button variant="outline" size="sm" className="h-8 gap-1" onClick={() => handleDelete(program.id)}>
									<TrashIcon className="h-3.5 w-3.5" />
									<span>Delete</span>
								</Button>
							</>
						)}
						
						{/* Show Approve Publish button only for pending programs if user is admin */}
						{user.roles === "administrator" && program.status === "pending" && (
						<Button size="sm" variant="black" onClick={() => handlePublish(program.id)}>
						Approve Publish
						</Button>
						)}
					</div>
									
                                                </div>
                                            </CardFooter>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </TabsContent>

                    </Tabs>
                </main>
            </div>
        </div>
    );
};

export default ProgramsPage;

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
