
# cloudflare-discord-mailing

Discord mailing is a service that allows you to see and respond to E-Mails in
Discord using [Cloudflare Workers][1] + [Route to Workers][2] + [Mailchannels][3].

## Setup

Create a [Discord application](https://discord.com/developers/applications), add
a bot to it in the Bot tab and invite the bot to your server.

Clone this repository and then get wrangler and the Discord developer panel ready,
because we'll need to add some secrets.

1. Deploy your worker, so we can add secrets to it. Use `npm run deploy` or
`wrangler publish`.

2. Do `wrangler secret put CHANNEL_ID` and enter your Discord channel that
emails will be sent to. Make sure your bot has the *view channels*,
*send messages*, *embed links* and *attach files* permissions!

3. Now go to your developer panel and copy your public key.
Do `wrangler secret put PUBLIC_KEY` and enter it.

4. Final step is getting your bot token, by going to the Bot tab. Then reset
your token to get your api token (might require 2FA). Proceed to put into
wrangler with `wrangler secret put TOKEN` and then entering it.

5. Now that you've done the worker setup, set your workers url as the
*INTERACTIONS ENDPOINT URL* in the Discord General Information tab of your application.

6. Finally, go to your [zone's Email Workers settings][4] and create a
custom address (or catch-all) that routes to your worker.

### SPF + Mailchannels

https://mailchannels.zendesk.com/hc/en-us/articles/200262610-Set-up-SPF-Records

## Known limitations

- All attachments are ignored
- Characters past 4,096 are removed (embed description length limit)
- Everyone can use the reply button

## LICENSE

This project is using the [postal-mime][5] library which is released under the
[AGPL license][6].
Due to the license, this project must also be released under AGPL.

If you find any decent email parsing library alternative that works in workers
and has a more sane license, please let us know and open an issue.


[1]: https://workers.cloudflare.com
[2]: https://blog.cloudflare.com/announcing-route-to-workers/
[3]: https://blog.cloudflare.com/sending-email-from-workers-with-mailchannels/
[4]: https://dash.cloudflare.com/?to=/:account/:zone/email/routing/routes
[5]: https://github.com/postalsys/postal-mime
[6]: https://github.com/postalsys/postal-mime/blob/master/LICENSE.txt
