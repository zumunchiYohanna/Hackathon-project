ALTER TABLE public.businesses
ADD COLUMN catalog_configured BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE public.businesses
ADD COLUMN inventory_configured BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE public.businesses
ADD COLUMN operating_hours_configured BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX idx_businesses_catalog_configured
    ON public.businesses(catalog_configured);

CREATE INDEX idx_businesses_inventory_configured
    ON public.businesses(inventory_configured);

CREATE INDEX idx_businesses_operating_hours_configured
    ON public.businesses(operating_hours_configured);