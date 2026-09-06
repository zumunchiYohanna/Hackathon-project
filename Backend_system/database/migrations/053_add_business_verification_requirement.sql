ALTER TABLE public.businesses
ADD COLUMN verification_required BOOLEAN NOT NULL DEFAULT TRUE;

CREATE INDEX idx_businesses_verification_required
    ON public.businesses(verification_required);