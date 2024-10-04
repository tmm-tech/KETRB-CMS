import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../Component/card';
import { ScrollArea } from "../Component/scroll-area"
import { Button } from "../Component/button"
import bgImage from "../Asset/bg.png";

interface Notification {
  id: number
  title: string
  summary: string
  body: string
  isRead: boolean
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, title: "New Update", summary: "Check out the latest update", body: "Detailed information about the update. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", isRead: false },
    { id: 2, title: "Reminder", summary: "Upcoming event reminder", body: "Details about the event. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.", isRead: true },
    { id: 3, title: "New Message", summary: "You have a new message", body: "Content of the new message. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.", isRead: false },
  ])

  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)

  const handleNotificationClick = (notification: Notification) => {
    setSelectedNotification(notification)
  }

  const markAsRead = (id: number) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(n =>
        n.id === id ? { ...n, isRead: !n.isRead } : n
      )
    )
    if (selectedNotification && selectedNotification.id === id) {
      setSelectedNotification({ ...selectedNotification, isRead: !selectedNotification.isRead })
    }
  }

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
            {notifications.map((notification) => (
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
                  <h3 className="text-sm font-medium">{notification.title}</h3>
                  <p className="text-sm text-muted-foreground">{notification.summary}</p>
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
      <Card className="w-full md:w-2/3 md:h-full overflow-hidden">
        <CardContent className="p-6">
          {selectedNotification ? (
            <div>
              <h2 className="text-2xl font-bold mb-4">{selectedNotification.title}</h2>
              <p className="mb-6">{selectedNotification.body}</p>
              <Button onClick={() => markAsRead(selectedNotification.id)}>
                {selectedNotification.isRead ? "Mark as Unread" : "Mark as Read"}
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
  )
}

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
