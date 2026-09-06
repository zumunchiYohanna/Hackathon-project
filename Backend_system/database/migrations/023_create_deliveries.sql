CREATE TYPE delivery_status AS ENUM (
    'PENDING',
    'SEARCHING_RIDER',
    'ASSIGNED',
    'RIDER_AT_PICKUP',
    'PICKED_UP',
    'IN_TRANSIT',
    'DELIVERED',
    'FAILED',
    'EXCEPTION',
    'CANCELLED'
);

CREATE TABLE deliveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    order_id UUID NOT NULL UNIQUE,

    rider_id UUID,
    vehicle_id UUID,

    status delivery_status NOT NULL DEFAULT 'PENDING',

    delivery_size VARCHAR(20) NOT NULL DEFAULT 'SMALL',

    pickup_location GEOGRAPHY(POINT, 4326),
    delivery_location GEOGRAPHY(POINT, 4326),

    assigned_at TIMESTAMPTZ,
    picked_up_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_deliveries_order
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_deliveries_rider
        FOREIGN KEY (rider_id)
        REFERENCES riders(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_deliveries_vehicle
        FOREIGN KEY (vehicle_id)
        REFERENCES vehicles(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_deliveries_size
        CHECK (
            delivery_size IN ('SMALL', 'MEDIUM', 'LARGE')
        )
);

CREATE INDEX idx_deliveries_order_id
    ON deliveries(order_id);

CREATE INDEX idx_deliveries_rider_id
    ON deliveries(rider_id);

CREATE INDEX idx_deliveries_vehicle_id
    ON deliveries(vehicle_id);

CREATE INDEX idx_deliveries_status
    ON deliveries(status);

CREATE INDEX idx_deliveries_pickup_location
    ON deliveries
    USING GIST (pickup_location);

CREATE INDEX idx_deliveries_delivery_location
    ON deliveries
    USING GIST (delivery_location);