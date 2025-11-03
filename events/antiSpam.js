const { Events, PermissionFlagsBits } = require("discord.js");
const logError = require("../utils/functions");

const messageTimestamps = new Map(); // Track user message times
const linkTimestamps = new Map(); // Track user link times

//#region RULES

const MESSAGE_LIMIT = 5; // Max 5 messages
const MESSAGE_INTERVAL = 10 * 1000; // In 10 seconds

const LINK_LIMIT = 2; // Max 2 link messages
const LINK_INTERVAL = 30 * 1000; // In 30 seconds

const MENTION_LIMIT = 3; // Max 3 mentions per message

//#endregion

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    try {
      if (message.author.bot || !message.guild) return;
      if (message.member.permissions.has(PermissionFlagsBits.ManageMessages))
        return;

      const userId = message.author.id;
      const now = Date.now();

      let timestamps = messageTimestamps.get(userId) || [];

      timestamps = timestamps.filter((t) => now - t < MESSAGE_INTERVAL);
      timestamps.push(now);
      messageTimestamps.set(userId, timestamps);

      if (timestamps.length > MESSAGE_LIMIT) {
        console.log("limit exceeded");
        await message.member.timeout(5_000);
        await message.delete().catch(() => {});
        await message.channel
          .send(
            `⚠️ ${message.author}, estás a enviar mensagens demasiado rápido.`
          )
          .then((msg) => setTimeout(() => msg.delete().catch(() => {}), 5000));
        return;
      }

      // Aqui poderás adicionar o LINK e MENTION PROTECTION futuramente
    } catch (error) {
      console.error("Erro no handler MessageCreate:", error);
      await logError("MessageCreate", error);
    }
  },
};
