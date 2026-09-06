CREATE TYPE public.incident_type AS ENUM (
    'BUSINESS_CANCELLED',
    'INVENTORY_FAILURE',
    'PAYMENT_FAILURE',
    'PAYMENT_UNKNOWN',
    'RIDER_UNAVAILABLE',
    'RIDER_DISAPPEARED',
    'DELIVERY_EXCEPTION',
    'REFUND_FAILURE',
    'SYSTEM_ERROR'
);

CREATE TYPE public.incident_severity AS ENUM (
    'LOW',
    'MEDIUM',
    'HIGH',
    'CRITICAL'
);

CREATE TYPE public.incident_status AS ENUM (
    'OPEN',
    'INVESTIGATING',
    'RESOLVED',
    'ESCALATED'
);

CREATE TABLE public.incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    order_id UUID NOT NULL,

    type public.incident_type NOT NULL,

    severity public.incident_severity NOT NULL DEFAULT 'MEDIUM',

    status public.incident_status NOT NULL DEFAULT 'OPEN',

    description TEXT NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    resolved_at TIMESTAMPTZ,

    resolved_by UUID,

    CONSTRAINT fk_incidents_order
        FOREIGN KEY (order_id)
        REFERENCES public.orders(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_incidents_resolved_by
        FOREIGN KEY (resolved_by)
        REFERENCES public.users(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_incidents_resolution
        CHECK (
            (status = 'RESOLVED' AND resolved_at IS NOT NULL)
            OR
            (status <> 'RESOLVED')
        )
);

CREATE INDEX idx_incidents_order_id
    ON public.incidents(order_id);

CREATE INDEX idx_incidents_type
    ON public.incidents(type);

CREATE INDEX idx_incidents_severity
    ON public.incidents(severity);

CREATE INDEX idx_incidents_status
    ON public.incidents(status);

CREATE INDEX idx_incidents_created_at
    ON public.incidents(created_at);

CREATE INDEX idx_incidents_resolved_by
    ON public.incidents(resolved_by);