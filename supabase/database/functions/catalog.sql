-- Author: Fabian, Laura

create or replace function upload_catalog_to_database(p_catalog_name text, p_products jsonb, p_requirements jsonb) returns void
    language plpgsql
as
$$
DECLARE
    v_catalog_id     uuid;
    v_requirement    jsonb;
    v_requirement_id uuid;
    v_product        text;
    v_details        jsonb;
BEGIN
    INSERT INTO catalogs (catalog_name, user_id)
    VALUES (p_catalog_name, auth.uid())
    RETURNING catalog_id INTO v_catalog_id;

    WITH ins AS (
        INSERT INTO products (product_name, product_url, user_id)
            SELECT UPPER(REPLACE(product ->> 'product_name', ' ', '')),
                   product ->> 'product_url',
                   auth.uid()
            FROM jsonb_array_elements(p_products) AS product
            ON CONFLICT (product_name) DO UPDATE
                SET product_name = EXCLUDED.product_name, product_url = EXCLUDED.product_url
            RETURNING product_id)
    INSERT
    INTO product_catalogs (product_id, catalog_id)
    SELECT product_id, v_catalog_id
    FROM ins;

    FOR v_requirement IN SELECT * FROM jsonb_array_elements(p_requirements)
        LOOP
            INSERT INTO requirements (catalog_id, reqid, title, description)
            VALUES (v_catalog_id, v_requirement ->> 'reqId', v_requirement ->> 'title', v_requirement ->> 'description')
            RETURNING requirement_id INTO v_requirement_id;

            FOR v_product, v_details IN SELECT * FROM jsonb_each(v_requirement -> 'productDetails')
                LOOP
                    INSERT INTO product_requirements (product_id, requirement_id, qualification, comment)
                    SELECT product_id, v_requirement_id, v_details ->> 'qualification', v_details ->> 'comment'
                    FROM products
                    WHERE product_name = UPPER(REPLACE(v_product, ' ', ''));
                END LOOP;
        END LOOP;
END;
$$;