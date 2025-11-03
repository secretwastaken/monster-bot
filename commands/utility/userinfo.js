const fs = require("fs");
const path = require("path");
const {
  SlashCommandBuilder,
  EmbedBuilder,
  userMention,
} = require("discord.js");
const { logError } = require("../../utils/functions");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Mostra informações detalhadas sobre um utilizador.")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("O utilizador de quem queres ver as informações.")
        .setRequired(false)
    ),

  async execute(interaction) {
    try {
      const target = interaction.options.getUser("target") || interaction.user;
      console.log("Target:", target);

      const member = await interaction.guild.members.fetch(target.id);

      const userDir = path.join(__dirname, "../../data/users");
      const userFile = path.join(userDir, `${target.id}.json`);
      const userData = fs.existsSync(userFile)
        ? JSON.parse(fs.readFileSync(userFile))
        : null;

      const embed = new EmbedBuilder()
        .setColor(0xffffff)
        .setTitle(`🧩 Informações de ${target.globalName || target.username}`)
        .setThumbnail(target.displayAvatarURL({ size: 512 }))
        .addFields(
          {
            name: "🪪 Utilizador",
            value: `${target.username} (${
              target.discriminator !== "0" ? `#${target.discriminator}` : ""
            }${userMention(target.id)})`,
            inline: false,
          },
          {
            name: "📅 Conta criada",
            value: `<t:${Math.floor(target.createdTimestamp / 1000)}:f>`,
            inline: true,
          },
          {
            name: "📥 Entrou no servidor",
            value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:f>`,
            inline: true,
          }
        );

      if (userData?.plataformas?.length > 0) {
        const plataformas = userData.plataformas
          .map((p) => `• **${p.emoji}** [${p.nome}](${p.url})`)
          .join("\n");

        embed.addFields({
          name: "🌐 Plataformas",
          value: plataformas,
          inline: false,
        });
      }

      if (member.roles.cache.size > 1) {
        const roles = member.roles.cache
          .filter((r) => r.id !== interaction.guild.id)
          .map((r) => `<@&${r.id}>`);

        embed.addFields({
          name: `🎭 Cargos [${roles.length}]`,
          value:
            roles.length > 15
              ? roles.slice(0, 15).join(", ") + " ..."
              : roles.join(", ") || "Sem cargos.",
        });
      }

      embed.setFooter({
        text: `Poderás ainda adicionar as tuas plataformas, fazendo /plataformas add [Plataforma] [Link]`,
      });

      return interaction.reply({ embeds: [embed], ephemeral: false });
    } catch (error) {
      await logError("userinfo (slash)", error);
      await interaction.reply({
        content: "❌ Ocorreu um erro ao executar o comando.",
        ephemeral: true,
      });
    }
  },

  // --- Prefix Command ---
  prefix: {
    name: "userinfo",
    description:
      "Mostra informações detalhadas sobre um utilizador. Usa: !userinfo [@utilizador]",
    usage: "!userinfo [@utilizador ou ID]",
    async execute(message, args = []) {
      // ✅ garante que args nunca é undefined
      try {
        let target;

        // ✅ Se houver menção
        if (message.mentions.users.size > 0) {
          target = message.mentions.users.first();
        }
        // ✅ Se houver argumento e não for menção
        else if (args.length > 0) {
          try {
            target = await message.client.users.fetch(args[0]);
          } catch {
            return message.reply("❌ Utilizador não encontrado.");
          }
        }
        // ✅ Caso contrário, o autor da mensagem
        else {
          target = message.author;
        }

        // ✅ Tentar obter o membro (pode falhar se o utilizador não estiver no servidor)
        let member;
        try {
          member = await message.guild.members.fetch(target.id);
        } catch {
          member = null;
        }

        const userDir = path.join(__dirname, "../../data/users");
        const userFile = path.join(userDir, `${target.id}.json`);
        const userData = fs.existsSync(userFile)
          ? JSON.parse(fs.readFileSync(userFile))
          : null;

        const embed = new EmbedBuilder()
          .setColor(0xffffff)
          .setTitle(`🧩 Informações de ${target.globalName || target.username}`)
          .setThumbnail(target.displayAvatarURL({ size: 512 }))
          .addFields(
            {
              name: "🪪 Utilizador",
              value: `${target.username} (${
                target.discriminator !== "0" ? `#${target.discriminator}` : ""
              }${userMention(target.id)})`,
              inline: false,
            },
            {
              name: "📅 Conta criada",
              value: `<t:${Math.floor(target.createdTimestamp / 1000)}:f>`,
              inline: true,
            }
          );

        // 📥 Entrou no servidor (só se existir)
        if (member?.joinedTimestamp) {
          embed.addFields({
            name: "📥 Entrou no servidor",
            value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:f>`,
            inline: true,
          });
        }

        // 🌐 Plataformas personalizadas
        if (userData?.plataformas?.length > 0) {
          const plataformas = userData.plataformas
            .map((p) => `• **${p.emoji}** [${p.nome}](${p.url})`)
            .join("\n");

          embed.addFields({
            name: "🌐 Plataformas",
            value: plataformas,
            inline: false,
          });
        }

        // 🎭 Cargos
        if (member && member.roles.cache.size > 1) {
          const roles = member.roles.cache
            .filter((r) => r.id !== message.guild.id)
            .map((r) => `<@&${r.id}>`);

          embed.addFields({
            name: `🎭 Cargos [${roles.length}]`,
            value:
              roles.length > 15
                ? roles.slice(0, 15).join(", ") + " ..."
                : roles.join(", ") || "Sem cargos.",
          });
        }

        embed.setFooter({
          text: `Poderás ainda adicionar as tuas plataformas, fazendo !plataformas add [Plataforma] [Link]`,
        });

        return message.reply({ embeds: [embed] });
      } catch (error) {
        await logError("userinfo (prefix)", error);
        message.reply("❌ Ocorreu um erro ao executar o comando.");
      }
    },
  },
};
