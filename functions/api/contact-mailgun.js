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

  const {
    MAILGUN_API_KEY,
    MAILGUN_API_URL,
    MAILGUN_DOMAIN,
    FROM_EMAIL_ADDRESS,
    TO_EMAIL_ADDRESS,
  } = env;

  if (
    !MAILGUN_API_KEY ||
    !MAILGUN_API_URL ||
    !MAILGUN_DOMAIN ||
    !FROM_EMAIL_ADDRESS ||
    !TO_EMAIL_ADDRESS
  ) {
    return json({
      error: "Missing MailGun configuration, please check your Pages environment variables.",
    });
  }

  const { email, name, message, topicEmail } = await readJson(request);
  if (!email) return json({ error: "Missing email" }, { status: 400 });

  const payload = new URLSearchParams();
  payload.append("from", FROM_EMAIL_ADDRESS);
  payload.append("to", topicEmail ? topicEmail : TO_EMAIL_ADDRESS);
  payload.append("h:Reply-To", email);
  payload.append("subject", `Contact Form: ${name} ${email}`);
  payload.append("text", message);

  try {
    const resp = await fetch(`${MAILGUN_API_URL}/v3/${MAILGUN_DOMAIN}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${btoa(`api:${MAILGUN_API_KEY}`)}`,
      },
      body: payload,
    });
    await resp.json();

    return json({
      statusCode: 200,
      status: resp?.ok ? "ok" : "error",
      body: "Your message was sent successfully! We'll be in touch.",
    });
  } catch (e) {
    console.log("ERROR:", e);
    return json(
      {
        statusCode: 400,
        status: "error",
        error: "Mailgun error",
      },
      { status: 500 },
    );
  }
}
