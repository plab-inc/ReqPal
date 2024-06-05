import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { handleUpload } from "./upload/index.ts";
import { handleDownload } from "./download/index.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const catalogRouter = {
  "/catalog/upload": handleUpload,
  "/catalog/download": handleDownload
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const path = url.pathname.toLowerCase();

  if (catalogRouter[path]) {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: {Authorization: req.headers.get('Authorization')!},
        },
      }
    )

    return catalogRouter[path](req, corsHeaders, supabase);
  }

  return new Response('Not found', { status: 404, headers: corsHeaders });
});