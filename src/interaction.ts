import { APIBaseInteraction, APIEmbed, APIInteractionResponse, APIMessage, ComponentType, InteractionResponseType, InteractionType, MessageFlags, TextInputStyle } from "discord-api-types/v10";
import { parseEmbed } from "./embed";


function handleReplyButton(interaction: APIBaseInteraction<InteractionType.MessageComponent, any>): APIInteractionResponse {
    const email = parseEmbed(interaction.message?.embeds[0] as APIEmbed);
    return {
        type: InteractionResponseType.Modal,
        data: {
            custom_id: "respond",
            title: `Reply to E-Mail by ${email.from.name || email.from.address}`,
            components: [
                {
                    type: ComponentType.ActionRow,
                    components: [
                        {
                            type: ComponentType.TextInput,
                            custom_id: "subject",
                            label: "Subject",
                            style: TextInputStyle.Short,
                            value: `Re: ${email.subject}`
                        }
                    ]
                },
                {
                    type: ComponentType.ActionRow,
                    components: [
                        {
                            type: ComponentType.TextInput,
                            custom_id: "responsebody",
                            label: "E-Mail content",
                            style: TextInputStyle.Paragraph,
                        }
                    ]
                }
            ]
        }
    }
}

async function handleReplySubmit(interaction: APIBaseInteraction<InteractionType.MessageComponent, any>): Promise<APIInteractionResponse> {
    const email = parseEmbed((interaction.message as APIMessage).embeds[0]);
    const subject = interaction.data.components[0].components[0].value;
    const body = interaction.data.components[1].components[0].value;

    const requestBody = {
        personalizations: [
            {
                to: [
                    { name: email.from.name, email: email.from.address }
                ],
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

    const response = await fetch("https://api.mailchannels.net/tx/v1/send", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(requestBody)
    })
    return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
            content: response.status === 202 ? "Reply successfully sent!" : `Reply failed! (${response.status})\n${await response.text()}`,
            flags: MessageFlags.Ephemeral
        }
    }
}


export async function handleInteraction(interaction: APIBaseInteraction<any, any>): Promise<APIInteractionResponse> {
	if(interaction.type === InteractionType.Ping) {
		return {
			type: InteractionResponseType.Pong
		}
	} else if (interaction.type === InteractionType.MessageComponent) {
		return handleReplyButton(interaction);
	} else if(interaction.type === InteractionType.ModalSubmit) {
        return await handleReplySubmit(interaction);
	} else {
		return {
			type: InteractionResponseType.ChannelMessageWithSource,
			data: {
				content: "Interaction not found.",
				flags: MessageFlags.Ephemeral
			}
		}
	}
}
