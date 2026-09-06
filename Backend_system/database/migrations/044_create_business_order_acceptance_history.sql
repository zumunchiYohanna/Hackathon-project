CREATE TABLE public.business_order_acceptance_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    business_id UUID NOT NULL,

    previous_value BOOLEAN,
    new_value BOOLEAN NOT NULL,

    changed_by UUID,

    reason VARCHAR(255),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_business_order_acceptance_history_business
        FOREIGN KEY (business_id)
        REFERENCES public.businesses(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_business_order_acceptance_history_changed_by
        FOREIGN KEY (changed_by)
        REFERENCES public.users(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_business_order_acceptance_history_change
        CHECK (
            previous_value IS NULL
            OR previous_value <> new_value
        )
);

CREATE INDEX idx_business_order_acceptance_history_business_id
    ON public.business_order_acceptance_history(business_id);

CREATE INDEX idx_business_order_acceptance_history_changed_by
    ON public.business_order_acceptance_history(changed_by);

CREATE INDEX idx_business_order_acceptance_history_created_at
    ON public.business_order_acceptance_history(created_at);