import { Command, Flag } from "discord-akairo";
import { Message } from "discord.js";

export default class LoopCommand extends Command {
  public constructor() {
    super("loop", {
      aliases: ["loop"],
      category: "Music",
      channel: "guild",
      description: {
        content: "Loop Command",
        usage: "loop [ track | queue | none ]",
        examples: ["tag create pizza ez"]
      },
      typing: true
    });
  }
  public *args(): object {
    const method = yield {
        type: [
            ["tag-trackloop", "track", "single", "current", "t"],
            ["tag-queueloop", "queue", "all", "q"],
            ["tag-loopnone", "none", "no", "0", "n"],
        ],

        otherwise: async (message: Message) => {
            const guild = await this.client.findOrCreateGuild({ id: message.guild!.id })

            let prefix = guild.prefix

            return new this.client.Embed(message, await this.client.guildsData.findOne({ id: message.guild!.id }).then(guild => guild.colour)).setDescription(`Invalid Usage:\nRun: \`${prefix}help tag\``)
        }
    }

    return Flag.continue(method);

  }
}


















// import { Command } from "discord-akairo";
// import { Message } from "discord.js";

// export default class LoopCommand extends Command {
//   constructor() {
//     super("loop", {
//       aliases: ["loop"],
//       channel: "guild",
//       category: "Music",
//       args: [
//         {
//             id: "queue",
//             type: "string",
//             prompt:{
//               start: "How would you like to edit the loop"
//             }
//           }
//       ],
//       description: {
//         content: "Loop Command", 
//         usage: "loop",
//         examples: ["loop"]
//       },
//       typing: true
//     });
//   }

//   async exec (message: Message, { queue }: { queue: string }) {

//     const player = this.client.manager.players.get(message.guild!.id)

//     const { channel } = message.member!.voice;

//     const types: String[] = ["track", "colour"]

//     if(!player) return message.channel.send(new this.client.Embed(message, await this.client.guildsData.findOne({ id: message.guild!.id }).then(guild => guild.colour)).setDescription("There is no player for this guild"));
//     if(!channel || channel.id !== player.voiceChannel.id) return message.channel.send(new new this.client.Embed(message, await this.client.guildsData.findOne({ id: message.guild!.id }).then(guild => guild.colour)).setDescription("You need to be in the same voice channel as me to use Leave Command"));
//     this.client.player.set(message.guild!.id, {
//         triva: false,
//         queueloop: false,
//         trackloop: true
//     })
//   }
// }