const { SlashCommandBuilder } = require("discord.js");
const logError = require("../../utils/functions");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("chouriço")
    .setDescription("Determina o tamanho do teu chouriço"),

  async execute(interaction) {
    try {
      const user = interaction.user;
      const size = Math.floor(Math.random() * 200 + 1);

      await interaction.reply(
        `O tamanho do chouriço de <@${user.id}> é de ${size}cm!`
      );
    } catch (error) {
      console.error("Erro no comando chouriço (slash):", error);
      await logError("chouriço (slash)", error);
      await interaction.reply({
        content: "❌ Ocorreu um erro ao executar o comando.",
        ephemeral: true,
      });
    }
  },

  prefix: {
    name: "chouriço",
    description: "Determina o tamanho do teu chouriço",

    async execute(message) {
      try {
        const user = message.author;
        const size = Math.floor(Math.random() * 200 + 1);

        await message.reply(
          `O tamanho do chouriço de <@${user.id}> é de ${size}cm!`
        );
      } catch (error) {
        console.error("Erro no comando chouriço (prefix):", error);
        await logError("chouriço (prefix)", error);
        await message.reply({
          content: "❌ Ocorreu um erro ao executar o comando.",
        });
      }
    },
  },
};
