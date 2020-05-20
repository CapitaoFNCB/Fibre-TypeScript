import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { MessageReaction } from "discord.js";
import Embed from "client/FibreEmbed";

export default class QueueCommand extends Command {
  constructor() {
    super("queue", {
      aliases: ["queue"],
      channel: "guild",
      category: "Music",
      description: {
        content: "Shows current queue for this guild.", 
        usage: "queue",
        examples: ["queue"]
      },
    });
  }

  async exec (message: Message) {

    const player = this.client.manager.players.get(message.guild!.id)
    let colour = await this.client.findOrCreateGuild({ id: message.guild!.id }).then(guild => guild.colour)
    if(!player) return message.util!.send(new this.client.Embed(message, colour).setDescription("There is no player for this guild."));
    let guild = await this.client.findOrCreateGuild({id: message.guild!.id})
    if(!player.queue.length){
        return message.util!.send(new this.client.Embed(message, colour).setDescription("The queue is empty."));
    } else if(player.queue.length < 2) {
        return message.util!.send(new this.client.Embed(message, colour).addField(`Now Playing`,`${player.queue[0].title}`, false).setFooter(`${player.trackRepeat ? "Repeating Track" : player.queueRepeat ? "Repeating Queue" : "Not Repeating"} • ${guild.notifications ? "Notifications Enabled" : "Notifications Disabled"}`));
    } else {
        let page: number = Math.floor(11);
        let i: number = 0;
        let queuelist = player.queue.slice(1,11).map((track) => `${++i}. ${track.title}`).join('\n');
        let pages = Math.floor((player.queue.slice(2).length + 10) / 10);
        let current = 1;
        let data = await this.client.findOrCreateGuild({id: message.guild!.id})
        let embed: Embed = new this.client.Embed(message, colour).addField(`🎧 Now Playing`,`${player.queue[0].title}`, false).addField(`Queue:`, queuelist, false).setFooter(`Page: ${current} / ${pages} • ${player.trackRepeat ? "Repeating Track" : player.queueRepeat ? "Repeating Queue" : "Not Repeating"} • ${data.notifications ? "Notifications Enabled" : "Notifications Disabled"}`);
        await message.util!.send(embed).then(async (msg) => {
            msg.delete({ timeout: 60000 }).catch(() => null);
            if (Math.floor((player.queue.slice(2).length + 10) / 10) > 1) {
            await msg.react('⏪').catch(() => null);
            await msg.react('◀').catch(() => null);
            await msg.react('▶').catch(() => null);
            await msg.react('⏩').catch(() => null);
            current = Math.floor(page / 10);
            const collector = msg.createReactionCollector((reaction, user) => (reaction.emoji.name === '⏪' || "◀" || "▶" || "⏩") && user.id === message.author.id, { time: 60000 });
            collector.on("collect", async (collected: MessageReaction) => {
                let guild = await this.client.findOrCreateGuild({id: message.guild!.id})
                switch (collected.emoji.name) {
                    case "⏪":
                        if (current === 1) return collected.users.remove(message.author).catch(error => null);
                        current = 1;
                        page = Math.floor(current) * 10 + 1;
                        i = page - 11;
                        pages = Math.floor((player.queue.slice(1).length + 10) / 10);
                        queuelist = player.queue.slice(page - 10, page).map((track) => `${++i}. ${track.title}`).join('\n');
                        if(!queuelist.length) return collected.users.remove(message.author).catch(error => null);
                        collected.users.remove(message.author).catch(error => null)
                        let edit_Embed: Embed = new this.client.Embed(message, colour).addField(`🎧 Now Playing`,`${player.queue[0].title}`, false)
                            .addField(`Queue:`, queuelist , false)
                            .setFooter(`Page: ${current} / ${pages} • ${player.trackRepeat ? "Repeating Track" : player.queueRepeat ? "Repeating Queue" : "Not Repeating"} • ${guild.notifications ? "Notifications Enabled" : "Notifications Disabled"}`);
                        msg.edit("", edit_Embed).catch(error => null)
                    break;

                    case "◀":
                        if (current === 1) return collected.users.remove(message.author).catch(error => null)
                        await current--;
                        page = Math.floor(current) * 10 + 1;
                        i = page - 11;
                        queuelist = player.queue.slice(page - 10, page).map((track) => `${++i}. ${track.title}`).join('\n');
                        pages = Math.floor((player.queue.slice(1).length + 10) / 10);
                        if(!queuelist.length) return collected.users.remove(message.author).catch(error => null)
                        collected.users.remove(message.author).catch(error => null)
                        let edit_embed: Embed = new this.client.Embed(message, colour).addField(`🎧 Now Playing`,`${player.queue[0].title}`, false)
                            .addField(`Queue:`, queuelist , false)
                            .setFooter(`Page: ${current} / ${pages} • ${player.trackRepeat ? "Repeating Track" : player.queueRepeat ? "Repeating Queue" : "Not Repeating"} • ${guild.notifications ? "Notifications Enabled" : "Notifications Disabled"}`);
                        msg.edit("", edit_embed).catch(error => null)
                    break;

                    case "▶":
                        if (current === pages) return collected.users.remove(message.author).catch(error => null)
                        await current++;
                        page = Math.floor(current) * 10 + 1;
                        i = page - 11;
                        queuelist = player.queue.slice(page - 10, page).map((track) => `${++i}. ${track.title}`).join('\n');
                        pages = Math.floor((player.queue.slice(1).length + 10) / 10);
                        if(!queuelist.length) return collected.users.remove(message.author).catch(error => null)
                        collected.users.remove(message.author).catch(error => null)
                        let next_embed: Embed = new this.client.Embed(message, colour).addField(`🎧 Now Playing`,`${player.queue[0].title}`, false)
                            .addField(`Queue:`, queuelist , false)
                            .setFooter(`Page: ${current} / ${pages} • ${player.trackRepeat ? "Repeating Track" : player.queueRepeat ? "Repeating Queue" : "Not Repeating"} • ${guild.notifications ? "Notifications Enabled" : "Notifications Disabled"}`);
                        msg.edit("", next_embed).catch(error => null)
                    break;

                    case "⏩":
                        if (current === pages) return collected.users.remove(message.author).catch(error => null)
                        current = pages;
                        page = Math.floor(current) * 10 + 1;
                        i = page - 11;
                        queuelist = player.queue.slice(page - 10, page).map((track) => `${++i}. ${track.title}`).join('\n');
                        pages = Math.floor((player.queue.slice(1).length + 10) / 10);
                        if(!queuelist.length) return collected.users.remove(message.author).catch(error => null)
                        collected.users.remove(message.author).catch(error => null)
                        let end_embed: Embed = new this.client.Embed(message, colour).addField(`🎧 Now Playing`,`${player.queue[0].title}`, false)
                            .addField(`Queue:`, queuelist , false)
                            .setFooter(`Page: ${current} / ${pages} • ${player.trackRepeat ? "Repeating Track" : player.queueRepeat ? "Repeating Queue" : "Not Repeating"} • ${guild.notifications ? "Notifications Enabled" : "Notifications Disabled"}`);
                        msg.edit("", end_embed).catch(error => null)
                    break;
                }
            })
        }
      })
    }
  }
}