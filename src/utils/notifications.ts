import { usePWA } from '@/hooks/usePWA';

export interface NotificationData {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
  actions?: NotificationAction[];
}

export const sendBookingNotification = (type: 'confirmed' | 'reminder' | 'cancelled', bookingData: any) => {
  const { sendNotification } = usePWA();
  
  const notifications = {
    confirmed: {
      title: 'Booking Confirmed! 🌸',
      body: `Your appointment with ${bookingData.companion_name} has been confirmed for ${bookingData.date}.`,
      tag: 'booking-confirmed',
      data: { bookingId: bookingData.id, type: 'confirmed' }
    },
    reminder: {
      title: 'Upcoming Appointment 📅',
      body: `Reminder: Your appointment with ${bookingData.companion_name} is in 1 hour.`,
      tag: 'booking-reminder',
      data: { bookingId: bookingData.id, type: 'reminder' }
    },
    cancelled: {
      title: 'Booking Cancelled ❌',
      body: `Your appointment with ${bookingData.companion_name} has been cancelled.`,
      tag: 'booking-cancelled',
      data: { bookingId: bookingData.id, type: 'cancelled' }
    }
  };

  const notification = notifications[type];
  sendNotification(notification.title, {
    body: notification.body,
    tag: notification.tag,
    data: notification.data,
    actions: [
      {
        action: 'view',
        title: 'View Details',
        icon: '/icon-192x192.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/close-icon.png'
      }
    ]
  });
};

export const sendCompanionNotification = (type: 'new-booking' | 'booking-cancelled', bookingData: any) => {
  const { sendNotification } = usePWA();
  
  const notifications = {
    'new-booking': {
      title: 'New Booking Request! 💕',
      body: `You have a new booking request for ${bookingData.date}.`,
      tag: 'new-booking',
      data: { bookingId: bookingData.id, type: 'new-booking' }
    },
    'booking-cancelled': {
      title: 'Booking Cancelled',
      body: `A booking for ${bookingData.date} has been cancelled.`,
      tag: 'booking-cancelled-companion',
      data: { bookingId: bookingData.id, type: 'booking-cancelled' }
    }
  };

  const notification = notifications[type];
  sendNotification(notification.title, {
    body: notification.body,
    tag: notification.tag,
    data: notification.data,
    actions: [
      {
        action: 'view',
        title: 'View Dashboard',
        icon: '/icon-192x192.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/close-icon.png'
      }
    ]
  });
};

// Schedule notification for booking reminders
export const scheduleBookingReminder = (bookingData: any) => {
  const bookingTime = new Date(bookingData.date + ' ' + bookingData.time);
  const reminderTime = new Date(bookingTime.getTime() - 60 * 60 * 1000); // 1 hour before
  const now = new Date();

  if (reminderTime > now) {
    const timeUntilReminder = reminderTime.getTime() - now.getTime();
    
    setTimeout(() => {
      sendBookingNotification('reminder', bookingData);
    }, timeUntilReminder);
  }
};

// Request permission and setup notification handlers
export const setupNotifications = () => {
  if ('serviceWorker' in navigator && 'Notification' in window) {
    navigator.serviceWorker.ready.then((registration) => {
      // Listen for notification clicks
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'notification-click') {
          const { action, notification } = event.data;
          
          switch (action) {
            case 'view':
              // Navigate to relevant page based on notification data
              if (notification.data?.type === 'new-booking') {
                window.location.href = '/companion-dashboard';
              } else {
                window.location.href = '/my-bookings';
              }
              break;
            case 'dismiss':
              // Just close the notification
              break;
          }
        }
      });
    });
  }
};
