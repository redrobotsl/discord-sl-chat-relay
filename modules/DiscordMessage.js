function buildRelayContent(message) {
	const content = message.content || '';
	const attachmentUrl = message.attachments?.first()?.url;

	if (!attachmentUrl) return content;

	return content ? `${content} ${attachmentUrl}` : attachmentUrl;
}

module.exports = { buildRelayContent };
