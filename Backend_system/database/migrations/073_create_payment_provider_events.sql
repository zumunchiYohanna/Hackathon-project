CREATE TYPE public.payment_provider_event_status AS ENUM (
    'RECEIVED',
    'PROCESSING',
    'PROCESSED',
    'FAILED',
    'IGNORED'
);

CREATE TABLE public.payment_provider_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    provider VARCHAR(100) NOT NULL,

    provider_event_id VARCHAR(255) NOT NULL,

    event_type VARCHAR(100) NOT NULL,

    payment_attempt_id UUID,

    payload JSONB NOT NULL,

    status public.payment_provider_event_status NOT NULL DEFAULT 'RECEIVED',

    processing_attempts INTEGER NOT NULL DEFAULT 0,

    received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    processed_at TIMESTAMPTZ,

    last_error TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_payment_provider_events_provider_event
        UNIQUE (provider, provider_event_id),

    CONSTRAINT fk_payment_provider_events_payment_attempt
        FOREIGN KEY (payment_attempt_id)
        REFERENCES public.payment_attempts(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_payment_provider_events_attempts
        CHECK (processing_attempts >= 0),

    CONSTRAINT chk_payment_provider_events_processed_at
        CHECK (
            status <> 'PROCESSED'
            OR processed_at IS NOT NULL
        )
);

CREATE INDEX idx_payment_provider_events_provider
    ON public.payment_provider_events(provider);

CREATE INDEX idx_payment_provider_events_provider_event_id
    ON public.payment_provider_events(provider_event_id);

CREATE INDEX idx_payment_provider_events_payment_attempt_id
    ON public.payment_provider_events(payment_attempt_id);

CREATE INDEX idx_payment_provider_events_status
    ON public.payment_provider_events(status);

CREATE INDEX idx_payment_provider_events_received_at
    ON public.payment_provider_events(received_at);

CREATE INDEX idx_payment_provider_events_payload
    ON public.payment_provider_events
    USING GIN (payload);