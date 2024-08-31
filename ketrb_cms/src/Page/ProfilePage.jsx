import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription} from "../Component/card";
import { Switch } from "../Component/switch";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../Component/select";
import { Button } from '../Component/button';
import SideNav from "../Component/SideNav";
import HeaderNav from "../Component/HeaderNav";
import bgImage from "../Asset/bg.png";
import { Badge } from '../Component/badge';

const ProfilePage = () => {

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <SideNav />
            <div
                className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14"
                style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
                <HeaderNav />
                <div className="flex flex-col gap-8 w-full max-w-[900px] mx-auto">
                    <section>
                        <Card>
                            <CardHeader>
                                <CardTitle>Overview</CardTitle>
                                <CardDescription>View and manage your profile information.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-6">
                                    <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                                        <div className="text-sm font-medium text-muted-foreground">Name</div>
                                        <div className="text-sm">John Doe</div>
                                    </div>
                                    <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                                        <div className="text-sm font-medium text-muted-foreground">Email</div>
                                        <div className="text-sm">john@example.com</div>
                                    </div>
                                    <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                                        <div className="text-sm font-medium text-muted-foreground">Role</div>
                                        <div className="text-sm">Administrator</div>
                                    </div>
                                    <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                                        <div className="text-sm font-medium text-muted-foreground">Joined</div>
                                        <div className="text-sm">June 1, 2021</div>
                                    </div>
                                    <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                                        <div className="text-sm font-medium text-muted-foreground">Status</div>
                                        <div className="text-sm">
                                            <Badge variant="outline">Active</Badge>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button variant="outline">Edit Profile</Button>
                            </CardFooter>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Account Settings</CardTitle>
                                <CardDescription>Manage your account-related settings.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4">
                                    <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                                        <div className="text-sm font-medium text-muted-foreground">Username</div>
                                        <div className="text-sm">johndoe</div>
                                    </div>
                                    <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                                        <div className="text-sm font-medium text-muted-foreground">Email</div>
                                        <div className="text-sm">john@example.com</div>
                                    </div>
                                    <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                                        <div className="text-sm font-medium text-muted-foreground">Language</div>
                                        <div className="text-sm">
                                            <Select>
                                                <SelectTrigger aria-label="Select language">
                                                    <SelectValue placeholder="Select language" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="en">English</SelectItem>
                                                    <SelectItem value="es">Español</SelectItem>
                                                    <SelectItem value="fr">Français</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                                        <div className="text-sm font-medium text-muted-foreground">Time Zone</div>
                                        <div className="text-sm">
                                            <Select>
                                                <SelectTrigger aria-label="Select time zone">
                                                    <SelectValue placeholder="Select time zone" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="utc">UTC</SelectItem>
                                                    <SelectItem value="est">EST</SelectItem>
                                                    <SelectItem value="pst">PST</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button variant="outline">Update Settings</Button>
                            </CardFooter>
                        </Card>
                    </section>
                    <section>
                        <h3 className="text-xl font-bold mb-4">Security Settings</h3>
                        <Card>
                            <CardHeader>
                                <CardTitle>Security Settings</CardTitle>
                                <CardDescription>Manage your security-related settings.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4">
                                    <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                                        <div className="text-sm font-medium text-muted-foreground">Password</div>
                                        <div className="text-sm">
                                            <Button variant="outline" size="sm">
                                                Change Password
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                                        <div className="text-sm font-medium text-muted-foreground">Two-Factor Auth</div>
                                        <div className="text-sm">
                                            <div className="flex items-center gap-2">
                                                <Switch />
                                                <span>Enabled</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                                        <div className="text-sm font-medium text-muted-foreground">Backup Codes</div>
                                        <div className="text-sm">
                                            <Button variant="outline" size="sm">
                                                View Backup Codes
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button variant="outline">Update Security</Button>
                            </CardFooter>
                        </Card>
                    </section>
                    <section>
                        <h3 className="text-xl font-bold mb-4">Notifications</h3>
                        <Card>
                            <CardHeader>
                                <CardTitle>Notification Preferences</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="-mx-2 flex items-start gap-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                                    <BellIcon className="mt-px h-5 w-5" />
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">Email Notifications</p>
                                        <p className="text-sm text-muted-foreground">
                                            Receive email notifications for important updates and activities.
                                        </p>
                                    </div>
                                    <div className="ml-auto">
                                        <Switch id="email-notifications" defaultChecked onCheckedChange={(checked) => { }} />
                                    </div>
                                </div>
                                <div className="-mx-2 flex items-start gap-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                                    <BellIcon className="mt-px h-5 w-5" />
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">In-App Notifications</p>
                                        <p className="text-sm text-muted-foreground">
                                            Receive in-app notifications for important updates and activities.
                                        </p>
                                    </div>
                                    <div className="ml-auto">
                                        <Switch id="in-app-notifications" defaultChecked onCheckedChange={(checked) => { }} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </section>
                    <section>
                        <h3 className="text-xl font-bold mb-4">Privacy Settings</h3>
                        <Card className="mt-4">
                            <CardHeader>
                                <CardTitle>Account Deactivation</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="-mx-2 flex items-start gap-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                                    <TrashIcon className="mt-px h-5 w-5" />
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">Deactivate Account</p>
                                        <p className="text-sm text-muted-foreground">Temporarily or permanently deactivate your account.</p>
                                    </div>
                                    <div className="ml-auto">
                                        <Button variant="destructive" size="sm">
                                            Deactivate
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </section>
                </div>
            </div>
        </div >
    );
};


export default ProfilePage;

function BellIcon(props) {
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
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
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