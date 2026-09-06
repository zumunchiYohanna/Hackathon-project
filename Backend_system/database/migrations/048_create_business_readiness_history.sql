CREATE TABLE public.business_readiness_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    business_id UUID NOT NULL,

    field_name VARCHAR(100) NOT NULL,

    previous_value BOOLEAN NOT NULL,
    new_value BOOLEAN NOT NULL,

    changed_by UUID,

    reason VARCHAR(255),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_business_readiness_history_business
        FOREIGN KEY (business_id)
        REFERENCES public.businesses(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_business_readiness_history_changed_by
        FOREIGN KEY (changed_by)
        REFERENCES public.users(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_business_readiness_history_change
        CHECK (previous_value <> new_value),

    CONSTRAINT chk_business_readiness_history_field
        CHECK (
            field_name IN (
                'CATALOG_CONFIGURED',
                'INVENTORY_CONFIGURED',
                'OPERATING_HOURS_CONFIGURED'
            )
        )
);

CREATE INDEX idx_business_readiness_history_business_id
    ON public.business_readiness_history(business_id);

CREATE INDEX idx_business_readiness_history_field_name
    ON public.business_readiness_history(field_name);

CREATE INDEX idx_business_readiness_history_changed_by
    ON public.business_readiness_history(changed_by);

CREATE INDEX idx_business_readiness_history_created_at
    ON public.business_readiness_history(created_at);