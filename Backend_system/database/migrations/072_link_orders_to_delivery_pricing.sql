ALTER TABLE public.orders
ADD COLUMN delivery_pricing_configuration_id UUID;

ALTER TABLE public.orders
ADD CONSTRAINT fk_orders_delivery_pricing_configuration
    FOREIGN KEY (delivery_pricing_configuration_id)
    REFERENCES public.delivery_pricing_configuration(id)
    ON DELETE RESTRICT;

CREATE INDEX idx_orders_delivery_pricing_configuration_id
    ON public.orders(delivery_pricing_configuration_id);