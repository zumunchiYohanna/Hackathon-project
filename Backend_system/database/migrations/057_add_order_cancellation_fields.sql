ALTER TABLE public.orders
ADD COLUMN cancellation_reason VARCHAR(50);

ALTER TABLE public.orders
ADD COLUMN cancelled_by VARCHAR(20);

ALTER TABLE public.orders
ADD COLUMN cancelled_at TIMESTAMPTZ;

ALTER TABLE public.orders
ADD CONSTRAINT chk_orders_cancellation_reason
CHECK (
    cancellation_reason IS NULL
    OR cancellation_reason IN (
        'OUT_OF_STOCK',
        'BUSINESS_UNAVAILABLE',
        'OPERATIONAL_ISSUE',
        'CUSTOMER_REQUEST',
        'SYSTEM_ERROR',
        'OTHER'
    )
);

ALTER TABLE public.orders
ADD CONSTRAINT chk_orders_cancelled_by
CHECK (
    cancelled_by IS NULL
    OR cancelled_by IN (
        'BUSINESS',
        'CUSTOMER',
        'ADMIN',
        'SYSTEM'
    )
);

ALTER TABLE public.orders
ADD CONSTRAINT chk_orders_cancellation_fields
CHECK (
    (
        cancellation_reason IS NULL
        AND cancelled_by IS NULL
        AND cancelled_at IS NULL
    )
    OR
    (
        cancellation_reason IS NOT NULL
        AND cancelled_by IS NOT NULL
        AND cancelled_at IS NOT NULL
    )
);

CREATE INDEX idx_orders_cancelled_at
    ON public.orders(cancelled_at);

CREATE INDEX idx_orders_cancellation_reason
    ON public.orders(cancellation_reason);

CREATE INDEX idx_orders_cancelled_by
    ON public.orders(cancelled_by);