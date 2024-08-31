import React, { useState } from "react";
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

const UserAdd = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [role, setRole] = useState("admin")
    const handleNameChange = (e) => setName(e.target.value)
    const handleEmailChange = (e) => setEmail(e.target.value)
    const handleRoleChange = (e) => setRole(e.target.value)
    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("New user:", { name, email, role, password: "password123" })
    }
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
                                            <Label htmlFor="role" className="block text-sm font-medium text-muted-foreground">
                                                Select Role
                                            </Label>
                                            <Select id="role" value={role} className="mt-1 block w-full" onValueChange={handleRoleChange}>
                                                <SelectTrigger className="w-[180px]">
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
                                                Default Password
                                            </Label>
                                            <Input id="password" type="text" value="password123" disabled className="mt-1 block w-full" />
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