import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { AkairoClient } from "discord-akairo";
import { GuildMember } from "discord.js";

export default class KickCommand extends Command {
  constructor() {
    super("kick", {
      aliases: ["kick"],
      category: "Moderation",
      channel: "guild",
      args: [
        {
          id: "string",
          type: "string",
          match: "rest",
          default: null
        },
      ],
      clientPermissions: "KICK_MEMBERS",
      userPermissions: "KICK_MEMBERS",
      description: {
        content: "Kicks members from a server. (limit: 10 messages)", 
        usage: "kick [ users ]",
        examples: [
          "kick 665237546183294999"
        ]
      },
    });
  }

  public async exec(message: Message, { string }: { string: any } ): Promise<Message | any> {
        let kickings = await resolveMembers(string, message, this.client)
        let colour = await this.client.findOrCreateGuild({ id: message.guild!.id }).then(guild => guild.colour)
        if(kickings.error) return message.util!.send(new this.client.Embed(message, colour).setDescription(kickings.error))
        return message.util!.send(new this.client.Embed(message, colour).setDescription(`Actions taken with reason: ${kickings.reason}\n${kickings.output!.map(x => x).join("\n")}`))
    }
}

async function resolveMembers(string: string, message: Message, client: AkairoClient) {
    if(!string) return { error: "No users have been specified." }
    let arr: any[] = string.split("<@").map(x => [...x].filter(char => char !== "!").filter(char => char !== ">").join("")).filter(x => x.length).join(" ").split(" ").map(x => [...x].filter(char => char !== ">").join(""));
    let output: string[] = [];
    let kicking_members: GuildMember[] = [];
    let searched_users: string[] = [];
    let reason: string = "No reason provided";
    let user_count = 0;

    for(const users of arr) {
        if(new RegExp(/(\d{17,19})/gm).test(users)){
            user_count += 1
        }
        if(user_count > 10) {
            return { error: "Too many users have been mentioned." }
        }
    }

    for(const user of arr) {
        let found = await message.guild!.members!.cache.get(user)
            if (found && !searched_users.includes(user)) {
                if(found.kickable) {
                    output.push(`${client.emojiList.message.accept} ${found.user.username} has been kicked`);
                    searched_users.push(user);
                    kicking_members.push(found)
                };
                if(!found.kickable) {
                    output.push(`${client.emojiList.message.deny} ${found.user.username} is not kickable`); 
                    searched_users.push(user);
                };
        } else {
            reason = string.split(" ").slice(arr.indexOf(user) == 0 ? 1 : arr.indexOf(user)).join(" ")
            if(!kicking_members.length) return { error: "No users have been specified." }
            for(const user of kicking_members.values()){
                user.kick(reason)
            }        
            return { output, reason }  
        }
    }

    return { output, reason };
}