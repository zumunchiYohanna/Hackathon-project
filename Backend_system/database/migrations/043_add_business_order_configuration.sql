ALTER TABLE public.businesses
ADD COLUMN minimum_order_amount BIGINT NOT NULL DEFAULT 0;

ALTER TABLE public.businesses
ADD COLUMN accepts_orders BOOLEAN NOT NULL DEFAULT TRUE;

ALTER TABLE public.businesses
ADD CONSTRAINT chk_businesses_minimum_order_amount
CHECK (minimum_order_amount >= 0);

CREATE INDEX idx_businesses_accepts_orders
    ON public.businesses(accepts_orders);

CREATE INDEX idx_businesses_status_accepts_orders
    ON public.businesses(status, accepts_orders);