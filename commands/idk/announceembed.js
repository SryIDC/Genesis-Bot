const {
  SlashCommandBuilder,
  MessageFlags,
  PermissionFlagsBits,
  EmbedBuilder,
  ChannelType,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("announceembed")
    .setDescription("Create an announcement using embed")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Channel to send the application link to")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("title")
        .setDescription("Enter embed title")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription("Enter embed description")
        .setRequired(true)
    )
    .addMentionableOption((option) =>
      option.setName("role").setDescription("Mention role").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("color")
        .setDescription("Enter embed color")
        .setRequired(true)
        .addChoices(
          { name: "Red", value: "red" },
          { name: "Blue", value: "blue" },
          { name: "Green", value: "green" },
          { name: "Cyan", value: "cyan" }
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const channel = interaction.options.getChannel("channel");
    const title = interaction.options.getString("title");
    const description = interaction.options.getString("description");
    const role = interaction.options.getMentionable("role");
    const color = interaction.options.getString("color");
    let colorcode;

    if (color === "red") {
      colorcode = "ff0000";
    } else if (color === "blue") {
      colorcode = "000fff";
    } else if (color === "green") {
      colorcode = "00ff13";
    } else if (color === "cyan") {
      colorcode = "00FFFF";
    }

    const appEmbed = new EmbedBuilder()
      .setColor(colorcode)
      .setTitle(title)
      .setDescription(`Hi wassup -p \n\n${role}`);
    try {
      await channel.send({
        embeds: [appEmbed],
      });
      await interaction.reply({
        content: `Embed was successfully sent to channel ${channel}`,
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
