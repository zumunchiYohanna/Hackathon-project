CREATE TYPE public.outbox_event_status AS ENUM (
    'PENDING',
    'PROCESSING',
    'PROCESSED',
    'FAILED'
);

CREATE TABLE public.outbox_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    event_type VARCHAR(100) NOT NULL,

    aggregate_type VARCHAR(100) NOT NULL,

    aggregate_id UUID NOT NULL,

    payload JSONB NOT NULL,

    status public.outbox_event_status NOT NULL DEFAULT 'PENDING',

    attempt_count INTEGER NOT NULL DEFAULT 0,

    available_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    processed_at TIMESTAMPTZ,

    last_error TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_outbox_events_attempt_count
        CHECK (attempt_count >= 0)
);

CREATE INDEX idx_outbox_events_status_available
    ON public.outbox_events(status, available_at);

CREATE INDEX idx_outbox_events_aggregate
    ON public.outbox_events(aggregate_type, aggregate_id);

CREATE INDEX idx_outbox_events_event_type
    ON public.outbox_events(event_type);

CREATE INDEX idx_outbox_events_created_at
    ON public.outbox_events(created_at);