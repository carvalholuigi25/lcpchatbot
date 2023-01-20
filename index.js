// console.log("Hello AI Bot!")
require('dotenv').config();

const token = process.env.mytoken;
const { ask } = require("./ai.js");
const { Client, Events, GatewayIntentBits, ActivityType } = require("discord.js");
// const server = require("./server.js");
const keep_alive = require("./keep_alive.js");
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

async function SendMsg(client, message, cmd, prefix = "!") {
    cmd = !cmd.includes(prefix) ? prefix + cmd : cmd;

    if (message.content.includes(cmd)) {
        const prompt = message.content.substring(cmd.length);
        const answer = await ask(prompt);
        client.channels.fetch(message.channelId).then(channel => channel.send(answer));

        //message.channel.send(answer);
        //message.channel.send(`Hello ${message.author.username} from LCPChatBot AI bot`);
    }
}

client.on(Events.ClientReady, () =>{
    client.user.setPresence({
        activities: [{
            name: 'LCPChatBot Playing !chatbot <msg> or !cb <msg>',
            type: ActivityType.Playing
        }],
        status: 'online'
    });
    console.log("The LCPChatBot AI is online"); 
});

client.on(Events.MessageCreate, async message => {
    await SendMsg(client, message, "chatbot", "!");
    await SendMsg(client, message, "cb", "!");
});

client.login(token);