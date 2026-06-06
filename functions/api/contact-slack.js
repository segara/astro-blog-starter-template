import {
  handleOptions,
  json,
  methodNotAllowed,
  readJson,
} from "../../src/pages-functions/utils.js";

const formUrl = "https://slack.com/api/chat.postMessage";

export async function onRequest(context) {
  const { request, env } = context;
  const optionsResponse = handleOptions(request);
  if (optionsResponse) return optionsResponse;
  if (request.method !== "POST") return methodNotAllowed();

  const { SLACK_CHANNEL_ID, SLACK_TOKEN } = env;
  const { email, message, topicChannel } = await readJson(request);

  if (!SLACK_CHANNEL_ID || !SLACK_TOKEN) {
    return json({
      error: "Missing Slack configuration, please check your Pages environment variables.",
    });
  }
  if (!email) return json({ error: "Missing email" }, { status: 400 });
  if (!message) return json({ error: "Missing message" }, { status: 400 });

  const data = {
    channel: topicChannel ? topicChannel : SLACK_CHANNEL_ID,
    text: `Contact Form submission \n \n ${message}`,
    icon_emoji: ":ok_hand:",
  };

  try {
    const resp = await fetch(formUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SLACK_TOKEN}`,
      },
      body: JSON.stringify(data),
    });
    const response = await resp.json();

    return json({
      statusCode: 200,
      status: response?.ok ? "ok" : "error",
    });
  } catch (e) {
    console.log("ERROR[]", e);
    return json({ error: "Slack error" }, { status: 500 });
  }
}
