import React, { useState,useEffect } from "react";
import SideNav from "../Component/SideNav";
import HeaderNav from "../Component/HeaderNav";
import { Card, CardHeader, CardTitle, CardContent } from '../Component/card';
import { ScrollArea } from "../Component/scroll-area";
import { Button } from "../Component/button";
import bgImage from "../Asset/bg.png";

const NotificationsPage = () => {
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [error, setError] = useState(null); 
  const [notifications, setNotifications] = useState([]);
  const storedUser = localStorage.getItem('user');
  const users = JSON.parse(storedUser);
  useEffect(() => {
    const getNotifications = async () => {
      if (!users) return; // Early return if user data is missing

      try {
        const response = await fetch(`https://ketrb-backend.onrender.com/notifications?id=${users.id}&role=${users.roles}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const fetchedNotifications = await response.json();
          setNotifications(fetchedNotifications.notifications);
        } else {
          console.error('Failed to fetch notifications');
          setError("Failed to fetch notifications.");
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setError("Error fetching notifications.");
      }
    };

    getNotifications();
  }, [users]);

  
  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
  };
  
const formatTitle = (title) => {
    return title
      .split('_')  // Split by underscores
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))  // Capitalize each word
      .join(' ');  // Join words with spaces
  };
  
  const markAsRead = async (id) => {
    try {
      
      const response = await fetch(`https://ketrb-backend.onrender.com/notifications/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_read: true }), // Adjust payload as needed
      });

      if (!response.ok) {
        throw new Error('Failed to update notification status');
      }

      // Update local state after successful API call
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id ? { ...notification, isRead: true } : notification
        )
      );

      if (selectedNotification && selectedNotification.id === id) {
        setSelectedNotification({ ...selectedNotification, isRead: true });
      }
    } catch (error) {
      console.error("Failed to update notification status:", error);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <SideNav />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14" style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: "center" }}>
        <HeaderNav />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="flex flex-col md:flex-row h-screen bg-background">
            <Card className="w-full md:w-1/3 md:h-full overflow-hidden">
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-5rem)] md:h-[calc(100vh-7rem)]">
                  {notifications.length === 0 ? (
                     <div className="p-2 text-sm text-gray-500">No notifications</div>
                   ) : (
                 notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`flex items-start p-4 cursor-pointer transition-colors ${
                        notification.isRead ? 'bg-background' : 'bg-accent'
                      } ${selectedNotification?.id === notification.id ? 'bg-muted' : ''}`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="mr-4 mt-1">
                        {notification.isRead ? (
                          <BellIcon className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <BellIcon className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-2xl font-medium mb-4">{formatTitle(notification.notification_type)}</h3>
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                      </div>
                    </div>
                  ))
      )}
                </ScrollArea>
              </CardContent>
            </Card>
            <Card className="w-full md:w-2/3 md:h-full overflow-hidden">
              <CardContent className="p-6">
                {selectedNotification ? (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">{formatTitle(selectedNotification.notification_type)}</h2>
                    <p className="mb-6">{selectedNotification.message}</p>
                   <Button variant="black" onClick={() => markAsRead(selectedNotification.id)}>
                      {selectedNotification.isRead ? "Mark as Unread" : "✔✔ Mark as Read"}
                    </Button>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground">Select a notification to view details</p>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NotificationsPage;

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
  );
}
