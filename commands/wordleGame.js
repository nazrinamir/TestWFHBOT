const { SlashCommandBuilder } = require('discord.js');

const activeGames = require('./wordleGame').activeGames;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('guess')
        .setDescription('Make a guess in the current Wordle game')
        .addStringOption(option =>
            option
                .setName('word')
                .setDescription('Your 5-letter guess')
                .setRequired(true)),

    async execute(interaction) {
        const channelId = interaction.channelId;
        const game = activeGames.get(channelId);

        if (!game) {
            return interaction.reply({
                content: 'There is no active game in this channel. Start one with `/wordle`!',
                ephemeral: true
            });
        }

        const guess = interaction.options.getString('word').toLowerCase();

        // Validate guess
        if (guess.length !== 5 || !/^[a-z]+$/.test(guess)) {
            return interaction.reply({
                content: 'Please guess a valid 5-letter word using only letters.',
                ephemeral: true
            });
        }

        // Check the guess
        let result = '';
        const targetWord = game.word;
        let remainingLetters = [...targetWord];

        // First pass: Check for correct positions (green)
        for (let i = 0; i < 5; i++) {
            if (guess[i] === targetWord[i]) {
                result += '🟩'; // Correct position
                remainingLetters[i] = null;
            }
        }

        // Second pass: Check for wrong positions (yellow) and missing letters (⬜)
        for (let i = 0; i < 5; i++) {
            if (guess[i] === targetWord[i]) continue; // Skip already marked correct

            const index = remainingLetters.indexOf(guess[i]);
            if (index !== -1) {
                result += '🟨'; // Wrong position
                remainingLetters[index] = null;
            } else {
                result += '⬜'; // Letter not in word
            }
        }

        game.attempts.push({ guess, result });

        // Check if won
        if (guess === targetWord) {
            activeGames.delete(channelId);
            await interaction.reply(`🎉 Congratulations! You've won!\nThe word was: ${targetWord}\nSolved in ${game.attempts.length} attempts!`);
            return;
        }

        // Check if lost
        if (game.attempts.length >= game.maxAttempts) {
            activeGames.delete(channelId);
            await interaction.reply(`Game Over! The word was: ${targetWord}`);
            return;
        }

        // Show current state
        const attemptsDisplay = game.attempts
            .map(a => `${a.guess} ${a.result}`)
            .join('\n');
        
        await interaction.reply(`${attemptsDisplay}\n\nAttempts remaining: ${game.maxAttempts - game.attempts.length}`);
    },
};
