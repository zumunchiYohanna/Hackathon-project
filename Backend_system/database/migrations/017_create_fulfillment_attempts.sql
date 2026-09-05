CREATE TYPE fulfillment_attempt_status AS ENUM (
    'EVALUATING',
    'QUALIFIED',
    'REJECTED',
    'RESERVED',
    'FAILED'
);

CREATE TABLE fulfillment_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    fulfillment_id UUID NOT NULL,
    business_id UUID NOT NULL,

    status fulfillment_attempt_status NOT NULL DEFAULT 'EVALUATING',

    rejection_reason VARCHAR(100),

    distance_meters INTEGER,

    evaluated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_fulfillment_attempts_fulfillment
        FOREIGN KEY (fulfillment_id)
        REFERENCES fulfillments(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_fulfillment_attempts_business
        FOREIGN KEY (business_id)
        REFERENCES businesses(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_fulfillment_attempts_distance
        CHECK (distance_meters IS NULL OR distance_meters >= 0)
);

CREATE INDEX idx_fulfillment_attempts_fulfillment_id
    ON fulfillment_attempts(fulfillment_id);

CREATE INDEX idx_fulfillment_attempts_business_id
    ON fulfillment_attempts(business_id);

CREATE INDEX idx_fulfillment_attempts_status
    ON fulfillment_attempts(status);

CREATE INDEX idx_fulfillment_attempts_evaluated_at
    ON fulfillment_attempts(evaluated_at);