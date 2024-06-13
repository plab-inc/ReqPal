import { supabase } from "@/plugins/supabase";
import {
  Catalog,
  CatalogDTO,
  Product,
  ProductDetail,
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
    addCatalog: this.addCatalog.bind(this),
    deleteCatalog: this.deleteCatalog.bind(this),
    updateCatalogName: this.updateCatalogName.bind(this),
    addRequirement: this.addRequirement.bind(this),
    deleteRequirement: this.deleteRequirement.bind(this),
    updateRequirement: this.updateRequirement.bind(this),
    addProduct: this.addProduct.bind(this),
    removeProductFromCatalogAndRequirements: this.removeProductFromCatalogAndRequirements.bind(this),
    addProductToCatalogAndRequirements: this.addProductToCatalogAndRequirements.bind(this),
    updateProductDetailsForRequirement: this.updateProductDetailsForRequirement.bind(this),
    insertProductDetailsForRequirement: this.insertProductDetailsForRequirement.bind(this)
  };

  public pull = {
    fetchRequirementsByCatalogId: this.fetchRequirementsByCatalogId.bind(this),
    fetchCatalogs: this.fetchCatalogs.bind(this),
    fetchProductDetailsByRequirement: this.fetchProductDetailsByRequirement.bind(this),
    fetchCatalogByCatalogId: this.fetchFullCatalogById.bind(this),
    fetchProductDetailsByRequirementWithQualificationByProductId: this.fetchProductDetailsByRequirementWithQualificationByProductId.bind(this),
    fetchProductDetailsByRequirementWithoutQualificationByProductId: this.fetchProductDetailsByRequirementWithoutQualificationByProductId.bind(this),
    checkIfCatalogNameExists: this.checkIfCatalogNameExists.bind(this),
    downloadCatalog: this.downloadCatalog.bind(this)
  };

  private async fetchRequirementsByCatalogId(catalogId: string): Promise<RequirementDTO[] | undefined> {
    const { data, error } = await supabase
      .from("catalogs")
      .select("requirements(requirement_id, catalog_id, label, title, description)")
      .eq("catalog_id", catalogId)
      .single();

    if (error) throw error;

    return data?.requirements?.map((req: any) => ({
      requirement_id: req.requirement_id,
      catalog_id: req.catalog_id,
      label: req.label,
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
      user_id,
      products:product_catalogs(
        products(
          product_id,
          product_name,
          product_url
        )
      ),
       requirements(
        requirement_id,
        label, 
        title, 
        description,
        productDetails:product_requirements (
          product:products(
            product_id,
            product_name
          ),
          qualification,
          comment
        )
      )
    `)
      .eq("catalog_id", catalogId)
      .order("label", { referencedTable: "requirements" })
      .single();

    if (error) throw error;

    if (data) {
      return mapToCatalog(data) as Catalog;
    }

    return undefined;
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
        label: requirement.label
      })
      .eq("requirement_id", requirement.requirement_id)
      .select()

    if (error) {
      throw error;
    }

    return data;
  }

  private async addRequirement(catalogId: string, requirement: Requirement) {
    const { data, error } = await supabase
      .from("requirements")
      .insert({
        catalog_id: catalogId,
        label: requirement.label,
        title: requirement.title,
        description: requirement.description
      })
      .select()
      .single();

    if (data) {
      return data as RequirementDTO;
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

  private async addProduct(product: Product, userUUID: string): Promise<ProductDTO | undefined> {
    const { data, error } = await supabase
      .from("products")
      .insert(
        {
          product_name: product.product_name,
          product_url: product.product_url,
          user_id: userUUID
        }
      )
      .select()
      .single();

    if (error) throw error;

    return data as ProductDTO;
  }

  private async addProductToCatalogAndRequirements(product: Product, catalog: Catalog) {
    const { error: catalogError } = await supabase
      .from("product_catalogs")
      .insert([
        {
          catalog_id: catalog.catalog_id,
          product_id: product.product_id
        }
      ]);

    if (catalogError) throw catalogError;

    //adding new product to requirements of the catalog with default values
    //using a bulk create operation which is handled in a single transaction
    const productRequirements = catalog.requirements.map((requirement) => ({
      requirement_id: requirement.requirement_id,
      product_id: product.product_id,
      comment: product.product_name.trim() + "-Kommentar",
      qualification: 1
    }));

    const { data: reqProducts, error: reqError } = await supabase
      .from("product_requirements")
      .insert(productRequirements)
      .select();

    if (reqError) throw reqError;

    if(reqProducts) return reqProducts;
  }

  private async insertProductDetailsForRequirement(productId: string, productDetails: ProductDetail, requirementId: string) {
    const { error } = await supabase
      .from("product_requirements")
      .insert({
        requirement_id: requirementId,
        product_id: productId,
        qualification: productDetails.qualification,
        comment: productDetails.comment
      });

    if (error) {
      throw error;
    }
  }

  private async updateProductDetailsForRequirement(productId: string, productDetails: ProductDetail, requirementId: string) {
    const { data, error } = await supabase
      .from("product_requirements")
      .update({
        qualification: productDetails.qualification,
        comment: productDetails.comment
      })
      .eq("product_id", productId)
      .eq("requirement_id", requirementId)
      .select();

    if (error) {
      throw error;
    }

    return data;
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

  async updateCatalogName(catalogId: string, catalogName: string): Promise<CatalogDTO[]> {
    const { data, error } = await supabase
      .from("catalogs")
      .update({catalog_name: catalogName})
      .eq("catalog_id", catalogId)
      .select();

    if (error) throw error;

    return data;
  }

  async addCatalog(catalogName: string, userId: string): Promise<CatalogDTO> {
    const { data, error } = await supabase
      .from("catalogs")
      .insert({catalog_name: catalogName, user_id: userId})
      .select()
      .single();

    if (error) throw error;

    return data as CatalogDTO;
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

  async deleteRequirement(requirementId: string): Promise<RequirementDTO[]> {
    const { data, error } = await supabase
      .from("requirements")
      .delete()
      .eq("requirement_id", requirementId)
      .select();

    if (error) throw error;

    return data;
  }

  async removeProductFromCatalogAndRequirements(productId: string, catalogId: string): Promise<void> {
    const { error } = await supabase.rpc("remove_product_from_catalog", {
      productid: productId,
      catalogid: catalogId
    });

    if (error) {
      throw error;
    }
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
