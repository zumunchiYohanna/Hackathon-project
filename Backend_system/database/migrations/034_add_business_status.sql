CREATE TYPE public.business_status AS ENUM (
    'ACTIVE',
    'TEMPORARILY_UNAVAILABLE',
    'SUSPENDED',
    'INACTIVE'
);

ALTER TABLE public.businesses
ADD COLUMN status public.business_status NOT NULL DEFAULT 'ACTIVE';

CREATE INDEX idx_businesses_status
    ON public.businesses(status);