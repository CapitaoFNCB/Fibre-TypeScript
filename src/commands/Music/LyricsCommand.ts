import { Command } from "discord-akairo";
import { Message, MessageReaction } from "discord.js";
import cheerio from "cheerio";
import fetch from "node-fetch";
import { Player } from "erela.js";
import { geniusApi } from "../../utils/Config"

export default class LyricsCommand extends Command {
  constructor() {
    super("lyrics", {
      aliases: ["lyrics", "ly"],
      category: "Music",
      channel: "guild",
      typing: true,
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
    });
  }

  async exec(message: Message, { query }: { query: string }): Promise<Message | any > {
    let colour = await this.client.findOrCreateGuild({ id: message.guild!.id }).then(guild => guild.colour)
    let songNameFormated;
    if(query) {
        songNameFormated = query.toLowerCase();
    } else {
        const player: Player = this.client.manager.players.get(message.guild!.id)
        if(player && player.queue[0]){
          songNameFormated = player.queue[0].title.toLowerCase();
        } else {
          message.util!.send(new this.client.Embed(message, colour).setDescription("Please make sure you specify a song or have a player playing."))
        }
    }
    const headers = { Authorization: `Bearer ${geniusApi}` };
    let body: any = await fetch(`https://api.genius.com/search?q=${encodeURI(songNameFormated)}`, { headers });
    let res = await body.json();
    if(!res.response.hits[0]) return message.util!.send(new this.client.Embed(message, colour).setDescription(`Nothing found for ${songNameFormated}`));
    const songID = res.response.hits[0].result.id;
    let result_body = await fetch(`https://api.genius.com/songs/${songID}`, { headers });
    let result = await result_body.json();
    const song = result.response.song;
    let lyrics = await getLyrics(song.url);
    lyrics = lyrics.replace(/(\[.+\])/g, '');
    let page: number = Math.floor(2048);
    let pages = Math.floor((lyrics.length + 2048) / 2048);
    let current = 1;
    let next_embed;
    let list = lyrics.slice(page - 2048, page)
    let embed = new this.client.Embed(message, colour).setDescription(list).setAuthor(song.full_title).setThumbnail(song.primary_artist.image_url)

    message.util!.send(embed).then(async (msg) => {

        if(lyrics.length > 2048) {

          msg.delete({ timeout: 60000 }).catch(() => null);

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
                        page = Math.floor(current) * 2048;
                        list = lyrics.slice(page - 2048, page)
                        collected.users.remove(message.author).catch(error => null)
                        next_embed = new this.client.Embed(message, colour)
                            .setDescription(list).setAuthor(song.full_title).setThumbnail(song.primary_artist.image_url)
                        msg.edit("", next_embed).catch(() => null)
                    break;

                    case "◀":
                        if (current === 1) return collected.users.remove(message.author).catch(error => null)
                        await current--;
                        page = Math.floor(current) * 2048;
                        list = lyrics.slice(page - 2048, page)
                        collected.users.remove(message.author).catch(error => null)
                        next_embed = new this.client.Embed(message, colour)
                            .setDescription(list).setAuthor(song.full_title).setThumbnail(song.primary_artist.image_url)
                        msg.edit("", next_embed).catch(() => null)
                    break;

                    case "▶":
                        if (current === pages) return collected.users.remove(message.author).catch(error => null)
                        await current++;
                        page = Math.floor(current) * 2048;
                        list = lyrics.slice(page - 2048, page)
                        collected.users.remove(message.author).catch(error => null)
                        next_embed = new this.client.Embed(message, colour)
                            .setDescription(list).setAuthor(song.full_title).setThumbnail(song.primary_artist.image_url)
                        msg.edit("", next_embed).catch(() => null)
                    break;

                    case "⏩":
                        if (current === pages) return collected.users.remove(message.author).catch(error => null)
                        current = pages;
                        page = Math.floor(current) * 2048;
                        list = lyrics.slice(page - 2048, page)
                        collected.users.remove(message.author).catch(error => null)
                        next_embed = new this.client.Embed(message, colour)
                            .setDescription(list).setAuthor(song.full_title).setThumbnail(song.primary_artist.image_url)
                        msg.edit("", next_embed).catch(() => null)
                    break;

                }
            })
        }
    })
    async function getLyrics(url) {
      const response = await fetch(url);
      const text = await response.text();
      const $ = cheerio.load(text);
      return $('.lyrics').text().trim();
    }
  }
}