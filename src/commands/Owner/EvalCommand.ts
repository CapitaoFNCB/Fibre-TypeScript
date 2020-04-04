import { Command } from "discord-akairo";
import { Message } from "discord.js";

import { inspect } from "util";

export default class EvalCommand extends Command {
  public constructor() {
    super("eval", {
      aliases: ["eval", "evaluate"],
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
          id: "code",
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

  public async exec (message: Message, { code, depth, async, silent }: { code: any; depth: number; async: boolean; silent: boolean }) {

    if(!this.client.ownerOnly(message.author.id)) return message.util!.send(new this.client.Embed()
      .setDescription("Owner Only Command")
    )   

    try {
      const hrStart: [number, number] = process.hrtime();

      if(async) code = `(async () => { ${code} })()`

      let toEvaluate = await eval(code);
      if (typeof toEvaluate !== "string") toEvaluate = await inspect(toEvaluate, { depth: depth });
      const hrDiff: [number, number] = process.hrtime(hrStart);

      if(silent) return;

      return message.util!.send(`*Ran in: ${hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ""}${hrDiff[1] / 1000000}ms.*\`\`\`js\n${toEvaluate.length > 1950 ? `${toEvaluate.substr(0, 1950)}...` : toEvaluate}\`\`\``);
    } catch (error) {

      if(silent) return;

      return message.util!.send(`Error: \`\`\`js\n${error}\`\`\``);
    }
  }
}