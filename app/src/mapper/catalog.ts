import { Catalog, Product, ProductDetail, Requirement } from "@/types/catalog.ts";

export const mapToCatalog = (input: any): Catalog => {
  const products: Product[] = input.products.map((item: any) => ({
    product_id: item.products.product_id,
    product_name: item.products.product_name,
    product_url: item.products.product_url
  }));

  const requirements: Requirement[] = input.requirements.map((item: any) => {
    const productDetails: { [product_id: string]: ProductDetail } = {};
    item.productDetails.forEach((detail: any) => {
      productDetails[detail.product.product_id] = {
        product_name: detail.product.product_name,
        qualification: detail.qualification,
        comment: detail.comment
      };
    });

    return {
      requirement_id: item.requirement_id,
      label: item.label,
      title: item.title,
      description: item.description,
      products: productDetails
    };
  });

  return {
    catalog_id: input.catalog_id,
    catalog_name: input.catalog_name,
    products: products,
    requirements: requirements
  };
};