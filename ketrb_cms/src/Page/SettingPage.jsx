import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../Component/tabs';
import { Button } from '../Component/button';
import SideNav from "../Component/SideNav";
import HeaderNav from "../Component/HeaderNav";
import bgImage from "../Asset/bg.png";


const SettingPage = () => {

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <SideNav />
            <div
                className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14"
                style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
                <HeaderNav />
                <div className="flex flex-col min-h-screen bg-muted">
                    <Tabs className="flex-1 grid grid-cols-[1fr_3fr] gap-8 p-4 md:p-8 mt-20" defaultValue="general">
                        {/* Vertical Tab List */}
                        <TabsList asChild className="flex flex-col space-y-1 bg-background rounded-md shadow-sm p-4">
                            <nav className="flex flex-col space-y-1">
                                <TabsTrigger value="general" asChild>
                                    <Button variant="ghost" className="w-full justify-start gap-2 text-left">
                                        <SettingsIcon className="w-5 h-5" />
                                        <span>General</span>
                                    </Button>
                                </TabsTrigger>
                                <TabsTrigger value="account" asChild>
                                    <Button variant="ghost" className="w-full justify-start gap-2 text-left">
                                        <UserIcon className="w-5 h-5" />
                                        <span>Account</span>
                                    </Button>
                                </TabsTrigger>
                                <TabsTrigger value="security" asChild>
                                    <Button variant="ghost" className="w-full justify-start gap-2 text-left">
                                        <LockIcon className="w-5 h-5" />
                                        <span>Security</span>
                                    </Button>
                                </TabsTrigger>
                                <TabsTrigger value="notification" asChild>
                                    <Button variant="ghost" className="w-full justify-start gap-2 text-left">
                                        <BellIcon className="w-5 h-5" />
                                        <span>Notifications</span>
                                    </Button>
                                </TabsTrigger>
                                <TabsTrigger value="appearance" asChild>
                                    <Button variant="ghost" className="w-full justify-start gap-2 text-left">
                                        <PaletteIcon className="w-5 h-5" />
                                        <span>Appearance</span>
                                    </Button>
                                </TabsTrigger>
                                <TabsTrigger value="integrations" asChild>
                                    <Button variant="ghost" className="w-full justify-start gap-2 text-left">
                                        <PlugIcon className="w-5 h-5" />
                                        <span>Integrations</span>
                                    </Button>
                                </TabsTrigger>
                                <TabsTrigger value="advanced" asChild>
                                    <Button variant="ghost" className="w-full justify-start gap-2 text-left">
                                        <SlidersVerticalIcon className="w-5 h-5" />
                                        <span>Advanced</span>
                                    </Button>
                                </TabsTrigger>
                            </nav>
                        </TabsList>

                        {/* Tab Content */}
                        <div className="bg-white p-6 rounded-md shadow-sm flex-1 -mt-20">
                            <TabsContent value="general">
                                <GeneralSettings />
                            </TabsContent>
                            <TabsContent value="account">
                                <AccountSettings />
                            </TabsContent>
                            <TabsContent value="security">
                                <SecuritySettings />
                            </TabsContent>
                            <TabsContent value="notifications">
                                <NotificationsSettings />
                            </TabsContent>
                            <TabsContent value="appearance">
                                <AppearanceSettings />
                            </TabsContent>
                            <TabsContent value="integrations">
                                <IntegrationsSettings />
                            </TabsContent>
                            <TabsContent value="advanced">
                                <AdvancedSettings />
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>
            </div>
        </div>
    );
};

const GeneralSettings = () => <div><h2>General Settings</h2></div>;
const AccountSettings = () => <div><h2>Account Settings</h2></div>;
const SecuritySettings = () => <div><h2>Security Settings</h2></div>;
const NotificationsSettings = () => <div><h2>Notifications Settings</h2></div>;
const AppearanceSettings = () => <div><h2>Appearance Settings</h2></div>;
const IntegrationsSettings = () => <div><h2>Integrations Settings</h2></div>;
const AdvancedSettings = () => <div><h2>Advanced Settings</h2></div>;


export default SettingPage;

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


function PaletteIcon(props) {
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
            <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
            <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
            <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
            <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
        </svg>
    )
}


function PlugIcon(props) {
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
            <path d="M12 22v-5" />
            <path d="M9 8V2" />
            <path d="M15 8V2" />
            <path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z" />
        </svg>
    )
}


function SettingsIcon(props) {
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
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    )
}


function SlidersVerticalIcon(props) {
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
            <line x1="4" x2="4" y1="21" y2="14" />
            <line x1="4" x2="4" y1="10" y2="3" />
            <line x1="12" x2="12" y1="21" y2="12" />
            <line x1="12" x2="12" y1="8" y2="3" />
            <line x1="20" x2="20" y1="21" y2="16" />
            <line x1="20" x2="20" y1="12" y2="3" />
            <line x1="2" x2="6" y1="14" y2="14" />
            <line x1="10" x2="14" y1="8" y2="8" />
            <line x1="18" x2="22" y1="16" y2="16" />
        </svg>
    )
}


function UserIcon(props) {
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
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    )
}