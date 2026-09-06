CREATE TABLE delivery_otps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    delivery_id UUID NOT NULL UNIQUE,

    otp_hash TEXT NOT NULL,

    expires_at TIMESTAMPTZ NOT NULL,

    verified_at TIMESTAMPTZ,

    attempt_count INTEGER NOT NULL DEFAULT 0,

    is_used BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_delivery_otps_delivery
        FOREIGN KEY (delivery_id)
        REFERENCES deliveries(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_delivery_otps_attempt_count
        CHECK (attempt_count >= 0)
);

CREATE INDEX idx_delivery_otps_delivery_id
    ON delivery_otps(delivery_id);

CREATE INDEX idx_delivery_otps_expires_at
    ON delivery_otps(expires_at);

CREATE INDEX idx_delivery_otps_is_used
    ON delivery_otps(is_used);