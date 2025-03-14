console.log("Starting the bot...");

require('dotenv').config();
const fs = require('fs');
const DiscordBot = require('./client/DiscordBot');

console.log("Creating DiscordBot client...");
const client = new DiscordBot();

// Load event handlers
console.log("Loading event handlers...");
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
  console.log(`Loading event: ${file}`);
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