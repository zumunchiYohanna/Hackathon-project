CREATE TYPE public.pickup_verification_status AS ENUM (
    'ACTIVE',
    'VERIFIED',
    'EXPIRED',
    'INVALIDATED'
);

CREATE TABLE public.pickup_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    delivery_id UUID NOT NULL UNIQUE,

    rider_id UUID NOT NULL,

    business_id UUID NOT NULL,

    credential_hash TEXT NOT NULL,

    status public.pickup_verification_status NOT NULL DEFAULT 'ACTIVE',

    expires_at TIMESTAMPTZ NOT NULL,

    verified_at TIMESTAMPTZ,

    attempt_count INTEGER NOT NULL DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_pickup_verifications_delivery
        FOREIGN KEY (delivery_id)
        REFERENCES public.deliveries(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_pickup_verifications_rider
        FOREIGN KEY (rider_id)
        REFERENCES public.riders(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_pickup_verifications_business
        FOREIGN KEY (business_id)
        REFERENCES public.businesses(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_pickup_verifications_attempt_count
        CHECK (attempt_count >= 0)
);

CREATE INDEX idx_pickup_verifications_delivery_id
    ON public.pickup_verifications(delivery_id);

CREATE INDEX idx_pickup_verifications_rider_id
    ON public.pickup_verifications(rider_id);

CREATE INDEX idx_pickup_verifications_business_id
    ON public.pickup_verifications(business_id);

CREATE INDEX idx_pickup_verifications_status
    ON public.pickup_verifications(status);

CREATE INDEX idx_pickup_verifications_expires_at
    ON public.pickup_verifications(expires_at);