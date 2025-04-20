const {
  Events,
  MessageFlags,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
  ModalBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

const {
  ApplicationReceivingChannel,
  WhitelistRole,
  RejectedChannel,
  AcceptedChannel,
} = require("../config.json");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) {
        console.error(
          `No command matching ${interaction.commandName} was found.`
        );
        return;
      }

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: "There was an error while executing this command!",
            flags: MessageFlags.Ephemeral,
          });
        } else {
          await interaction.reply({
            content: "There was an error while executing this command!",
            flags: MessageFlags.Ephemeral,
          });
        }
      }
    } else if (interaction.isButton()) {
      const { customId, user, message, guild } = interaction;
      const collectorFilter = (i) => user.id === user.id;
      try {
        if (customId === "whitelistApply") {
          const modal = new ModalBuilder()
            .setCustomId("genWhitelist")
            .setTitle("Genesis Whitelist");
          const nameInput = new TextInputBuilder()
            .setCustomId("name")
            .setStyle(TextInputStyle.Short)
            .setLabel("What's your name?")
            .setPlaceholder("Enter your Name")
            .setRequired(true);
          const ageInput = new TextInputBuilder()
            .setCustomId("age")
            .setStyle(TextInputStyle.Short)
            .setLabel("What's your age?")
            .setPlaceholder("Enter your Age")
            .setRequired(true);
          const pwrgInput = new TextInputBuilder()
            .setLabel("Explain power gaming?")
            .setCustomId("pwrg")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Enter your answer")
            .setRequired(true);
          const metagInput = new TextInputBuilder()
            .setLabel("Explain meta gaming?")
            .setCustomId("metag")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Enter your answer")
            .setRequired(true);
          const rvdm = new TextInputBuilder()
            .setLabel("Explain RDM/VDM?")
            .setCustomId("rvdm")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Enter your answer")
            .setRequired(true);
          const firstComp = new ActionRowBuilder().addComponents(nameInput);
          const secondComp = new ActionRowBuilder().addComponents(ageInput);
          const thirdComp = new ActionRowBuilder().addComponents(pwrgInput);
          const fourthComp = new ActionRowBuilder().addComponents(metagInput);
          const fifthComp = new ActionRowBuilder().addComponents(rvdm);

          modal.addComponents(
            firstComp,
            secondComp,
            thirdComp,
            fourthComp,
            fifthComp
          );
          await interaction.showModal(modal);
        } else if (
          customId === "acceptWhitelist" ||
          customId === "declineWhitelist"
        ) {
          const embed = EmbedBuilder.from(message.embeds[0]);
          const userId = embed.data.footer?.text;

          const newStatus =
            customId === "acceptWhitelist"
              ? "✅ Form Status: Accepted"
              : "❌ Form Status: Declined";

          const newColor = customId === "acceptWhitelist" ? "00ff13" : "ff0000";

          if (!userId) {
            return interaction.reply({
              content: "❌ Couldn't find the user who submitted this form.",
              flags: MessageFlags.Ephemeral,
            });
          }

          if (customId === "acceptWhitelist") {
            const member = await guild.members.fetch(userId);
            await member.roles.add(WhitelistRole);
          }

          embed.setDescription(newStatus);
          embed.setColor(newColor);

          const disabledRow = ActionRowBuilder.from(message.components[0]);
          disabledRow.components.forEach((btn) => btn.setDisabled(true));

          await message.edit({
            embeds: [embed],
            components: [disabledRow],
          });

          const dmChannel = await interaction.client.channels.fetch(
            `${
              customId === "acceptWhitelist" ? AcceptedChannel : RejectedChannel
            }`
          );

          await dmChannel.send({
            content: `<@${userId}> your whitelist application has been ${
              customId === "acceptWhitelist" ? "accepted" : "declined"
            }`,
          });

          await interaction.reply({
            content: `You have ${
              customId === "acceptWhitelist" ? "accepted" : "declined"
            } the form.`,
            flags: MessageFlags.Ephemeral,
          });
          return;
        } else if (customId === "holdWhitelist") {
          const embed = EmbedBuilder.from(message.embeds[0]);
          const userId = embed.data.footer?.text;

          const newStatus =
            customId === "acceptWhitelist"
              ? "✅ Form Status: Accepted"
              : "❌ Form Status: Declined";

          const newColor = customId === "acceptWhitelist" ? "00ff13" : "ff0000";

          if (!userId) {
            return interaction.reply({
              content: "❌ Couldn't find the user who submitted this form.",
              flags: MessageFlags.Ephemeral,
            });
          }

          if (customId === "acceptWhitelist") {
            const member = await guild.members.fetch(userId);
            await member.roles.add(WhitelistRole);
          }

          embed.setDescription(newStatus);
          embed.setColor(newColor);

          const disabledRow = ActionRowBuilder.from(message.components[0]);
          disabledRow.components.forEach((btn) => btn.setDisabled(true));

          await message.edit({
            embeds: [embed],
            components: [disabledRow],
          });

          const dmChannel = await interaction.client.channels.fetch(
            `${
              customId === "acceptWhitelist" ? AcceptedChannel : RejectedChannel
            }`
          );

          await dmChannel.send({
            content: `<@${userId}> your whitelist application has been ${
              customId === "acceptWhitelist" ? "accepted" : "declined"
            }`,
          });

          await interaction.reply({
            content: `Form has been `,
            flags: MessageFlags.Ephemeral,
          });
          return;
        }
      } catch (error) {
        await interaction.reply({
          content: "Confirmation not received within 1 minute, cancelling",
          flags: MessageFlags.Ephemeral,
          components: [],
        });
        console.log(error);
      }
    } else if (interaction.isModalSubmit()) {
      if (interaction.customId === "genWhitelist") {
        const name = interaction.fields.getTextInputValue("name");
        const age = interaction.fields.getTextInputValue("age");
        const pwrg = interaction.fields.getTextInputValue("pwrg");
        const metag = interaction.fields.getTextInputValue("metag");
        const rvdm = interaction.fields.getTextInputValue("rvdm");
        const user = interaction.user;

        const whitelistEmbed = new EmbedBuilder()
          .setColor(0x0099ff)
          .setDescription("Form Status: Pending")
          .setTitle("Discord Username")
          .setDescription(`${user.username}\n`)
          .addFields(
            { name: "Name", value: `${name}\n` },
            {
              name: "Age:",
              value: `${age}\n`,
            },
            {
              name: "Power Gaming:",
              value: `${pwrg}\n`,
            },
            {
              name: "Meta Gaming:",
              value: `${metag}\n`,
            },
            {
              name: "VDM/RDM:",
              value: `${rvdm}\n`,
            }
          )
          .setFooter({
            text: `${user.id}`,
          })
          .setTimestamp();

        try {
          const submitChannel = await interaction.client.channels.fetch(
            ApplicationReceivingChannel
          );
          const acceptWhitelist = new ButtonBuilder()
            .setCustomId("acceptWhitelist")
            .setLabel("Accept Form")
            .setStyle(ButtonStyle.Success)
            .setEmoji("✅");

          const declineWhitelist = new ButtonBuilder()
            .setCustomId("declineWhitelist")
            .setLabel("Decline Form")
            .setStyle(ButtonStyle.Danger)
            .setEmoji("❌");

          const holdWhitelist = new ButtonBuilder()
            .setCustomId("holdWhitelist")
            .setLabel("Hold Application")
            .setStyle(ButtonStyle.Premium)
            .setEmoji("🛑");

          const buttons = new ActionRowBuilder().addComponents(
            acceptWhitelist,
            declineWhitelist,
            holdWhitelist
          );
          await submitChannel.send({
            embeds: [whitelistEmbed],
            components: [buttons],
          });
          await interaction.reply({
            content:
              "✅ Your whitelist application has been submitted! Wait for management team to review your form!",
            flags: MessageFlags.Ephemeral,
          });
        } catch (error) {
          console.log(error);
          await interaction.reply({
            content: `❌ Error while submitting form! Contact developers.`,
            flags: MessageFlags.Ephemeral,
          });
        }
      }
    }
  },
};
