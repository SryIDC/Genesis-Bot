const {
  SlashCommandBuilder,
  MessageFlags,
  PermissionFlagsBits,
  ChannelType,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("announce")
    .setDescription("Create an announcement")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Channel to send the application link to")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("Enter message")
        .setRequired(true)
    )
    .addMentionableOption((option) =>
      option.setName("role").setDescription("Mention role").setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const channel = interaction.options.getChannel("channel");
    const message = interaction.options.getString("message");
    const role = interaction.options.getMentionable("role");

    try {
      await channel.send({
        content: `${message}\n\n${role}`,
      });
      await interaction.reply({
        content: `Message was successfully sent to channel ${channel}`,
        falgs: MessageFlags.Ephemeral,
      });
    } catch (error) {
      console.log(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "There was an error while using this command",
          flags: MessageFlags.Ephemeral,
        });
      }
    }
  },
};
