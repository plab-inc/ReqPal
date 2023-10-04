create or replace function upload_catalog_to_database(p_catalog_name text, p_products jsonb, p_requirements jsonb) returns void
    language plpgsql
as
$$
DECLARE
    v_catalog_id        integer;
    v_product_ids       int[];
    v_product_ids_index integer DEFAULT 1;
    v_requirement       jsonb;
    v_requirement_id    integer;
    v_product           text;
    v_details           jsonb;
BEGIN

    INSERT INTO catalogs (catalog_name) VALUES (p_catalog_name) RETURNING catalog_id INTO v_catalog_id;

    WITH ins AS (
        INSERT INTO products (product_name)
            SELECT UPPER(REPLACE(product ->> 'product_name', ' ', ''))
            FROM jsonb_array_elements(p_products) AS product
            ON CONFLICT (product_name) DO UPDATE
                SET product_name = EXCLUDED.product_name
            RETURNING product_id)
    SELECT ARRAY_AGG(product_id)
    INTO v_product_ids
    FROM ins;

    FOR v_requirement IN SELECT * FROM jsonb_array_elements(p_requirements)
        LOOP
            INSERT INTO requirements (catalog_id, reqid, title, description)
            VALUES (v_catalog_id, v_requirement ->> 'reqId', v_requirement ->> 'title', v_requirement ->> 'description')
            RETURNING requirement_id INTO v_requirement_id;

            v_product_ids_index := 1;

            FOR v_product, v_details IN SELECT * FROM jsonb_each(v_requirement -> 'productDetails')
                LOOP
                    INSERT INTO product_requirements (product_id, requirement_id, qualification, comment)
                    VALUES (v_product_ids[v_product_ids_index],
                            v_requirement_id,
                            v_details -> 'qualification',
                            v_details -> 'comment');
                    v_product_ids_index := v_product_ids_index + 1;
                END LOOP;

        END LOOP;

END;
$$;