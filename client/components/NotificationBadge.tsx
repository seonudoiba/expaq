// "use client"

// import React from 'react';
// import { Bell } from 'lucide-react';
// import { useNotifications } from '@/contexts/NotificationContext';
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import { Button } from '@/components/ui/button';
// import { useRouter } from 'next/navigation';
// import { formatDistanceToNow } from 'date-fns';

// export const NotificationBadge: React.FC = () => {
//     const { notifications, unreadCount, markAsRead } = useNotifications();
//     const router = useRouter();

//     const handleNotificationClick = (notification: any) => {
//         markAsRead(notification.id);
        
//         // Navigate based on notification type
//         switch (notification.type) {
//             case 'BOOKING_CREATED':
//             case 'BOOKING_UPDATED':
//             case 'BOOKING_CANCELLED':
//             case 'BOOKING_CONFIRMED':
//                 router.push(`/bookings/${notification.data.bookingId}`);
//                 break;
//             case 'MESSAGE_RECEIVED':
//                 router.push(`/messages/${notification.data.senderId}`);
//                 break;
//             case 'REVIEW_RECEIVED':
//                 router.push(`/reviews/${notification.data.reviewId}`);
//                 break;
//             case 'ACTIVITY_UPDATED':
//                 router.push(`/activities/${notification.data.activityId}`);
//                 break;
//             default:
//                 router.push('/notifications');
//         }
//     };

//     const getNotificationIcon = (type: string) => {
//         switch (type) {
//             case 'BOOKING_CREATED':
//             case 'BOOKING_UPDATED':
//             case 'BOOKING_CANCELLED':
//             case 'BOOKING_CONFIRMED':
//                 return '📅';
//             case 'MESSAGE_RECEIVED':
//                 return '💬';
//             case 'REVIEW_RECEIVED':
//                 return '⭐';
//             case 'ACTIVITY_UPDATED':
//                 return '🎯';
//             default:
//                 return '🔔';
//         }
//     };

//     return (
//         <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//                 <Button variant="ghost" size="icon" className="relative">
//                     <Bell className="h-5 w-5" />
//                     {unreadCount > 0 && (
//                         <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
//                             {unreadCount > 99 ? '99+' : unreadCount}
//                         </span>
//                     )}
//                 </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end" className="w-80">
//                 {notifications.length === 0 ? (
//                     <div className="p-4 text-center text-sm text-muted-foreground">
//                         No notifications
//                     </div>
//                 ) : (
//                     notifications.slice(0, 5).map((notification) => (
//                         <DropdownMenuItem
//                             key={notification.id}
//                             className={`p-4 cursor-pointer ${
//                                 !notification.read ? 'bg-muted/50' : ''
//                             }`}
//                             onClick={() => handleNotificationClick(notification)}
//                         >
//                             <div className="flex items-start gap-3">
//                                 <span className="text-lg">
//                                     {getNotificationIcon(notification.type)}
//                                 </span>
//                                 <div className="flex-1 space-y-1">
//                                     <p className="text-sm font-medium leading-none">
//                                         {notification.title}
//                                     </p>
//                                     <p className="text-sm text-muted-foreground">
//                                         {notification.message}
//                                     </p>
//                                     <p className="text-xs text-muted-foreground">
//                                         {formatDistanceToNow(new Date(notification.createdAt), {
//                                             addSuffix: true,
//                                         })}
//                                     </p>
//                                 </div>
//                             </div>
//                         </DropdownMenuItem>
//                     ))
//                 )}
//                 {notifications.length > 5 && (
//                     <DropdownMenuItem
//                         className="p-4 text-center text-sm text-primary cursor-pointer"
//                         onClick={() => router.push('/notifications')}
//                     >
//                         View all notifications
//                     </DropdownMenuItem>
//                 )}
//             </DropdownMenuContent>
//         </DropdownMenu>
//     );
// };