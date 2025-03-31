const { Client, Intents } = require('discord.js');
const fs = require('fs');

class DiscordBot extends Client {
  constructor() {
    super({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

    this.commands = new Map();
    this.loadCommands();
    this.loadComponents();
  }

  loadCommands() {
    const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
      const command = require(`../commands/${file}`);
      this.commands.set(command.name, command);
    }
  }

  loadComponents() {
    const componentFiles = fs.readdirSync('./src/components').filter(file => file.endsWith('.js'));
    for (const file of componentFiles) {
      const component = require(`../components/${file}`);
      this.components.set(component.name, component);
    }
  }

  connect() {
    this.login(process.env.DISCORD_TOKEN);
  }
}

module.exports = DiscordBot;
