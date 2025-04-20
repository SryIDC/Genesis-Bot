const { Events, ActivityType } = require("discord.js");

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    client.user.setActivity({
      name: "Genesis Roleplay",
      type: ActivityType.Playing,
      status: "dnd",
    });
    console.log(`Ready! Logged in as ${client.user.tag}`);
  },
};
