CREATE TABLE public.refund_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    refund_id UUID NOT NULL,

    previous_status public.refund_status,
    new_status public.refund_status NOT NULL,

    reason VARCHAR(255),

    changed_by UUID,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_refund_status_history_refund
        FOREIGN KEY (refund_id)
        REFERENCES public.refunds(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_refund_status_history_changed_by
        FOREIGN KEY (changed_by)
        REFERENCES public.users(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_refund_status_history_change
        CHECK (
            previous_status IS NULL
            OR previous_status <> new_status
        )
);

CREATE INDEX idx_refund_status_history_refund_id
    ON public.refund_status_history(refund_id);

CREATE INDEX idx_refund_status_history_new_status
    ON public.refund_status_history(new_status);

CREATE INDEX idx_refund_status_history_changed_by
    ON public.refund_status_history(changed_by);

CREATE INDEX idx_refund_status_history_created_at
    ON public.refund_status_history(created_at);