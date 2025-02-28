const { SlashCommandBuilder } = require('discord.js');
const schedule = require('node-schedule');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('schedulemeeting')
        .setDescription('Schedule a meeting with notifications')
        .addStringOption(option =>
            option.setName('time')
                .setDescription('Meeting time (24-hour format, e.g., 14:30)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('description')
                .setDescription('Meeting description/agenda')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('attendees')
                .setDescription('Tag meeting attendees (separate with spaces)')
                .setRequired(true)),

    async execute(interaction) {
        const timeString = interaction.options.getString('time');
        const description = interaction.options.getString('description');
        const attendeesString = interaction.options.getString('attendees');

        // Validate time format
        const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(timeString)) {
            return interaction.reply({
                content: 'Please provide a valid time in 24-hour format (e.g., 14:30)',
                ephemeral: true
            });
        }

        // Parse attendees (user mentions)
        const attendees = attendeesString.match(/<@!?\d+>/g) || [];
        if (attendees.length === 0) {
            return interaction.reply({
                content: 'Please mention at least one user to attend the meeting',
                ephemeral: true
            });
        }

        // Parse the time
        const [hours, minutes] = timeString.split(':').map(Number);
        const meetingTime = new Date();
        meetingTime.setHours(hours, minutes, 0);

        // If the time has already passed today, schedule for tomorrow
        if (meetingTime < new Date()) {
            meetingTime.setDate(meetingTime.getDate() + 1);
        }

        // Schedule the meeting notification
        const job = schedule.scheduleJob(meetingTime, async function() {
            const attendeesMention = attendees.join(' ');
            await interaction.channel.send({
                content: `🔔 **MEETING STARTING NOW!**\n\n`
                    + `📝 **Description:** ${description}\n`
                    + `⏰ **Time:** ${timeString}\n`
                    + `👥 **Attendees:** ${attendeesMention}\n\n`
                    + `Please join the meeting now!`
            });
        });

        // Send confirmation message
        await interaction.reply({
            content: `✅ Meeting scheduled!\n\n`
                + `📝 **Description:** ${description}\n`
                + `⏰ **Time:** ${timeString}\n`
                + `👥 **Attendees:** ${attendees.join(' ')}\n\n`
                + `A notification will be sent when the meeting starts.`,
            ephemeral: false
        });
    },
};
