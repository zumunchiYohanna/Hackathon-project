CREATE TYPE vehicle_type_code AS ENUM (
    'MOTORCYCLE',
    'KEKE'
);

CREATE TABLE vehicle_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    code vehicle_type_code NOT NULL UNIQUE,

    name VARCHAR(100) NOT NULL,

    description TEXT,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_vehicle_types_active
    ON vehicle_types(is_active);