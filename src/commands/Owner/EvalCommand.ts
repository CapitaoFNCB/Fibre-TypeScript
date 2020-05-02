import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import { inspect } from "util";
import { capitalize } from "../../utils/Functions"
import FibreClient from "client/FibreClient";

export default class EvalCommand extends Command {
  public constructor() {
    super("eval", {
      aliases: ["eval", "evaluate"],
      category: "Owner",
      ownerOnly: true,
      description: {
        content: "Executes JavaScript code",
        usage: "eval [ code ] < depth >",
        examples: [
          "eval 2 + 2",
          "eval this.client.users.cache.get(message.author.id)"
        ]
      },
      args: [
        {
          id: "toEval",
          type: "text",
          match: "rest",
          prompt: {
            start: "What would you like to evaluate?"
          }
        },
        {
          id: "depth",
          type: "number",
          match: "option",
          flag: ["-d=", "-depth="],
          default: 0
        },

        {
          id: "silent",
          type: "boolean",
          match: "flag",
          flag: ["-silent", "-s"],
        },
      ],
      typing: true
    });
  }

  public async exec (message: Message, { toEval, depth, silent }: { toEval: any; depth: number; silent: boolean }) {


    const embed = new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}, this.client).then(guild => guild.colour))
    
    try {
      const hrStart: [number, number] = process.hrtime();
      let toEvaluate = await eval(toEval);
      let type = toEvaluate
      if (typeof toEvaluate !== "string") toEvaluate = await inspect(toEvaluate, { depth: depth });
      const hrDiff: [number, number] = process.hrtime(hrStart);

      const execTime = hrDiff[0] > 0 ? `${hrDiff[0]}s` : `${Math.round(hrDiff[1] / 1000)}μ`;

      if(silent) return;


      return message.util!.send(embed
        .addField("Response:", `\`\`\`js\n${toEvaluate.length > 1010 ? `${toEvaluate.substr(0, 1010)}...` : toEvaluate}\`\`\``, false)
        .addField("Type:", this.client.capitalize(typeof type))
        .addField("Time Taken:", execTime))
    } catch (error) {

      if(silent) return;

      return message.util!.send(embed
        .addField("Response:", `Error: \`\`\`js\n${error}\`\`\``, false));
    }
  }
}
