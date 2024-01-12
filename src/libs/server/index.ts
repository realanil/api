const dotenv = require('dotenv');
import { BaseSlotGame } from "../platform/slots/base_slot_game";
import { RGS } from "./rgs";
import { glob } from "glob";

dotenv.config();

const port:string = process.env.PORT ? process.env.PORT : "8080";

glob(`./src/games/*/*.ts`).then( async servFiles => {

    const engines :Map<string, BaseSlotGame> = new Map();

    for( let i=0; i<servFiles.length; i++ ) {
        const tsfile = servFiles[i].split('src\\')[1];
        const servClass = tsfile.split(".")[0]
        const engine = await import( './../../' + servClass );

        const id:string = servFiles[i].split('\\')[2]
        console.log ( id, engine, servFiles[i] );
        engines.set( id, new engine.GameServer() )
    }
    
    const server = new RGS(  engines );
    server.start( port);
    console.log( "start server") 
})

