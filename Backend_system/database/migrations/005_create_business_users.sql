-- ============================================
-- Migration: 005_create_business_users
-- Description: Link users to businesses they manage
-- ============================================

CREATE TYPE business_user_role AS ENUM (
    'OWNER',
    'MANAGER',
    'STAFF'
);

CREATE TABLE business_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    business_id UUID NOT NULL,
    user_id UUID NOT NULL,

    business_role business_user_role NOT NULL DEFAULT 'STAFF',

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_business_users_business
        FOREIGN KEY (business_id)
        REFERENCES businesses(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_business_users_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE RESTRICT,

    CONSTRAINT uq_business_users_membership
        UNIQUE (business_id, user_id)
);

CREATE INDEX idx_business_users_business_id
    ON business_users(business_id);

CREATE INDEX idx_business_users_user_id
    ON business_users(user_id);

CREATE INDEX idx_business_users_active
    ON business_users(is_active);