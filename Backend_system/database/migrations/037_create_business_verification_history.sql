CREATE TABLE public.business_verification_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    business_id UUID NOT NULL,

    previous_status public.business_verification_status,

    new_status public.business_verification_status NOT NULL,

    reason VARCHAR(255),

    changed_by UUID,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_business_verification_history_business
        FOREIGN KEY (business_id)
        REFERENCES public.businesses(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_business_verification_history_changed_by
        FOREIGN KEY (changed_by)
        REFERENCES public.users(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_business_verification_history_status_change
        CHECK (
            previous_status IS NULL
            OR previous_status <> new_status
        )
);

CREATE INDEX idx_business_verification_history_business_id
    ON public.business_verification_history(business_id);

CREATE INDEX idx_business_verification_history_new_status
    ON public.business_verification_history(new_status);

CREATE INDEX idx_business_verification_history_changed_by
    ON public.business_verification_history(changed_by);

CREATE INDEX idx_business_verification_history_created_at
    ON public.business_verification_history(created_at);