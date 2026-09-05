CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    rider_id UUID NOT NULL,
    vehicle_type_id UUID NOT NULL,

    registration_number VARCHAR(50),

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_vehicles_rider
        FOREIGN KEY (rider_id)
        REFERENCES riders(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_vehicles_vehicle_type
        FOREIGN KEY (vehicle_type_id)
        REFERENCES vehicle_types(id)
        ON DELETE RESTRICT,

    CONSTRAINT uq_vehicles_registration_number
        UNIQUE (registration_number)
);

CREATE INDEX idx_vehicles_rider_id
    ON vehicles(rider_id);

CREATE INDEX idx_vehicles_vehicle_type_id
    ON vehicles(vehicle_type_id);

CREATE INDEX idx_vehicles_active
    ON vehicles(is_active);