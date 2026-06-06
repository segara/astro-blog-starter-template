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

  const { POSTMARK_SERVER_TOKEN, FROM_EMAIL_ADDRESS, TO_EMAIL_ADDRESS } = env;

  if (!POSTMARK_SERVER_TOKEN || !FROM_EMAIL_ADDRESS || !TO_EMAIL_ADDRESS) {
    return json({
      error: "Missing Postmark configuration, please check your Pages environment variables.",
    });
  }

  const { email, name, message, topicEmail } = await readJson(request);
  if (!email) return json({ error: "Missing email" }, { status: 400 });

  const emailObject = {
    From: FROM_EMAIL_ADDRESS,
    To: topicEmail ? topicEmail : TO_EMAIL_ADDRESS,
    Subject: `Contact Form: ${name} ${email}`,
    TextBody: message,
  };

  try {
    const resp = await fetch("https://api.postmarkapp.com/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Postmark-Server-Token": POSTMARK_SERVER_TOKEN,
      },
      body: JSON.stringify(emailObject),
    });
    const response = await resp.json();

    return json({
      statusCode: 200,
      status: resp?.ok ? "ok" : "error",
      body: resp?.ok
        ? "Your message was sent successfully! We'll be in touch."
        : response?.Message,
    });
  } catch (e) {
    console.log("ERROR[]", e);
    return json(
      {
        statusCode: 400,
        status: "error",
        error: "Postmark error",
      },
      { status: 500 },
    );
  }
}
