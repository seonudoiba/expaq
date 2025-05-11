"use client"

import React, { useState } from 'react';
import { Bell, Check, Settings, Trash2, Calendar, MessageSquare, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useWebSocket, NotificationType } from '@/hooks/useWebSocket';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { useNotifications } from '@/contexts/NotificationContext';

interface NotificationPreferences {
    bookingNotifications: boolean;
    messageNotifications: boolean;
    reviewNotifications: boolean;
    systemNotifications: boolean;
}

interface GroupedNotifications {
    [key: string]: Notification[];
}

export default function NotificationsPage() {
    const { user } = useAuth();
    const router = useRouter();
    const {
        notifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        deleteAllNotifications,
    } = useNotifications();
    const [preferences, setPreferences] = useState<NotificationPreferences>({
        bookingNotifications: true,
        messageNotifications: true,
        reviewNotifications: true,
        systemNotifications: true,
    });
    const [selectedType, setSelectedType] = useState<NotificationType | 'all'>('all');

    const getGroupTitle = (date: string) => {
        const notificationDate = new Date(date);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (notificationDate.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (notificationDate.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else if (notificationDate > new Date(today.setDate(today.getDate() - 7))) {
            return 'This Week';
        } else if (notificationDate > new Date(today.setDate(today.getDate() - 30))) {
            return 'This Month';
        } else {
            return notificationDate.toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
            });
        }
    };

    const groupNotificationsByDate = (notifications: Notification[]): GroupedNotifications => {
        return notifications.reduce((groups: GroupedNotifications, notification) => {
            const date = getGroupTitle(notification.createdAt);
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(notification);
            return groups;
        }, {});
    };

    const filteredNotifications = notifications.filter((notification) => {
        if (selectedType === 'all') return true;
        return notification.type === selectedType;
    });

    const groupedNotifications = groupNotificationsByDate(filteredNotifications);

    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsRead();
            toast.success('All notifications marked as read');
        } catch (error) {
            toast.error('Failed to mark all notifications as read');
        }
    };

    const handleDeleteAll = async () => {
        try {
            await deleteAllNotifications();
            toast.success('All notifications deleted');
        } catch (error) {
            toast.error('Failed to delete all notifications');
        }
    };

    const getNotificationIcon = (type: NotificationType) => {
        switch (type) {
            case 'BOOKING_CREATED':
            case 'BOOKING_UPDATED':
            case 'BOOKING_CANCELLED':
            case 'BOOKING_CONFIRMED':
                return <Calendar className="h-5 w-5" />;
            case 'MESSAGE_RECEIVED':
                return <MessageSquare className="h-5 w-5" />;
            case 'REVIEW_RECEIVED':
                return <Star className="h-5 w-5" />;
            default:
                return <Bell className="h-5 w-5" />;
        }
    };

    const updatePreference = async (type: keyof NotificationPreferences, value: boolean) => {
        try {
            await fetch(`/api/notifications/preferences/${type}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ enabled: value }),
            });
            setPreferences(prev => ({ ...prev, [type]: value }));
            toast.success('Preferences updated');
        } catch (error) {
            toast.error('Failed to update preferences');
        }
    };

    if (!user) {
        return (
            <div className="container mx-auto py-8 text-center">
                <h1 className="text-2xl font-bold mb-4">Please log in to view notifications</h1>
                <Button onClick={() => router.push('/login')}>Log in</Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Notifications</h1>
                    <p className="text-muted-foreground">
                        {notifications.filter(n => !n.read).length} unread notification
                        {notifications.filter(n => !n.read).length !== 1 ? 's' : ''}
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    {notifications.some(n => !n.read) && (
                        <Button variant="outline" onClick={handleMarkAllAsRead}>
                            Mark all as read
                        </Button>
                    )}
                    <Button variant="outline" onClick={handleDeleteAll}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear all
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Tabs defaultValue="all" onValueChange={(value) => setSelectedType(value as NotificationType | 'all')}>
                        <TabsList>
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="BOOKING_CREATED">Bookings</TabsTrigger>
                            <TabsTrigger value="MESSAGE_RECEIVED">Messages</TabsTrigger>
                            <TabsTrigger value="REVIEW_RECEIVED">Reviews</TabsTrigger>
                        </TabsList>

                        <TabsContent value={selectedType} className="mt-6">
                            {Object.entries(groupedNotifications).map(([date, notifications]) => (
                                <div key={date} className="mb-8">
                                    <h2 className="text-lg font-semibold mb-4">{date}</h2>
                                    <div className="space-y-4">
                                        {notifications.map((notification) => (
                                            <Card
                                                key={notification.id}
                                                className={`${
                                                    !notification.read ? 'border-primary' : ''
                                                }`}
                                            >
                                                <CardContent className="p-4">
                                                    <div className="flex items-start space-x-4">
                                                        <div className="text-primary">
                                                            {getNotificationIcon(notification.type)}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center justify-between">
                                                                <h3 className="font-semibold">
                                                                    {notification.title}
                                                                </h3>
                                                                <div className="flex items-center space-x-2">
                                                                    {!notification.read && (
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            onClick={() => markAsRead(notification.id)}
                                                                        >
                                                                            <Check className="h-4 w-4" />
                                                                        </Button>
                                                                    )}
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={() => deleteNotification(notification.id)}
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                            <p className="text-sm text-muted-foreground mt-1">
                                                                {notification.message}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground mt-2">
                                                                {formatDistanceToNow(
                                                                    new Date(notification.createdAt),
                                                                    { addSuffix: true }
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            {Object.keys(groupedNotifications).length === 0 && (
                                <div className="text-center py-8">
                                    <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-medium">No notifications</h3>
                                    <p className="text-muted-foreground">
                                        You're all caught up! Check back later for updates.
                                    </p>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>

                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notification Preferences</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="booking-notifications">Booking Notifications</Label>
                                <Switch
                                    id="booking-notifications"
                                    checked={preferences.bookingNotifications}
                                    onCheckedChange={(checked: boolean) =>
                                        updatePreference('bookingNotifications', checked)
                                    }
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="message-notifications">Message Notifications</Label>
                                <Switch
                                    id="message-notifications"
                                    checked={preferences.messageNotifications}
                                    onCheckedChange={(checked: boolean) =>
                                        updatePreference('messageNotifications', checked)
                                    }
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="review-notifications">Review Notifications</Label>
                                <Switch
                                    id="review-notifications"
                                    checked={preferences.reviewNotifications}
                                    onCheckedChange={(checked: boolean) =>
                                        updatePreference('reviewNotifications', checked)
                                    }
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="system-notifications">System Notifications</Label>
                                <Switch
                                    id="system-notifications"
                                    checked={preferences.systemNotifications}
                                    onCheckedChange={(checked: boolean) =>
                                        updatePreference('systemNotifications', checked)
                                    }
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
} 