// Notification System Module (MVP: In-App Priority)

function sendInAppNotification(userId, message, eventType) {
    const notification = {
        recipientId: userId,
        type: eventType,
        message: message,
        timestamp: new Date().toISOString(),
        status: 'DELIVERED'
    };

    console.log(
        `[IN-APP NOTIFICATION] To User ${userId}: ${message}`
    );

    return notification;
}

// Placeholder for future expansion
// Future versions can support:
// - Email notifications
// - SMS notifications
// - Push notifications
// - Notification preferences
// - Priority levels
// - Notification history

module.exports = {
    sendInAppNotification
};