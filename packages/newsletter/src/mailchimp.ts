import Mailchimp from '@mailchimp/mailchimp_marketing'

async function init() {
	Mailchimp.setConfig({
		apiKey: import.meta.env.MAILCHIMP_API_KEY,
		server:
			import.meta.env.MAILCHIMP_SERVER_PREFIX ||
			import.meta.env.MAILCHIMP_API_KEY?.slice(
				import.meta.env.MAILCHIMP_API_KEY.lastIndexOf('-') + 1,
			),
	})

	console.log(await Mailchimp.ping.get())
	// console.log(await Mailchimp.lists.getAllLists({}))
}

async function createCampaign({ title, listId }: { title: string; listId: string }) {
	const campaign = await Mailchimp.campaigns.create({
		type: 'regular',
		recipients: {
			list_id: listId,
		},
		settings: {
			title,
			subject_line: `Newsletter 💌 Spanischer Verein Köln`,
			from_name: 'Spanischer Verein Köln',
			reply_to: 'circulomachado@gmail.com',
			inline_css: true,
		},
		tracking: {
			html_clicks: false,
			text_clicks: false,
		},
	})

	if (!('id' in campaign)) {
		throw new Error('Failed to create campaign')
	}

	return campaign.id
}

async function setCampaignContent(campaignId: string, html: string) {
	await Mailchimp.campaigns.setContent(campaignId, {
		html,
	})
}

async function sendCampaign(campaignId: string) {
	await Mailchimp.campaigns.send(campaignId)
}

export async function sendNewsletter({
	title,
	listId,
	html,
}: {
	title: string
	listId: string
	html: string
}) {
	console.log('Sending newsletter', { title })

	try {
		const campaignId = await createCampaign({ title, listId })
		if (!campaignId) throw new Error('Failed to create campaign')

		await setCampaignContent(campaignId, html)
		await sendCampaign(campaignId)

		console.log('Newsletter sent!')
	} catch (error) {
		console.error(error)
	}
}

await init()
