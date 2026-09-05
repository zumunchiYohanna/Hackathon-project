CREATE TABLE riders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL UNIQUE,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_available BOOLEAN NOT NULL DEFAULT FALSE,

    current_location GEOGRAPHY(POINT, 4326),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_riders_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE RESTRICT
);

CREATE INDEX idx_riders_user_id
    ON riders(user_id);

CREATE INDEX idx_riders_active
    ON riders(is_active);

CREATE INDEX idx_riders_available
    ON riders(is_available);

CREATE INDEX idx_riders_current_location
    ON riders
    USING GIST (current_location);