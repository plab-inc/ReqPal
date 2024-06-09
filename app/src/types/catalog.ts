import { Database } from "@/types/supabase.ts";

export type ProductDetail = {
    qualification: number;
    comment: string;
}

export type Product = {
    product_id?: string;
    product_name: string;
    product_url: string;
}

export type Requirement = {
    requirement_id: string;
    reqId: string | null;
    title: string | null;
    description: string | null;
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

export type CatalogDTO = Database["public"]["Tables"]["catalogs"]["Row"];
export type ProductDTO = Database["public"]["Tables"]["products"]["Row"];
export type RequirementDTO = Database["public"]["Tables"]["requirements"]["Row"];
export type ProductRequirementDTO = Database["public"]["Tables"]["product_requirements"]["Row"];