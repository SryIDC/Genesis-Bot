const {
  SlashCommandBuilder,
  MessageFlags,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Create an announcement")
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Amount of messages to delete")
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("User to clear message's from")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(interaction) {
    const { channel, options } = interaction;

    const amount = options.getInteger("amount");
    const target = options.getUser("user");

    const messages = await channel.messages.fetch({
      limit: amount + 1,
    });

    const res = new EmbedBuilder();

    if (target) {
      let i = 0;
      const filtered = [];

      await messages.filtert((msg) => {
        if (msg.author.id === target.id && amount > 1) {
          filtered.push(msg);
          i++;
        }
      });

      await channel.bulkDelete(filtered).then((messages) => {
        res.setDescription(
          `Successfully deleted ${messages.size} messages from ${target}`
        );
        interaction.reply({
          embeds: [res],
          flags: MessageFlags.Ephemeral,
        });
      });
    } else {
      await channel.bulkDelete(amount, true).then((messages) => {
        res.setDescription(
          `Successfully deleted ${messages.size} messages from this channel`
        );
        interaction.reply({
          embeds: [res],
          flags: MessageFlags.Ephemeral,
        });
      });
    }
  },
};
