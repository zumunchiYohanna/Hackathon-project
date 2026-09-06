CREATE TABLE public.delivery_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    delivery_id UUID NOT NULL,

    previous_status public.delivery_status,

    new_status public.delivery_status NOT NULL,

    changed_by UUID,

    reason VARCHAR(255),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_delivery_status_history_delivery
        FOREIGN KEY (delivery_id)
        REFERENCES public.deliveries(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_delivery_status_history_changed_by
        FOREIGN KEY (changed_by)
        REFERENCES public.users(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_delivery_status_history_change
        CHECK (
            previous_status IS NULL
            OR previous_status <> new_status
        )
);

CREATE INDEX idx_delivery_status_history_delivery_id
    ON public.delivery_status_history(delivery_id);

CREATE INDEX idx_delivery_status_history_new_status
    ON public.delivery_status_history(new_status);

CREATE INDEX idx_delivery_status_history_changed_by
    ON public.delivery_status_history(changed_by);

CREATE INDEX idx_delivery_status_history_created_at
    ON public.delivery_status_history(created_at);