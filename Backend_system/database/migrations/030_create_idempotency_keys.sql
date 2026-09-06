CREATE TABLE public.idempotency_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL,

    idempotency_key VARCHAR(255) NOT NULL,

    endpoint VARCHAR(255) NOT NULL,

    request_hash TEXT NOT NULL,

    response_status INTEGER,

    response_body JSONB,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    expires_at TIMESTAMPTZ NOT NULL,

    CONSTRAINT fk_idempotency_keys_user
        FOREIGN KEY (user_id)
        REFERENCES public.users(id)
        ON DELETE RESTRICT,

    CONSTRAINT uq_idempotency_keys_user_key
        UNIQUE (user_id, idempotency_key),

    CONSTRAINT chk_idempotency_keys_status
        CHECK (
            response_status IS NULL
            OR (response_status >= 100 AND response_status <= 599)
        ),

    CONSTRAINT chk_idempotency_keys_expiry
        CHECK (expires_at > created_at)
);

CREATE INDEX idx_idempotency_keys_user_id
    ON public.idempotency_keys(user_id);

CREATE INDEX idx_idempotency_keys_expires_at
    ON public.idempotency_keys(expires_at);

CREATE INDEX idx_idempotency_keys_endpoint
    ON public.idempotency_keys(endpoint);