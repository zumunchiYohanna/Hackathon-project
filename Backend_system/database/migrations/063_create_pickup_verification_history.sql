CREATE TABLE public.pickup_verification_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    pickup_verification_id UUID NOT NULL,

    previous_status public.pickup_verification_status,
    new_status public.pickup_verification_status NOT NULL,

    rider_id UUID NOT NULL,
    business_id UUID NOT NULL,

    reason VARCHAR(255),

    changed_by UUID,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_pickup_verification_history_verification
        FOREIGN KEY (pickup_verification_id)
        REFERENCES public.pickup_verifications(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_pickup_verification_history_rider
        FOREIGN KEY (rider_id)
        REFERENCES public.riders(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_pickup_verification_history_business
        FOREIGN KEY (business_id)
        REFERENCES public.businesses(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_pickup_verification_history_changed_by
        FOREIGN KEY (changed_by)
        REFERENCES public.users(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_pickup_verification_history_change
        CHECK (
            previous_status IS NULL
            OR previous_status <> new_status
        )
);

CREATE INDEX idx_pickup_verification_history_verification_id
    ON public.pickup_verification_history(pickup_verification_id);

CREATE INDEX idx_pickup_verification_history_rider_id
    ON public.pickup_verification_history(rider_id);

CREATE INDEX idx_pickup_verification_history_business_id
    ON public.pickup_verification_history(business_id);

CREATE INDEX idx_pickup_verification_history_new_status
    ON public.pickup_verification_history(new_status);

CREATE INDEX idx_pickup_verification_history_changed_by
    ON public.pickup_verification_history(changed_by);

CREATE INDEX idx_pickup_verification_history_created_at
    ON public.pickup_verification_history(created_at);