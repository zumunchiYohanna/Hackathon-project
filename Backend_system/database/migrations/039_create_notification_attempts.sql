CREATE TYPE public.notification_attempt_status AS ENUM (
    'PENDING',
    'SENT',
    'FAILED',
    'UNKNOWN'
);

CREATE TABLE public.notification_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    notification_id UUID NOT NULL,

    attempt_number INTEGER NOT NULL,

    status public.notification_attempt_status NOT NULL DEFAULT 'PENDING',

    provider VARCHAR(100),

    provider_reference VARCHAR(255),

    failure_reason TEXT,

    attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    completed_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_notification_attempts_notification
        FOREIGN KEY (notification_id)
        REFERENCES public.notifications(id)
        ON DELETE RESTRICT,

    CONSTRAINT uq_notification_attempt_number
        UNIQUE (notification_id, attempt_number),

    CONSTRAINT chk_notification_attempts_number
        CHECK (attempt_number > 0),

    CONSTRAINT chk_notification_attempts_completed_at
        CHECK (
            status IN ('PENDING', 'UNKNOWN')
            OR completed_at IS NOT NULL
        )
);

CREATE INDEX idx_notification_attempts_notification_id
    ON public.notification_attempts(notification_id);

CREATE INDEX idx_notification_attempts_status
    ON public.notification_attempts(status);

CREATE INDEX idx_notification_attempts_provider_reference
    ON public.notification_attempts(provider_reference);

CREATE INDEX idx_notification_attempts_attempted_at
    ON public.notification_attempts(attempted_at);