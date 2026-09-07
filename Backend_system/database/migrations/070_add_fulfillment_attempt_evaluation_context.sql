ALTER TABLE public.fulfillment_attempts
ADD COLUMN evaluated_distance_meters NUMERIC(12,2);

ALTER TABLE public.fulfillment_attempts
ADD COLUMN evaluation_radius_meters NUMERIC(12,2);

ALTER TABLE public.fulfillment_attempts
ADD CONSTRAINT chk_fulfillment_attempts_evaluated_distance
CHECK (
    evaluated_distance_meters IS NULL
    OR evaluated_distance_meters >= 0
);

ALTER TABLE public.fulfillment_attempts
ADD CONSTRAINT chk_fulfillment_attempts_evaluation_radius
CHECK (
    evaluation_radius_meters IS NULL
    OR evaluation_radius_meters > 0
);

CREATE INDEX idx_fulfillment_attempts_evaluated_distance
    ON public.fulfillment_attempts(evaluated_distance_meters);