import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Assuming you're using react-router
import SideNav from "../Component/SideNav";
import HeaderNav from "../Component/HeaderNav";
import bgImage from "../Asset/bg.png";
import { Card, CardHeader, CardTitle, CardContent } from "../Component/card";
import { Label } from "../Component/label";
import { Input } from "../Component/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../Component/select";
import { Button } from "../Component/button";
import { Alert, AlertDescription, AlertTitle } from "../Component/alert";


const UserEdit = () => {
    const [fullname, setName] = useState("");
    const [email, setEmail] = useState("");
    const [roles, setRole] = useState("");
    const [gender, setGender] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState(""); 

    const { id } = useParams(); // Get user ID from route parameters

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await fetch(`https://ketrb-backend.onrender.com/users/user/${id}`);
                const userData = await response.json();
                setName(userData.data.fullname);
                setEmail(userData.data.email);
                setRole(userData.data.roles);
                setGender(userData.data.gender);
            } catch (error) {
                console.error('Error fetching user details:', error);
            } 
        };
        fetchUserDetails();
    }, [id]);

    const handleNameChange = (e) => setName(e.target.value);
    const handleEmailChange = (e) => setEmail(e.target.value);

    const generatePassword = () => {
        const capitalLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const smallLetters = "abcdefghijklmnopqrstuvwxyz";
        const digits = "0123456789";
        const specialChars = "!@#$%^&*()";

        const allChars = capitalLetters + smallLetters + digits + specialChars;

        const getRandomChar = (str) => str[Math.floor(Math.random() * str.length)];

        let password = "";
        password += getRandomChar(capitalLetters);
        password += getRandomChar(smallLetters);
        password += getRandomChar(digits);
        password += getRandomChar(specialChars);

        for (let i = 4; i < 12; i++) {
            password += getRandomChar(allChars);
        }

        password = password.split("").sort(() => 0.5 - Math.random()).join("");

        return password;
    };

    const handleRoleChange = (value) => {
        setRole(value);
    };

    const handleGenderChange = (value) => {
        
        setGender(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = {
            fullname,
            email,
            roles,
            gender,
            ...(password && { password }) // Only include password if it's set
        };

        try {
            const response = await fetch(`https://ketrb-backend.onrender.com/users/update/${id}`, {
                method: 'PUT', // Use PUT for updating
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            setLoading(false);

            if (response.ok) {
                setAlertMessage('User updated successfully!');
                // Redirect or refresh the page to show the updated users list
                navigate('/users');
            } else {
                if (result.message.includes('duplicate key value violates unique constraint')) {
                    setAlertMessage('Update failed: This email is already registered.');
                } else {
                    setAlertMessage(result.message || 'Failed to update user.');
                }
            }
        } catch (error) {
            setLoading(false);
            setAlertMessage('An error occurred: ' + error.message);
        }
    };
    const handleChangePassword = () => {
        const newPassword = generatePassword();
        setPassword(newPassword);
    };

    const handleCancel = () => {
        window.location.href = '/users'; 
    };

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <SideNav />
            <div
                className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14"
                style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
                <HeaderNav />
                <div className="flex items-center justify-center min-h-screen bg-muted">
                    <Card className="w-full max-w-2xl bg-white">
                        <CardHeader>
                            <CardTitle>Edit User</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h2 className="text-xl font-bold mb-4">Edit User Information</h2>
                                    {alertMessage && (
                                        <Alert>
                                            <AlertTitle>Notification</AlertTitle>
                                            <AlertDescription>{alertMessage}</AlertDescription>
                                        </Alert>
                                    )}
                                    <form className="space-y-6 w-[600px] mx-auto" onSubmit={handleSubmit}>
                                        <div>
                                            <Label htmlFor="name" className="block text-sm font-medium text-muted-foreground">
                                                Name
                                            </Label>
                                            <Input id="name" type="text" value={fullname} onChange={handleNameChange} className="mt-1 block w-full" placeholder={fullname} />
                                        </div>
                                        <div>
                                            <Label htmlFor="email" className="block text-sm font-medium text-muted-foreground">
                                                Email
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={email}
                                                onChange={handleEmailChange}
                                                className="mt-1 block w-full"
                                                placeholder={email}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="gender" className="block text-sm font-medium text-muted-foreground">
                                                Gender
                                            </Label>
                                            <Select id="gender" value={gender} className="mt-1 block w-full" onValueChange={handleGenderChange}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={gender} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="male">Male</SelectItem>
                                                    <SelectItem value="female">Female</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label htmlFor="role" className="block text-sm font-medium text-muted-foreground">
                                                Select Role
                                            </Label>
                                            <Select id="role" value={roles} className="mt-1 block w-full" onValueChange={handleRoleChange}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={roles} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="administrator">Administrator</SelectItem>
                                                    <SelectItem value="editor">Editor</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1">
                                                <Label htmlFor="password" className="block text-sm font-medium text-muted-foreground">
                                                    Generated Password
                                                </Label>
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    value={password}
                                                    placeholder="Password Generated Automatically"
                                                    readOnly
                                                    className="mt-1 block w-full"
                                                />
                                            </div>
                                            <Button
                                                variant="black"
                                                type="button"
                                                onClick={handleChangePassword}
                                                className="mt-1 flex-shrink-0"
                                            >
                                                Change Password
                                            </Button>
                                        </div>

                                        <div className="flex justify-end gap-2">
                                            <Button variant="outline" type="button" onClick={handleCancel}>
                                                Cancel
                                            </Button>
                                            <Button variant="black" type="submit">
                                                {loading ? (
                                                    <span className="flex items-center">
                                                        <svg
                                                            className="animate-spin h-5 w-5 mr-3 text-white"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <circle
                                                                className="opacity-25"
                                                                cx="12"
                                                                cy="12"
                                                                r="10"
                                                                stroke="currentColor"
                                                                strokeWidth="4"
                                                            ></circle>
                                                            <path
                                                                className="opacity-75"
                                                                fill="currentColor"
                                                                d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8v-8H4z"
                                                            ></path>
                                                        </svg>
                                                        Loading...
                                                    </span>
                                                ) : (
                                                    "Save User"
                                                )}
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default UserEdit;