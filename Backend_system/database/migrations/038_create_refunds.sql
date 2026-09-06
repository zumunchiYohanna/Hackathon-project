CREATE TYPE public.refund_status AS ENUM (
    'PENDING',
    'PROCESSING',
    'SUCCESS',
    'FAILED',
    'UNKNOWN'
);

CREATE TABLE public.refunds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    payment_id UUID NOT NULL,

    amount BIGINT NOT NULL,

    currency CHAR(3) NOT NULL DEFAULT 'NGN',

    status public.refund_status NOT NULL DEFAULT 'PENDING',

    provider_reference VARCHAR(255),

    reason VARCHAR(255) NOT NULL,

    idempotency_key VARCHAR(255) NOT NULL,

    failure_reason TEXT,

    requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    processed_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_refunds_payment
        FOREIGN KEY (payment_id)
        REFERENCES public.payments(id)
        ON DELETE RESTRICT,

    CONSTRAINT uq_refunds_idempotency_key
        UNIQUE (idempotency_key),

    CONSTRAINT chk_refunds_amount
        CHECK (amount > 0),

    CONSTRAINT chk_refunds_currency
        CHECK (currency ~ '^[A-Z]{3}$'),

    CONSTRAINT chk_refunds_processed_at
        CHECK (
            status NOT IN ('SUCCESS', 'FAILED')
            OR processed_at IS NOT NULL
        )
);

CREATE INDEX idx_refunds_payment_id
    ON public.refunds(payment_id);

CREATE INDEX idx_refunds_status
    ON public.refunds(status);

CREATE INDEX idx_refunds_provider_reference
    ON public.refunds(provider_reference);

CREATE INDEX idx_refunds_requested_at
    ON public.refunds(requested_at);

CREATE INDEX idx_refunds_processed_at
    ON public.refunds(processed_at);