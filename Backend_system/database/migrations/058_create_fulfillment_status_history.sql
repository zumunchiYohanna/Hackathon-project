CREATE TABLE public.fulfillment_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    fulfillment_id UUID NOT NULL,

    previous_status public.fulfillment_status,
    new_status public.fulfillment_status NOT NULL,

    changed_by UUID,
    reason VARCHAR(255),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_fulfillment_status_history_fulfillment
        FOREIGN KEY (fulfillment_id)
        REFERENCES public.fulfillments(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_fulfillment_status_history_changed_by
        FOREIGN KEY (changed_by)
        REFERENCES public.users(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_fulfillment_status_history_change
        CHECK (
            previous_status IS NULL
            OR previous_status <> new_status
        )
);

CREATE INDEX idx_fulfillment_status_history_fulfillment_id
    ON public.fulfillment_status_history(fulfillment_id);

CREATE INDEX idx_fulfillment_status_history_new_status
    ON public.fulfillment_status_history(new_status);

CREATE INDEX idx_fulfillment_status_history_changed_by
    ON public.fulfillment_status_history(changed_by);

CREATE INDEX idx_fulfillment_status_history_created_at
    ON public.fulfillment_status_history(created_at);