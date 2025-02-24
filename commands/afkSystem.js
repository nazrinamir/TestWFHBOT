const { SlashCommandBuilder } = require('discord.js');

// Store AFK users with their timestamps
const afkUsers = new Map();

const afkCommand = new SlashCommandBuilder()
  .setName("afk")
  .setDescription("Replies with 'AFK!'")
  .addStringOption(option => 
    option
      .setName("duration")
      .setDescription("How long will you be AFK?")
      .addChoices(
        { name: "about 5 minutes", value: "5" },
        { name: "about 10 minutes", value: "10" },
        { name: "about 15 minutes", value: "15" },
        { name: "about 20 minutes", value: "20" },
        { name: "about 25 minutes", value: "25" },
        { name: "about 30 minutes", value: "30" },
        { name: "more than 30 minutes", value: "100" },
        { name: "I'm not sure", value: "0" }
      )
      .setRequired(true)
  );

const backCommand = new SlashCommandBuilder()
  .setName("back")
  .setDescription("Return from AFK status");

function formatTime(milliseconds) {
  const seconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const parts = [];
  if (hours > 0) parts.push(`${hours} hour(s)`);
  if (minutes > 0) parts.push(`${minutes} minute(s)`);
  if (remainingSeconds > 0) parts.push(`${remainingSeconds} second(s)`);

  return parts.join(' ');
}

async function handleAfk(interaction) {
  // Check if user is already AFK
  if (afkUsers.has(interaction.user.id)) {
    const afkData = afkUsers.get(interaction.user.id);
    const elapsedTime = formatTime(Date.now() - afkData.timestamp);
    
    return interaction.reply({
      content: `You are already AFK! (${elapsedTime} have passed)\nUse \`/back\` to return from AFK first.`,
      ephemeral: true
    });
  }

  const duration = interaction.options.getString("duration");
  afkUsers.set(interaction.user.id, {
    timestamp: Date.now(),
    duration: parseInt(duration)
  });
  await interaction.reply(`Notice AFK from **${interaction.user.username}**: Unavailable for ${duration} minutes`);
}

async function handleBack(interaction) {
  if (!afkUsers.has(interaction.user.id)) {
    return interaction.reply({
      content: "You are not AFK!",
      ephemeral: true
    });
  }

  const afkData = afkUsers.get(interaction.user.id);
  const timeTaken = formatTime(Date.now() - afkData.timestamp);
  afkUsers.delete(interaction.user.id);

  await interaction.reply(`**${interaction.user.username}** is back! (Was AFK for ${timeTaken})`);
}

module.exports = {
  afkCommand,
  backCommand,
  handleAfk,
  handleBack,
  afkUsers
}; 