ALTER TABLE public.notifications
ADD COLUMN event_key VARCHAR(255);

CREATE UNIQUE INDEX uq_notifications_event_key
    ON public.notifications(event_key)
    WHERE event_key IS NOT NULL;

CREATE INDEX idx_notifications_event_key
    ON public.notifications(event_key)
    WHERE event_key IS NOT NULL;