import { Command } from "discord-akairo";
import { Message } from "discord.js";

import { exec } from "child_process";

export default class ExecCommand extends Command {
  public constructor() {
    super("exec", {
      aliases: ["exec", "execute"],
      args: [
        {
          id: "execution",
          type: "string",
          match: "content",
          prompt: {
            start: "Please provide a bash command."
          }
        }
      ],
      category: "Owner",
      description: {
        content: "Executes bash commands inside of a bot command.",
        usage: "exec [command]",
        examples: ["exec ls", "exec pm2"]
      },
      ownerOnly: true
    });
  }

  public async exec(message: Message, { execution }: { execution: string }) {
    try {
      exec(execution, (error, stdout, stderr) => {
        if (error) return message.channel.send(`Error:\n\n\`${error}\``);
        if (stderr) return message.channel.send(`Bash Error:\n\n\`${stderr}\``);

        message.channel.send(
          stdout.length > 1900 ? `${stdout.substr(0, 1900)}...` : stdout,
          { code: true }
        );
      });
    } catch (error) {
      message.channel.send(`Error\n\n${error}`, { code: true });
    }
  }
}