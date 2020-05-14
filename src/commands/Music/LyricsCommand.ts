import { Command } from "discord-akairo";
import { Message, MessageReaction } from "discord.js";
import cheerio from "cheerio";
import fetch from "node-fetch";
import { Player } from "erela.js";

export default class LyricsCommand extends Command {
  constructor() {
    super("lyrics", {
      aliases: ["lyrics", "ly"],
      category: "Core",
      channel: "guild",
      args: [
        {
          id: "query",
          type: "string",
          match: "rest",
          default: null
        },
      ],
      description: {
        content: "Display's lyrics of song.", 
        usage: "lyrics < song >",
        examples: [
          "lyrics ncs",
          "lyrics trackmania",
          "lyrics"
        ]
      },
      typing: true
    });
  }

  async exec(message: Message, { query }: { query: string }): Promise<Message | any > {

    let lyrics;
    let songNameFormated;
    if(query) {
        songNameFormated = query.toLowerCase().replace(/\(lyrics|lyric|official music video|audio|official|official video|official video hd|clip officiel|clip|extended|hq\)/gmi, "");

    } else {
        const player: Player = this.client.manager.players.get(message.guild!.id)

        if(player && player.queue[0]){
          
          songNameFormated = player.queue[0].title.toLowerCase().replace(/\(lyrics|lyric|official music video|audio| video|official|official video|official video hd|clip officiel|clip|extended|hq\)/gi, "");

        } else {

          message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour)).setDescription("Please make sure you specify a song or have a player playing."))

        }

    }

    let res: any = await fetch(`https://www.musixmatch.com/search/${encodeURIComponent(songNameFormated)}`);
    res = await res.text();
    let $ = await cheerio.load(res);
    let songLink = `https://musixmatch.com${$("h2[class=\"media-card-title\"]").find("a").attr("href")}`;
    if(songLink.includes("undefined")) return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour)).setDescription(`Nothing found for ${songNameFormated}`))
    res = await fetch(songLink);
    res = await res.text();
    $ = await cheerio.load(res);
    lyrics = await $("p[class=\"mxm-lyrics__content \"]").text();
    if(!lyrics.length) return message.util!.send(new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour)).setDescription(`Nothing found for ${songNameFormated}`))
    let page: number = Math.floor(120);
    let pages = Math.floor((lyrics.split(" ").length + 120) / 120);
    let current = 1;
    let next_embed;
    let list = lyrics.split(" ").splice(page - 120, page)
    let embed = new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour)).setDescription(list.join(" "))

    message.util!.send(embed).then(async (msg) => {

        msg.delete({ timeout: 60000 }).catch(() => null);

        if(lyrics.split(" ").length > 120) {

            await msg.react('⏪');
            await msg.react('◀');
            await msg.react('▶');
            await msg.react('⏩');

            const collector = msg.createReactionCollector((reaction, user) => (reaction.emoji.name === '⏪' || "◀" || "▶" || "⏩") && user.id === message.author.id, { time: 60000 });

            collector.on("collect", async (collected: MessageReaction) => {

                switch (collected.emoji.name) {

                    case "⏪":
                        if (current === 1) return collected.users.remove(message.author).catch(error => null)
                        current = 1;
                        page = Math.floor(current) * 120;
                        list = lyrics.split(" ").splice(page - 120, page).join(" ")
                        collected.users.remove(message.author).catch(error => null)
                        next_embed = new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour))
                            .setDescription(list)
                        msg.edit("", next_embed).catch(() => null)
                    break;

                    case "◀":
                        if (current === 1) return collected.users.remove(message.author).catch(error => null)
                        await current--;
                        page = Math.floor(current) * 120;
                        list = lyrics.split(" ").splice(page - 120, page).join(" ")
                        collected.users.remove(message.author).catch(error => null)
                        next_embed = new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour))
                            .setDescription(list)
                        msg.edit("", next_embed).catch(() => null)
                    break;

                    case "▶":
                        if (current === pages) return collected.users.remove(message.author).catch(error => null)
                        await current++;
                        page = Math.floor(current) * 120;
                        list = lyrics.split(" ").splice(page - 120, page).join(" ")
                        collected.users.remove(message.author).catch(error => null)
                        next_embed = new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour))
                            .setDescription(list)
                        msg.edit("", next_embed).catch(() => null)
                    break;

                    case "⏩":
                        if (current === pages) return collected.users.remove(message.author).catch(error => null)
                        current = pages;
                        page = Math.floor(current) * 120;
                        list = lyrics.split(" ").splice(page - 120, page).join(" ")
                        collected.users.remove(message.author).catch(error => null)
                        next_embed = new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour))
                            .setDescription(list)
                        msg.edit("", next_embed).catch(() => null)
                    break;

                }
            })
        }
    })
  }
}