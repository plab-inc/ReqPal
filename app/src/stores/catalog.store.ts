import {defineStore} from 'pinia';
import catalogService from "@/services/database/catalog.service.ts";
import {
    Catalog,
    CatalogDTO,
    Product,
    ProductDetail,
    ProductDTO,
    ProductRequirementDTO,
    Requirement,
    RequirementDTO
} from "@/types/catalog.types.ts";
import {DatabaseError} from "@/errors/custom.errors.ts";

interface CatalogState {
    catalogs: CatalogDTO[]
    examples: CatalogDTO[]
    currentCatalog: Catalog | null
}

export const useCatalogStore = defineStore('catalog', {
    state: (): CatalogState => ({
        catalogs: [],
        examples: [],
        currentCatalog: null,
    }),

    getters: {
        getCurrentCatalog(): Catalog | null {
            return this.currentCatalog;
        },
        getCustomCatalogs(): CatalogDTO[] {
            return this.catalogs;
        },
        getExampleCatalogs(): CatalogDTO[] {
            return this.examples;
        },
    },

    actions: {
        async fetchCatalogs() {
            const catalogData = await catalogService.pull.fetchCatalogs();
            if (catalogData) {
                this.catalogs = catalogData;
            }
            const exampleCatalogData = await catalogService.pull.fetchCatalogs(true);
            if (exampleCatalogData) {
                this.examples = exampleCatalogData;
            }
        },
        async deleteCatalog(catalogId: number) {
            await catalogService.push.deleteCatalog(catalogId).then(
                (data: CatalogDTO[]) => {
                    if (data.length > 0) {
                        this.catalogs.splice(this.catalogs.findIndex(c => c.catalog_id === catalogId), 1);
                        return;
                    }
                    throw new DatabaseError("Catalog could not be deleted", 500);
                }
            );
        },

        async getCatalogWithProductsById(catalogId: number) {

            const catalogData: CatalogDTO | undefined = await catalogService.pull.fetchCatalogByCatalogId(catalogId);
            const productData: ProductDTO[] | undefined = await catalogService.pull.fetchProductsByCatalogId(catalogId);
            const requirementsData: RequirementDTO[] | undefined = await catalogService.pull.fetchRequirementsByCatalogId(catalogId);

            const catalogRequirements: Requirement[] = [];
            const catalogProducts: Product[] = [];

            if (requirementsData) {
                for (const requirement of requirementsData) {

                    catalogRequirements.push({
                        requirement_id: requirement.requirement_id,
                        reqId: requirement.reqid,
                        title: requirement.title,
                        description: requirement.description,
                        products: {}
                    })
                }
            }

            if (productData) {
                for (const product of productData) {
                    catalogProducts.push({
                        product_id: product.product_id,
                        product_name: product.product_name,
                        product_url: product.product_url
                    })
                }
            }

            if (catalogData) {
                this.currentCatalog = {
                    catalog_id: catalogData.catalog_id,
                    catalog_name: catalogData.catalog_name ? catalogData.catalog_name : "Catalog",
                    products: catalogProducts,
                    requirements: catalogRequirements
                }
            }
        },

        async getProductDetailsForRequirement(requirement: Requirement, products: Product[]) {

            if (this.currentCatalog) {
                const productDetails: ProductRequirementDTO[] | undefined = await catalogService.pull.fetchProductDetailsByRequirement(requirement.requirement_id);

                if (productDetails) {

                    const detailsMap = new Map(productDetails.map(detail => [detail.product_id, detail]));

                    requirement.products = products.reduce((acc, product) => {
                        const detail = detailsMap.get(product.product_id!);
                        if (detail) {
                            acc[product.product_name] = {
                                qualification: detail.qualification || '',
                                comment: detail.comment || ''
                            };
                        }
                        return acc;
                    }, {} as { [p: string]: ProductDetail });

                }
            }
        },

        async fetchProductDetailsByRequirementWithQualification(requiremendId: number) {
            return await catalogService.pull.fetchProductDetailsByRequirement(requiremendId);
        },

        async fetchProductDetailsByRequirementWithQualificationByProductId(requiremendId: number, productId: number) {
            return await catalogService.pull.fetchProductDetailsByRequirementWithQualificationByProductId(requiremendId, productId);
        },

        async fetchProductDetailsByRequirementWithoutQualificationByProductId(requiremendId: number, productId: number) {
            return await catalogService.pull.fetchProductDetailsByRequirementWithoutQualificationByProductId(requiremendId, productId);
        },

        async fetchProductById(productId: number) {
            return await catalogService.pull.fetchProductById(productId);
        }
    }
});