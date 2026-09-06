ALTER TABLE public.businesses
ADD COLUMN owner_user_id UUID;

ALTER TABLE public.businesses
ADD CONSTRAINT fk_businesses_owner_user
    FOREIGN KEY (owner_user_id)
    REFERENCES public.users(id)
    ON DELETE RESTRICT;

CREATE UNIQUE INDEX uq_businesses_owner_user_id
    ON public.businesses(owner_user_id)
    WHERE owner_user_id IS NOT NULL;

CREATE INDEX idx_businesses_owner_user_id
    ON public.businesses(owner_user_id);