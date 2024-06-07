import { Events, messageLink, PermissionsBitField, EmbedBuilder} from 'discord.js';
import { Client, TextChannel } from 'discord.js';
import { maycord } from '../../config.json';
import cron from 'node-cron';

module.exports = {
  name: Events.ClientReady,
  execute(client: Client) {
    cron.schedule('00 20 * * *', async () => {
      const embed = new EmbedBuilder()
      const targetChannel = await client.channels.fetch('1133741422290407438')
      const server = await client.guilds.fetch(maycord)
      const channelsList = await server.channels.fetch();
      const textChannels = channelsList.filter((channel): channel is TextChannel => channel?.type === 0)
      const validChannels = textChannels.filter((channel) => {
        return channel?.permissionsFor(server.members.me!).has(PermissionsBitField.Flags.ViewChannel)
      })
      
      let posts = []
      for (let element of validChannels) {
        let pinnedMessages = await element[1].messages.fetchPinned()
        let post = [...pinnedMessages.values()]
        if (post.length > 0) {
          posts.push(post)
        }
      }
      if (!posts.length) { 
        return new Error('No posts found')
      }
      let randomPost = posts[Math.floor(Math.random() * posts.length)][0]
      embed.setAuthor({name: randomPost.author.displayName, iconURL: randomPost.author.displayAvatarURL()})
      embed.setDescription(`${randomPost}\n\n${messageLink(randomPost.channelId, randomPost.id)}`)
      embed.setTimestamp(randomPost.createdTimestamp)
      if (randomPost.attachments) { embed.setImage(randomPost.attachments.first()!.url) }
      if (targetChannel instanceof TextChannel) { targetChannel!.send({embeds: [embed]}) }
    });
  },
};
