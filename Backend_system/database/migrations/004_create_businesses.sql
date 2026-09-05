-- ============================================
-- Migration: 004_create_businesses
-- Description: Create registered businesses
-- ============================================

CREATE TABLE businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(255) NOT NULL,
    description TEXT,

    phone_number VARCHAR(30),
    email VARCHAR(255),

    address_line VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,

    location GEOGRAPHY(POINT, 4326) NOT NULL,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Spatial index for nearby-business searches
CREATE INDEX idx_businesses_location
    ON businesses
    USING GIST (location);

-- Indexes for common business filtering
CREATE INDEX idx_businesses_is_active
    ON businesses(is_active);

CREATE INDEX idx_businesses_is_verified
    ON businesses(is_verified);

CREATE INDEX idx_businesses_city_state
    ON businesses(city, state);