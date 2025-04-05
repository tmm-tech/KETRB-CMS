"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import SideNav from "../Component/SideNav"
import HeaderNav from "../Component/HeaderNav"
import bgImage from "../Asset/bg.png"
import { Button } from "../Component/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "../Component/dropdown-menu"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../Component/tabs"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../Component/card"
import { Badge } from "../Component/badge"
import { Alert, AlertDescription, AlertTitle } from "../Component/alert"
import { useNavigate } from "react-router-dom"
import LoadingPage from "../Page/LoadingPage"

const CareersPage = () => {
  const [careers, setCareers] = useState([])
  const [loading, setLoading] = useState(true)
  const [alertMessage, setAlertMessage] = useState("")
  const [sortOption, setSortOption] = useState("date") // default sorting by date
  const [statusFilter, setStatusFilter] = useState([]) // filter by status
  const [departmentFilter, setDepartmentFilter] = useState([]) // filter by department
  const storedUser = localStorage.getItem("user")
  const user = JSON.parse(storedUser)
  const user_id = user.id
  const navigate = useNavigate()

  // Add the applications state and fetch function
  // Add after the careers state declaration (around line 22)
  const [applications, setApplications] = useState([])

  const fetchCareers = async () => {
    try {
      const response = await fetch("https://ketrb-backend.onrender.com/careers/") // Update with your API endpoint
      const data = await response.json()
      setCareers(data) // Adjust according to your data structure
    } catch (error) {
      console.error("Error fetching careers:", error)
    }
  }

  // Add this inside the useEffect after fetchCareers
  const fetchApplications = async () => {
    try {
      const response = await fetch("https://ketrb-backend.onrender.com/applications/")
      const data = await response.json()
      setApplications(data)
    } catch (error) {
      console.error("Error fetching applications:", error)
    }
  }

  // Modify the useEffect to fetch both careers and applications
  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([fetchCareers(), fetchApplications()])
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <LoadingPage />
  }

  const handleEdit = (id) => {
    navigate(`/careers/edit/${id}`) // Redirect to the edit page
  }

  const filteredCareers = careers
    .filter((career) => (statusFilter.length === 0 ? true : statusFilter.includes(career.status)))
    .filter((career) => (departmentFilter.length === 0 ? true : departmentFilter.includes(career.department)))
    .sort((a, b) => {
      if (sortOption === "asc") {
        return a.title.localeCompare(b.title)
      } else if (sortOption === "desc") {
        return b.title.localeCompare(a.title)
      } else if (sortOption === "date") {
        return new Date(b.posted_at) - new Date(a.posted_at)
      }
      return 0
    })

  // Handle status filter change
  const handleStatusFilterChange = (status) => {
    if (statusFilter.includes(status)) {
      setStatusFilter(statusFilter.filter((item) => item !== status))
    } else {
      setStatusFilter([...statusFilter, status])
    }
  }

  // Handle department filter change
  const handleDepartmentFilterChange = (department) => {
    if (departmentFilter.includes(department)) {
      setDepartmentFilter(departmentFilter.filter((item) => item !== department))
    } else {
      setDepartmentFilter([...departmentFilter, department])
    }
  }

  // Handle sorting option change
  const handleSortChange = (sortOption) => {
    setSortOption(sortOption)
  }

  // Cancel delete function
  const handleCancel = async (id) => {
    try {
      const response = await fetch(`https://ketrb-backend.onrender.com/careers/canceldelete/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isdeleted: false }),
      })

      if (response.ok) {
        setAlertMessage("Career posting delete canceled successfully")
        window.location.href = "/careers"
      } else {
        setAlertMessage("Failed to cancel career posting delete")
      }
    } catch (error) {
      console.error("Error canceling career posting delete:", error)
      setAlertMessage("An error occurred while canceling the career posting delete.")
    }
  }

  const handlePublish = async (id) => {
    try {
      const response = await fetch(`https://ketrb-backend.onrender.com/careers/approve/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      })
      if (response.ok) {
        const updatedCareer = await response.json()
        setCareers((prevCareers) => prevCareers.map((career) => (career.id === id ? updatedCareer : career)))
        setAlertMessage("Career posting published successfully")
        window.location.href = "/careers"
      } else {
        setAlertMessage("Failed to publish career posting")
      }
    } catch (error) {
      console.error("Error publishing career posting:", error)
      setAlertMessage("An error occurred while publishing the career posting.")
    }
  }

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this career posting?")
    if (confirmDelete) {
      try {
        const response = await fetch(`https://ketrb-backend.onrender.com/careers/delete/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role: user.roles, user_id }),
        })

        if (response.ok) {
          if (user.roles === "editor") {
            setAlertMessage("Career posting marked for deletion. Admin approval required.")
            window.location.reload()
          } else {
            setAlertMessage("Career posting deleted successfully")
            window.location.reload()
          }
        } else {
          setAlertMessage("Failed to delete career posting")
        }
      } catch (error) {
        console.error("Error deleting career posting:", error)
        setAlertMessage("An error occurred while deleting the career posting.")
      }
    }
  }

  // Add these handler functions before the return statement
  const handleViewApplication = (id) => {
    navigate(`/applications/${id}`)
  }

  const handleApplicationStatus = async (id, status) => {
    try {
      const response = await fetch(`https://ketrb-backend.onrender.com/applications/status/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        setApplications(applications.map((app) => (app.id === id ? { ...app, status } : app)))
        setAlertMessage(`Application ${status === "accepted" ? "accepted" : "rejected"} successfully`)
      } else {
        setAlertMessage("Failed to update application status")
      }
    } catch (error) {
      console.error("Error updating application status:", error)
      setAlertMessage("An error occurred while updating the application status.")
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <SideNav />
      <div
        className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14"
        style={{ backgroundImage: `url(${bgImage})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
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
                <CardTitle>Career Opportunities</CardTitle>
                <CardDescription>Manage your job postings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-4xl font-bold">{careers.length}</div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-green-500 text-green-50">
                      Active
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
            <Card>
              <CardHeader>
                <CardTitle>Job Applications</CardTitle>
                <CardDescription>Manage job applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-4xl font-bold">{applications.length}</div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-green-500 text-green-50">
                      Completed
                    </Badge>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
          <Tabs defaultValue="careers">
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="careers">Career Opportunities</TabsTrigger>
                <TabsTrigger value="applications">Career Applications</TabsTrigger>
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
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M12 19V5M5 12l7-7 7 7" />
                          </svg>
                        </span>
                      </DropdownMenuRadioItem>

                      <DropdownMenuRadioItem value="desc">
                        <span className="flex items-center gap-2">
                          Z-A (Descending)
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M12 5v14M5 12l7 7 7-7" />
                          </svg>
                        </span>
                      </DropdownMenuRadioItem>

                      <DropdownMenuRadioItem value="date">
                        <span className="flex items-center gap-2">
                          Date
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
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
                      checked={statusFilter.includes("active")}
                      onCheckedChange={() => handleStatusFilterChange("active")}
                    >
                      Active
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={statusFilter.includes("pending")}
                      onCheckedChange={() => handleStatusFilterChange("pending")}
                    >
                      Pending
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={statusFilter.includes("draft")}
                      onCheckedChange={() => handleStatusFilterChange("draft")}
                    >
                      Draft
                    </DropdownMenuCheckboxItem>

                    <DropdownMenuSeparator />

                    {/* Filter by Department */}
                    <DropdownMenuLabel>Filter by Department</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={departmentFilter.includes("engineering")}
                      onCheckedChange={() => handleDepartmentFilterChange("engineering")}
                    >
                      Engineering
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={departmentFilter.includes("marketing")}
                      onCheckedChange={() => handleDepartmentFilterChange("marketing")}
                    >
                      Marketing
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={departmentFilter.includes("sales")}
                      onCheckedChange={() => handleDepartmentFilterChange("sales")}
                    >
                      Sales
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={departmentFilter.includes("hr")}
                      onCheckedChange={() => handleDepartmentFilterChange("hr")}
                    >
                      Human Resources
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={departmentFilter.includes("finance")}
                      onCheckedChange={() => handleDepartmentFilterChange("finance")}
                    >
                      Finance
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Link to="/careers/add career">
                  <Button variant="outline" size="sm" className="h-8 gap-1 bg-black text-white">
                    <PlusIcon className="h-3.5 w-3.5" />
                    <span>Add Career Posting</span>
                  </Button>
                </Link>
              </div>
            </div>
            <TabsContent value="careers">
              <div className="grid gap-4">
                {filteredCareers.length === 0 ? (
                  <div className="col-span-full flex items-center justify-center">
                    <p className="text-center text-gray-500">No career opportunities available.</p>
                  </div>
                ) : (
                  filteredCareers.map((career) => (
                    <Card
                      key={career.id}
                      className={
                        career.isdeleted === true && user.roles === "editor" ? "opacity-50 pointer-events-none" : ""
                      }
                    >
                      <CardHeader>
                        <CardTitle>{career.title}</CardTitle>
                        <CardDescription>
                          {career.status === "active"
                            ? `Posted on ${new Date(career.posted_at).toLocaleDateString()}`
                            : career.status === "pending"
                              ? "Pending Approval"
                              : "Draft"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Department</h3>
                            <p className="mt-1">{career.department}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Location</h3>
                            <p className="mt-1">{career.location}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Employment Type</h3>
                            <p className="mt-1">{career.employment_type}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Salary Range</h3>
                            <p className="mt-1">{career.salary_range || "Not specified"}</p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <h3 className="text-sm font-medium text-gray-500">Description</h3>
                          <p className="mt-1 line-clamp-3">{career.description}</p>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <div className="flex items-center justify-between gap-2 w-full">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className={`capitalize ${
                                career.status === "active"
                                  ? "bg-green-500 text-green-50"
                                  : career.status === "pending"
                                    ? "bg-yellow-500 text-yellow-50"
                                    : "bg-gray-500 text-gray-50"
                              }`}
                            >
                              {career.status}
                            </Badge>
                            <Badge variant="outline" className="bg-blue-500 text-blue-50">
                              {career.department}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            {/* Conditionally display buttons */}
                            {user.roles === "administrator" && career.isdeleted === true ? (
                              // Show Approve Delete button if the career is pending delete and user is an admin
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 gap-1"
                                  onClick={() => handleEdit(career.id)}
                                >
                                  <FilePenIcon className="h-3.5 w-3.5" />
                                  <span>View</span>
                                </Button>
                                <Button
                                  variant="black"
                                  size="sm"
                                  className="h-8 gap-1"
                                  onClick={() => handleDelete(career.id)}
                                >
                                  <CheckIcon className="h-3.5 w-3.5" />
                                  <span>Approve Delete</span>
                                </Button>
                                <Button
                                  variant="black"
                                  size="sm"
                                  className="h-8 gap-1"
                                  onClick={() => handleCancel(career.id)}
                                >
                                  <CheckIcon className="h-3.5 w-3.5" />
                                  <span>Cancel Delete</span>
                                </Button>
                              </>
                            ) : (
                              // Otherwise, show Edit and Delete buttons
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 gap-1"
                                  onClick={() => handleEdit(career.id)}
                                >
                                  <FilePenIcon className="h-3.5 w-3.5" />
                                  <span>View</span>
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 gap-1"
                                  onClick={() => handleDelete(career.id)}
                                >
                                  <TrashIcon className="h-3.5 w-3.5" />
                                  <span>Delete</span>
                                </Button>
                              </>
                            )}

                            {/* Show Approve Publish button only for pending careers if user is admin */}
                            {user.roles === "administrator" && career.status === "pending" && (
                              <Button size="sm" variant="black" onClick={() => handlePublish(career.id)}>
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
            {/* Add the Applications TabsContent after the careers TabsContent (around line 380) */}
            {/* Replace the existing TabsContent for applications or add if it doesn't exist */}
            <TabsContent value="applications">
              <div className="grid gap-4">
                {applications.length === 0 ? (
                  <div className="col-span-full flex items-center justify-center">
                    <p className="text-center text-gray-500">No job applications available.</p>
                  </div>
                ) : (
                  applications.map((application) => (
                    <Card key={application.id}>
                      <CardHeader>
                        <CardTitle>{application.job_title || "Job Application"}</CardTitle>
                        <CardDescription>
                          Applied on {new Date(application.applied_at).toLocaleDateString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Applicant Name</h3>
                            <p className="mt-1">{application.applicant_name}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Email</h3>
                            <p className="mt-1">{application.email}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                            <p className="mt-1">{application.phone || "Not provided"}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Status</h3>
                            <p className="mt-1">{application.status || "Pending"}</p>
                          </div>
                        </div>
                        {application.cover_letter && (
                          <div className="mt-4">
                            <h3 className="text-sm font-medium text-gray-500">Cover Letter</h3>
                            <p className="mt-1 line-clamp-3">{application.cover_letter}</p>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter>
                        <div className="flex items-center justify-between gap-2 w-full">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className={`capitalize ${
                                application.status === "accepted"
                                  ? "bg-green-500 text-green-50"
                                  : application.status === "rejected"
                                    ? "bg-red-500 text-red-50"
                                    : "bg-yellow-500 text-yellow-50"
                              }`}
                            >
                              {application.status || "Pending"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 gap-1"
                              onClick={() => window.open(application.resume_url, "_blank")}
                            >
                              <DownloadIcon className="h-3.5 w-3.5" />
                              <span>Resume</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 gap-1"
                              onClick={() => handleViewApplication(application.id)}
                            >
                              <FilePenIcon className="h-3.5 w-3.5" />
                              <span>View</span>
                            </Button>
                            {user.roles === "administrator" && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 gap-1 bg-green-500 text-white hover:bg-green-600"
                                  onClick={() => handleApplicationStatus(application.id, "accepted")}
                                >
                                  <CheckIcon className="h-3.5 w-3.5" />
                                  <span>Accept</span>
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 gap-1 bg-red-500 text-white hover:bg-red-600"
                                  onClick={() => handleApplicationStatus(application.id, "rejected")}
                                >
                                  <XIcon className="h-3.5 w-3.5" />
                                  <span>Reject</span>
                                </Button>
                              </>
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
  )
}

export default CareersPage

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

// Add the XIcon at the end of the file with the other icon components
function XIcon(props) {
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}