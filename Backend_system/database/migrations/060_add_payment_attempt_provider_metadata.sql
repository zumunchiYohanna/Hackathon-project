ALTER TABLE public.payment_attempts
ADD COLUMN provider VARCHAR(100);

ALTER TABLE public.payment_attempts
ADD COLUMN provider_reference VARCHAR(255);

ALTER TABLE public.payment_attempts
ADD COLUMN failure_reason TEXT;

ALTER TABLE public.payment_attempts
ADD COLUMN initiated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

ALTER TABLE public.payment_attempts
ADD COLUMN completed_at TIMESTAMPTZ;

CREATE INDEX idx_payment_attempts_provider
    ON public.payment_attempts(provider);

CREATE INDEX idx_payment_attempts_provider_reference
    ON public.payment_attempts(provider_reference);

CREATE INDEX idx_payment_attempts_initiated_at
    ON public.payment_attempts(initiated_at);

CREATE INDEX idx_payment_attempts_completed_at
    ON public.payment_attempts(completed_at);