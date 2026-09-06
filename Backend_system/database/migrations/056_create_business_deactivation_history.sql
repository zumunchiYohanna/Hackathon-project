CREATE TABLE public.business_deactivation_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    business_id UUID NOT NULL,

    action VARCHAR(20) NOT NULL,

    reason VARCHAR(255),

    changed_by UUID,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_business_deactivation_history_business
        FOREIGN KEY (business_id)
        REFERENCES public.businesses(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_business_deactivation_history_changed_by
        FOREIGN KEY (changed_by)
        REFERENCES public.users(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_business_deactivation_history_action
        CHECK (
            action IN ('DEACTIVATED', 'REACTIVATED')
        )
);

CREATE INDEX idx_business_deactivation_history_business_id
    ON public.business_deactivation_history(business_id);

CREATE INDEX idx_business_deactivation_history_action
    ON public.business_deactivation_history(action);

CREATE INDEX idx_business_deactivation_history_changed_by
    ON public.business_deactivation_history(changed_by);

CREATE INDEX idx_business_deactivation_history_created_at
    ON public.business_deactivation_history(created_at);