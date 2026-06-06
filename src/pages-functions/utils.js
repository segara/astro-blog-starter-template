const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "OPTIONS,POST",
};

export function handleOptions(request) {
  if (request.method !== "OPTIONS") return null;

  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export function json(data, init = {}) {
  return Response.json(data, {
    ...init,
    headers: {
      ...corsHeaders,
      ...init.headers,
    },
  });
}

export function methodNotAllowed() {
  return json({ error: "Method not allowed" }, { status: 405 });
}

export async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}
