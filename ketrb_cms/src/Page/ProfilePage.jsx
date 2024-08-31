import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../Component/tabs';
import { Button } from '../Component/button';
import SideNav from "../Component/SideNav";
import HeaderNav from "../Component/HeaderNav";
import bgImage from "../Asset/bg.png";

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
                        <div className="flex items-center gap-4 mb-6">
                            <Avatar className="h-16 w-16">
                                <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div>
                                <h2 className="text-2xl font-bold">Jared Palmer</h2>
                                <p className="text-muted-foreground">jared@acme.com</p>
                            </div>
                        </div>
                        <div className="prose prose-sm">
                            {/* <p>
                                I'm a software engineer with a passion for building great products. I've been working in the tech industry
                                for the past 5 years and have experience with a variety of technologies.
                            </p> */}
                        </div>
                    </section>
                    <section>
                        <h3 className="text-xl font-bold mb-4">Account Settings</h3>
                        <Card>
                            <CardHeader>
                                <CardTitle>Update Account Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" defaultValue="jared@acme.com" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input id="password" type="password" />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button>Save Changes</Button>
                            </CardFooter>
                        </Card>
                        <Card className="mt-4">
                            <CardHeader>
                                <CardTitle>Connected Accounts</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="-mx-2 flex items-start gap-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                                    <ChromeIcon className="mt-px h-5 w-5" />
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">Google</p>
                                        <p className="text-sm text-muted-foreground">Linked since June 2021</p>
                                    </div>
                                    <div className="ml-auto">
                                        <Button variant="ghost" size="icon">
                                            <TrashIcon className="h-5 w-5" />
                                            <span className="sr-only">Unlink Google account</span>
                                        </Button>
                                    </div>
                                </div>
                                <div className="-mx-2 flex items-start gap-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                                    <GitlabIcon className="mt-px h-5 w-5" />
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">GitHub</p>
                                        <p className="text-sm text-muted-foreground">Linked since August 2020</p>
                                    </div>
                                    <div className="ml-auto">
                                        <Button variant="ghost" size="icon">
                                            <TrashIcon className="h-5 w-5" />
                                            <span className="sr-only">Unlink GitHub account</span>
                                        </Button>
                                    </div>
                                </div>
                                <Button variant="outline" className="mt-4">
                                    Connect a new account
                                </Button>
                            </CardContent>
                        </Card>
                    </section>
                    <section>
                        <h3 className="text-xl font-bold mb-4">Security Settings</h3>
                        <Card>
                            <CardHeader>
                                <CardTitle>Change Password</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="current-password">Current Password</Label>
                                    <Input id="current-password" type="password" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="new-password">New Password</Label>
                                    <Input id="new-password" type="password" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="confirm-password">Confirm Password</Label>
                                    <Input id="confirm-password" type="password" />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button>Change Password</Button>
                            </CardFooter>
                        </Card>
                        <Card className="mt-4">
                            <CardHeader>
                                <CardTitle>Two-Factor Authentication</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="-mx-2 flex items-start gap-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                                    <LockIcon className="mt-px h-5 w-5" />
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">Two-Factor Authentication</p>
                                        <p className="text-sm text-muted-foreground">
                                            Enhance your account security with two-factor authentication.
                                        </p>
                                    </div>
                                    <div className="ml-auto">
                                        <Switch id="two-factor" defaultChecked={false} onCheckedChange={(checked) => { }} />
                                    </div>
                                </div>
                            </CardContent>
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
                        <Card>
                            <CardHeader>
                                <CardTitle>Data Sharing and Visibility</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="-mx-2 flex items-start gap-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                                    <EyeIcon className="mt-px h-5 w-5" />
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">Profile Visibility</p>
                                        <p className="text-sm text-muted-foreground">Control who can see your profile information.</p>
                                    </div>
                                    <div className="ml-auto">
                                        <Select>
                                            <SelectTrigger aria-label="Select profile visibility">
                                                <SelectValue placeholder="Select visibility" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="public">Public</SelectItem>
                                                <SelectItem value="private">Private</SelectItem>
                                                <SelectItem value="friends">Friends Only</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="-mx-2 flex items-start gap-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                                    <ShareIcon className="mt-px h-5 w-5" />
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">Data Sharing</p>
                                        <p className="text-sm text-muted-foreground">
                                            Control what data you share with third-party apps and services.
                                        </p>
                                    </div>
                                    <div className="ml-auto">
                                        <Select>
                                            <SelectTrigger aria-label="Select data sharing">
                                                <SelectValue placeholder="Select data sharing" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Share all data</SelectItem>
                                                <SelectItem value="limited">Share limited data</SelectItem>
                                                <SelectItem value="none">Don't share any data</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
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
        </div>
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
  
  
  function ChromeIcon(props) {
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
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="4" />
        <line x1="21.17" x2="12" y1="8" y2="8" />
        <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
        <line x1="10.88" x2="15.46" y1="21.94" y2="14" />
      </svg>
    )
  }
  
  
  function EyeIcon(props) {
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
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    )
  }
  
  
  function GitlabIcon(props) {
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
        <path d="m22 13.29-3.33-10a.42.42 0 0 0-.14-.18.38.38 0 0 0-.22-.11.39.39 0 0 0-.23.07.42.42 0 0 0-.14.18l-2.26 6.67H8.32L6.1 3.26a.42.42 0 0 0-.1-.18.38.38 0 0 0-.26-.08.39.39 0 0 0-.23.07.42.42 0 0 0-.14.18L2 13.29a.74.74 0 0 0 .27.83L12 21l9.69-6.88a.71.71 0 0 0 .31-.83Z" />
      </svg>
    )
  }
  
  
  function LockIcon(props) {
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
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    )
  }
  
  
  function ShareIcon(props) {
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
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <polyline points="16 6 12 2 8 6" />
        <line x1="12" x2="12" y1="2" y2="15" />
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