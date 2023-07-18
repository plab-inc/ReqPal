import {serve} from "https://deno.land/std@0.168.0/http/server.ts";

interface Product {
  qualification: string;
  comment: string;
}

interface Requirement {
  reqId: string;
  title: string;
  description: string;
  products: { [key: string]: Product };
}

interface RequirementsJSON {
  requirements: Requirement[];
}

serve(async (req)=>{
    
    const contentType = req.headers.get('Content-Type');
    if (!contentType || !contentType.includes('multipart/form-data')) {
        return new Response(JSON.stringify({
            error: "Invalid Content-Type. Must be multipart/form-data."
        }), {
            headers: {
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
                'Content-Type': 'application/json'
            },
            status: 422
        });
    }
    
    const csvString = new TextDecoder('utf-8').decode(await csvFile.arrayBuffer());
    if (!validateCSVFormat(csvString)) {
        return new Response(JSON.stringify({
            error: "Invalid CSV format"
        }), {
            headers: {
                'Content-Type': 'application/json'
            },
            status: 400
        });
    }
    
    const json = convertCSVtoJSONString(csvString);
    const response = new Response(JSON.stringify(json, null, 2), {
        headers: {
            'Content-Type': 'application/json'
        },
        status: 200
    });
    console.log('CSV to JSON conversion successful');
    return response;
});
function validateCSVFormat(csvString: string) {
    const productCol = csvString.replace(/\r/g, "").split("\n")[0];
    const productList = productCol.split(';').filter((product)=>product !== '');
    const requirementRowTitlesCol = csvString.replace(/\r/g, "").split("\n")[1];
    return checkProductsColumn(productCol) && checkRequirementColumns(requirementRowTitlesCol, productList.length);
}
function checkProductsColumn(productCol: string) {
    if (productCol.length === 0) {
        console.error('Product column is empty');
        return false;
    }
    if (!productCol.startsWith(';;;')) {
        console.error('Product column does not start with ";;;"');
        return false;
    }
    if (!productCol.endsWith(';')) {
        console.error('Product column does not end with ";"');
        return false;
    }
    const fields = productCol.split(';;').slice(1, -1);
    for (const field of fields){
        if (field === '') {
            console.error('Product column contains empty field');
            return false;
        }
    }
    return true;
}
function checkRequirementColumns(line: string, products: number) {
    const requirementFields = line.split(';').slice(0, 3);
    const productFields = line.split(';').slice(3);
    if (productFields.length % 2 !== 0 || productFields.length / 2 !== products) {
        console.error('Invalid number of product fields');
        return false;
    }
    for(let i = 0; i < productFields.length; i += 2){
        if (productFields[i] !== 'Qualifizierung' || productFields[i + 1] !== 'Kommentar') {
            console.error('Invalid product colum titles');
            return false;
        }
    }
    const correctTitles = ['Req-ID', 'Titel', 'Beschreibung'];
    for (let i = 0; i < correctTitles.length; i++) {
        if (requirementFields[i] !== correctTitles[i]) {
            console.error('Invalid requirement column titles');
            return false;
        }
    }
    return true;
}
function convertCSVtoJSONString(csvString: string): RequirementsJSON {
    const lines = csvString.replace(/\r/g, "").split("\n");
    const products = lines[0].split(";;;")[1].split(";;");
    const requirementsJson: RequirementsJSON = {
        requirements: []
    };
    for(let i = 2; i < lines.length; i++){
        const currentLine = lines[i].split(";");
        const item: Requirement = {
            "reqId": currentLine[0],
            "title": currentLine[1],
            "description": currentLine[2],
            "products": {}
        };
        for(let k = 0; k < products.length; k++){
            const product = products[k];
            const qualification = currentLine[k * 2 + 3];
            const comment = currentLine[k * 2 + 4];
            item.products[product] = {
                "qualification": qualification,
                "comment": comment
            };
        }
        requirementsJson.requirements.push(item);
    }
    return requirementsJson;
}