const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const logError = require("../../utils/functions");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("Fornece informações sobre o servidor."),

  async execute(bot, interaction) {
    try {
      const guild = bot.guilds.cache.get("1231627321811800085");
      await guild.members.fetch();

      const counts = { online: 0, idle: 0, dnd: 0, offline: 0 };
      let botCount = 0;

      guild.members.cache.forEach((member) => {
        if (member.user.bot) botCount++;
        const status = member.presence?.status || "offline";
        counts[status] = (counts[status] || 0) + 1;
      });

      const createdTimestamp = Math.floor(guild.createdTimestamp / 1000);

      const embed = new EmbedBuilder()
        .setColor(0xeb4034)
        .setThumbnail(
          `https://cdn.discordapp.com/avatars/346423622287753226/ede06c729f6e2830f63503b3a4465afa.webp`
        )
        .setImage(
          `https://cdn.discordapp.com/avatars/346423622287753226/ede06c729f6e2830f63503b3a4465afa.webp`
        )
        .setAuthor({
          name: "secretwastaken",
          iconURL: `https://cdn.discordapp.com/avatars/346423622287753226/ede06c729f6e2830f63503b3a4465afa.webp`,
          url: "https://secretwastaken.vercel.app",
        })
        .addFields(
          {
            name: "🎥 Streamer",
            value: "secretwastaken (`346423622287753226`)",
          },
          { name: "🔍 ID do Servidor", value: `${guild.id}` },
          { name: "📅 Servidor criado em", value: `<t:${createdTimestamp}:D>` },
          {
            name: "<:server_boost_level_2_alt:1434287162551046224> Boosts:",
            value: `**Nível**: ${guild.premiumTier} (${guild.premiumSubscriptionCount}) Boosts`,
          },
          { name: `**👥 Total de Membros (${guild.memberCount})**`, value: "" },
          { name: `**🟢 Online**: ${counts.online}`, value: "" },
          { name: `**⛔ Ocupado**: ${counts.dnd}`, value: "" },
          { name: `**🌙 Idle**: ${counts.idle}`, value: "" },
          { name: `**💀 Offline**: ${counts.offline}`, value: "" },
          { name: `**🤖 Bots**: ${botCount}`, value: "" }
        )
        .setFooter({ text: "Created with ❤️ by secretwastaken" });

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Erro no comando serverinfo:", error);
      await logError("serverinfo (slash)", error);
      await interaction.reply({
        content: "❌ Ocorreu um erro ao executar o comando.",
        ephemeral: true,
      });
    }
  },

  prefix: {
    name: "serverinfo",
    description: "Fornece informações sobre o servidor.",
    async execute(bot, message) {
      try {
        const guild = bot.guilds.cache.get("1231627321811800085");
        await guild.members.fetch();

        const counts = { online: 0, idle: 0, dnd: 0, offline: 0 };
        let botCount = 0;

        guild.members.cache.forEach((member) => {
          if (member.user.bot) botCount++;
          const status = member.presence?.status || "offline";
          counts[status] = (counts[status] || 0) + 1;
        });

        const createdTimestamp = Math.floor(guild.createdTimestamp / 1000);

        const embed = new EmbedBuilder()
          .setColor(0xeb4034)
          .setThumbnail(
            `https://cdn.discordapp.com/avatars/346423622287753226/ede06c729f6e2830f63503b3a4465afa.webp`
          )
          .setImage(
            `https://cdn.discordapp.com/avatars/346423622287753226/ede06c729f6e2830f63503b3a4465afa.webp`
          )
          .setAuthor({
            name: "secretwastaken",
            iconURL: `https://cdn.discordapp.com/avatars/346423622287753226/ede06c729f6e2830f63503b3a4465afa.webp`,
            url: "https://secretwastaken.vercel.app",
          })
          .addFields(
            {
              name: "🎥 Streamer",
              value: "secretwastaken (`346423622287753226`)",
            },
            { name: "🔍 ID do Servidor", value: `${guild.id}` },
            {
              name: "📅 Servidor criado em",
              value: `<t:${createdTimestamp}:D>`,
            },
            {
              name: "<:server_boost_level_2_alt:1434287162551046224> Boosts:",
              value: `**Nível**: ${guild.premiumTier} (${guild.premiumSubscriptionCount}) Boosts`,
            },
            {
              name: `**👥 Total de Membros (${guild.memberCount})**`,
              value: "",
            },
            { name: `**🟢 Online**: ${counts.online}`, value: "" },
            { name: `**⛔ Ocupado**: ${counts.dnd}`, value: "" },
            { name: `**🌙 Idle**: ${counts.idle}`, value: "" },
            { name: `**💀 Offline**: ${counts.offline}`, value: "" },
            { name: `**🤖 Bots**: ${botCount}`, value: "" }
          )
          .setFooter({ text: "Created with ❤️ by secretwastaken" });

        await message.reply({ embeds: [embed] });
      } catch (error) {
        console.error("Erro no comando serverinfo (prefix):", error);
        await logError("serverinfo (prefix)", error);
        await message.reply({
          content: "❌ Ocorreu um erro ao executar o comando.",
          ephemeral: true,
        });
      }
    },
  },
};
