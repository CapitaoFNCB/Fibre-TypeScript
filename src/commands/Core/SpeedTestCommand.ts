import { Command } from "discord-akairo";
import { Message } from "discord.js";

import { exec } from "child_process";

export default class ExecCommand extends Command {
  public constructor() {
    super("speedtest", {
      aliases: ["speedtest", "speed","internet"],
      category: "Core",
      description: {
        content: "Tests Internet Speed",
        usage: "speedtest",
        examples: ["speedtest"]
      },
      typing: true
    });
  }

  public async exec(message: Message) {

    let send_message = await message.channel.send(new this.client.Embed(message, await this.client.guildsData.findOne({ id: message.guild!.id }).then(guild => guild.colour)).setDescription("Fetching Data!"))

      exec("curl -s https://raw.githubusercontent.com/sivel/speedtest-cli/master/speedtest.py | python -", async (error, stdout, stderr) => {
        if (error) return message.util!.send(new this.client.Embed(message, await this.client.guildsData.findOne({ id: message.guild!.id }).then(guild => guild.colour)).setDescription("There was an error"));
        if (stderr) return message.util!.send(new this.client.Embed(message, await this.client.guildsData.findOne({ id: message.guild!.id }).then(guild => guild.colour)).setDescription("There was an error"));

        let data: String[] = stdout.split("\n").filter(string => (string.startsWith("Download") || string.startsWith("Upload")))
        
        send_message.edit("", new this.client.Embed(message, await this.client.guildsData.findOne({ id: message.guild!.id }).then(guild => guild.colour)).setDescription(data.map(x => x)))

      });
  }
}