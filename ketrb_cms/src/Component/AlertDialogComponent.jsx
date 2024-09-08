import React from "react";
import { Link } from "react-router-dom";
const AlertDialogComponent = ({ isOpen, onClose, message }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center"
            onClick={() => onClose(false)} variant="outline"
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
                <div className="flex justify-end pt-4 border-t border-gray-200 gap-2">
                    <button
                        variant="outline"
                        className="py-2 px-4 rounded-md"
                        onClick={() => onClose(false)}
                    >
                        Close
                    </button>
                    <Link>
                        <button
                            variant="black"
                            className="py-2 px-4 rounded-md ">
                            Continue
                        </button>
                    </Link>
                </div>
            </div>
        </div >
    );
};

export default AlertDialogComponent;
