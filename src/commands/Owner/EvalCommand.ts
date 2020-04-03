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
        }
      ],
      ownerOnly: true
    });
  }

  public async exec (message: Message, { code, depth }: { code: any; depth: number; }) {
    try {
      const hrStart: [number, number] = process.hrtime();
      let toEvaluate = eval(code);
      if (typeof toEvaluate !== "string") toEvaluate = inspect(toEvaluate, { depth: depth });
      const hrDiff: [number, number] = process.hrtime(hrStart);

      return message.util!.send(`*Ran in: ${hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ""}${hrDiff[1] / 1000000}ms.*\`\`\`js\n${toEvaluate.length > 1950 ? `${toEvaluate.substr(0, 1950)}...` : toEvaluate}\`\`\``);
    } catch (error) {
      return message.util!.send(`Error: \`\`\`js\n${error}\`\`\``);
    }
  }
}