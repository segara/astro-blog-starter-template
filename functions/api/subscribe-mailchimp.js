import {
  handleOptions,
  json,
  methodNotAllowed,
  readJson,
} from "../../src/pages-functions/utils.js";

export async function onRequest(context) {
  const { request, env } = context;
  const optionsResponse = handleOptions(request);
  if (optionsResponse) return optionsResponse;
  if (request.method !== "POST") return methodNotAllowed();

  const { MAILCHIMP_API_KEY, MAILCHIMP_SERVER_PREFIX, MAILCHIMP_LIST_ID } = env;

  if (!MAILCHIMP_API_KEY || !MAILCHIMP_SERVER_PREFIX || !MAILCHIMP_LIST_ID) {
    return json({
      error: "Missing MailChimp configuration, please check your Pages environment variables.",
    });
  }

  const { email } = await readJson(request);
  if (!email) return json({ error: "Missing email" }, { status: 400 });

  const data = JSON.stringify({
    email_address: email,
    status: "pending",
  });

  try {
    const resp = await fetch(
      `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${MAILCHIMP_API_KEY}`,
        },
        body: data,
      },
    );
    const response = await resp.json();

    return json({
      statusCode: 200,
      status: response?.title ? response.title : response?.status,
      email: response?.email_address,
    });
  } catch (e) {
    console.log("ERROR[]", e);
    return json({ error: "Mailchimp error" }, { status: 500 });
  }
}
