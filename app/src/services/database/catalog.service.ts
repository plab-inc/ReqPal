import {supabase} from "@/plugins/supabase";
import {Catalog, CatalogDTO} from "@/types/catalog.types";

class CatalogServiceClass {

    public push = {
        uploadCatalogToDatabase: this.uploadCatalogToDatabase.bind(this),
        deleteCatalog: this.deleteCatalog.bind(this)
    };

    public pull = {
        fetchRequirementsByCatalogId: this.fetchRequirementsByCatalogId.bind(this),
        fetchCatalogs: this.fetchCatalogs.bind(this),
        fetchProductDetailsByRequirement: this.fetchProductDetailsByRequirement.bind(this),
        fetchCatalogByCatalogId: this.fetchCatalogById.bind(this),
        fetchProductsByRequirementId: this.fetchProductsByRequirementId.bind(this),
        fetchLessonsForCatalog: this.fetchLessonsForCatalog.bind(this)
    }

    private async fetchRequirementsByCatalogId(catalogId: number) {
        const {data, error} = await supabase
            .from('catalogs')
            .select('requirements(requirement_id, reqid, title, description)')
            .eq('catalog_id', catalogId);

        if (error) throw error;

        if (data && data.length > 0) {
            return data;
        }
    }

    private async fetchCatalogById(catalogId: number) {
        const {data, error} = await supabase
            .from('catalogs')
            .select('catalog_id, catalog_name')
            .eq('catalog_id', catalogId);

        if (error) throw error;

        if (data) {
            return data;
        }
    }

    private async fetchProductsByRequirementId(requirementId: number) {
        const {data, error} = await supabase
            .from('product_requirements')
            .select('products(product_id, product_name)')
            .eq('requirement_id', requirementId)

        if (error) throw error;

        if (data) {
            return data;
        }
    }

    private async fetchProductDetailsByRequirement(productName: string, requirementId: number) {
        const {data, error} = await supabase
            .from('product_requirements')
            .select('products(product_name), qualification, comment')
            .eq('requirement_id', requirementId)

        if (error) throw error;

        if (data && data.length > 0) {
            return data.find((item: any) => item.products.product_name === productName) || null;
        }
    }


    private async uploadCatalogToDatabase(catalog: Catalog): Promise<void> {

        const {error: uploadError} = await supabase
            .rpc('upload_catalog_to_database', {
                p_catalog_name: catalog.catalog_name,
                p_products: catalog.products,
                p_requirements: catalog.requirements
            })

        if (uploadError) throw uploadError;

    }

    async convertCSVToCatalog(csvFile: File): Promise<Catalog> {

        const formData = new FormData();
        formData.append('csv', csvFile);

        const {data: catalogData, error: catalogError} = await supabase.functions.invoke('csvToJson', {
            body: formData
        });

        if (catalogError || !catalogData) throw catalogError;

        return catalogData;
    }

    async fetchLessonsForCatalog(catalogId: number) {
        const {data, error} = await supabase
            .from('lessons')
            .select('*')
            .eq('catalog_id', catalogId)
            .select()

        if (error) throw error;

        if (data) {
            return data;
        }
    }

    async fetchCatalogs(examples: boolean = false) {
        const {data, error} = await supabase
            .from('catalogs')
            .select('*')
            .eq('example', examples)

        if (error) throw error;

        if (data) {
            return data;
        }
    }

    async deleteCatalog(catalogId: number):Promise<CatalogDTO[]> {
        const {data, error} = await supabase
            .from('catalogs')
            .delete()
            .eq('catalog_id', catalogId)
            .select();

        if (error) throw error;

        return data;

    }

}

const CatalogService = new CatalogServiceClass();

export default CatalogService;