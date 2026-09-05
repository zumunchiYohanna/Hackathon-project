CREATE TYPE order_status AS ENUM (
    'PENDING',
    'CONFIRMED',
    'PREPARING',
    'READY_FOR_PICKUP',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'CANCELLED'
);

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL,

    status order_status NOT NULL DEFAULT 'PENDING',

    delivery_address_line VARCHAR(255) NOT NULL,
    delivery_city VARCHAR(100) NOT NULL,
    delivery_state VARCHAR(100) NOT NULL,

    delivery_location GEOGRAPHY(POINT, 4326) NOT NULL,

    subtotal_amount BIGINT NOT NULL DEFAULT 0,
    delivery_fee_amount BIGINT NOT NULL DEFAULT 0,
    total_amount BIGINT NOT NULL DEFAULT 0,

    currency CHAR(3) NOT NULL DEFAULT 'NGN',

    cancellation_reason VARCHAR(100),
    cancelled_by VARCHAR(30),
    cancelled_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_orders_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_orders_subtotal
        CHECK (subtotal_amount >= 0),

    CONSTRAINT chk_orders_delivery_fee
        CHECK (delivery_fee_amount >= 0),

    CONSTRAINT chk_orders_total
        CHECK (total_amount >= 0)
);

CREATE INDEX idx_orders_user_id
    ON orders(user_id);

CREATE INDEX idx_orders_status
    ON orders(status);

CREATE INDEX idx_orders_created_at
    ON orders(created_at);

CREATE INDEX idx_orders_delivery_location
    ON orders
    USING GIST (delivery_location);