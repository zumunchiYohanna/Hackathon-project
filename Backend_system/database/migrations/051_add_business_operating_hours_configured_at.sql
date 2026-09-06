ALTER TABLE public.businesses
ADD COLUMN operating_hours_configured_at TIMESTAMPTZ;

ALTER TABLE public.businesses
ADD CONSTRAINT chk_businesses_operating_hours_configured_at
CHECK (
    operating_hours_configured = FALSE
    OR operating_hours_configured_at IS NOT NULL
);

CREATE INDEX idx_businesses_operating_hours_configured_at
    ON public.businesses(operating_hours_configured_at);