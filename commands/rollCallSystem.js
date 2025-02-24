const { SlashCommandBuilder } = require('discord.js');

const rollCallCommand = new SlashCommandBuilder()
  .setName("rollcall")
  .setDescription("Shows list of users in the current voice channel");

async function handleRollCall(interaction) {
  // Check if user is in a voice channel
  if (!interaction.member.voice.channel) {
    return interaction.reply({
      content: "You need to be in a voice channel to use this command!",
      ephemeral: true
    });
  }

  const voiceChannel = interaction.member.voice.channel;
  const members = voiceChannel.members;
  const currentTime = new Date().toLocaleTimeString(); // Get current time
  
  let userList = `**Users in ${voiceChannel.name}** (Roll call at ${currentTime}):\n`;
  let count = 1;

  members.forEach(member => {
    const status = member.voice.deaf ? '🔇' : 
                  member.voice.mute ? '🔈' : '🔊';
    userList += `${count}. ${status} ${member.user.username}\n`;
    count++;
  });
  
  userList += `\nTotal users: ${members.size}`;

  await interaction.reply(userList);
}

module.exports = {
  rollCallCommand,
  handleRollCall
};
