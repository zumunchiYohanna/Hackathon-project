CREATE TYPE fulfillment_status AS ENUM (
    'SEARCHING',
    'VERIFYING',
    'CONFIRMED',
    'FAILED',
    'REASSIGNING'
);

CREATE TABLE fulfillments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    order_id UUID NOT NULL UNIQUE,

    business_id UUID,

    status fulfillment_status NOT NULL DEFAULT 'SEARCHING',

    confirmed_at TIMESTAMPTZ,
    failed_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_fulfillments_order
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_fulfillments_business
        FOREIGN KEY (business_id)
        REFERENCES businesses(id)
        ON DELETE RESTRICT
);

CREATE INDEX idx_fulfillments_business_id
    ON fulfillments(business_id);

CREATE INDEX idx_fulfillments_status
    ON fulfillments(status);