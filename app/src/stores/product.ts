import {defineStore} from "pinia";
import {Product} from "@/types/catalog.ts";
import {useAuthStore} from "@/stores/auth.ts";
import ProductService from "@/services/database/products.ts";

interface ProductState {
    products: Product[]
    examples: Product[]
    currentProduct: Product | null
}

export const useProductStore = defineStore('product', {
    state: (): ProductState => ({
        products: [],
        examples: [],
        currentProduct: null
    }),

    getters: {},

    actions: {

        async fetchProductById(productId: string) {
            const data = await ProductService.pull.fetchProductById(productId);
            if (data) this.currentProduct = data;
            return data;
        },

        async uploadProductFromUser(product: Product) {
            const authStore = useAuthStore();
            if (authStore.user) {
                return await ProductService.push.uploadProduct(product, authStore.user.id);
            }
        },
    }
});