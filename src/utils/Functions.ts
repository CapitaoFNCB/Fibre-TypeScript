import usersData from "../database/User"
import membersData from "../database/Member"
import guildsData from "../database/Guild"
import { MessageEmbed } from "discord.js"
import { owners } from "./Config"

export function check_emojis(emoji){
    if(emoji === '1️⃣') return 1
    else if(emoji === '2️⃣') return 2
    else if(emoji === '3️⃣') return 3
    else if(emoji === '4️⃣') return 4
    else if(emoji === '5️⃣') return 5
    else if(emoji === '🗑️') return 6
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

export async function findOrCreateUser(param, isLean){
    return new Promise(async function (resolve, reject){
        let userData = (isLean ? await usersData.findOne(param).lean() : await usersData.findOne(param));
        if(userData){
            resolve(userData);
        } else {
            userData = new usersData(param);
            await userData.save();
            resolve((isLean ? userData.toJSON() : userData));
        }
    })
}

export async function findOrCreateMember(param, isLean){
    return new Promise(async function (resolve, reject){
        let memberData = (isLean ? await membersData.findOne(param).lean() : await membersData.findOne(param));
        if(memberData){
            resolve(memberData);
        } else {
            memberData = new membersData(param);
            await memberData.save();
            let guild = await guildsData.findOne({ id: param.guildID });
            if(guild){
                guild.members.push(memberData._id);
                await guild.save();
            }
            resolve((isLean ? memberData.toJSON() : memberData));
        }
    });
}

export async function findOrCreateGuild(param, isLean){
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