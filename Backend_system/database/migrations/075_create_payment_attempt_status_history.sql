CREATE TABLE public.payment_attempt_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    payment_attempt_id UUID NOT NULL,

    previous_status public.payment_attempt_status,
    new_status public.payment_attempt_status NOT NULL,

    reason VARCHAR(255),

    changed_by UUID,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_payment_attempt_status_history_attempt
        FOREIGN KEY (payment_attempt_id)
        REFERENCES public.payment_attempts(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_payment_attempt_status_history_changed_by
        FOREIGN KEY (changed_by)
        REFERENCES public.users(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_payment_attempt_status_history_change
        CHECK (
            previous_status IS NULL
            OR previous_status <> new_status
        )
);

CREATE INDEX idx_payment_attempt_status_history_attempt_id
    ON public.payment_attempt_status_history(payment_attempt_id);

CREATE INDEX idx_payment_attempt_status_history_new_status
    ON public.payment_attempt_status_history(new_status);

CREATE INDEX idx_payment_attempt_status_history_changed_by
    ON public.payment_attempt_status_history(changed_by);

CREATE INDEX idx_payment_attempt_status_history_created_at
    ON public.payment_attempt_status_history(created_at);