import { AkairoClient, CommandHandler, ListenerHandler, Flag } from "discord-akairo";
import { join } from 'path';
import { capitalize, resolve, flag, checkDays, guildOnly, ownerOnly, perms, check_emojis, getUsersData, findOrCreateMember, findOrCreateGuild, findOrCreateUser } from "../utils/Functions"
import { owners } from "../utils/Config";
import { Message, Collection } from "discord.js";
import guildsData from "../database/Guild"
import membersData from "../database/Member"
import usersData from "../database/User"
import Logger from "@ayanaware/logger";
import { DefaultFormatter, DefaultFormatterColor, Color } from "@ayanaware/logger"
import Embed from "./FibreEmbed";
import { load } from "../dashboard/app"

Logger.setFormatter(new DefaultFormatter({
  colorMap: new Map([
    [DefaultFormatterColor.LOG_PACKAGE_PATH, Color.BRIGHT_YELLOW],
    [DefaultFormatterColor.LOG_PACKAGE_NAME, Color.BRIGHT_RED],
    [DefaultFormatterColor.LOG_UNIQUE_MARKER, Color.WHITE]
  ])
}));


declare module "discord-akairo" {
    interface AkairoClient {
        config: Options;
        commandHandler: CommandHandler;
        listenerHandler: ListenerHandler;
        logger: Logger;
        capitalize;
        resolve;
        flag;
        checkDays;
        manager;
        guildOnly;
        ownerOnly;
        Embed;
        perms;
        check_emojis;
        load;
        getUsersData;
        usersData;
        guildsData;
        membersData;
        databaseCache;
        findOrCreateUser;
        findOrCreateMember;
        findOrCreateGuild;
        queue;
    }
  }
  
  interface Options {
    owners?: string | string[];
    token?: string;
  }
  
  export default class FibreClient extends AkairoClient {
    public logger: Logger = Logger.get(FibreClient);

    public constructor(config: Options) {
        super(
          {
            ownerID: owners
          },
        );
    
       this.config = config;
       this.checkDays = checkDays; 
       this.flag = flag;
       this.resolve = resolve;
       this.capitalize = capitalize;
       this.guildOnly = guildOnly;
       this.ownerOnly = ownerOnly;
       this.Embed = Embed;
       this.perms = perms;
       this.check_emojis = check_emojis;
       this.load = load;
       this.getUsersData = getUsersData;
       this.usersData = usersData;
       this.guildsData = guildsData;
       this.membersData = membersData;
       this.findOrCreateUser = findOrCreateUser;
       this.findOrCreateMember = findOrCreateMember;
       this.findOrCreateGuild = findOrCreateGuild;
       this.databaseCache = {};
       this.databaseCache.users = new Collection();
       this.databaseCache.guilds = new Collection();
       this.databaseCache.members = new Collection();
       this.queue = new Collection();

       this.commandHandler = new CommandHandler(this, {
            prefix: async (msg: Message) => {
              let prefix = "+";
              if(!msg.guild) return prefix;
              const guild = await this.findOrCreateGuild({id: msg.guild.id}, this)
              if(guild) prefix = guild.prefix
              return prefix
            },
            commandUtil: true,
            handleEdits: true,
            argumentDefaults: {
              prompt: {
                modifyStart: async (_, str?: string) => new this.Embed(_).promptEmbed(str, await guildsData.findOne({ id: _.guild!.id }).then(guild => guild.colour)),
                modifyRetry: async (_, str?: string) => new this.Embed(_).promptEmbed(str, await guildsData.findOne({ id: _.guild!.id }).then(guild => guild.colour)),
                cancel: async _ =>
                  new this.Embed(_).promptEmbed(
                    "Alright, I've cancelled the command for you."
                    , await guildsData.findOne({ id: _.guild!.id }).then(guild => guild.colour)),
                ended: async _ =>
                  new this.Embed(_).promptEmbed(
                    "You took too many tries to respond correctly, so I've cancelled the command"
                  , await guildsData.findOne({ id: _.guild!.id }).then(guild => guild.colour)),
                timeout: async _ =>
                  new this.Embed(_).promptEmbed(
                    "You took long to respond, so I've cancelled the command"
                  , await guildsData.findOne({ id: _.guild!.id }).then(guild => guild.colour)),
                retries: 3,
                time: 6e4
              },
              otherwise: ""
            },
            blockBots: true,
            blockClient: true,
            allowMention: true,
            ignoreCooldown: this.ownerID,
            ignorePermissions: this.ownerID,
            defaultCooldown: 4e3,
            commandUtilLifetime: 6e5,
            directory: join(__dirname, "..", "commands"),
            extensions: ['.js']
        });
        this.listenerHandler = new ListenerHandler(this,{
            directory: join(__dirname, "..", "listeners"),
            extensions: ['.js']
        });

        this.listenerHandler.setEmitters({
          process: process,
          // lavalink: this.shoukaku,
          commandHandler: this.commandHandler,
          listenerHandler: this.listenerHandler,
          // inhibitorHandler: this.inhibitorHandler
      });

        this.commandHandler.resolver.addType("existingTag", async (msg: Message, word: string) => {

          if (!word || !msg.guild || this.commandHandler.modules.has(word))
              return Flag.fail(word);

          let guild: any = await this.findOrCreateGuild({ id: msg.guild.id })

          let data = guild.customCommands.filter((c) => c.name == word);

          return data.length ? Flag.fail(word) : word;

        })

        this.commandHandler.resolver.addType("catAlias", async (msg: Message, word: string) => {

          return this.commandHandler.findCommand(word) ? this.commandHandler.findCommand(word) : this.commandHandler.categories.get(this.capitalize(word.toLowerCase())) ? this.commandHandler.categories.get(this.capitalize(word.toLowerCase())) : null

        })

        
        this.commandHandler.resolver.addType("tag", async (msg: Message, word: string) => {

          if (!word || !msg.guild || this.commandHandler.modules.has(word))
              return Flag.fail(word);

          let guild: any = await this.findOrCreateGuild({ id: msg.guild.id })

          let data = guild.customCommands.filter((c) => c.name == word);

          return data.length ? word : Flag.fail(word);

        })

        this.commandHandler.useListenerHandler(this.listenerHandler);
        this.listenerHandler.loadAll()
        this.commandHandler.loadAll()
    }


    public async broadcastEval(evalStr, onlyOneValid) {
      const results = await this.shard!.broadcastEval(evalStr);
      if (onlyOneValid) return results.find(r => r);
      return results;
    }

    public async start(): Promise<string> {

        return this.login(this.config.token);
        
    }
}