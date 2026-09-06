CREATE TYPE notification_channel AS ENUM (
    'IN_APP',
    'EMAIL',
    'SMS'
);

CREATE TYPE notification_status AS ENUM (
    'PENDING',
    'SENT',
    'FAILED',
    'READ'
);

CREATE TYPE notification_type AS ENUM (
    'ORDER_CONFIRMED',
    'ORDER_PREPARING',
    'ORDER_READY_FOR_PICKUP',
    'ORDER_IN_TRANSIT',
    'RIDER_ARRIVED',
    'ORDER_DELIVERED',
    'ORDER_CANCELLED',
    'FULFILLMENT_FAILED',

    'NEW_ORDER',
    'RIDER_ASSIGNED',
    'RIDER_APPROACHING',
    'ORDER_PICKED_UP',

    'DELIVERY_ASSIGNMENT',
    'PICKUP_INSTRUCTIONS'
);

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL,

    order_id UUID,

    type notification_type NOT NULL,

    channel notification_channel NOT NULL DEFAULT 'IN_APP',

    status notification_status NOT NULL DEFAULT 'PENDING',

    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,

    sent_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_notifications_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_notifications_order
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE RESTRICT
);

CREATE INDEX idx_notifications_user_id
    ON notifications(user_id);

CREATE INDEX idx_notifications_order_id
    ON notifications(order_id);

CREATE INDEX idx_notifications_type
    ON notifications(type);

CREATE INDEX idx_notifications_status
    ON notifications(status);

CREATE INDEX idx_notifications_channel
    ON notifications(channel);

CREATE INDEX idx_notifications_created_at
    ON notifications(created_at);