const { SlashCommandBuilder } = require("discord.js");
const { logError } = require("../../utils/functions");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong! and shows latency"),

  async execute(interaction) {
    try {
      console.log(interaction.user);
      const sent = await interaction.reply({
        content: "🏓 Calculando...",
        fetchReply: true,
      });
      const latency = sent.createdTimestamp - interaction.createdTimestamp;
      await sent.edit(`🏓 Pong! | Latência API: ${latency}ms`);
    } catch (error) {
      console.error("Erro no comando ping (slash):", error);
      await logError("ping (slash)", error);
      await interaction.reply({
        content: "❌ Ocorreu um erro ao executar o comando.",
        ephemeral: true,
      });
    }
  },

  prefix: {
    name: "ping",
    description: "Replies with Pong! and shows latency",
    async execute(message) {
      try {
        const sent = await message.channel.send("🏓 Calculando...");
        const latency = sent.createdTimestamp - message.createdTimestamp;
        await sent.edit(`🏓 Pong! | Latência API: ${latency}ms`);
      } catch (error) {
        console.error("Erro no comando ping (prefix):", error);
        await logError("ping (prefix)", error);
        await message.reply("❌ Ocorreu um erro ao executar o comando.");
      }
    },
  },
};
