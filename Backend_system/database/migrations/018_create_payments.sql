CREATE TYPE payment_status AS ENUM (
    'PENDING',
    'AUTHORIZED',
    'HELD',
    'RELEASED',
    'FAILED',
    'UNKNOWN',
    'REFUNDED',
    'REFUND_PENDING'
);

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    order_id UUID NOT NULL UNIQUE,

    status payment_status NOT NULL DEFAULT 'PENDING',

    amount BIGINT NOT NULL,
    currency CHAR(3) NOT NULL DEFAULT 'NGN',

    provider VARCHAR(50),
    provider_reference VARCHAR(255),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_payments_order
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_payments_amount
        CHECK (amount >= 0),

    CONSTRAINT uq_payments_provider_reference
        UNIQUE (provider_reference)
);

CREATE INDEX idx_payments_order_id
    ON payments(order_id);

CREATE INDEX idx_payments_status
    ON payments(status);

CREATE INDEX idx_payments_provider_reference
    ON payments(provider_reference);