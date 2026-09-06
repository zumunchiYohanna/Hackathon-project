ALTER TABLE public.businesses
ADD COLUMN inventory_configured_at TIMESTAMPTZ;

ALTER TABLE public.businesses
ADD CONSTRAINT chk_businesses_inventory_configured_at
CHECK (
    inventory_configured = FALSE
    OR inventory_configured_at IS NOT NULL
);

CREATE INDEX idx_businesses_inventory_configured_at
    ON public.businesses(inventory_configured_at);