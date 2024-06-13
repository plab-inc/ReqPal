import { defineStore } from "pinia";
import catalogService from "@/services/database/catalog.ts";
import CatalogService from "@/services/database/catalog.ts";
import { Catalog, CatalogDTO, Product, ProductDetail, ProductRequirementDTO, Requirement } from "@/types/catalog.ts";
import { DatabaseError } from "@/errors/custom.ts";

interface CatalogState {
    catalogs: CatalogDTO[]
    examples: CatalogDTO[]
    currentCatalog: Catalog | null
    currentCatalogSelectedIds: String[];
}

export const useCatalogStore = defineStore('catalog', {
    state: (): CatalogState => ({
        catalogs: [],
        examples: [],
        currentCatalogSelectedIds: [],
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
        getCurrentCatalogSelectedIds(): String[] {
            return this.currentCatalogSelectedIds;
        }
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
        async deleteCatalog(catalogId: string) {
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

        async deleteRequirement(requirementId: string) {
            await catalogService.push.deleteRequirement(requirementId).then(
                (data: any) => {
                    if (data.length > 0) {
                        this.currentCatalog?.requirements.splice(this.currentCatalog?.requirements.findIndex(r => r.requirement_id === requirementId), 1);
                        return;
                    }
                    throw new DatabaseError("Requirement could not be deleted", 500);
                }
            );
        },

        async deleteSelectedRequirements() {
            if (this.currentCatalog) {
                await catalogService.deleteRequirements(this.getCurrentCatalogSelectedIds).then(() => {
                      this.currentCatalog.requirements = this.currentCatalog.requirements.filter((requirement) => {
                          return !this.currentCatalogSelectedIds.includes(requirement.requirement_id);
                      });
                  }
                );
            }
            this.currentCatalogSelectedIds = [];
        },

        async getFullCatalogById(catalogId: string) {

            const catalog = await catalogService.pull.fetchCatalogByCatalogId(catalogId);

            if (catalog) {
                this.currentCatalog = catalog;
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
                            acc[product.product_id] = {
                                product_name: product.product_name,
                                qualification: detail.qualification || 0,
                                comment: detail.comment || ''
                            };
                        }
                        return acc;
                    }, {} as { [p: string]: ProductDetail });

                }
            }
        },

        async fetchProductDetailsByRequirementWithQualificationByProductId(requirementId: string, productId: string) {
            return await catalogService.pull.fetchProductDetailsByRequirementWithQualificationByProductId(requirementId, productId);
        },

        async fetchProductDetailsByRequirementWithoutQualificationByProductId(requirementId: string, productId: string) {
            return await catalogService.pull.fetchProductDetailsByRequirementWithoutQualificationByProductId(requirementId, productId);
        },

        async checkIfCatalogNameExists(catalogName: string) {
            return await catalogService.pull.checkIfCatalogNameExists(catalogName);
        },

        async removeProductFromCatalogAndRequirements(productId: string) {
            if (!this.currentCatalog || !this.currentCatalog.catalog_id) {
                throw Error("No current catalog found.")
            }

            await CatalogService.push.removeProductFromCatalogAndRequirements(productId, this.currentCatalog.catalog_id);
            const index = this.currentCatalog.products.findIndex(pr => pr.product_id === productId);
            if (index >= 0) this.currentCatalog.products.splice(index, 1);
            this.currentCatalog.requirements.forEach(req => {
                if (req.products.hasOwnProperty(productId)) {
                    delete req.products[productId];
                }
            })
        },

        async addProductToCatalogAndRequirements(product: Product) {
            if (!this.currentCatalog) {
                throw Error("No current catalog found.")
            }
            if (product.product_id) {
                const data = await CatalogService.push.addProductToCatalogAndRequirements(product, this.currentCatalog);
                this.currentCatalog.products.push(product);
                if(data && data[0]) {
                    this.currentCatalog.requirements.forEach(req => {
                        req.products[product.product_id] = {
                            comment: data[0].comment ? data[0].comment : product.product_name+"-Kommentar",
                            product_name: product.product_name,
                            qualification: data[0].qualification
                        }
                    })
                }
            }
        }
    }
});
