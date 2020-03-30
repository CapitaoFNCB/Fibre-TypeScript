import { token } from "./utils/Config";
import { ShardingManager } from 'discord.js';
const shard = new ShardingManager('dist/Fibre.js', {
    token: token,
    respawn: true
  });
  
shard.spawn(2);