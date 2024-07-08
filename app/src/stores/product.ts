import {defineStore} from "pinia";
import {Product} from "@/types/catalog.ts";
import {useAuthStore} from "@/stores/auth.ts";
import ProductService from "@/services/database/product.ts";

interface ProductState {
    products: Product[]
    currentProduct: Product | null
}

export const useProductStore = defineStore('product', {
    state: (): ProductState => ({
        products: [],
        currentProduct: null
    }),

    getters: {
        getCurrentProducts: (state) => {
            return state.products;
        },
        getCurrentProduct: (state) => {
            return state.currentProduct;
        },
    },

    actions: {

        async fetchProductById(productId: string) {
            const data = await ProductService.pull.fetchProductById(productId);
            if (data) this.currentProduct = data;
            return data;
        },

        async fetchProductsByUser() {
            const authStore = useAuthStore();
            if (authStore.user) {
                const data = await ProductService.pull.fetchProductsByUser(authStore.user.id);
                if (data) this.products = data;
                return data;
            }
        },

        async uploadProductFromUser(product: Product) {
            const authStore = useAuthStore();
            if (authStore.user) {
                const newProduct = await ProductService.push.uploadProduct(product, authStore.user.id);
                if (newProduct) {
                    this.products.push(newProduct);
                }
            }
        },

        async updateCurrentProduct(product: Product) {
            await ProductService.push.updateProduct(product);
            this.currentProduct = product;
            const index = this.products.findIndex(p => p.product_id === product.product_id);
            if (index >= 0) {
                this.products[index] = this.currentProduct;
            }
        },

        async deleteProduct(productId: string) {
            await ProductService.push.deleteProduct(productId);
            const index = this.products.findIndex(p => p.product_id === productId);
            if (index >= 0) {
                this.products.splice(index, 1);
            }
        }
    }
});