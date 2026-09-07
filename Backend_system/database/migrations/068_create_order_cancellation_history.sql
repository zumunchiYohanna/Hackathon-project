CREATE TABLE public.order_cancellation_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    order_id UUID NOT NULL,

    cancellation_reason VARCHAR(50) NOT NULL,
    cancelled_by VARCHAR(20) NOT NULL,

    cancelled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    notes TEXT,

    CONSTRAINT fk_order_cancellation_history_order
        FOREIGN KEY (order_id)
        REFERENCES public.orders(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_order_cancellation_history_reason
        CHECK (
            cancellation_reason IN (
                'OUT_OF_STOCK',
                'BUSINESS_UNAVAILABLE',
                'OPERATIONAL_ISSUE',
                'CUSTOMER_REQUEST',
                'SYSTEM_ERROR',
                'OTHER'
            )
        ),

    CONSTRAINT chk_order_cancellation_history_actor
        CHECK (
            cancelled_by IN (
                'BUSINESS',
                'CUSTOMER',
                'ADMIN',
                'SYSTEM'
            )
        )
);

CREATE INDEX idx_order_cancellation_history_order_id
    ON public.order_cancellation_history(order_id);

CREATE INDEX idx_order_cancellation_history_reason
    ON public.order_cancellation_history(cancellation_reason);

CREATE INDEX idx_order_cancellation_history_cancelled_by
    ON public.order_cancellation_history(cancelled_by);

CREATE INDEX idx_order_cancellation_history_cancelled_at
    ON public.order_cancellation_history(cancelled_at);