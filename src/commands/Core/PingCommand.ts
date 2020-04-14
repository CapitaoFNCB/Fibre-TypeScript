import { Command } from "discord-akairo";

export default class PingCOmmand extends Command {
  constructor() {
    super("ping", {
      aliases: ["ping"],
      category: "Core",
      description: {
        content: "Ping Command", 
        usage: "ping",
        examples: ["ping"]
      },
      typing: true
    });
  }

  exec(message) {
    return message.util.send('Pinging...').then(sent => {
        const timeDiff = (sent.editedAt || sent.createdAt) - (message.editedAt || message.createdAt);
        return message.util.send(new this.client.Embed()
            .setDescription(`Response: \`${timeDiff} ms\`\nLatency: \`${Math.round(this.client.ws.ping)} ms\``));
        });
    }
}