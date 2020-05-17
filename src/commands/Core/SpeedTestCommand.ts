import { Command } from "discord-akairo";
import { Message } from "discord.js";

import { exec } from "child_process";

export default class SpeedtestCommand extends Command {
  public constructor() {
    super("speedtest", {
      aliases: ["speedtest", "speed","internet"],
      category: "Core",
      channel: "guild",
      cooldown: 50000,
      ratelimit: 1,
      description: {
        content: "Tests Internet Speed.",
        usage: "speedtest",
        examples: [
          "speedtest",
          "speed",
          "internet"
        ]
      },
      typing: true
    });
  }

  public async exec(message: Message) {
    let colour = await this.client.findOrCreateGuild({ id: message.guild!.id }).then(guild => guild.colour)
    let send_message = await message.util!.send(new this.client.Embed(message, colour).setDescription("Attempting to run a speedtest."))

      exec("curl -s https://raw.githubusercontent.com/sivel/speedtest-cli/master/speedtest.py | python -", async (error, stdout, stderr) => {
        if (error) return message.util!.send(new this.client.Embed(message, colour).setDescription("There was an error."));
        if (stderr) return message.util!.send(new this.client.Embed(message, colour).setDescription("There was an error."));

        let data: String[] = stdout.split("\n").filter(string => (string.startsWith("Download") || string.startsWith("Upload")))
        
        send_message.edit("", new this.client.Embed(message, colour).setDescription(data.map(x => x)))

      });
  }
}