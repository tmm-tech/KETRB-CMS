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
import { Button } from "../Component/button";

const UserAdd = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("admin");
    const [gender, setGender] = useState("male");
    const [password, setPassword] = useState("");

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
            name,
            email,
            role,
            gender,
            password: generatedPassword,
        };
    
        try {
            const response = await axios.post('https://ketrb-backend.onrender.com/users/register', userData);
    
            console.log('User registered successfully:', response.data);
            
        } catch (error) {
            if (error.response) {
                console.error('Error registering user:', error.response.data);
                
            } else {
                console.error('Network error:', error.message);
               
            }
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
                                            <Input id="name" type="text" value={name} onChange={handleNameChange} className="mt-1 block w-full" />
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
                                            <Select id="role" value={role} className="mt-1 block w-full" onValueChange={handleRoleChange}>
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
                                            <Input id="password" type="password" value={password} readOnly className="mt-1 block w-full" />
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            <Button variant="outline" type="button">
                                                Cancel
                                            </Button>
                                            <Button variant="black" type="submit">
                                                Save User
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

export default UserAdd;