ALTER TABLE public.businesses
ADD COLUMN catalog_configured_at TIMESTAMPTZ;

ALTER TABLE public.businesses
ADD CONSTRAINT chk_businesses_catalog_configured_at
CHECK (
    catalog_configured = FALSE
    OR catalog_configured_at IS NOT NULL
);

CREATE INDEX idx_businesses_catalog_configured_at
    ON public.businesses(catalog_configured_at);