-- ============================================
-- Migration: 002_create_users
-- Description: Create the users table
-- ============================================

-- User roles
CREATE TYPE user_role AS ENUM (
    'CUSTOMER',
    'BUSINESS_USER',
    'RIDER',
    'ADMIN'
);

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    email VARCHAR(255) UNIQUE,
    phone_number VARCHAR(30) UNIQUE,

    password_hash TEXT NOT NULL,

    role user_role NOT NULL DEFAULT 'CUSTOMER',

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    email_verified_at TIMESTAMPTZ,
    phone_verified_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT users_contact_required
        CHECK (
            email IS NOT NULL
            OR phone_number IS NOT NULL
        )
);

-- Indexes for commonly used lookups
CREATE INDEX idx_users_role
    ON users(role);

CREATE INDEX idx_users_is_active
    ON users(is_active);