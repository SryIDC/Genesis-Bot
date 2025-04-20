const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
  EmbedBuilder,
  ChannelType,
  SlashCommandRoleOption,
} = require("discord.js");
const { ApplicationReceivingChannel } = require("../../config.json");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("whitelistapplication")
    .setDescription("Send application to a channel")
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
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const channel = interaction.options.getChannel("channel");
    const title = interaction.options.getString("title");
    const description = interaction.options.getString("description");

    const appEmbed = new EmbedBuilder()
      .setColor("00FFFF")
      .setTitle(title)
      .setDescription(`${description}`);

    const apply = new ButtonBuilder()
      .setCustomId("whitelistApply")
      .setLabel("Apply")
      .setStyle(ButtonStyle.Success)
      .setEmoji("📝");
    const rules = new ButtonBuilder()
      .setLabel("Rules")
      .setURL("https://discord.gg/Cefu25ryd4")
      .setStyle(ButtonStyle.Link)
      .setEmoji("📘");

    const row = new ActionRowBuilder().addComponents(apply, rules);
    await interaction.reply(`Application sent to channel ${channel}`);
    await channel.send({
      embeds: [appEmbed],
      components: [row],
    });
  },
};
