import { EmbedMail, Env } from "./types"

export function sendEmail({ email, subject, body }: SendParameters, env: Env) {
    const dkim = getDKIM(env);
    const requestBody = {
        personalizations: [
            {
                to: [
                    { name: email.from.name, email: email.from.address }
                ],
                ...dkim,
            },
        ],
        from: {
            name: email.to.name,
            email: email.to.address,
        },
        subject,
        content: [
            {
                type: "text/plain",
                value: body
            }
        ]
    }

    return fetch("https://api.mailchannels.net/tx/v1/send", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(requestBody)
    })
}

interface SendParameters {
    email: EmbedMail;
    subject: string;
    body: string;
}

function getDKIM(env: Env) {
    if(env.DKIM_DOMAIN && env.DKIM_PRIVATE_KEY && env.DKIM_SELECTOR) {
        return {
            dkim_domain: env.DKIM_DOMAIN,
            dkim_selector: env.DKIM_SELECTOR,
            dkim_private_key: env.DKIM_PRIVATE_KEY,
        }
    }
    return {};
}
