ALTER TABLE public.businesses
ADD COLUMN onboarding_completed_at TIMESTAMPTZ;

ALTER TABLE public.businesses
ADD COLUMN onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX idx_businesses_onboarding_completed
    ON public.businesses(onboarding_completed);

CREATE INDEX idx_businesses_onboarding_completed_at
    ON public.businesses(onboarding_completed_at);

ALTER TABLE public.businesses
ADD CONSTRAINT chk_businesses_onboarding_completed_at
CHECK (
    onboarding_completed = FALSE
    OR onboarding_completed_at IS NOT NULL
);