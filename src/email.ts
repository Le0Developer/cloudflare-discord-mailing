// @ts-ignore -- no types for now (PR soon?)
import PostalMime from "postal-mime";

import { EmailMessage, Env, PostalMail } from "./types";
import { makeEmbed } from "./embed";
import { APIActionRowComponent, APIButtonComponentWithCustomId, APIMessageActionRowComponent, ButtonStyle, ComponentType, RESTPostAPIChannelMessageFormDataBody } from "discord-api-types/v10";
import getChannelId from "./routing";


const REPLY_BUTTON: APIButtonComponentWithCustomId = {
    type: ComponentType.Button,
    custom_id: "reply",
    style: ButtonStyle.Secondary,
    label: "Reply to E-Mail"
};
const REPLY_COMPONENT: APIActionRowComponent<APIMessageActionRowComponent> = {
    type: ComponentType.ActionRow,
    components: [REPLY_BUTTON]
}

export default async function handleEmail(message: EmailMessage, env: Env) {
    // parse the email
    const parser = new PostalMime();
    const body = await new Response(message.raw).arrayBuffer();
    const email = await parser.parse(body) as PostalMail;

    // find channel id
    const channelId = await getChannelId(email, env);
    if(channelId === null) {
        // If you want to reject the email instead of silently dropping,
        // uncomment the following line:
        // message.setReject("Rejected.");
        return;
    }

    // prepare discord request body
    const formData = new FormData();

    const embed = makeEmbed(email);
    const requestBody: RESTPostAPIChannelMessageFormDataBody = {
        embeds: [embed],
        components: [REPLY_COMPONENT]
    }
    formData.append("payload_json", JSON.stringify(requestBody));
    // send to discord
    const response = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
        method: "POST",
        headers: {
            authorization: `Bot ${env.TOKEN}`
        },
        body: formData,
    });
    if(response.status >= 400) {
        message.setReject(`Failed to forward to upstream Discord: ${response.status}`)
    }
}
