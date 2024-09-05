import React, { useState } from "react";
import SideNav from "../Component/SideNav";
import HeaderNav from "../Component/HeaderNav";
import bgImage from "../Asset/bg.png";
import { Card, CardHeader, CardTitle, CardContent } from "../Component/card";
import axios from 'axios';
import { Label } from "../Component/label";
import { Input } from "../Component/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../Component/select";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel
} from "../Component/alert-dialog";
import { Button } from "../Component/button";

const UserAdd = () => {
    const [fullname, setName] = useState("");
    const [email, setEmail] = useState("");
    const [roles, setRole] = useState("admin");
    const [gender, setGender] = useState("male");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");

    const handleNameChange = (e) => setName(e.target.value);
    const handleEmailChange = (e) => setEmail(e.target.value);
    const handleGenderChange = (e) => setGender(e.target.value);
    const handleRoleChange = (e) => setRole(e.target.value);


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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const generatedPassword = generatePassword();
        setPassword(generatedPassword);

        const userData = {
            fullname,
            email,
            roles,
            gender,
            password: generatedPassword,
        };

        try {
            const response = await axios.post('https://ketrb-backend.onrender.com/users/register', userData);
            const result = await response.json();
            setLoading(false);
            if (response.ok) {
                setDialogMessage('User added successfully!');
            } else {
                setDialogMessage(result.message || 'Failed to add user.');
            }
        } catch (error) {
            setLoading(false);
            setDialogMessage('An error occurred: ' + error.message);
        }

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
                            <CardTitle>Add User</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h2 className="text-xl font-bold mb-4">Add New User</h2>
                                    <form className="space-y-6 w-[600px] mx-auto" onSubmit={handleSubmit}>
                                        <div>
                                            <Label htmlFor="name" className="block text-sm font-medium text-muted-foreground">
                                                Name
                                            </Label>
                                            <Input id="name" type="text" value={fullname} onChange={handleNameChange} className="mt-1 block w-full" />
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
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="gender" className="block text-sm font-medium text-muted-foreground">
                                                Gender
                                            </Label>
                                            <Select id="gender" value={gender} className="mt-1 block w-full" onValueChange={handleGenderChange}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Gender" />
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
                                                    <SelectValue placeholder="Role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="admin">Admin</SelectItem>
                                                    <SelectItem value="editor">Editor</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label htmlFor="password" className="block text-sm font-medium text-muted-foreground">
                                                Generated Password
                                            </Label>
                                            <Input id="password" type="password" value={password} placeholder="Password generated Automatically" readOnly className="mt-1 block w-full" />
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            <Button variant="outline" type="button">
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
            {/* AlertDialog component */}
            <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <AlertDialogTrigger asChild>
                    <span></span> {/* Trigger is hidden, dialog is controlled by state */}
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{dialogMessage}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {/* Description can be customized based on the message */}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDialogOpen(false)}>Close</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default UserAdd;