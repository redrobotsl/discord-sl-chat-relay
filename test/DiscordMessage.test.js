const assert = require('node:assert/strict');
const { buildRelayContent } = require('../modules/DiscordMessage.js');

function attachments(...urls) {
	return {
		first: () => urls[0] ? { url: urls[0] } : undefined,
	};
}

assert.equal(
	buildRelayContent({ content: 'Hello from Discord', attachments: attachments() }),
	'Hello from Discord',
);

assert.equal(
	buildRelayContent({ content: 'No attachment collection' }),
	'No attachment collection',
);

assert.equal(
	buildRelayContent({ content: '', attachments: attachments('https://cdn.discordapp.com/image.png') }),
	'https://cdn.discordapp.com/image.png',
);

assert.equal(
	buildRelayContent({
		content: 'Screenshot',
		attachments: attachments(
			'https://cdn.discordapp.com/first.png',
			'https://cdn.discordapp.com/second.png',
		),
	}),
	'Screenshot https://cdn.discordapp.com/first.png',
);
