const { Events, messageLink, Message, PermissionsBitField, EmbedBuilder} = require('discord.js');
const { maycord, noellecord } = require('../config.json');
const cron = require('node-cron');

module.exports = {
  name: Events.ClientReady,
  execute(client) {
    cron.schedule('00 20 * * *', async () => {
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
      let randomPost = posts[Math.floor(Math.random() * posts.length)][0]
      embed.setAuthor({name: randomPost.author.globalName, iconURL: randomPost.author.displayAvatarURL()})
      embed.setDescription(`${randomPost}\n\n${messageLink(randomPost.channelId, randomPost.id)}`)
      embed.setTimestamp(randomPost.createdTimestamp)
      if (randomPost.attachments.size > 0) { embed.setImage(randomPost.attachments.first().url)}
      targetChannel.send({embeds: [embed]})
    });
  },
};