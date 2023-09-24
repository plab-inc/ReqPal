import {supabase} from "@/plugins/supabase";
import {
    Catalog,
    dbCatalog,
    dbProduct,
    dbProductRequirement,
    dbRequirement,
    Product,
    ProductDetail,
    Requirement
} from "@/types/catalog.types";

class CatalogServiceClass{

    public push = {
        uploadCatalogToDatabase: this.uploadCatalogToDatabase.bind(this)
    };

    public pull = {
        fetchRequirementsByCatalogId: this.fetchRequirementsByCatalogId.bind(this)
    }

    private async fetchRequirementsByCatalogId(catalogId: string) {
        const {data, error} = await supabase
            .from('catalogs')
            .select('requirements(reqid,title,desciption)')
            .eq('catalog_id', catalogId);

        if (error) throw error;

        if (data && data.length > 0) {
            console.log(data);
        }
    }

    private async uploadCatalogToDatabase(catalog: Catalog): Promise<void> {

        const dbProducts: dbProduct[] = [];
        const catalogData = await this.addCatalog(catalog);
        const catalogId = catalogData[0].catalog_id;

        for (const product of catalog.products) {

            const productData = await this.addProduct(product);

            if (productData) {
                dbProducts.push(productData[0]);
            }
        }

        for (const requirement of catalog.requirements) {

            const requirementData = await this.addRequirement(requirement, catalogId);
            const requirementId = requirementData[0].requirement_id;

            for (const [productName, productDetails] of Object.entries(requirement.products)) {

                const unifiedProductName = productName.toUpperCase().replace(/\s/g, '');
                const productId = dbProducts.find(product => product.product_name === unifiedProductName)?.product_id;

                if (productId) {
                    await this.addProductRequirement(productId, requirementId, productDetails);
                }

            }

        }

    }

    async convertCSVToCatalog(csvFile: File): Promise<Catalog> {

        const formData = new FormData();
        formData.append('csv', csvFile);

        const {data, error} = await supabase.functions.invoke('csvToJson', {
            body: formData
        });

        if (error || !data) throw error;

        return data;
    }

    private async addCatalog(catalog: Catalog): Promise<dbCatalog[]> {

        const {data: catalogData, error: catalogError} = await supabase
            .from('catalogs')
            .insert([{catalog_name: catalog.catalog_name}])
            .select();

        if (catalogError || !catalogData) throw catalogError;

        return catalogData;

    }

    private async addProduct(product: Product): Promise<dbProduct[]> {

        const unifiedProductName = product.product_name.toUpperCase().replace(/\s/g, '');

        const {data: productData, error: productError} = await supabase.from('products')
            .upsert({product_name: unifiedProductName},
                {onConflict: 'product_name'})
            .select();

        if (productError || !productData) throw productError;

        return productData;
    }

    private async addRequirement(requirement: Requirement, catalogId: number): Promise<dbRequirement[]> {

        const {data: requirementData, error: requirementError} = await supabase
            .from('requirements')
            .insert([{
                catalog_id: catalogId,
                reqid: requirement.reqId,
                title: requirement.title,
                description: requirement.description
            }])
            .select();

        if (requirementError || !requirementData) throw requirementError;

        return requirementData;

    }

    private async addProductRequirement(productId: number, requirementId: number, productDetail: ProductDetail): Promise<dbProductRequirement[]> {

        const {data: productDetailData, error: productDetailError} = await supabase
            .from('product_requirements')
            .insert([{
                product_id: productId,
                requirement_id: requirementId,
                qualification: productDetail.qualification,
                comment: productDetail.comment
            }])
            .select();

        if (productDetailError) throw productDetailError;

        return productDetailData;

    }

}

const CatalogService = new CatalogServiceClass();

export default CatalogService;