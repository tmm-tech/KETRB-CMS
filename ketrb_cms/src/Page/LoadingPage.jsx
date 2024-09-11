import React from 'react';
import logo from "../Asset/Logo/ketrb.ico";

export default function LoadingPage() {
    return (
        <div className="flex min-h-screen w-full flex-col bg-transparent">
            <div className="flex h-screen w-full items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <img src={logo} alt="Logo" className="h-20 w-20" />
                    <h1 className="text-2xl font-bold">Loading KETRB CMS...</h1>
                    <p className="text-muted-foreground">Please wait while we load the content for you.</p>
                    <LoaderIcon className="animate-spin h-12 w-12 text-black" />
                </div>
            </div>
        </div>
    );
}

function LoaderIcon(props) {
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
            <path d="M12 2v4" />
            <path d="m16.2 7.8 2.9-2.9" />
            <path d="M18 12h4" />
            <path d="m16.2 16.2 2.9 2.9" />
            <path d="M12 18v4" />
            <path d="m4.9 19.1 2.9-2.9" />
            <path d="M2 12h4" />
            <path d="m4.9 4.9 2.9 2.9" />
        </svg>
    );
}
