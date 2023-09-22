import { supabase } from "@/plugins/supabase";
import { defineStore } from 'pinia';


interface ProductDetail {
    qualification: string;
    comment: string;
}

interface Requirement {
    reqId: string;
    title: string;
    description: string;
    products: {
        [key: string]: ProductDetail;
    };
}

interface Catalog {
    catalog_name: string;
    products: string[];
    requirements: Requirement[];
}

export const useCatalogStore = defineStore('catalog', {
    state: () => ({
        currentCatalog: null
    }),

    getters: {
        getCurrentCatalog(): any{
            return this.currentCatalog;
        }
    },

    actions: {
        async fetchWholeCatalogById(catalogId: string) {
            const {data, error} = await supabase
                .from('catalogs')
                .select('catalog_id, catalog_name, ' +
                    'requirements (requirement_id, reqId, title, description, ' +
                    'products (product_id, product_name, ' +
                    'product_requirements (qualification, comment)))')
                .eq('catalog_id', catalogId);

            if (error) throw error;

            if (data && data.length > 0) {
                console.log(data);
            }
        },

        async uploadJsonToDatabase(jsonData: Catalog) {
            const { data: catalogData , error: catalogError} = await supabase
                .from('catalogs')
                .insert([{ catalog_name: jsonData.catalog_name }])
                .select();

            if (catalogError || !catalogData) throw catalogError;

            const catalogId = catalogData[0].catalog_id;

            const products: any[] = [];

            for (const product of jsonData.products) {
                const productData = await this.addProduct(product);

                if (productData) {
                    products.push(productData[0]);
                }
            }

            for(const requirement of jsonData.requirements){

                const { data: requirementData, error: requirementError } = await supabase
                    .from('requirements')
                    .insert([{ catalog_id: catalogId, reqid: requirement.reqId, title: requirement.title, description: requirement.description }])
                    .select();

                if (requirementError || !requirementData) throw requirementError;

                const requirementId = requirementData[0].requirement_id;

                for (const [productName, productDetails] of Object.entries(requirement.products)) {

                    const productId = products.find(product => product.product_name === productName)?.product_id;

                    if(productId){

                        const { error: productDetailError } = await supabase
                            .from('product_requirements')
                            .insert([{product_id: productId, requirement_id: requirementId, qualification: productDetails.qualification, comment: productDetails.comment}]);

                        if (productDetailError) throw productDetailError;

                    }

                }

            }

            console.log('Catalog uploaded successfully');
        },

        async addProduct(productName: string) {

            const { data: productData, error: productError } = await supabase.from('products')
                .upsert({product_name: productName},
                    {onConflict: 'product_name'})
                .select();

            if (productError || !productData) throw productError;

            return productData;
        },

        async convertCatalogToJson(csvFile: File){

            const formData = new FormData();
            formData.append('csv', csvFile);

            const { data, error } = await supabase.functions.invoke('csvToJson', {
                body: formData
            });

            if (error || !data ) throw error;

            await this.uploadJsonToDatabase(data);

        }
    }
});