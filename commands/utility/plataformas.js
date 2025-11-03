const fs = require("fs");
const path = require("path");
const { SlashCommandBuilder } = require("discord.js");
const { logError } = require("../../utils/functions");

const PLATFORMS = {
  Steam: "<:Steam:1435001083582742617>",
  PlayStation: "<:Playstation:1435003517978018015>",
  Xbox: "<:XBox:1435003474223042640>",
  EpicGames: "<:EpicGames:1435003428668707008>",
  Nintendo: "<:Nintendo:1435003376445161645>",
  BattleNet: "<:BattleNet:1435003328714117233>",
  Twitch: "<:Twitch:1435001130219208725>",
  YouTube: "<:YouTube:1435001177052807250>",
  Linktree: "<:Linktree:1435001220166058064>",
  Beacons: "<:Beacons:1435001263220592801>",
  Instagram: "<:Instagram:1435000941169479800>",
  Twitter: "<:Twitter:1435001793913421865>",
  TikTok: "<:Tiktok:1435001036807999679>",
};

const PLATFORM_REGEX = {
  Steam: /^https?:\/\/(www\.)?steamcommunity\.com\/id\/[A-Za-z0-9_-]+\/?$/i,
  PlayStation: /^https?:\/\/(my\.|www\.)?playstation\.com\/[A-Za-z0-9_-]+\/?$/i,
  Xbox: /^https?:\/\/(account\.|www\.)?xbox\.com\/[A-Za-z0-9_-]+\/?$/i,
  EpicGames: /^https?:\/\/(www\.)?epicgames\.com\/id\/[A-Za-z0-9_-]+\/?$/i,
  Nintendo: /^https?:\/\/(my\.|accounts\.)?nintendo\.com\/[A-Za-z0-9_-]+\/?$/i,
  BattleNet: /^https?:\/\/(www\.)?battle\.net\/[A-Za-z0-9_-]+\/?$/i,
  Twitch: /^https?:\/\/(www\.)?twitch\.tv\/[A-Za-z0-9_]+\/?$/i,
  YouTube:
    /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/[A-Za-z0-9_\-\/?=]+$/i,
  Linktree: /^https?:\/\/(www\.)?linktr\.ee\/[A-Za-z0-9_.-]+\/?$/i,
  Beacons: /^https?:\/\/(www\.)?beacons\.ai\/[A-Za-z0-9_.-]+\/?$/i,
  Instagram: /^https?:\/\/(www\.)?instagram\.com\/[A-Za-z0-9_.-]+\/?$/i,
  Twitter: /^https?:\/\/(www\.)?(x\.com|twitter\.com)\/[A-Za-z0-9_]+\/?$/i,
  TikTok: /^https?:\/\/(www\.)?tiktok\.com\/@?[A-Za-z0-9_.-]+\/?$/i,
};

const ALLOWED_PLATFORMS = Object.keys(PLATFORM_REGEX);

module.exports = {
  // --- Slash command ---
  data: new SlashCommandBuilder()
    .setName("plataformas")
    .setDescription("Gerir plataformas associadas ao teu perfil.")
    .addSubcommand((sub) =>
      sub
        .setName("add")
        .setDescription("Adiciona uma plataforma com o teu link de perfil.")
        .addStringOption((opt) =>
          opt
            .setName("nome")
            .setDescription("Escolhe uma plataforma.")
            .setRequired(true)
            .addChoices(
              ...ALLOWED_PLATFORMS.map((p) => ({ name: p, value: p }))
            )
        )
        .addStringOption((opt) =>
          opt
            .setName("url")
            .setDescription("Insere o link do teu perfil.")
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("remove")
        .setDescription("Remove uma plataforma do teu perfil.")
        .addStringOption((opt) =>
          opt
            .setName("nome")
            .setDescription("Escolhe a plataforma a remover.")
            .setRequired(true)
            .addChoices(
              ...ALLOWED_PLATFORMS.map((p) => ({ name: p, value: p }))
            )
        )
    ),

  async execute(interaction) {
    try {
      const sub = interaction.options.getSubcommand();
      const platform = interaction.options.getString("nome");
      const userId = interaction.user.id;
      const userDir = path.join(__dirname, "../../data/users");
      const userFile = path.join(userDir, `${userId}.json`);

      if (!fs.existsSync(userFile)) {
        return interaction.reply({
          content: "❌ Não tens um perfil registado ainda.",
          ephemeral: true,
        });
      }

      const userData = JSON.parse(fs.readFileSync(userFile));
      if (!Array.isArray(userData.plataformas)) userData.plataformas = [];

      if (sub === "add") {
        const url = interaction.options.getString("url");

        const badLink = /(javascript:|data:|@|%0A|%0D)/i;
        if (badLink.test(url)) {
          return interaction.reply({
            content: "🚫 Link inválido ou potencialmente perigoso.",
            ephemeral: true,
          });
        }

        const regex = PLATFORM_REGEX[platform];
        if (!regex.test(url)) {
          return interaction.reply({
            content: `🚫 O link não corresponde ao formato esperado para **${platform}**.`,
            ephemeral: true,
          });
        }

        if (userData.plataformas.some((p) => p.nome === platform)) {
          return interaction.reply({
            content: `⚠️ Já tens **${platform}** registada.`,
            ephemeral: true,
          });
        }

        userData.plataformas.push({
          nome: platform,
          emoji: PLATFORMS[platform],
          url,
        });

        fs.writeFileSync(userFile, JSON.stringify(userData, null, 2));

        return interaction.reply({
          content: `✅ Plataforma ${PLATFORMS[platform]} **${platform}** adicionada com sucesso!`,
          ephemeral: true,
        });
      }

      if (sub === "remove") {
        const index = userData.plataformas.findIndex(
          (p) => p.nome === platform
        );
        if (index === -1) {
          return interaction.reply({
            content: `⚠️ Não tens a plataforma **${platform}** registada.`,
            ephemeral: true,
          });
        }

        userData.plataformas.splice(index, 1);
        fs.writeFileSync(userFile, JSON.stringify(userData, null, 2));

        return interaction.reply({
          content: `✅ Plataforma ${PLATFORMS[platform]} **${platform}** removida com sucesso!`,
          ephemeral: true,
        });
      }
    } catch (error) {
      await logError("plataformas (slash)", error);
      await interaction.reply({
        content: "❌ Ocorreu um erro ao executar o comando.",
        ephemeral: true,
      });
    }
  },

  // --- Prefix command ---
  prefix: {
    name: "plataformas",
    description: "Gerir plataformas associadas ao teu perfil.",
    usage: "!plataformas <add|remove> <nome> [url]",
    async execute(message, args = []) {
      // 👈 valor default para evitar undefined
      try {
        if (!Array.isArray(args)) args = []; // 👈 segurança extra

        if (args.length < 2) {
          return message.reply(
            "❌ Uso incorreto. Exemplo: `!plataformas add Steam <url>`"
          );
        }

        const sub = args[0].toLowerCase();
        const platform = args[1];
        const url = args[2];
        const userId = message.author.id;
        const userDir = path.join(__dirname, "../../data/users");
        const userFile = path.join(userDir, `${userId}.json`);

        // 🔹 Verificar se a lista de plataformas permitidas existe
        if (
          typeof ALLOWED_PLATFORMS === "undefined" ||
          !Array.isArray(ALLOWED_PLATFORMS)
        ) {
          return message.reply(
            "⚠️ As plataformas permitidas não estão configuradas."
          );
        }

        if (!ALLOWED_PLATFORMS.includes(platform)) {
          return message.reply(
            `❌ Plataforma inválida. Escolhe uma das seguintes: ${ALLOWED_PLATFORMS.join(
              ", "
            )}`
          );
        }

        if (!fs.existsSync(userFile)) {
          return message.reply("❌ Não tens um perfil registado ainda.");
        }

        const userData = JSON.parse(fs.readFileSync(userFile));
        if (!Array.isArray(userData.plataformas)) userData.plataformas = [];

        // -------------------------
        // ADD
        // -------------------------
        if (sub === "add") {
          if (!url) {
            return message.reply(
              "❌ Tens de fornecer o link da tua conta. Exemplo: `!plataformas add Steam <url>`"
            );
          }

          const badLink = /(javascript:|data:|@|%0A|%0D)/i;
          if (badLink.test(url)) {
            return message.reply(
              "🚫 Link inválido ou potencialmente perigoso."
            );
          }

          const regex = PLATFORM_REGEX?.[platform];
          if (!regex || !regex.test(url)) {
            return message.reply(
              `🚫 O link não corresponde ao formato esperado para **${platform}**.`
            );
          }

          if (userData.plataformas.some((p) => p.nome === platform)) {
            return message.reply(`⚠️ Já tens **${platform}** registada.`);
          }

          userData.plataformas.push({
            nome: platform,
            emoji: PLATFORMS?.[platform] || "",
            url,
          });

          fs.writeFileSync(userFile, JSON.stringify(userData, null, 2));

          return message.reply(
            `✅ Plataforma ${
              PLATFORMS?.[platform] || ""
            } **${platform}** adicionada com sucesso!`
          );
        }

        // -------------------------
        // REMOVE
        // -------------------------
        if (sub === "remove") {
          const index = userData.plataformas.findIndex(
            (p) => p.nome === platform
          );
          if (index === -1) {
            return message.reply(
              `⚠️ Não tens a plataforma **${platform}** registada.`
            );
          }

          userData.plataformas.splice(index, 1);
          fs.writeFileSync(userFile, JSON.stringify(userData, null, 2));

          return message.reply(
            `✅ Plataforma ${
              PLATFORMS?.[platform] || ""
            } **${platform}** removida com sucesso!`
          );
        }

        // -------------------------
        // SUBCOMANDO INVÁLIDO
        // -------------------------
        return message.reply(
          "❌ Subcomando inválido. Usa `!plataformas add` ou `!plataformas remove`."
        );
      } catch (error) {
        await logError("plataformas (prefix)", error);
        message.reply("❌ Ocorreu um erro ao executar o comando.");
      }
    },
  },
};
