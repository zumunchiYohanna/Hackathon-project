CREATE TABLE public.business_operating_exceptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    business_id UUID NOT NULL,

    exception_date DATE NOT NULL,

    is_closed BOOLEAN NOT NULL DEFAULT TRUE,

    opens_at TIME,

    closes_at TIME,

    reason VARCHAR(255),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_business_operating_exceptions_business
        FOREIGN KEY (business_id)
        REFERENCES public.businesses(id)
        ON DELETE RESTRICT,

    CONSTRAINT uq_business_operating_exceptions_date
        UNIQUE (business_id, exception_date),

    CONSTRAINT chk_business_operating_exceptions_times
        CHECK (
            is_closed = TRUE
            OR (
                opens_at IS NOT NULL
                AND closes_at IS NOT NULL
                AND opens_at <> closes_at
            )
        )
);

CREATE INDEX idx_business_operating_exceptions_business_id
    ON public.business_operating_exceptions(business_id);

CREATE INDEX idx_business_operating_exceptions_date
    ON public.business_operating_exceptions(exception_date);