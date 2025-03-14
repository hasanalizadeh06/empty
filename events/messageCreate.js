module.exports = {
  name: 'messageCreate',
  execute(message) {
    console.log(`Message received: ${message.content}`);
    // Add your message handling logic here
  },
};
