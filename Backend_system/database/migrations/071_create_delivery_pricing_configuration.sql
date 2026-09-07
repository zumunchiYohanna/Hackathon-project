CREATE TABLE public.delivery_pricing_configuration (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    currency CHAR(3) NOT NULL DEFAULT 'NGN',

    base_fee_amount BIGINT NOT NULL DEFAULT 0,

    distance_rate_per_km_amount BIGINT NOT NULL DEFAULT 0,

    small_size_fee_amount BIGINT NOT NULL DEFAULT 0,
    medium_size_fee_amount BIGINT NOT NULL DEFAULT 0,
    large_size_fee_amount BIGINT NOT NULL DEFAULT 0,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    effective_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    effective_until TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_delivery_pricing_currency
        CHECK (currency ~ '^[A-Z]{3}$'),

    CONSTRAINT chk_delivery_pricing_base_fee
        CHECK (base_fee_amount >= 0),

    CONSTRAINT chk_delivery_pricing_distance_rate
        CHECK (distance_rate_per_km_amount >= 0),

    CONSTRAINT chk_delivery_pricing_small_fee
        CHECK (small_size_fee_amount >= 0),

    CONSTRAINT chk_delivery_pricing_medium_fee
        CHECK (medium_size_fee_amount >= 0),

    CONSTRAINT chk_delivery_pricing_large_fee
        CHECK (large_size_fee_amount >= 0),

    CONSTRAINT chk_delivery_pricing_effective_period
        CHECK (
            effective_until IS NULL
            OR effective_until > effective_from
        )
);

CREATE INDEX idx_delivery_pricing_configuration_active
    ON public.delivery_pricing_configuration(is_active);

CREATE INDEX idx_delivery_pricing_configuration_effective_from
    ON public.delivery_pricing_configuration(effective_from);

CREATE INDEX idx_delivery_pricing_configuration_effective_until
    ON public.delivery_pricing_configuration(effective_until);