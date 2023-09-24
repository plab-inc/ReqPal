CREATE OR REPLACE FUNCTION json_cmp("left" json, "right" json) RETURNS integer
    IMMUTABLE
    STRICT
    LANGUAGE sql
AS
$$
SELECT bttextcmp($1::text, $2::text);
$$;

CREATE OR REPLACE FUNCTION json_eq(json, json) RETURNS boolean
    IMMUTABLE
    STRICT
    LANGUAGE sql
AS
$$
SELECT json_cmp($1, $2) = 0;
$$;

CREATE OR REPLACE FUNCTION json_gt(json, json) RETURNS boolean
    IMMUTABLE
    STRICT
    LANGUAGE sql
AS
$$
SELECT json_cmp($1, $2) > 0;
$$;

CREATE OR REPLACE FUNCTION json_gte(json, json) RETURNS boolean
    IMMUTABLE
    STRICT
    LANGUAGE sql
AS
$$
SELECT json_cmp($1, $2) >= 0;
$$;

CREATE OR REPLACE FUNCTION json_lt(json, json) RETURNS boolean
    IMMUTABLE
    STRICT
    LANGUAGE sql
AS
$$
SELECT json_cmp($1, $2) < 0;
$$;

CREATE OR REPLACE FUNCTION json_lte(json, json) RETURNS boolean
    IMMUTABLE
    STRICT
    LANGUAGE sql
AS
$$
SELECT json_cmp($1, $2) <= 0;
$$;