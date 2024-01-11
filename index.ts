import { SlotocrashServer } from "./src/games/slotocrash/slotocrash_server";
import { RGS } from "./src/libs/server/rgs";

const port: string = "8080";

const server = new RGS(new SlotocrashServer());
server.start(port);
