import {serve} from "https://deno.land/std@0.168.0/http/server.ts";

//Author: Fabian

interface ProductDetails {
  qualification: string;
  comment: string;
}

export type Product = {
    product_name: string;
    product_url: string;
}

interface Requirement {
  reqId: string;
  title: string;
  description: string;
  productDetails: { [key: string]: ProductDetails };
}

interface RequirementsJSON {
    catalog_name: string;
    products: Product[]
    requirements: Requirement[];
}

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ValidationError";
    }
}

serve(async (req) => {

    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const contentType = req.headers.get('Content-Type');

        if (!contentType || !contentType.includes('multipart/form-data')) {
            return new Response(JSON.stringify({
                error: "Invalid Content-Type. Must be multipart/form-data."
            }), {
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json'
                },
                status: 415
            });
        }

        const formData = await req.formData();
        const csvFile: File = formData.get('csv') as File;

        if (!csvFile) {
            return new Response(JSON.stringify({
                error: "No CSV file found in form data."
            }), {
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json'
                },
                status: 422
            });
        }

        const csvString = new TextDecoder('utf-8').decode(await csvFile.arrayBuffer());
        validateCSVFormat(csvString);

        const fileNameWithoutExtension = csvFile.name.substring(0, csvFile.name.lastIndexOf('.'));
        const json = convertCSVtoJSONString(csvString, fileNameWithoutExtension);

        return new Response(JSON.stringify(json, null, 2), {
            headers: {
                ...corsHeaders,
                'Content-Type': 'application/json'
            },
            status: 200
        });


    } catch (error) {

        if (error instanceof ValidationError) {
            return new Response(JSON.stringify({ error: error.message }), {
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json'
                },
                status: 400,
            });
        }

        return new Response(JSON.stringify({ error: error.message }), {
            headers: {
                ...corsHeaders,
                'Content-Type': 'application/json'
            },
            status: 500,
        });
    }
});


function validateCSVFormat(csvString: string){
    const productCol = csvString.replace(/\r/g, "").split("\n")[0];
    checkProductsColumn(productCol);

    const productList = productCol.split(';;;')[1].split(';').filter((product)=>product !== '');
    const requirementRowTitlesCol = csvString.replace(/\r/g, "").split("\n")[1];
    checkRequirementColumns(requirementRowTitlesCol, productList.length / 2);
}
function checkProductsColumn(productRow: string) {
    if (productRow.length === 0) {
        console.error('Product column is empty');
        throw new ValidationError('Product column is empty');
    }
    if (!productRow.startsWith(';;;')) {
        console.error('Product column does not start with ";;;"');
        throw new ValidationError('Product column does not start with ";;;"');
    }

    const fields = productRow.split(';;;')[1].split(';');

    for (const field of fields){
        if (field === '') {
            console.error('Product-Name/-URL column contains empty field');
            throw new ValidationError('Product-Name/-URL column contains empty field');
        }
    }
    if (fields.length % 2 !== 0) {
        console.error('Product column does not contain pairs of product names and URLs');
        throw new ValidationError('Product column does not contain pairs of product names and URLs');
    }

    for (let i = 0; i < fields.length; i += 2) {
        const productURL = fields[i + 1].trim();

        if (!productURL.startsWith('http://') && !productURL.startsWith('https://')) {
            console.error(`Product URL "${productURL}" is not valid.`);
            throw new ValidationError(`Product URL "${productURL}" is not valid.`);
        }

    }

    return true;
}
function checkRequirementColumns(line: string, products: number) {
    const requirementFields = line.split(';').slice(0, 3);
    const productFields = line.split(';').slice(3);
    if (productFields.length % 2 !== 0 || productFields.length / 2 !== products) {
        console.error('Invalid number of product fields');
        throw new ValidationError('Invalid number of product fields');
    }
    for(let i = 0; i < productFields.length; i += 2){
        if (productFields[i] !== 'Qualifizierung' || productFields[i + 1] !== 'Kommentar') {
            console.error('Invalid product colum titles');
            throw new ValidationError('Invalid product colum titles');
        }
    }
    const correctTitles = ['Req-ID', 'Titel', 'Beschreibung'];
    for (let i = 0; i < correctTitles.length; i++) {
        if (requirementFields[i] !== correctTitles[i]) {
            console.error('Invalid requirement column titles');
            throw new ValidationError('Invalid requirement column titles');
        }
    }
    return true;
}
function convertCSVtoJSONString(csvString: string, fileName: string): RequirementsJSON {
    const lines = csvString.replace(/\r/g, "").split("\n");
    const products = lines[0].split(";;;")[1].split(';');

    const mappedProducts: Product[] = [];

    for (let i = 0; i < products.length; i += 2) {
        mappedProducts.push({
            product_name: products[i],
            product_url: products[i + 1],
        });
    }


    const requirementsJson: RequirementsJSON = {
        catalog_name: fileName,
        products: mappedProducts,
        requirements: []
    };
    for(let i = 2; i < lines.length; i++){
        const currentLine = lines[i].split(";");
        const item: Requirement = {
            "reqId": currentLine[0],
            "title": currentLine[1],
            "description": currentLine[2],
            "productDetails": {}
        };
        for(let k = 0; k < mappedProducts.length; k++){
            const product = mappedProducts[k];
            const qualification = currentLine[k * 2 + 3];
            const comment = currentLine[k * 2 + 4];
            item.productDetails[product.product_name] = {
                "qualification": qualification,
                "comment": comment
            };
        }
        requirementsJson.requirements.push(item);
    }
    return requirementsJson;
}