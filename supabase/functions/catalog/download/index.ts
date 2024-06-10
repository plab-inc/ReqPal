export async function handleDownload(req: Request, corsHeaders: any, supabase: any) {
  try {
    const { catalog_id } = await req.json();

    if (!catalog_id) {
      return new Response(JSON.stringify({ error: "Catalog ID parameter is required" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      });
    }

    const { data, error } = await fetchCatalogData(supabase, catalog_id);

    if (error) {
      throw error;
    }

    if (!data) {
      return new Response(JSON.stringify({ error: "Catalog not found" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404
      });
    }

    const csv = convertToCSV(data);
    const responseData = {
      catalog_name: data.catalog_name,
      csv: csv
    };

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
}

async function fetchCatalogData(supabase, catalog_id) {
  const { data, error } = await supabase
    .from('catalogs')
    .select(`
      catalog_name,
      product_catalogs(
        products(
          product_name,
          product_url
        )
      ),
      requirements(
        label, 
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
    .eq('catalog_id', catalog_id)
    .single();

  return { data, error };
}

function convertToCSV(data) {
  let csv = [];
  let headerRow = ['', '', ''];
  let products = data.product_catalogs.map(catalog => catalog.products);

  products.forEach(product => {
    headerRow.push(product.product_name, product.product_url);
  });
  csv.push(headerRow.join(';'));

  let columnHeaders = ['Req-ID', 'Titel', 'Beschreibung'];
  products.forEach(() => {
    columnHeaders.push('Qualifizierung', 'Kommentar');
  });
  csv.push(columnHeaders.join(';'));

  data.requirements.forEach(req => {
    let row = [
      req.label,
      req.title,
      req.description
    ];
    let productMap = {};
    req.productDetails.forEach(detail => {
      productMap[detail.product_id] = detail;
    });
    products.forEach(product => {
      if (product.product_id in productMap) {
        row.push(productMap[product.product_id].qualification, productMap[product.product_id].comment);
      } else {
        row.push('', '');
      }
    });
    csv.push(row.join(';'));
  });

  return csv.join('\n');
}