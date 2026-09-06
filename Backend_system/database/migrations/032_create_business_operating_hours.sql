CREATE TYPE public.day_of_week AS ENUM (
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY'
);

CREATE TABLE public.business_operating_hours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    business_id UUID NOT NULL,

    day_of_week public.day_of_week NOT NULL,

    opens_at TIME NOT NULL,

    closes_at TIME NOT NULL,

    is_closed BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_business_operating_hours_business
        FOREIGN KEY (business_id)
        REFERENCES public.businesses(id)
        ON DELETE RESTRICT,

    CONSTRAINT uq_business_operating_hours_day
        UNIQUE (business_id, day_of_week),

    CONSTRAINT chk_business_operating_hours_times
        CHECK (
            is_closed = TRUE
            OR opens_at <> closes_at
        ),

    CONSTRAINT chk_business_operating_hours_closed
        CHECK (
            is_closed = TRUE
            OR (
                opens_at IS NOT NULL
                AND closes_at IS NOT NULL
            )
        )
);

CREATE INDEX idx_business_operating_hours_business_id
    ON public.business_operating_hours(business_id);

CREATE INDEX idx_business_operating_hours_day
    ON public.business_operating_hours(day_of_week);