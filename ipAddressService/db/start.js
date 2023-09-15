import { dbInit } from './dbInit.js';
// import { spInit } from './spInit.js';
// import { triggerInit } from './triggerInit.js';

async function start() {
    // let schema = process.env.DATABASE
    await dbInit()
    // await triggerInit(schema)
}

start();