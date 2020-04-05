import { Command } from "discord-akairo";
import { Message } from "discord.js";

import { inspect } from "util";

export default class EvalCommand extends Command {
  public constructor() {
    super("eval", {
      aliases: ["eval", "evaluate"],
      category: "Owner",
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
          id: "async",
          type: "boolean",
          match: "flag",
          flag: ["-async", "-a"],
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

  public async exec (message: Message, { toEval, depth, async, silent }: { toEval: any; depth: number; async: boolean; silent: boolean }) {

    if(!this.client.ownerOnly(message.author.id)) return message.util!.send(new this.client.Embed()
      .setDescription("Owner Only Command")
    )  
    
    const embed = new this.client.Embed()

    try {
      const hrStart: [number, number] = process.hrtime();

      if(async) toEval = `(async () => { ${toEval} })()`;

      let toEvaluate = await eval(toEval);
      if (typeof toEvaluate !== "string") toEvaluate = await inspect(toEvaluate, { depth: depth });
      const hrDiff: [number, number] = process.hrtime(hrStart);

      const execTime = hrDiff[0] > 0 ? `${hrDiff[0]}s` : `${Math.round(hrDiff[1] / 1000)}μ`;

      if(silent) return;


      return message.util!.send(embed
        .addField("Response:", `\`\`\`js\n${toEvaluate.length > 1010 ? `${toEvaluate.substr(0, 1010)}...` : toEvaluate}\`\`\``, false)
        .addField("Type:", typeof eval(toEval))
        .addField("Time Taken:", execTime))
    } catch (error) {

      if(silent) return;

      return message.util!.send(embed
        .addField("Response:", `Error: \`\`\`js\n${error}\`\`\``, false));
    }
  }
}