import FibreClient from "./client/FibreClient";
import { token } from "./utils/Config";
const client = new FibreClient({token:token});

client.start();