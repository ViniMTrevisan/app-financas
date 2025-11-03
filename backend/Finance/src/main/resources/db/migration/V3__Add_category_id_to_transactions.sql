ALTER TABLE transactions
    ADD COLUMN category_id BIGINT;

ALTER TABLE transactions
    ADD CONSTRAINT fk_transactions_on_category
        FOREIGN KEY (category_id)
            REFERENCES categories (id);