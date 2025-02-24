require("dotenv").config();
const {
  Client,
  Events,
  GatewayIntentBits,
  SlashCommandBuilder
} = require("discord.js");
const { afkCommand, backCommand, handleAfk, handleBack } = require("./commands/afkSystem");
const { rollCallCommand, handleRollCall } = require("./commands/rollCallSystem");
const { taskCommand, handleTask } = require("./commands/taskAssignment");

const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates
  ] 
});

client.once(Events.ClientReady, c => {
  console.log(`Logged in as ${c.user.tag}`);

  const ping = new SlashCommandBuilder()
    .setName("ping")
    .setDescription('Replies with "Pong!"');

  const hello = new SlashCommandBuilder()
    .setName("hello")
    .setDescription('Replies with "Hello!"');

  client.application.commands.create(ping, process.env.SERVER_ID);
  client.application.commands.create(afkCommand, process.env.SERVER_ID);
  client.application.commands.create(backCommand, process.env.SERVER_ID);
  client.application.commands.create(hello, process.env.SERVER_ID);
  client.application.commands.create(rollCallCommand, process.env.SERVER_ID);
  client.application.commands.create(taskCommand, process.env.SERVER_ID);
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  if (commandName === "ping") {
    await interaction.reply("Pong!");
  }
  if (commandName === "afk") {
    await handleAfk(interaction);
  }
  if (commandName === "back") {
    await handleBack(interaction);
  }
  if (commandName === "hello") {
    await interaction.reply(`Hello! ${interaction.user.tag}`);
  }
  if (commandName === "rollcall") {
    await handleRollCall(interaction);
  }
  if (commandName === "task") {
    await handleTask(interaction);
  }
});

client.login(process.env.DISCORD_TOKEN);
