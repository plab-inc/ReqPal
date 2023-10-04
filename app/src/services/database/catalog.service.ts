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
        fetchRequirementsByCatalogId: this.fetchRequirementsByCatalogId.bind(this),
        fetchProductDetailsByRequirement: this.fetchProductDetailsByRequirement.bind(this)
    }

    private async fetchRequirementsByCatalogId(catalogId: number) {
        const {data, error} = await supabase
            .from('catalogs')
            .select('requirements(reqid, title, description)')
            .eq('catalog_id', catalogId);

        if (error) throw error;

        if (data && data.length > 0) {
            return data;
        }
    }

    private async fetchProductDetailsByRequirement(productName: string, requirementId: number) {
        const {data, error} = await supabase
            .from('product_requirements')
            .select('products(product_name), qualification, comment)')
            .eq('requirement_id', requirementId)

        if (error) throw error;

        if(!productName && data && data.length > 0) {
            return data;
        }

        if (data && data.length > 0) {
            return data.find((item: any) => item.products.product_name === productName) || null;
        }
    }


    private async uploadCatalogToDatabase(catalog: Catalog): Promise<void> {

        let { data, error } = await supabase
            .rpc('upload_catalog_to_database', {
                p_catalog_name: catalog.catalog_name,
                p_products: catalog.products,
                p_requirements: catalog.requirements
            })

        if (error) console.error(error)

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

}

const CatalogService = new CatalogServiceClass();

export default CatalogService;