const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

// Store AFK users with their timestamps
const afkUsers = new Map();

function handleAfkCommand(message) {
  const row = new ActionRowBuilder()
    .addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('afk_duration')
        .setPlaceholder('Select AFK duration')
        .addOptions([
          { label: '5 minutes', value: '5' },
          { label: '10 minutes', value: '10' },
          { label: '15 minutes', value: '15' },
          { label: '20 minutes', value: '20' },
          { label: '25 minutes', value: '25' },
        ])
    );

  return message.reply({
    content: 'Please select how long you\'ll be AFK:',
    components: [row]
  });
}

function handleBackCommand(message) {
  if (!afkUsers.has(message.author.id)) return;
  
  const afkData = afkUsers.get(message.author.id);
  const timeTaken = Math.floor((Date.now() - afkData.timestamp) / 60000);
  afkUsers.delete(message.author.id);
  
  return message.reply(`I'm back from AFK, sorry for inconvenience (${timeTaken} minutes)`);
}

function handleAfkSelection(interaction) {
  const duration = parseInt(interaction.values[0]);
  afkUsers.set(interaction.user.id, {
    timestamp: Date.now(),
    duration: duration
  });

  return interaction.reply(`AFK ${interaction.user.username} about ${duration} mins`);
}

module.exports = {
  afkUsers,
  handleAfkCommand,
  handleBackCommand,
  handleAfkSelection
}; 