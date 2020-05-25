import { Command } from "discord-akairo";
import { Message } from "discord.js";
import moment from "moment";

const emojies = {
  "HOUSE_BALANCE" : "<:fibre_house_balance:712566988626460692>",
  "EARLY_SUPPORTER": "<:fibre_early_support:712566987993251841>",
  "VERIFIED_DEVELOPER": "<:fibre_verified_developer:712566988198641681>",
  "DISCORD_EMPLOYEE": "<:fibre_discord_staff:712566988089589771>",
  "DISCORD_PARTNER": "<:fibre_discord_partner:712566987594661960>",
  "HYPESQUAD_EVENTS": "<:fibre_hypesquad_events:712566988261818369>",
  "BUGHUNTER_LEVEL_2": "<:fibre_bug_hunter_1:712566988635111524>",
  "BUGHUNTER_LEVEL_1": "<:fibre_bug_hunter_2:712568939321884713>",
  "HOUSE_BRAVERY": "<:fibre_house_bravery:712566988320538716>",
  "HOUSE_BRILLIANCE": "<:fibre_house_brilliance:712566988467208215>",
  "VERIFIED_BOT": "<:fibre_verified_bot:712613523976486982>"
}

const statues = {
  "dnd": "<:fibre_dnd:714450120946483302> Do Not Disturb",
  "idle": "<:fibre_idle:714450121089351700> Idle",
  "online": "<:fibre_online:714450121038757938> Online",
  "offline": "<:fibre_offline:714450121097740349> Offline"
}

const statuses = {
  "desktop": "🖥️ Desktop",
  "mobile": "📱 Mobile",
  "web": "<:fibre_web:714452048812441641> Web"
}

export default class UserInfoCommand extends Command {
  constructor() {
    super("userinfo", {
      aliases: ["userinfo", "ui", "whois"],
      channel: "guild",
      category: "Info",
      args: [
        {
          id: "member",
          type: async (message: Message, user: string) => {
            if(!user) return null;
            try {
              let member: any = await this.client.util.resolveMember(user, message.guild!.members.cache);
              if(member) return member;
            } catch {}
            try {
              let resolved_user: any = await this.client.util.resolveUsers(user, this.client.users.cache);
              if(resolved_user.size > 1) return resolved_user.first();
              else if (resolved_user.size) return resolved_user.first();
            } catch {}
            try {
              let fetched: any = await this.client.users.fetch(user);
              if(fetched) return fetched;
            } catch {}
          },
          default: (_) => _.member
        }
      ],
      description: {
        content: "Shows user's information", 
        usage: "userinfo < user >",
        examples: [
          "userinfo pizza",
        ]
      },
    });
  }

  async exec (message: Message, { member }: { member: any  }): Promise<Message | any> {
    let colour = await this.client.findOrCreateGuild({ id: message.guild!.id }).then(guild => guild.colour);
    if(member.joinedTimestamp){
      return message.util!.send(new this.client.Embed(message, colour)
        .addField("Username:", member.user.username, true)
        .addField("Discriminator:", member.user.discriminator, true)
        .addField("Nickname:", member.nickname ?? "None", true)
        .addField("Bot:", `${member.user.bot ? "<:fibre_bot:714450121131032576> Yes": "🧍 No"}`, true)
        .addField("Status:", statues[member.user.presence.status], true)
        .addField("Client Status:", member.user.presence.clientStatus ? Object.keys(member.user.presence.clientStatus).map(x => statuses[x]) : "N/A", true)
        .addField("Created At:", moment(member.user.createdTimestamp).format("dddd do MMMM YYYY"), true)
        .addField("Joined At:", moment(member.joinedTimestamp).format("dddd do MMMM YYYY"), true)
        .addField("Boosting:", member.premiumSince ? `Since ${moment(member.premiumSince).format("dddd do MMMM YYYY")}` : "Not boosting", true)
        .addField(`Badges [${member.user.flags.toArray().length}]:`, member.user.flags.toArray().length ? member.user.flags.toArray().map(x => emojies[x]).join(" ") : "No Badges", false)
        .addField(`Roles [${member.roles.cache.size - 1}]:`, `${member.roles.cache.map(role => role).filter(role => role.name !== "@everyone").sort((a,b) => b.position - a.position).slice(0,15).join(", ")} ${member.roles.cache.size > 15 ? "..." : ""}`, false)
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true, format: "png", size: 2048 }))
        .setFooter(`User ID: ${member.id}`)
      )
    }
    return message.util!.send(new this.client.Embed(message, colour)
        .addField("Username:", member.username, true)
        .addField("Discriminator:", member.discriminator, true)
        .addField("Bot:", `${member.bot ? "<:fibre_bot:714450121131032576> Yes": "🧍 No"}`, true)
        .addField("Created At:", moment(member.createdTimestamp).format("dddd do MMMM YYYY"), true)
        .addField("Status:", statues[member.presence.status], true)
        .addField("Client Status:", member.presence.clientStatus ? Object.keys(member.presence.clientStatus).map(x => statuses[x]) : "N/A", true)
        .addField("Badges:", member.flags ? member.flags.toArray().length ? member.flags.toArray().map(x => emojies[x]).join(" ") : "No Badges" : "No Badges")
        .setThumbnail(member.displayAvatarURL({ dynamic: true, format: "png", size: 2048 }))
        .setFooter(`User ID: ${member.id}`)
      )
  }
}