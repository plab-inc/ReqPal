import {supabase} from "@/plugins/supabase";
import {
    Product,
    ProductDTO,
} from "@/types/catalog.ts";

class ProductServiceClass {

    public push = {
        uploadProduct: this.uploadProduct.bind(this),
        updateProduct: this.updateProduct.bind(this),
        deleteProduct: this.deleteProduct.bind(this),
    };

    public pull = {
        fetchProductsByCatalogId: this.fetchProductsByCatalogId.bind(this),
        fetchProductById: this.fetchProductById.bind(this),
        fetchExampleProducts: this.fetchExampleProducts.bind(this),
        fetchProductsByUser: this.fetchProductsByUser.bind(this),
    };

    private async fetchProductsByCatalogId(catalogId: string): Promise<Product[] | undefined> {
        const {data, error} = await supabase
            .from("product_catalogs")
            .select("products(product_id, product_name, product_url)")
            .eq("catalog_id", catalogId);

        if (error) throw error;

        return data?.reduce((products: Product[], item) => {
            if (item.products) products.push(item.products);
            return products;
        }, []) || undefined;
    }

    private async fetchProductById(productId: string): Promise<ProductDTO | undefined> {
        const {data, error} = await supabase
            .from("products")
            .select("*")
            .eq("product_id", productId)
            .single();

        if (error) throw error;

        if (data) {
            return data as ProductDTO;
        }
    }

    private async fetchExampleProducts(): Promise<Product[] | undefined> {
        const {data, error} = await supabase
            .from("catalogs")
            .select(`
    catalog_id,
    products:product_catalogs!inner(
      product_id,
      product:products(
        product_id,
        product_name,
        product_url
      )
    )
  `)
            .eq("example", true);

        if (error) throw error;

        if (data) {
            let result = data.flatMap(catalog => catalog.products.map(pc => pc.product));
            return result as Product[];
        }
        return undefined;
    }

    private async fetchProductsByUser(): Promise<Product[] | undefined> {
        const {data, error} = await supabase
            .from("products")
            .select("*")

        if (error) throw error;

        if (data) {
            return data as Product[];
        }
    }


    private async uploadProduct(product: Product, userUUID: string): Promise<ProductDTO | undefined> {
        const {data, error} = await supabase
            .from('products')
            .insert(
                {
                    product_name: product.product_name,
                    product_url: product.product_url,
                    user_id: userUUID
                }
            )
            .select()

        if (error) throw error;

        return data[0] as ProductDTO;
    }

    private async updateProduct(product: Product) {
        if (!product.product_id) {
            throw new Error("Product Id not found.")
        }
        const {error} = await supabase
            .from("products")
            .update({
                product_name: product.product_name,
                product_url: product.product_url
            })
            .eq("product_id", product.product_id);

        if (error) {
            throw error;
        }
    }

    async deleteProduct(productId: string): Promise<ProductDTO[]> {
        const {data, error} = await supabase
            .from("products")
            .delete()
            .eq("product_id", productId)
            .select();

        if (error) throw error;

        return data;
    }
}

const ProductService = new ProductServiceClass();

export default ProductService;