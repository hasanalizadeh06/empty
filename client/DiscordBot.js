const { Client, Intents } = require('discord.js');
const fs = require('fs');

class DiscordBot extends Client {
  constructor() {
    super({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

    this.commands = new Map();
    this.loadCommands();
  }

  loadCommands() {
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
      const command = require(`../commands/${file}`);
      this.commands.set(command.name, command);
    }
  }

  connect() {
    this.login(process.env.DISCORD_TOKEN);
  }
}

module.exports = DiscordBot;
