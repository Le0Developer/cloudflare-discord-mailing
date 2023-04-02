import { isValidRequest, PlatformAlgorithm } from "discord-verify";
import { APIBaseInteraction } from "discord-api-types/v10"

import handleEmail from "./email";
import { EmailMessage, Env } from "./types";
import { handleInteraction } from "./interaction";


export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		if (request.method !== "POST")
			return new Response("Method not allowed", { status: 405 });

		if(!await isValidRequest(request, env.PUBLIC_KEY, PlatformAlgorithm.Cloudflare))
			return new Response("Unauthorized", { status: 401 });
		
		const body = await request.json() as APIBaseInteraction<any, any>;
		const response = await handleInteraction(body, env);
		return new Response(
			JSON.stringify(response),
			{
				headers: {
					"content-type": "application/json"
				}
			}
		)
	},

	async email(message: EmailMessage, env: Env, ctx: ExecutionContext): Promise<void> {
		return await handleEmail(message, env);
	},
};
