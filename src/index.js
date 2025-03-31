try {
  console.log("Starting the bot...");

  require('dotenv').config();
  const fs = require('fs');
  const DiscordBot = require('./client/DiscordBot');

  console.log("Creating DiscordBot client...");
  const client = new DiscordBot();

  // Load event handlers
  console.log("Loading event handlers...");
  const eventFiles = fs.readdirSync('./src/events').filter(file => file.endsWith('.js'));
  for (const file of eventFiles) {
    console.log(`Loading event: ${file}`);
    try {
      const event = require(`./events/${file}`);
      if (event.once) {
        client.once(event.name, (...args) => {
          console.log(`Event triggered: ${event.name}`);
          event.execute(...args);
        });
      } else {
        client.on(event.name, (...args) => {
          console.log(`Event triggered: ${event.name}`);
          event.execute(...args);
        });
      }
    } catch (error) {
      console.error(`Unable to load event: ${file}`, error);
    }
  }

  // Load commands
  console.log("Loading commands...");
  const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    console.log(`Loading command: ${file}`);
    try {
      const command = require(`./commands/${file}`);
      if (!command.name || !command.execute) {
        throw new Error(`Invalid command type in file: ${file}`);
      }
      client.commands.set(command.name, command);
      console.log(`Loaded command: ${command.name}`);
    } catch (error) {
      console.error(`Unable to load command: ${file}`, error);
    }
  }

  // Load components
  console.log("Loading components...");
  const componentFiles = fs.readdirSync('./src/components').filter(file => file.endsWith('.js'));
  for (const file of componentFiles) {
    console.log(`Loading component: ${file}`);
    try {
      const component = require(`./components/${file}`);
      if (!component.name || !component.type) {
        throw new Error(`Invalid component type in file: ${file}`);
      }
      client.components.set(component.name, component);
      console.log(`Loaded component: ${component.name}`);
    } catch (error) {
      console.error(`Unable to load component: ${file}`, error);
    }
  }

  module.exports = client;

  console.log("Connecting to Discord...");
  client.connect();

  process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
  });

  process.on('uncaughtException', error => {
    console.error('Uncaught exception:', error);
  });
} catch (err) {
  console.error("An error occurred while starting the bot:", err);
  process.exit(1);
}