ALTER TABLE public.delivery_otps
ADD COLUMN last_attempt_at TIMESTAMPTZ;

ALTER TABLE public.delivery_otps
ADD COLUMN locked_at TIMESTAMPTZ;

ALTER TABLE public.delivery_otps
ADD CONSTRAINT chk_delivery_otps_locked_state
CHECK (
    locked_at IS NULL
    OR attempt_count > 0
);

CREATE INDEX idx_delivery_otps_last_attempt_at
    ON public.delivery_otps(last_attempt_at);

CREATE INDEX idx_delivery_otps_locked_at
    ON public.delivery_otps(locked_at);