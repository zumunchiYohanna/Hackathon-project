CREATE TYPE public.inventory_adjustment_reason AS ENUM (
    'RESTOCK',
    'DAMAGED',
    'EXPIRED',
    'LOST',
    'COUNT_CORRECTION',
    'RETURN',
    'MANUAL_ADJUSTMENT',
    'OTHER'
);

CREATE TYPE public.inventory_adjustment_source AS ENUM (
    'BUSINESS',
    'ADMIN',
    'SYSTEM'
);

CREATE TABLE public.inventory_adjustments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    inventory_id UUID NOT NULL,

    quantity_change INTEGER NOT NULL,

    reason public.inventory_adjustment_reason NOT NULL,

    source public.inventory_adjustment_source NOT NULL,

    actor_user_id UUID,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_inventory_adjustments_inventory
        FOREIGN KEY (inventory_id)
        REFERENCES public.inventory(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_inventory_adjustments_actor
        FOREIGN KEY (actor_user_id)
        REFERENCES public.users(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_inventory_adjustments_quantity
        CHECK (quantity_change <> 0),

    CONSTRAINT chk_inventory_adjustments_actor
        CHECK (
            (source IN ('BUSINESS', 'ADMIN') AND actor_user_id IS NOT NULL)
            OR
            (source = 'SYSTEM' AND actor_user_id IS NULL)
        )
);

CREATE INDEX idx_inventory_adjustments_inventory_id
    ON public.inventory_adjustments(inventory_id);

CREATE INDEX idx_inventory_adjustments_reason
    ON public.inventory_adjustments(reason);

CREATE INDEX idx_inventory_adjustments_source
    ON public.inventory_adjustments(source);

CREATE INDEX idx_inventory_adjustments_actor_user_id
    ON public.inventory_adjustments(actor_user_id);

CREATE INDEX idx_inventory_adjustments_created_at
    ON public.inventory_adjustments(created_at);