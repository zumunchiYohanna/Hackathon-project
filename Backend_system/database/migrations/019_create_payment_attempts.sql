CREATE TYPE payment_attempt_status AS ENUM (
    'INITIATED',
    'PENDING',
    'SUCCESS',
    'FAILED',
    'UNKNOWN'
);

CREATE TABLE payment_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    payment_id UUID NOT NULL,

    status payment_attempt_status NOT NULL DEFAULT 'INITIATED',

    amount BIGINT NOT NULL,
    currency CHAR(3) NOT NULL DEFAULT 'NGN',

    provider VARCHAR(50),
    provider_reference VARCHAR(255),

    failure_reason VARCHAR(255),

    initiated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_payment_attempts_payment
        FOREIGN KEY (payment_id)
        REFERENCES payments(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_payment_attempts_amount
        CHECK (amount >= 0),

    CONSTRAINT uq_payment_attempts_provider_reference
        UNIQUE (provider_reference)
);

CREATE INDEX idx_payment_attempts_payment_id
    ON payment_attempts(payment_id);

CREATE INDEX idx_payment_attempts_status
    ON payment_attempts(status);

CREATE INDEX idx_payment_attempts_provider_reference
    ON payment_attempts(provider_reference);

CREATE INDEX idx_payment_attempts_initiated_at
    ON payment_attempts(initiated_at);