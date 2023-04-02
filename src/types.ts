
/* General workers types */
export interface Env {
	CHANNEL_ID: string;
	TOKEN: string;
	PUBLIC_KEY: string;
	DKIM_DOMAIN: string;
	DKIM_SELECTOR: string;
	DKIM_PRIVATE_KEY: string;
}

export interface EmailMessage { // not yet in worker-types
	from: string;
	to: string;
	headers: Headers;

	forward: (email: string) => Promise<void>;
	setReject: (reason: string) => void;
	raw: ReadableStream;
	rawSize: number;
}

/* Custom types */
export interface Address {
    name: string;
    address: string
}

export interface PostalMail { // postal-mime return type
	headers: Array<{ key: string, value: string }>;
	from: Address;
	to: Array<Address>;
	subject: string;
	messageId: string;
	date: string;
	text: string;
	html: string;
	attachments: Array<{
		filename: string;
		mimeType: string;
		disposition: "attachment" | "inline" | null;
		related: boolean;
		contentId: string,
		content: ArrayBuffer
	}>;
}

export interface EmbedMail { // mail metadata parsed from embed
	subject: string;
	body: string;
	to: Address;
	from: Address;
	timestamp: string;
}
