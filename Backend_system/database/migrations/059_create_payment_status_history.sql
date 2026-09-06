CREATE TABLE public.payment_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    payment_id UUID NOT NULL,

    previous_status public.payment_status,
    new_status public.payment_status NOT NULL,

    changed_by UUID,
    reason VARCHAR(255),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_payment_status_history_payment
        FOREIGN KEY (payment_id)
        REFERENCES public.payments(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_payment_status_history_changed_by
        FOREIGN KEY (changed_by)
        REFERENCES public.users(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_payment_status_history_change
        CHECK (
            previous_status IS NULL
            OR previous_status <> new_status
        )
);

CREATE INDEX idx_payment_status_history_payment_id
    ON public.payment_status_history(payment_id);

CREATE INDEX idx_payment_status_history_new_status
    ON public.payment_status_history(new_status);

CREATE INDEX idx_payment_status_history_changed_by
    ON public.payment_status_history(changed_by);

CREATE INDEX idx_payment_status_history_created_at
    ON public.payment_status_history(created_at);