import { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import {useProductStore} from "@/stores/product.ts";

export async function fetchProduct(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
    try {
        const productStore = useProductStore();
        await productStore.fetchProductById(to.params.productId.toString());
        return next();
    } catch (error) {
        return next({name: 'Error'});
    }
}

export async function fetchProductsByUser(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
    try {
        const productStore = useProductStore();
        await productStore.fetchProductsByUser();
        return next();
    } catch (error) {
        return next({name: 'Error'});
    }
}