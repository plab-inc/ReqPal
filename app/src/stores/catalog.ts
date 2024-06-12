import {defineStore} from "pinia";
import catalogService from "@/services/database/catalog.ts";
import CatalogService from "@/services/database/catalog.ts";
import {Catalog, CatalogDTO, Product, ProductDetail, ProductRequirementDTO, Requirement} from "@/types/catalog.ts";
import {DatabaseError} from "@/errors/custom.ts";
import {useAuthStore} from "@/stores/auth.ts";

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

        async fetchProductDetailsByRequirementWithQualification(requiremendId: string) {
            return await catalogService.pull.fetchProductDetailsByRequirement(requiremendId);
        },

        async fetchProductDetailsByRequirementWithQualificationByProductId(requiremendId: string, productId: string) {
            return await catalogService.pull.fetchProductDetailsByRequirementWithQualificationByProductId(requiremendId, productId);
        },

        async fetchProductDetailsByRequirementWithoutQualificationByProductId(requiremendId: string, productId: string) {
            return await catalogService.pull.fetchProductDetailsByRequirementWithoutQualificationByProductId(requiremendId, productId);
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
        },

        async addProductFromUser(product: Product) {
            const authStore = useAuthStore();
            if (authStore.user) {
                return await CatalogService.push.addProduct(product, authStore.user.id);
            }
        },

        async addProductToCatalogAndRequirements(product: Product) {
            if (!this.currentCatalog) {
                throw Error("No current catalog found.")
            }
            if (product.product_id) {
                await CatalogService.push.addProductToCatalogAndRequirements(product.product_id, this.currentCatalog);
                this.currentCatalog.products.push(product);
            }
        }
    }
});