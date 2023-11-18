const { Events, messageLink, PermissionsBitField, EmbedBuilder} = require('discord.js');
const { maycord, noellecord } = require('../config.json');

module.exports = {
	name: Events.ClientReady,
	async execute(client) {
		const embed = new EmbedBuilder()
		const targetChannel = await client.channels.fetch('1133741422290407438')
		const server = await client.guilds.fetch(noellecord)
		const channelsList = await server.channels.fetch();
		const textChannels = channelsList.filter((channel) => channel.type === 0)
		const validChannels = textChannels.filter((channel) => {
			if (channel.permissionsFor(server.members.me).has(PermissionsBitField.Flags.ViewChannel)) return true
			return false
		})
		
		let posts = []
		for (element of validChannels) {
			let pinnedMessages = await element[1].messages.fetchPinned()
			let post = [...pinnedMessages.values()]
			if (post.length > 0) {
				posts.push(post)
			}
		}
		let randomPost = posts[Math.floor(Math.random() * posts.length)]
		embed.setAuthor({name: randomPost[0].author.globalName, iconURL: randomPost[0].author.displayAvatarURL()})
		embed.setDescription(`${randomPost}\n\n${messageLink(randomPost[0].channelId, randomPost[0].id)}`)
		embed.setURL(messageLink(randomPost[0].channelId, randomPost[0].id))
		embed.setTimestamp()
		targetChannel.send({embeds: [embed]})
	},
};