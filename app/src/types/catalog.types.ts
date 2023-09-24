import {Database} from "@/types/supabase.types";

export type ProductDetail = {
    qualification: string;
    comment: string;
}

export type Product = {
    product_id?: number;
    product_name: string;
}

export type Requirement = {
    requirement_id?: number;
    reqId: string;
    title: string;
    description: string;
    products: {
        [key: string]: ProductDetail;
    };
}

export type Catalog = {
    catalog_id?: string;
    catalog_name: string;
    products: Product[];
    requirements: Requirement[];
}

export type dbCatalog = Database["public"]["Tables"]["catalogs"]["Row"];
export type dbProduct = Database["public"]["Tables"]["products"]["Row"];
export type dbRequirement = Database["public"]["Tables"]["requirements"]["Row"];
export type dbProductRequirement = Database["public"]["Tables"]["product_requirements"]["Row"];