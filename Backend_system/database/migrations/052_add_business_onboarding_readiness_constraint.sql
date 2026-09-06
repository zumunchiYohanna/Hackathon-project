ALTER TABLE public.businesses
ADD CONSTRAINT chk_businesses_onboarding_requirements
CHECK (
    onboarding_completed = FALSE
    OR (
        catalog_configured = TRUE
        AND inventory_configured = TRUE
        AND operating_hours_configured = TRUE
    )
);