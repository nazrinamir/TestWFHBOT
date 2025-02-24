const { SlashCommandBuilder } = require('discord.js');
const { userTasks } = require('./taskAssignment');

const rollCallCommand = new SlashCommandBuilder()
  .setName("rollcall")
  .setDescription("Shows list of users and their tasks in the current voice channel");

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
  const currentTime = new Date().toLocaleTimeString();
  
  let userList = `**Users in ${voiceChannel.name}** (Roll call at ${currentTime}):\n\n`;
  let count = 1;

  members.forEach(member => {
    const status = member.voice.deaf ? '🔇' : 
                  member.voice.mute ? '🔈' : '🔊';
    
    // Get user's tasks
    const userTaskList = userTasks.get(member.user.id) || [];
    const taskCount = userTaskList.length;
    
    userList += `${count}. ${status} **${member.user.username}** (${taskCount} tasks)\n`;
    
    // Add tasks if they exist
    if (taskCount > 0) {
      userTaskList.forEach((task, index) => {
        const taskTime = new Date(task.timestamp).toLocaleTimeString();
        userList += `   └─ ${index + 1}. [${taskTime}] ${task.description}\n`;
      });
      userList += '\n';
    } else {
      userList += '   └─ No tasks assigned\n\n';
    }
    
    count++;
  });
  
  userList += `\nTotal users: ${members.size}`;

  await interaction.reply(userList);
}

module.exports = {
  rollCallCommand,
  handleRollCall
};
