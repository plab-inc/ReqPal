import {supabase} from "@/plugins/supabase";
import {Catalog, CatalogDTO, ProductDTO, ProductRequirementDTO, RequirementDTO} from "@/types/catalog.types";

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
        fetchProductsByCatalogId: this.fetchProductsByCatalogId.bind(this),
        fetchProductById: this.fetchProductById.bind(this),
        fetchProductDetailsByRequirementWithQualificationByProductId: this.fetchProductDetailsByRequirementWithQualificationByProductId.bind(this),
        fetchProductDetailsByRequirementWithoutQualificationByProductId: this.fetchProductDetailsByRequirementWithoutQualificationByProductId.bind(this)
    }

    private async fetchRequirementsByCatalogId(catalogId: number): Promise<RequirementDTO[] | undefined> {
        const {data, error} = await supabase
            .from('catalogs')
            .select('requirements(requirement_id, catalog_id, reqid, title, description)')
            .eq('catalog_id', catalogId)
            .single();

        if (error) throw error;

        return data?.requirements?.map((req: any) => ({
            requirement_id: req.requirement_id,
            catalog_id: req.catalog_id,
            reqid: req.reqid,
            title: req.title,
            description: req.description
        }));
    }

    private async fetchCatalogById(catalogId: number): Promise<CatalogDTO | undefined> {
        const {data, error} = await supabase
            .from('catalogs')
            .select('*')
            .eq('catalog_id', catalogId)
            .single();

        if (error) throw error;

        if (data) {
            return data as CatalogDTO;
        }
    }

    private async fetchProductsByCatalogId(catalogId: number): Promise<ProductDTO[] | undefined> {
        const {data, error} = await supabase
            .from('product_catalogs')
            .select('products(product_id, product_name, product_url)')
            .eq('catalog_id', catalogId)

        if (error) throw error;

        return data?.reduce((productDTOS: ProductDTO[], item) => {
            if (item.products) productDTOS.push(item.products);
            return productDTOS;
        }, []) || undefined;
    }

    private async fetchProductDetailsByRequirement(requirementId: number): Promise<ProductRequirementDTO[] | undefined> {
        const {data, error} = await supabase
            .from('product_requirements')
            .select('product_requirement_id, qualification, comment, requirement_id, product_id')
            .eq('requirement_id', requirementId)

        if (error) throw error;

        if (data) {
            return data as ProductRequirementDTO[];
        }
    }

    private async fetchProductDetailsByRequirementWithQualificationByProductId(requirementId: number, productId: number): Promise<ProductRequirementDTO | undefined> {
        const {data, error} = await supabase
            .from('product_requirements')
            .select('product_requirement_id, comment, requirement_id, product_id, qualification')
            .eq('requirement_id', requirementId)
            .eq('product_id', productId)
            .single()

        if (error) throw error;

        if (data) {
            return data as ProductRequirementDTO;
        }
    }

    private async fetchProductDetailsByRequirementWithoutQualificationByProductId(requirementId: number, productId: number): Promise<ProductRequirementDTO | undefined> {
        const {data, error} = await supabase
            .from('product_requirements')
            .select('product_requirement_id, comment, requirement_id, product_id')
            .eq('requirement_id', requirementId)
            .eq('product_id', productId)
            .single()

        if (error) throw error;

        if (data) {
            return data as ProductRequirementDTO;
        }
    }

    private async fetchProductById(productId: number): Promise<ProductDTO | undefined> {
        const {data, error} = await supabase
            .from('products')
            .select('*')
            .eq('product_id', productId)
            .single()

        if (error) throw error;

        if (data) {
            return data as ProductDTO;
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

    async fetchCatalogs(examples: boolean = false): Promise<CatalogDTO[] | undefined> {
        const {data, error} = await supabase
            .from('catalogs')
            .select('*')
            .eq('example', examples)

        if (error) throw error;

        if (data) {
            return data;
        }
    }

    async deleteCatalog(catalogId: number): Promise<CatalogDTO[]> {
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