import {defineStore} from 'pinia';
import catalogService from "@/services/database/catalog.service.ts";
import {Catalog, dbCatalog, Product, ProductDetail, Requirement} from "@/types/catalog.types.ts";
import {Lesson} from "@/types/lesson.types.ts";

interface CatalogState {
    allCatalogs: dbCatalog[]
    currentCatalog: Catalog | null
    currentLessonRequirements: Requirement[]
    currentCatalogLessons: Lesson[]
}

export const useCatalogStore = defineStore('catalog', {
    state: (): CatalogState => ({
        allCatalogs: [],
        currentCatalog: null,
        currentLessonRequirements: [],
        currentCatalogLessons: []
    }),

    getters: {
        getCurrentCatalog(): any {
            return this.currentCatalog;
        }
    },

    actions: {
        async getAllCatalogs() {

            const catalogData = await catalogService.pull.fetchAllCatalogs();

            if (catalogData) {
                this.allCatalogs = catalogData;
            }

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

        async setCatalogAndRequirementsToLesson(lessonId: number, requirements: Requirement[]) {
            if (this.currentCatalog && this.currentCatalog.catalog_id) {
                for (const req of requirements) {
                    await catalogService.push.setCatalogRequirementToLesson(this.currentCatalog.catalog_id, lessonId, req.requirement_id);
                }
            }
        },

        async removeRequirementsFromLesson(lessonId: number, requirements: Requirement[]) {
            for (const req of requirements) {
                await catalogService.push.removeRequirementsFromLesson(lessonId, req.requirement_id);
            }
        },

        async getRequirementsForLesson(lessonId: number) {
            const data = await catalogService.pull.fetchRequirementsForLesson(lessonId);
            this.currentLessonRequirements = [];
            if (data) {
                data.forEach(d => {
                    if (d.requirements) {
                        this.currentLessonRequirements.push(
                            {
                                description: d.requirements.description,
                                products: {},
                                reqId: d.requirements.reqid,
                                requirement_id: d.requirements.requirement_id,
                                title: d.requirements.title
                            }
                        )
                    }
                })
            }
        },

        async getAllLessonsForCatalog(catalogId: number) {
            const data = await catalogService.pull.fetchLessonsForCatalog(catalogId);

            if (data) {
                this.currentCatalogLessons = data;
            }
        },
    }
});