CREATE TABLE business_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    business_id UUID NOT NULL,
    product_id UUID NOT NULL,

    price_amount BIGINT NOT NULL,
    currency CHAR(3) NOT NULL DEFAULT 'NGN',

    is_available BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_business_products_business
        FOREIGN KEY (business_id)
        REFERENCES businesses(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_business_products_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE RESTRICT,

    CONSTRAINT uq_business_products
        UNIQUE (business_id, product_id),

    CONSTRAINT chk_business_products_price
        CHECK (price_amount >= 0)
);

CREATE INDEX idx_business_products_business_id
    ON business_products(business_id);

CREATE INDEX idx_business_products_product_id
    ON business_products(product_id);

CREATE INDEX idx_business_products_available
    ON business_products(is_available);