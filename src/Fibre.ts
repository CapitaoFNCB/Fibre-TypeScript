import FibreClient from "./client/FibreClient";
import { token } from "../Config";
const client = new FibreClient({token:token});


client.start();