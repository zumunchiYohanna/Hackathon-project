CREATE TABLE public.delivery_assignment_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    delivery_id UUID NOT NULL,

    rider_id UUID,
    vehicle_id UUID,

    action VARCHAR(30) NOT NULL,

    reason VARCHAR(255),

    changed_by UUID,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_delivery_assignment_history_delivery
        FOREIGN KEY (delivery_id)
        REFERENCES public.deliveries(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_delivery_assignment_history_rider
        FOREIGN KEY (rider_id)
        REFERENCES public.riders(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_delivery_assignment_history_vehicle
        FOREIGN KEY (vehicle_id)
        REFERENCES public.vehicles(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_delivery_assignment_history_changed_by
        FOREIGN KEY (changed_by)
        REFERENCES public.users(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_delivery_assignment_history_action
        CHECK (
            action IN (
                'ASSIGNED',
                'REASSIGNED',
                'UNASSIGNED'
            )
        ),

    CONSTRAINT chk_delivery_assignment_history_assignment
        CHECK (
            action = 'UNASSIGNED'
            OR rider_id IS NOT NULL
        )
);

CREATE INDEX idx_delivery_assignment_history_delivery_id
    ON public.delivery_assignment_history(delivery_id);

CREATE INDEX idx_delivery_assignment_history_rider_id
    ON public.delivery_assignment_history(rider_id);

CREATE INDEX idx_delivery_assignment_history_vehicle_id
    ON public.delivery_assignment_history(vehicle_id);

CREATE INDEX idx_delivery_assignment_history_action
    ON public.delivery_assignment_history(action);

CREATE INDEX idx_delivery_assignment_history_changed_by
    ON public.delivery_assignment_history(changed_by);

CREATE INDEX idx_delivery_assignment_history_created_at
    ON public.delivery_assignment_history(created_at);