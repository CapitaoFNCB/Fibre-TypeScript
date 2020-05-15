import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import { inspect } from "util";
import fetch from "node-fetch";

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
    });
  }

  public async exec (message: Message, { toEval, depth, silent }: { toEval: any; depth: number; silent: boolean }) {
    const embed = new this.client.Embed(message, await this.client.findOrCreateGuild({id: message.guild!.id}).then(guild => guild.colour))
    try {
      const hrStart: [number, number] = process.hrtime();
      let toEvaluate = await eval(toEval);
      const hrDiff: [number, number] = process.hrtime(hrStart);
      let type = toEvaluate
      if (typeof toEvaluate !== "string") toEvaluate = await inspect(toEvaluate, { depth });
      const execTime = hrDiff[0] > 0 ? `${hrDiff[0]}s` : `${Math.round(hrDiff[1] / 1000)}μ`;

      if(silent) return;

      if(toEvaluate.length > 1024) {
        const res = await fetch(`https://hasteb.in/documents`, {
          method: 'POST',
          body: toEvaluate,
          headers: {
            'User-Agent': `Node.js/10.15.3`
          }
        });
        let json = await res.json();
        toEvaluate = `https://hasteb.in/${json.key}.js` ;
      }
      return message.util!.send(embed
        .addField("Response:", `\`\`\`js\n${toEvaluate.replace(this.client.token, "Fuck Off")}\`\`\``, false)
        .addField("Type:", this.client.capitalize(typeof type))
        .addField("Time Taken:", execTime))
    } catch (error) {

      return message.util!.send(embed
        .addField("Response:", `Error: \`\`\`js\n${error}\`\`\``, false));
    }
  }
}
