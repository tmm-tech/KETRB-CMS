import React from "react";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction
} from "../Component/alert-dialog";
import { Link } from "react-router-dom";

const AlertDialogComponent = ({ isOpen, onClose, message }) => {
    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{message}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {/* Description can be customized based on the message */}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => onClose(false)}>Close</AlertDialogCancel>
                    <Link to="/users"><AlertDialogAction>Continue</AlertDialogAction></Link>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default AlertDialogComponent;