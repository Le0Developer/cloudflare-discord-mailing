import { APIEmbed } from "discord-api-types/v10"
import { decodeAddress, encodeAddress } from "./address"
import { EmbedMail, PostalMail } from "./types"

export function makeEmbed(email: PostalMail): APIEmbed {
	return {
		title: email.subject,
		description: (email.text || parseHTML(email.html)).trim().substring(0, 4096) || "No content found",
		author: {
			name: encodeAddress(email.from)
		},
		footer: {
			text: `Sent to ${encodeAddress(email.to[0])}`,
		},
		timestamp: new Date(email.date).toISOString(),
		color: 0x2f3136,
	}
}

export function parseEmbed(embed: APIEmbed): EmbedMail {
	return {
		subject: embed.title as string,
		body: embed.description as string,
		to: decodeAddress(embed.footer?.text.substring(8) as string),
		from: decodeAddress(embed.author?.name as string),
		timestamp: embed.timestamp as string,
	}
}

function parseHTML(html: string): string {
	html = html.replace(/<!doctype[^>]+>/i, "");
	html = html.replace(/<head>.*?<\/head>/i, "");
	html = html.replace(/<style[^>]*>.*?<\/style>/gi, "");
	html = html.replace(/<script[^>]*>.*?<\/script>/gi, "");
	html = html.replace(/\n|\r/g, " ");
	html = html.replace(/&#?\w+;/g, " ");
	html = html.replace(/<br\s*?\/?>/gi, "\n");
	html = html.replace(/[ \t]+/g, " ");
	html = html.replace(/^\s+|\s+$/gm, "");
	return html.replace(/<\/?[^>]+?>/g, "")
}