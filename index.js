// console.log("Hello AI Bot!")
// const server = require("./server.js");
const keep_alive = require("./keep_alive.js");
require('dotenv').config();

const token = process.env.mytoken;
const { ask, isValIncase } = require("./ai.js");
const { Client, GatewayIntentBits, ActivityType, AttachmentBuilder } = require("discord.js");
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
    const resp = await ask(prompt);
    SendTextToChannel(client, message, "\nThe response is being generating. Wait for it until its finished!\n");
    
    if(resp.length >= 2000) {
      const attachment = new AttachmentBuilder(Buffer.from(resp, 'utf-8'), { name: 'response.txt' });
      SendTextToChannel(client, message, { files: [attachment] });
    } else {
      SendTextToChannel(client, message, resp);
    }

    SendTextToChannel(client, message, "\nThe response has been generated!\n");
  }
}

async function DoExecCmds(client, message, cmd, prefix = "!") {
  if(Array.isArray(cmd)) {
    for(let cmdv of cmd) {
      await SendMsg(client, message, cmdv, prefix);
    }
  } else {
    await SendMsg(client, message, cmd, prefix);
  }
}

async function SendTextToChannelAsync(client, message, text) {
  const channel = await client.channels.fetch(message.channel.id);
  channel.send(text);
}

function SendTextToChannel(client, message, text) {
  client.channels.fetch(message.channelId).then(channel => channel.send(text));
}

// function SendTextToChannelSync(client, message, text) {
  // message.channel.send(text);
  // client.channels.fetch(message.channelId).then(channel => channel.send(text));
// }

async function GetInitialCommands(client, message) { 
  const commandBody = message.content.slice("!".length);
  const args = commandBody.split(' ');
  const command = args.shift().toLowerCase();
  
  if(command === "help_chat") {
    await SendTextToChannelAsync(client, message, `
    Help:
    !cb <msg> or !chatbot <msg> - to talk with chatbot and get info from it
    !hello_chat - gets hello output message
    !time_chat - gets time output message
    !help_chat - get list of help commands`);
  }
  else if(command === "hello_chat") {
    await SendTextToChannelAsync(client, message, `Hello ${message.author.username} from LCPChatBot!`);
  }
  else if(command === "time_chat") {
    await SendTextToChannelAsync(client, message, `The time is ${new Date().toString()}!`);
  }
}

client.on("ready", () => {
  client.user.setPresence({
    activities: [{
      name: 'LCPChatBot Playing !chatbot <msg> or !cb <msg>',
      type: ActivityType.Playing
    }],
    status: 'online'
  });
  console.log("The LCPChatBot AI is online"); 
});

client.on("messageCreate", async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith("!")) return;
  
  try {
    await GetInitialCommands(client, message);
    await DoExecCmds(client, message, ["chatbot", "cb"], "!");
  } catch(err) {
    console.log(err);
    await SendTextToChannelAsync(client, message, `\nError: ${err} \n`);
  }
});

client.on("error", (err) => {
  console.error(err);
});

client.login(token);