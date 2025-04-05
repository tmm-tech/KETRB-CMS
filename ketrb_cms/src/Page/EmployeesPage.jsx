import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SideNav from "../Component/SideNav";
import HeaderNav from "../Component/HeaderNav";
import bgImage from "../Asset/bg.png";
import { Button } from "../Component/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "../Component/dropdown-menu";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../Component/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../Component/card";
import { Badge } from "../Component/badge";
import { Alert, AlertDescription, AlertTitle } from "../Component/alert";
import { useNavigate } from "react-router-dom";
import LoadingPage from "../Page/LoadingPage";

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [alertMessage, setAlertMessage] = useState("")
  const [sortOption, setSortOption] = useState("name") // default sorting by name
  const [departmentFilter, setDepartmentFilter] = useState([]) // filter by department
  const [roleFilter, setRoleFilter] = useState([]) // filter by role (Leadership, Management, Other)
  const storedUser = localStorage.getItem("user")
  const user = JSON.parse(storedUser)
  const user_id = user.id
  const navigate = useNavigate()

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("https://ketrb-backend.onrender.com/employees/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json()
        setEmployees(data) // Adjust according to your data structure
      } catch (error) {
        console.error("Error fetching employees:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEmployees()
  }, [])

  if (loading) {
    return <LoadingPage />
  }

  const handleEdit = (id) => {
    navigate(`/employees/edit employees/${id}`) // Redirect to the edit page
  }

  const filteredEmployees = employees
    .filter((employee) => (departmentFilter.length === 0 ? true : departmentFilter.includes(employee.department)))
    .filter((employee) => (roleFilter.length === 0 ? true : roleFilter.includes(employee.role_type)))
    .sort((a, b) => {
      if (sortOption === "name") {
        return a.last_name.localeCompare(b.last_name)
      } else if (sortOption === "department") {
        return a.department.localeCompare(b.department)
      } else if (sortOption === "role") {
        // Sort by role hierarchy: Leadership > Management > Other
        const roleOrder = { leadership: 1, management: 2, other: 3 }
        return roleOrder[a.role_type] - roleOrder[b.role_type]
      } else if (sortOption === "hire_date") {
        return new Date(b.hire_date) - new Date(a.hire_date)
      }
      return 0
    })

  // Handle department filter change
  const handleDepartmentFilterChange = (department) => {
    if (departmentFilter.includes(department)) {
      setDepartmentFilter(departmentFilter.filter((item) => item !== department))
    } else {
      setDepartmentFilter([...departmentFilter, department])
    }
  }

  // Handle role filter change
  const handleRoleFilterChange = (role) => {
    if (roleFilter.includes(role)) {
      setRoleFilter(roleFilter.filter((item) => item !== role))
    } else {
      setRoleFilter([...roleFilter, role])
    }
  }

  // Handle sorting option change
  const handleSortChange = (sortOption) => {
    setSortOption(sortOption)
  }

  // Cancel delete function
  const handleCancel = async (id) => {
    try {
      const response = await fetch(`https://ketrb-backend.onrender.com/employees/canceldelete/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isdeleted: false }),
      })

      if (response.ok) {
        setAlertMessage("Employee delete canceled successfully")
        window.location.href = "/employees"
      } else {
        setAlertMessage("Failed to cancel employee delete")
      }
    } catch (error) {
      console.error("Error canceling employee delete:", error)
      setAlertMessage("An error occurred while canceling the employee delete.")
    }
  }

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this employee?")
    if (confirmDelete) {
      try {
        const response = await fetch(`https://ketrb-backend.onrender.com/employees/delete/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role: user.roles, user_id }),
        })

        if (response.ok) {
          if (user.roles === "editor") {
            setAlertMessage("Employee marked for deletion. Admin approval required.")
            window.location.reload()
          } else {
            setAlertMessage("Employee deleted successfully")
            window.location.reload()
          }
        } else {
          setAlertMessage("Failed to delete employee")
        }
      } catch (error) {
        console.error("Error deleting employee:", error)
        setAlertMessage("An error occurred while deleting the employee.")
      }
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>All Employees</CardTitle>
                <CardDescription>Total employee count</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{employees.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Leadership</CardTitle>
                <CardDescription>Leadership team members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{employees.filter((e) => e.role_type === "leadership").length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Management</CardTitle>
                <CardDescription>Management team members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{employees.filter((e) => e.role_type === "management").length}</div>
              </CardContent>
            </Card>
          </div>
          <Tabs defaultValue="employees">
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="employees">All Employees</TabsTrigger>
                <TabsTrigger value="leadership">Leadership</TabsTrigger>
                <TabsTrigger value="management">Management</TabsTrigger>
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

                    {/* Sorting Options */}
                    <DropdownMenuRadioGroup value={sortOption} onValueChange={handleSortChange}>
                      <DropdownMenuRadioItem value="name">
                        <span className="flex items-center gap-2">Name</span>
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="department">
                        <span className="flex items-center gap-2">Department</span>
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="role">
                        <span className="flex items-center gap-2">Role Type</span>
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="hire_date">
                        <span className="flex items-center gap-2">Hire Date</span>
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>

                    <DropdownMenuSeparator />

                    {/* Filter by Department */}
                    <DropdownMenuLabel>Filter by Department</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={departmentFilter.includes("executive")}
                      onCheckedChange={() => handleDepartmentFilterChange("executive")}
                    >
                      Executive
                    </DropdownMenuCheckboxItem>
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

                    <DropdownMenuSeparator />

                    {/* Filter by Role Type */}
                    <DropdownMenuLabel>Filter by Role Type</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={roleFilter.includes("leadership")}
                      onCheckedChange={() => handleRoleFilterChange("leadership")}
                    >
                      Leadership
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={roleFilter.includes("management")}
                      onCheckedChange={() => handleRoleFilterChange("management")}
                    >
                      Management
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={roleFilter.includes("other")}
                      onCheckedChange={() => handleRoleFilterChange("other")}
                    >
                      Other Positions
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Link to="/employees/add employees">
                  <Button variant="outline" size="sm" className="h-8 gap-1 bg-black text-white">
                    <PlusIcon className="h-3.5 w-3.5" />
                    <span>Add Employee</span>
                  </Button>
                </Link>
              </div>
            </div>
            <TabsContent value="employees">
              <div className="grid gap-4">
                {filteredEmployees.length === 0 ? (
                  <div className="col-span-full flex items-center justify-center">
                    <p className="text-center text-gray-500">No employees found.</p>
                  </div>
                ) : (
                  filteredEmployees.map((employee) => (
                    <Card
                      key={employee.id}
                      className={
                        employee.isdeleted === true && user.roles === "editor" ? "opacity-50 pointer-events-none" : ""
                      }
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle>
                              {employee.first_name} {employee.last_name}
                            </CardTitle>
                            <CardDescription>{employee.job_title}</CardDescription>
                          </div>
                          {employee.profile_image && (
                            <div className="h-12 w-12 overflow-hidden rounded-full">
                              <img
                                src={employee.profile_image || "/placeholder.svg"}
                                alt={`${employee.first_name} ${employee.last_name}`}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Department</h3>
                            <p className="mt-1">{employee.department}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Email</h3>
                            <p className="mt-1">{employee.email}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                            <p className="mt-1">{employee.phone || "Not provided"}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Hire Date</h3>
                            <p className="mt-1">{new Date(employee.hire_date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        {employee.bio && (
                          <div className="mt-4">
                            <h3 className="text-sm font-medium text-gray-500">Bio</h3>
                            <p className="mt-1 line-clamp-3">{employee.bio}</p>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter>
                        <div className="flex items-center justify-between gap-2 w-full">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className={`capitalize ${
                                employee.role_type === "leadership"
                                  ? "bg-purple-500 text-purple-50"
                                  : employee.role_type === "management"
                                    ? "bg-blue-500 text-blue-50"
                                    : "bg-gray-500 text-gray-50"
                              }`}
                            >
                              {employee.role_type}
                            </Badge>
                            <Badge variant="outline" className="bg-green-500 text-green-50">
                              {employee.department}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            {/* Conditionally display buttons */}
                            {user.roles === "administrator" && employee.isdeleted === true ? (
                              // Show Approve Delete button if the employee is pending delete and user is an admin
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 gap-1"
                                  onClick={() => handleEdit(employee.id)}
                                >
                                  <FilePenIcon className="h-3.5 w-3.5" />
                                  <span>View</span>
                                </Button>
                                <Button
                                  variant="black"
                                  size="sm"
                                  className="h-8 gap-1"
                                  onClick={() => handleDelete(employee.id)}
                                >
                                  <CheckIcon className="h-3.5 w-3.5" />
                                  <span>Approve Delete</span>
                                </Button>
                                <Button
                                  variant="black"
                                  size="sm"
                                  className="h-8 gap-1"
                                  onClick={() => handleCancel(employee.id)}
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
                                  onClick={() => handleEdit(employee.id)}
                                >
                                  <FilePenIcon className="h-3.5 w-3.5" />
                                  <span>View</span>
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 gap-1"
                                  onClick={() => handleDelete(employee.id)}
                                >
                                  <TrashIcon className="h-3.5 w-3.5" />
                                  <span>Delete</span>
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
            <TabsContent value="leadership">
              <div className="grid gap-4">
                {filteredEmployees.filter((e) => e.role_type === "leadership").length === 0 ? (
                  <div className="col-span-full flex items-center justify-center">
                    <p className="text-center text-gray-500">No leadership team members found.</p>
                  </div>
                ) : (
                  filteredEmployees
                    .filter((e) => e.role_type === "leadership")
                    .map((employee) => (
                      <Card
                        key={employee.id}
                        className={
                          employee.isdeleted === true && user.roles === "editor" ? "opacity-50 pointer-events-none" : ""
                        }
                      >
                        {/* Same card content as above */}
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle>
                                {employee.first_name} {employee.last_name}
                              </CardTitle>
                              <CardDescription>{employee.job_title}</CardDescription>
                            </div>
                            {employee.profile_image && (
                              <div className="h-12 w-12 overflow-hidden rounded-full">
                                <img
                                  src={employee.profile_image || "/placeholder.svg"}
                                  alt={`${employee.first_name} ${employee.last_name}`}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h3 className="text-sm font-medium text-gray-500">Department</h3>
                              <p className="mt-1">{employee.department}</p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-500">Email</h3>
                              <p className="mt-1">{employee.email}</p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                              <p className="mt-1">{employee.phone || "Not provided"}</p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-500">Hire Date</h3>
                              <p className="mt-1">{new Date(employee.hire_date).toLocaleDateString()}</p>
                            </div>
                          </div>
                          {employee.bio && (
                            <div className="mt-4">
                              <h3 className="text-sm font-medium text-gray-500">Bio</h3>
                              <p className="mt-1 line-clamp-3">{employee.bio}</p>
                            </div>
                          )}
                        </CardContent>
                        <CardFooter>
                          <div className="flex items-center justify-between gap-2 w-full">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-purple-500 text-purple-50">
                                Leadership
                              </Badge>
                              <Badge variant="outline" className="bg-green-500 text-green-50">
                                {employee.department}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 gap-1"
                                onClick={() => handleEdit(employee.id)}
                              >
                                <FilePenIcon className="h-3.5 w-3.5" />
                                <span>View</span>
                              </Button>
                            </div>
                          </div>
                        </CardFooter>
                      </Card>
                    ))
                )}
              </div>
            </TabsContent>
            <TabsContent value="management">
              <div className="grid gap-4">
                {filteredEmployees.filter((e) => e.role_type === "management").length === 0 ? (
                  <div className="col-span-full flex items-center justify-center">
                    <p className="text-center text-gray-500">No management team members found.</p>
                  </div>
                ) : (
                  filteredEmployees
                    .filter((e) => e.role_type === "management")
                    .map((employee) => (
                      <Card
                        key={employee.id}
                        className={
                          employee.isdeleted === true && user.roles === "editor" ? "opacity-50 pointer-events-none" : ""
                        }
                      >
                        {/* Same card content as above */}
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle>
                                {employee.first_name} {employee.last_name}
                              </CardTitle>
                              <CardDescription>{employee.job_title}</CardDescription>
                            </div>
                            {employee.profile_image && (
                              <div className="h-12 w-12 overflow-hidden rounded-full">
                                <img
                                  src={employee.profile_image || "/placeholder.svg"}
                                  alt={`${employee.first_name} ${employee.last_name}`}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h3 className="text-sm font-medium text-gray-500">Department</h3>
                              <p className="mt-1">{employee.department}</p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-500">Email</h3>
                              <p className="mt-1">{employee.email}</p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                              <p className="mt-1">{employee.phone || "Not provided"}</p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-500">Hire Date</h3>
                              <p className="mt-1">{new Date(employee.hire_date).toLocaleDateString()}</p>
                            </div>
                          </div>
                          {employee.bio && (
                            <div className="mt-4">
                              <h3 className="text-sm font-medium text-gray-500">Bio</h3>
                              <p className="mt-1 line-clamp-3">{employee.bio}</p>
                            </div>
                          )}
                        </CardContent>
                        <CardFooter>
                          <div className="flex items-center justify-between gap-2 w-full">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-blue-500 text-blue-50">
                                Management
                              </Badge>
                              <Badge variant="outline" className="bg-green-500 text-green-50">
                                {employee.department}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 gap-1"
                                onClick={() => handleEdit(employee.id)}
                              >
                                <FilePenIcon className="h-3.5 w-3.5" />
                                <span>View</span>
                              </Button>
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

export default EmployeesPage

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