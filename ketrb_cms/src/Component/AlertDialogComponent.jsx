import React from "react";
import { Button } from "../Component/button";
const AlertDialogComponent = ({ isOpen, onClose, message }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center"
            onClick={() => onClose(false)}
        >
            <div
                className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-xl font-semibold">Notification</h3>
                </div>
                <div className="py-4">
                    <p>{message}</p>
                </div>
                <div className="flex justify-end pt-4 border-t border-gray-200">
                    <button
                        variant="black"
                        onClick={() => onClose(false)}
                    >
                        Close
                    </button>
                    <button
                        variant="black"
                        onClick={() => onClose(false)}
                    >
                    Continue
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AlertDialogComponent;
