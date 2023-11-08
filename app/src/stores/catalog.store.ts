import {defineStore} from 'pinia';
import catalogService from "@/services/database/catalog.service.ts";
import {Catalog, CatalogDTO, Product, ProductDetail, Requirement} from "@/types/catalog.types.ts";
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
                    if(data.length > 0) {
                        this.catalogs.splice(this.catalogs.findIndex(c => c.catalog_id === catalogId), 1);
                        return;
                    }
                    throw new DatabaseError("Catalog could not be deleted", 500);
                }
            );
        },

        async getCatalogWithProductsById(id: number) {

            const catalogData = await catalogService.pull.fetchCatalogByCatalogId(id);
            const requirementsData = await catalogService.pull.fetchRequirementsByCatalogId(id);

            const catalogRequirements: Requirement[] = [];
            const catalogProducts: Product[] = [];

            if (requirementsData) {
                for (const requirements of requirementsData) {
                    for (const req of requirements.requirements) {
                        catalogRequirements.push({
                            requirement_id: req.requirement_id,
                            reqId: req.reqid,
                            title: req.title,
                            description: req.description,
                            products: {}
                        })
                    }

                    const req = requirements.requirements[0]
                    const productData = await catalogService.pull.fetchProductsByRequirementId(req.requirement_id);
                    if (productData) {
                        productData.forEach(p => {
                            catalogProducts.push({
                                product_id: p.products?.product_id,
                                product_name: p.products?.product_name ? p.products?.product_name : "Product",
                                product_url: p.products?.product_url ? p.products?.product_url : "Url"
                            })
                        })
                    }
                }
            }

            if (catalogData && catalogData.length > 0) {
                const catalog = catalogData[0];
                this.currentCatalog = {
                    catalog_id: catalog.catalog_id,
                    catalog_name: catalog.catalog_name ? catalog.catalog_name : "Catalog",
                    products: catalogProducts,
                    requirements: catalogRequirements
                }
            }
        },

        async getProductDetailsForRequirement(req: Requirement) {

            if (this.currentCatalog) {
                for (const product of this.currentCatalog?.products) {
                    if (product.product_name) {
                        const productDetail = await catalogService.pull.fetchProductDetailsByRequirement(product.product_name, req.requirement_id);

                        if (productDetail) {
                            const reqProduct: ProductDetail = {
                                qualification: productDetail.qualification ? productDetail.qualification : "",
                                comment: productDetail.comment ? productDetail.comment : "",
                            }
                            if ((product.product_name)) req.products[product.product_name] = reqProduct;
                        }
                    }
                }
            }
        },

    }
});