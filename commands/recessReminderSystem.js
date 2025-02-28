const { Client, Events } = require('discord.js');

// Replace these with your values
const CHANNEL_ID = process.env.CHANNEL_ID; // The channel ID where you want the message to appear
const RECESS_TIME = process.env.REMINDER_TIME;  // Time to send reminder (24-hour format)

module.exports = (client) => {
    setInterval(() => {
        const now = new Date();
        const time = now.toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit'
        });

        if (time === REMINDER_TIME) {
            const channel = client.channels.cache.get(CHANNEL_ID);
            if (channel) {
                channel.send(' **Reminder:** Alright, Time to recess guys!');
            }
        }
    }, 60000); // Check every minute
};
