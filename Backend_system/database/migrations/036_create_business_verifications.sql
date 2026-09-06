CREATE TYPE public.business_verification_status AS ENUM (
    'PENDING',
    'VERIFIED',
    'REJECTED',
    'SUSPENDED'
);

CREATE TABLE public.business_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    business_id UUID NOT NULL UNIQUE,

    status public.business_verification_status NOT NULL DEFAULT 'PENDING',

    verified_by UUID,

    verification_notes TEXT,

    verified_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_business_verifications_business
        FOREIGN KEY (business_id)
        REFERENCES public.businesses(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_business_verifications_verified_by
        FOREIGN KEY (verified_by)
        REFERENCES public.users(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_business_verifications_verified
        CHECK (
            status <> 'VERIFIED'
            OR verified_at IS NOT NULL
        )
);

CREATE INDEX idx_business_verifications_status
    ON public.business_verifications(status);

CREATE INDEX idx_business_verifications_verified_by
    ON public.business_verifications(verified_by);

CREATE INDEX idx_business_verifications_verified_at
    ON public.business_verifications(verified_at);