import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class EvalCommand extends Command {
  public constructor() {
    super("eval", {
      aliases: ["eval", "evaluate"],
      args: [
        {
          id: "evaluated",
          type: "string",
          match: "content",
          prompt: {
            start: "Please provide a phrase to evaluate"
          }
        }
      ],
      category: "Owner",
      description: {
        content: "Evaluates code",
        usage: "eval [code]",
        examples: ["eval typeof NaN", "eval 2 + 2"]
      },
      ownerOnly: true
    });
  }

  public async exec(message: Message, { evaluated }: { evaluated: any }) {
    try {
      let hrStart = process.hrtime();

      let toEval = await eval(evaluated);
      if (typeof toEval !== "string") toEval = require("util").inspect(toEval);

      let hrDiff = process.hrtime(hrStart);

      return message.channel.send(
        `Executed in: ${hrDiff[1] / 1000000}ms\`\`\`js\n${
          toEval.length > 1800 ? `${toEval.substr(0, 1800)}...` : toEval
        }\`\`\``
      );
    } catch (error) {
      return message.channel.send(`Error: \`\`\`js\n${error}\`\`\``);
    }
  }
}