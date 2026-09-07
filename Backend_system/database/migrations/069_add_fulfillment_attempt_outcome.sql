ALTER TABLE public.fulfillment_attempts
ADD COLUMN outcome_reason VARCHAR(50);

ALTER TABLE public.fulfillment_attempts
ADD COLUMN outcome_details TEXT;

ALTER TABLE public.fulfillment_attempts
ADD COLUMN evaluated_at TIMESTAMPTZ;

ALTER TABLE public.fulfillment_attempts
ADD CONSTRAINT chk_fulfillment_attempts_outcome_reason
CHECK (
    outcome_reason IS NULL
    OR outcome_reason IN (
        'BUSINESS_UNAVAILABLE',
        'BUSINESS_CLOSED',
        'MISSING_PRODUCT',
        'INSUFFICIENT_STOCK',
        'PRODUCT_UNAVAILABLE',
        'PRICE_CHANGED',
        'RESERVATION_FAILED',
        'BUSINESS_CANCELLED',
        'SYSTEM_ERROR',
        'OTHER'
    )
);

CREATE INDEX idx_fulfillment_attempts_outcome_reason
    ON public.fulfillment_attempts(outcome_reason);

CREATE INDEX idx_fulfillment_attempts_evaluated_at
    ON public.fulfillment_attempts(evaluated_at);