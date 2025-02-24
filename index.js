require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { handleAfkCommand, handleBackCommand, handleAfkSelection } = require('./commands/afkSystem');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences
  ]
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  if (message.content.toLowerCase() === '!afk') {
    await handleAfkCommand(message);
  }
  else if (message.content.toLowerCase() === '!back') {
    await handleBackCommand(message);
  }
  else if (message.content === '!ping') {
    await message.reply('Pong!');
  }
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isStringSelectMenu()) return;

  if (interaction.customId === 'afk_duration') {
    await handleAfkSelection(interaction);
  }
});

client.login(process.env.DISCORD_TOKEN); 