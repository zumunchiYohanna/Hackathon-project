CREATE TYPE audit_actor_type AS ENUM (
    'USER',
    'SYSTEM'
);

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    actor_type audit_actor_type NOT NULL,

    actor_user_id UUID,

    action VARCHAR(100) NOT NULL,

    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID,

    description TEXT,

    metadata JSONB,

    ip_address INET,
    user_agent TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_audit_logs_actor_user
        FOREIGN KEY (actor_user_id)
        REFERENCES users(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_audit_logs_actor
        CHECK (
            (actor_type = 'USER' AND actor_user_id IS NOT NULL)
            OR
            (actor_type = 'SYSTEM' AND actor_user_id IS NULL)
        )
);

CREATE INDEX idx_audit_logs_actor_user_id
    ON audit_logs(actor_user_id);

CREATE INDEX idx_audit_logs_action
    ON audit_logs(action);

CREATE INDEX idx_audit_logs_entity
    ON audit_logs(entity_type, entity_id);

CREATE INDEX idx_audit_logs_created_at
    ON audit_logs(created_at);

CREATE INDEX idx_audit_logs_metadata
    ON audit_logs
    USING GIN (metadata);