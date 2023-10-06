import {defineStore} from 'pinia';
import catalogService from "@/services/database/catalog.service.ts";
import {Catalog, Product, ProductDetail, Requirement} from "@/types/catalog.types.ts";

interface CatalogState {
    currentCatalog: Catalog | null
}

export const useCatalogStore = defineStore('catalog', {
    state: (): CatalogState => ({
        currentCatalog: null
    }),

    getters: {
        getCurrentCatalog(): any {
            return this.currentCatalog;
        }
    },

    actions: {
        async getWholeCatalogById(id: number) {

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

            await this.getProductDetails();
        },

        async getProductDetails() {
            if (this.currentCatalog) {
                for (const req of this.currentCatalog.requirements) {
                    for (const product of this.currentCatalog?.products) {
                        if (product.product_name) {
                            const productDetail = await catalogService.pull.fetchProductDetailsByRequirement(product.product_name, req.requirement_id);

                            if (productDetail) {
                                productDetail.forEach(p => {
                                    const reqProduct: ProductDetail = {
                                        qualification: p.qualification ? p.qualification : "",
                                        comment: p.comment ? p.comment : "",
                                    }
                                    if ((product.product_name)) req.products[product.product_name] = reqProduct;
                                })
                            }
                        }
                    }
                }
            }
        },
    }
});