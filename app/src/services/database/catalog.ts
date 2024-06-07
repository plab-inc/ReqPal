import { supabase } from "@/plugins/supabase";
import {
  Catalog,
  CatalogDTO,
  ProductDTO,
  ProductRequirementDTO,
  Requirement,
  RequirementDTO
} from "@/types/catalog.ts";
import { FunctionsHttpError } from "@supabase/supabase-js";
import { ConversionError } from "@/errors/custom.ts";
import { mapToCatalog } from "@/mapper/catalog.ts";

class CatalogServiceClass {

  public push = {
    uploadCatalog: this.uploadCatalog.bind(this),
    deleteCatalog: this.deleteCatalog.bind(this),
    updateRequirement: this.updateRequirement.bind(this)
  };

  public pull = {
    fetchRequirementsByCatalogId: this.fetchRequirementsByCatalogId.bind(this),
    fetchCatalogs: this.fetchCatalogs.bind(this),
    fetchProductDetailsByRequirement: this.fetchProductDetailsByRequirement.bind(this),
    fetchCatalogByCatalogId: this.fetchFullCatalogById.bind(this),
    fetchProductsByCatalogId: this.fetchProductsByCatalogId.bind(this),
    fetchProductById: this.fetchProductById.bind(this),
    fetchProductDetailsByRequirementWithQualificationByProductId: this.fetchProductDetailsByRequirementWithQualificationByProductId.bind(this),
    fetchProductDetailsByRequirementWithoutQualificationByProductId: this.fetchProductDetailsByRequirementWithoutQualificationByProductId.bind(this),
    checkIfCatalogNameExists: this.checkIfCatalogNameExists.bind(this),
    downloadCatalog: this.downloadCatalog.bind(this)
  };

  private async fetchRequirementsByCatalogId(catalogId: string): Promise<RequirementDTO[] | undefined> {
    const { data, error } = await supabase
      .from("catalogs")
      .select("requirements(requirement_id, catalog_id, reqid, title, description)")
      .eq("catalog_id", catalogId)
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

  private async fetchFullCatalogById(catalogId: string): Promise<Catalog | undefined> {
    const { data, error } = await supabase
      .from("catalogs")
      .select(`
      catalog_id,
      catalog_name,
      products:product_catalogs(
        products(
          product_id,
          product_name,
          product_url
        )
      ),
       requirements(
        requirement_id,
        reqid, 
        title, 
        description,
        productDetails:product_requirements (
          product:products (
            product_name
          ),
          qualification,
          comment
        )
      )
    `)
      .eq("catalog_id", catalogId)
      .order("reqid", { referencedTable: "requirements" })
      .single();

    if (error) throw error;

    if (data) {
      return mapToCatalog(data) as Catalog;
    }

    return undefined;
  }

  private async fetchProductsByCatalogId(catalogId: string): Promise<ProductDTO[] | undefined> {
    const { data, error } = await supabase
      .from("product_catalogs")
      .select("products(product_id, product_name, product_url)")
      .eq("catalog_id", catalogId);

    if (error) throw error;

    return data?.reduce((productDTOS: ProductDTO[], item) => {
      if (item.products) productDTOS.push(item.products);
      return productDTOS;
    }, []) || undefined;
  }

  private async fetchProductDetailsByRequirement(requirementId: string): Promise<ProductRequirementDTO[] | undefined> {
    const { data, error } = await supabase
      .from("product_requirements")
      .select("product_requirement_id, qualification, comment, requirement_id, product_id")
      .eq("requirement_id", requirementId);

    if (error) throw error;

    if (data) {
      return data as ProductRequirementDTO[];
    }
  }

  private async fetchProductDetailsByRequirementWithQualificationByProductId(requirementId: string, productId: string): Promise<ProductRequirementDTO | undefined> {
    const { data, error } = await supabase
      .from("product_requirements")
      .select("product_requirement_id, comment, requirement_id, product_id, qualification")
      .eq("requirement_id", requirementId)
      .eq("product_id", productId)
      .single();

    if (error) throw error;

    if (data) {
      return data as ProductRequirementDTO;
    }
  }

  private async fetchProductDetailsByRequirementWithoutQualificationByProductId(requirementId: string, productId: string): Promise<ProductRequirementDTO | undefined> {
    const { data, error } = await supabase
      .from("product_requirements")
      .select("product_requirement_id, comment, requirement_id, product_id")
      .eq("requirement_id", requirementId)
      .eq("product_id", productId)
      .single();

    if (error) throw error;

    if (data) {
      return data as ProductRequirementDTO;
    }
  }

  private async fetchProductById(productId: string): Promise<ProductDTO | undefined> {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("product_id", productId)
      .single();

    if (error) throw error;

    if (data) {
      return data as ProductDTO;
    }
  }

  private async downloadCatalog(catalogId: string): Promise<any> {

    const { data: data, error: error } = await supabase.functions.invoke("catalog/download", {
      body: { "catalog_id": catalogId }
    });

    if (error || !data) {
      throw error;
    }

    return data;
  }

  private async updateRequirement(requirement: Requirement) {
    const { data, error } = await supabase
      .from("requirements")
      .update({
        title: requirement.title,
        description: requirement.description,
        reqid: requirement.reqId
      })
      .eq("requirement_id", requirement.requirement_id);

    if (data) {
      return;
    }

    if (error) {
      throw error;
    }
  }

  async uploadCatalog(csvFile: File): Promise<void> {

    const formData = new FormData();
    formData.append("csv", csvFile);

    const { data: data, error: error } = await supabase.functions.invoke("catalog/upload", {
      body: formData
    });

    if (error) {
      if (error instanceof FunctionsHttpError) {
        const errorMessage = await error.context.json();
        throw new ConversionError(errorMessage.error, 400);
      }
      throw error;
    }

    if (data) {
      return;
    }

  }

  async fetchCatalogs(examples: boolean = false): Promise<CatalogDTO[] | undefined> {
    const { data, error } = await supabase
      .from("catalogs")
      .select("*")
      .eq("example", examples);

    if (error) throw error;

    if (data) {
      return data;
    }
  }

  async deleteCatalog(catalogId: string): Promise<CatalogDTO[]> {
    const { data, error } = await supabase
      .from("catalogs")
      .delete()
      .eq("catalog_id", catalogId)
      .select();

    if (error) throw error;

    return data;
  }

  private async checkIfCatalogNameExists(catalogName: string): Promise<boolean> {
    const { error, count } = await supabase
      .from("catalogs")
      .select("catalog_name", { count: "exact", head: true })
      .eq("catalog_name", catalogName)
      .eq("example", false);

    if (error) throw error;

    if (count) {
      return count > 0;
    }
    return false;
  }

}

const CatalogService = new CatalogServiceClass();

export default CatalogService;