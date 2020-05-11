import { MessageEmbed } from "discord.js";
import { owners } from "./Config";
import guildsData from "../database/Guild";

export function check_emojis(emoji){
    if(emoji === '1️⃣') return 1
    else if(emoji === '2️⃣') return 2
    else if(emoji === '3️⃣') return 3
    else if(emoji === '4️⃣') return 4
    else if(emoji === '5️⃣') return 5
    else if(emoji === '🔼') return 6
    else if(emoji === '🗑️') return 7
}

export function perms(check, member){
    let neededperms: string[] = []
    check.forEach(element => {
        if(!member.permissions.toArray().includes(element)) neededperms.push(element)
    });
    return neededperms
}

export function ownerOnly(id){
    if(!owners.includes(id)) return false
    return true
}

export function capitalize(str){
    return str.slice(0, 1).toUpperCase() + str.slice(1);
}

export function guildOnly(channel){
    return channel.send(new MessageEmbed()
        .setDescription("Guild Only Command")
        .setColor("0491e2")    
    )
}

export function flag(string){
    let region = {
        "brazil": ":flag_br: Brazil",
        "europe": ":flag_eu: Central Europe",
        "singapore": ":flag_sg: Singapore",
        "india": ":flag_in: India",
        "us-central": ":flag_us: U.S. Central",
        "us-east": ":flag_us: U.S. East",
        "us-south": ":flag_us: U.S. South",
        "us-west": ":flag_us: U.S. West",
        "hongkong": ":flag_hk: Hong Kong",
        "russia": ":flag_ru: Russia",
        "southafrica": ":flag_za:  South Africa",
        "japan": ":flag_jp: Japan",
        "sydney": ":flag_au: Sydney",
    }
    return region[string]
}

export function resolve(type, value, guild,client){
    if (!value) return value;
    if (!type || typeof type !== "string") throw new TypeError("Must pass `type` as string");
    switch(type.toLowerCase()) {
        case "guild":
            const resguild = client.guilds.cache.get(value) || client.guilds.cache.find(x => x.name.toLowerCase().includes(value.toLowerCase()))
            return resguild
        
        case "member":
            const resmember = guild.members.cache.get(value) || guild.members.cache.find(u => u.user.username.toLowerCase().includes(value.toLowerCase())) || guild.members.cache.find(u => u.displayName.toLowerCase().includes(value.toLowerCase())) || guild.members.cache.find(u => u.user.tag.toLowerCase().includes(value.toLowerCase()))
            return resmember
        
        case "user":
            const resuser = client.users.cache.get(value) || client.users.cache.find(u => u.user.toLowerCase().includes(value.toLowerCase())) || client.users.cache.find(u => u.displayName.toLowerCase().includes(value.toLowerCase())) || client.users.cache.find(u => u.tag.toLowerCase().includes(value.toLowerCase()))
            return resuser
        
        case "channel":
            const reschannel = guild.channels.cache.get(value) || guild.channels.cache.find(c => c.name.toLowerCase() == value.toLowerCase())
            return reschannel

        case "role":
            const resrole = guild.roles.cache.get(value) || guild.roles.cache.find(c => c.name.toLowerCase() == value.toLowerCase())
            return resrole
    }
}

export function checkDays(date){
    let now = new Date();
    let diff = now.getTime() - date.getTime();
    let days = Math.floor(diff / 86400000);
    return days + (days == 1 ? " day" : " days") + " ago";
}

export async function findOrCreateUser({ id: userID }, client, isLean?){
    return new Promise(async (resolve) => {
        if(client.databaseCache.users.get(userID)){
            resolve(isLean ? client.databaseCache.users.get(userID).toJSON() : client.databaseCache.users.get(userID));
        } else {
          let userData = (isLean ? await client.usersData.findOne({ id: userID }).lean() : await client.usersData.findOne({ id: userID }));
          if(userData){
              resolve(userData);
          } else {
              userData = new client.usersData({ id: userID });
              await userData.save();
              resolve((isLean ? userData.toJSON() : userData));
          }
          client.databaseCache.users.set(userID, userData);
        }
    });
  }

  export async function creatOrFind(param, isLean){
    return new Promise(async function (resolve, reject){
        let guildData = (isLean ? await guildsData.findOne(param).populate("members").lean() : await guildsData.findOne(param).populate("members"));
        if(guildData){
            resolve(guildData);
        } else {
            guildData = new guildsData(param);
            await guildData.save();
            resolve(guildData.toJSON());
        }
    });
}

  export async function findOrCreateGuild({ id: guildID }, client, isLean?){
    return new Promise(async (resolve) => {
        if(client.databaseCache.guilds.get(guildID)){
            resolve(isLean ? client.databaseCache.guilds.get(guildID).toJSON() : client.databaseCache.guilds.get(guildID));
        } else {
          let guildData = (isLean ? await client.guildsData.findOne({ id: guildID }).populate("members").lean() : await client.guildsData.findOne({ id: guildID }).populate("members"));
          if(guildData){
              resolve(guildData);
          } else {
              guildData = new client.guildsData({ id: guildID });
              await guildData.save();
              resolve(guildData.toJSON());
          }
          client.databaseCache.guilds.set(guildID, guildData);
        }
    });
  }

  export async function findOrCreateMember({ id: memberID, guildId: id }, client, isLean?){
    return new Promise(async (resolve) => {
        if(client.databaseCache.members.get(`${memberID}${id}`)){
            resolve(isLean ? client.databaseCache.members.get(`${memberID}${id}`).toJSON() : client.databaseCache.members.get(`${memberID}${id}`));
        } else {
          let memberData = (isLean ? await client.membersData.findOne({ id: memberID, guildId: id }).lean() : await client.membersData.findOne({ id: memberID, guildId: id }));
              if(memberData){
                  resolve(memberData);
              } else {
                  memberData = new client.membersData({ id: memberID, guildId: id });
                  await memberData.save();
                  resolve((isLean ? memberData.toJSON() : memberData));
                }
                client.databaseCache.members.set(`${memberID}${id}`, memberData);
            }
          });
      } 

export async function getUsersData(client, users){
    return new Promise(async function(resolve, reject){
        let usersData: any[] = [];
        for(let u of users){
            let result = await client.usersData.find({id: u.id});
            if(result[0]){
                usersData.push(result[0]);
            } else {
                let user = new client.usersData({
                    id: u.id
                });
                await user.save();
                usersData.push(user);
            }
        }
        resolve(usersData);
    });
}