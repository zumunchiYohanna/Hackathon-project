CREATE TABLE public.inventory_reservation_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    reservation_id UUID NOT NULL,

    previous_status public.inventory_reservation_status,
    new_status public.inventory_reservation_status NOT NULL,

    quantity INTEGER NOT NULL,

    reason VARCHAR(255),

    changed_by UUID,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_inventory_reservation_history_reservation
        FOREIGN KEY (reservation_id)
        REFERENCES public.inventory_reservations(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_inventory_reservation_history_changed_by
        FOREIGN KEY (changed_by)
        REFERENCES public.users(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_inventory_reservation_history_quantity
        CHECK (quantity > 0),

    CONSTRAINT chk_inventory_reservation_history_change
        CHECK (
            previous_status IS NULL
            OR previous_status <> new_status
        )
);

CREATE INDEX idx_inventory_reservation_history_reservation_id
    ON public.inventory_reservation_history(reservation_id);

CREATE INDEX idx_inventory_reservation_history_previous_status
    ON public.inventory_reservation_history(previous_status);

CREATE INDEX idx_inventory_reservation_history_new_status
    ON public.inventory_reservation_history(new_status);

CREATE INDEX idx_inventory_reservation_history_changed_by
    ON public.inventory_reservation_history(changed_by);

CREATE INDEX idx_inventory_reservation_history_created_at
    ON public.inventory_reservation_history(created_at);