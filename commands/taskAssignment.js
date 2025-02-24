const { SlashCommandBuilder } = require('discord.js');

// Store tasks for users
const userTasks = new Map();

const taskCommand = new SlashCommandBuilder()
  .setName("task")
  .setDescription("Manage your tasks")
  .addSubcommand(subcommand =>
    subcommand
      .setName('add')
      .setDescription('Add a new task')
      .addStringOption(option =>
        option
          .setName('description')
          .setDescription('What is the task?')
          .setRequired(true)
      )
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName('list')
      .setDescription('List all your tasks')
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName('remove')
      .setDescription('Remove a task by number')
      .addIntegerOption(option =>
        option
          .setName('number')
          .setDescription('Task number to remove')
          .setRequired(true)
      )
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName('clear')
      .setDescription('Clear all your tasks')
  );

async function handleTask(interaction) {
  const subcommand = interaction.options.getSubcommand();
  const userId = interaction.user.id;

  if (!userTasks.has(userId)) {
    userTasks.set(userId, []);
  }

  const tasks = userTasks.get(userId);
  const currentTime = new Date().toLocaleTimeString();

  switch (subcommand) {
    case 'add':
      const description = interaction.options.getString('description');
      tasks.push({
        description,
        timestamp: Date.now()
      });
      await interaction.reply(`✅ Task added: ${description}`);
      break;

    case 'list':
      if (tasks.length === 0) {
        await interaction.reply({
          content: '📝 You have no tasks for today!',
          ephemeral: true
        });
        return;
      }

      let taskList = `**${interaction.user.username}'s Tasks** (as of ${currentTime}):\n\n`;
      tasks.forEach((task, index) => {
        const taskTime = new Date(task.timestamp).toLocaleTimeString();
        taskList += `${index + 1}. [${taskTime}] ${task.description}\n`;
      });
      taskList += `\nTotal tasks: ${tasks.length}`;

      await interaction.reply(taskList);
      break;

    case 'remove':
      const taskNumber = interaction.options.getInteger('number');
      if (taskNumber < 1 || taskNumber > tasks.length) {
        await interaction.reply({
          content: '❌ Invalid task number!',
          ephemeral: true
        });
        return;
      }
      const removedTask = tasks.splice(taskNumber - 1, 1)[0];
      await interaction.reply(`🗑️ Removed task: ${removedTask.description}`);
      break;

    case 'clear':
      const taskCount = tasks.length;
      userTasks.set(userId, []);
      await interaction.reply(`🧹 Cleared ${taskCount} tasks!`);
      break;
  }
}

module.exports = {
  taskCommand,
  handleTask,
  userTasks
};
