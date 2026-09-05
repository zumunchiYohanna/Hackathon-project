CREATE TYPE inventory_reservation_status AS ENUM (
    'ACTIVE',
    'RELEASED',
    'COMMITTED',
    'EXPIRED'
);

CREATE TABLE inventory_reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    inventory_id UUID NOT NULL,
    order_id UUID,

    quantity INTEGER NOT NULL,

    status inventory_reservation_status NOT NULL DEFAULT 'ACTIVE',

    expires_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_inventory_reservations_inventory
        FOREIGN KEY (inventory_id)
        REFERENCES inventory(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_inventory_reservations_quantity
        CHECK (quantity > 0)
);

CREATE INDEX idx_inventory_reservations_inventory_id
    ON inventory_reservations(inventory_id);

CREATE INDEX idx_inventory_reservations_order_id
    ON inventory_reservations(order_id);

CREATE INDEX idx_inventory_reservations_status
    ON inventory_reservations(status);

CREATE INDEX idx_inventory_reservations_expires_at
    ON inventory_reservations(expires_at);