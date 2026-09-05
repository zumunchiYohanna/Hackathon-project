CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    business_product_id UUID NOT NULL UNIQUE,

    quantity_on_hand INTEGER NOT NULL DEFAULT 0,
    quantity_reserved INTEGER NOT NULL DEFAULT 0,

    low_stock_threshold INTEGER NOT NULL DEFAULT 0,

    last_updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_inventory_business_product
        FOREIGN KEY (business_product_id)
        REFERENCES business_products(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_inventory_quantity_on_hand
        CHECK (quantity_on_hand >= 0),

    CONSTRAINT chk_inventory_quantity_reserved
        CHECK (quantity_reserved >= 0),

    CONSTRAINT chk_inventory_reserved_not_exceed_on_hand
        CHECK (quantity_reserved <= quantity_on_hand),

    CONSTRAINT chk_inventory_low_stock_threshold
        CHECK (low_stock_threshold >= 0)
);

CREATE INDEX idx_inventory_business_product_id
    ON inventory(business_product_id);

CREATE INDEX idx_inventory_last_updated_at
    ON inventory(last_updated_at);