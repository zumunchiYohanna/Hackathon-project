CREATE TABLE public.order_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    order_id UUID NOT NULL,

    previous_status public.order_status,
    new_status public.order_status NOT NULL,

    changed_by UUID,

    reason VARCHAR(255),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_order_status_history_order
        FOREIGN KEY (order_id)
        REFERENCES public.orders(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_order_status_history_changed_by
        FOREIGN KEY (changed_by)
        REFERENCES public.users(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_order_status_history_change
        CHECK (
            previous_status IS NULL
            OR previous_status <> new_status
        )
);

CREATE INDEX idx_order_status_history_order_id
    ON public.order_status_history(order_id);

CREATE INDEX idx_order_status_history_new_status
    ON public.order_status_history(new_status);

CREATE INDEX idx_order_status_history_changed_by
    ON public.order_status_history(changed_by);

CREATE INDEX idx_order_status_history_created_at
    ON public.order_status_history(created_at);