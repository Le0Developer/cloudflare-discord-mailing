import { Env, PostalMail } from "./types";

export default async function getChannelId(email: PostalMail, env: Env): Promise<string | null> {
    // You can put more complex logic in here
    // Either return a Discord channel id, or null to drop the email
    //   If you want `null` to reject instead of silently dropping, modify
    //   `src/email.ts` by uncommenting the `message.setReject` line.
    //
    // Example: route emails to the partner inbox to a different channel
    // if(email.to.address === "partner@example.com") return "12345678901234567890";
    //
    // Example: one channel per sender, stored in KV (pseudo code)
    // let channelId = await env.KV.get(email.from.address);
    // if(!channelId) {
    //      channelId = await createChannel();
    //      await env.KV.put(email.from.address, channelId);
    // }
    // return channelId;
    //
    // Example: drop spam
    // if(email.text.includes("extended warranty")) return null;
    return env.CHANNEL_ID;
}
