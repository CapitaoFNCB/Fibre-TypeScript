import { AkairoClient, CommandHandler, ListenerHandler } from "discord-akairo";
import { join } from 'path';
import { capitalize, resolve, flag, checkDays, findOrCreateUser, findOrCreateGuild, findOrCreateMember, guildOnly, ownerOnly, perms, check_emojis} from "../utils/Functions"
import { owners, token } from "../utils/Config";
import { Message } from "discord.js";
import guildsData from "../database/Guild"
import Logger from "@ayanaware/logger";
import { DefaultFormatter, DefaultFormatterColor, Color } from "@ayanaware/logger"
import Embed from "./FibreEmbed";

Logger.setFormatter(new DefaultFormatter({
  dateFormat: "DD/MMM/YYYY hh:mm",
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
        findOrCreateUser;
        findOrCreateGuild;
        findOrCreateMember;
        guildOnly;
        ownerOnly;
        Embed;
        perms;
        check_emojis;
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
       this.findOrCreateGuild = findOrCreateGuild;
       this.findOrCreateMember = findOrCreateMember;
       this.findOrCreateUser = findOrCreateUser;
       this.guildOnly = guildOnly;
       this.ownerOnly = ownerOnly;
       this.Embed = Embed;
       this.perms = perms;
       this.check_emojis = check_emojis;

       this.commandHandler = new CommandHandler(this, {
            prefix: async (msg: Message) => {
              let prefix = "+";
              const guild = await guildsData.findOne({ id: msg.guild?.id })
              if(guild) prefix = guild.prefix
              return prefix
            },
            commandUtil: true,
            handleEdits: true,
            argumentDefaults: {
              prompt: {
                modifyStart: (_, str?: string) => new this.Embed(_).promptEmbed(str),
                modifyRetry: (_, str?: string) => new this.Embed(_).promptEmbed(str),
                cancel: _ =>
                  new this.Embed(_).promptEmbed(
                    "Alright, I've cancelled the command for you."
                  ),
                ended: _ =>
                  new this.Embed(_).promptEmbed(
                    "You took too many tries to respond correctly, so I've cancelled the command"
                  ),
                timeout: _ =>
                  new this.Embed(_).promptEmbed(
                    "You took long to respond, so I've cancelled the command"
                  ),
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
            automateCategories: true,
            defaultCooldown: 4e3,
            commandUtilLifetime: 6e5,
            directory: join(__dirname, "..", "commands"),
            extensions: ['.js']
        });
        this.listenerHandler = new ListenerHandler(this,{
            directory: join(__dirname, "..", "listeners"),
            extensions: ['.js']
        });
        this.commandHandler.useListenerHandler(this.listenerHandler);
        this.listenerHandler.loadAll()
        this.commandHandler.loadAll()
    }
    public async start(): Promise<string> {
    
        return this.login(this.config.token);
      }
}