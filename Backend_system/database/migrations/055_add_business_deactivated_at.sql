ALTER TABLE public.businesses
ADD COLUMN deactivated_at TIMESTAMPTZ;

CREATE INDEX idx_businesses_deactivated_at
    ON public.businesses(deactivated_at);