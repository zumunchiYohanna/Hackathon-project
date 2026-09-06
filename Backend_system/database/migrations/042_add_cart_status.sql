CREATE TYPE public.cart_status AS ENUM (
    'ACTIVE',
    'CHECKED_OUT',
    'ABANDONED'
);

ALTER TABLE public.carts
ADD COLUMN status public.cart_status NOT NULL DEFAULT 'ACTIVE';

ALTER TABLE public.carts
ADD COLUMN checked_out_at TIMESTAMPTZ;

ALTER TABLE public.carts
ADD COLUMN abandoned_at TIMESTAMPTZ;

CREATE INDEX idx_carts_status
    ON public.carts(status);

CREATE INDEX idx_carts_status_updated_at
    ON public.carts(status, updated_at);

ALTER TABLE public.carts
ADD CONSTRAINT chk_carts_checked_out_at
CHECK (
    status <> 'CHECKED_OUT'
    OR checked_out_at IS NOT NULL
);

ALTER TABLE public.carts
ADD CONSTRAINT chk_carts_abandoned_at
CHECK (
    status <> 'ABANDONED'
    OR abandoned_at IS NOT NULL
);