import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: {Authorization: req.headers.get('Authorization')!},
        },
      }
    )

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
});

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
      req.reqid,
      req.title,
      req.description
    ];
    let productMap = {};
    req.productDetails.forEach(detail => {
      productMap[detail.product.product_name] = detail;
    });
    products.forEach(product => {
      if (product.product_name in productMap) {
        row.push(productMap[product.product_name].qualification, productMap[product.product_name].comment);
      } else {
        row.push('', '');
      }
    });
    csv.push(row.join(';'));
  });

  return csv.join('\n');
}