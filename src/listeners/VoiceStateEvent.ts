import { Listener } from "discord-akairo";

export default class ReadyListener extends Listener {
    public constructor() {
      super("listeners-voiceStateUpdate", {
        emitter: "client",
        event: "voiceStateUpdate"
      });
    }
  
    public exec(OldState ,NewState) {
        if(NewState.id == this.client.user!.id && NewState.channelID == null) {
            let player = this.client.manager.players.get(NewState.guild.id)
            if(player){
                this.client.manager.players.destroy(NewState.guild.id)
            }
        }
    }
}