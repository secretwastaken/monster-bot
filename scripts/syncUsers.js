const fs = require("fs");
const path = require("path");
const { Client, GatewayIntentBits } = require("discord.js");
const { logError } = require("../utils/functions");
require("dotenv/config");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers, // necessário para obter todos os membros
  ],
});

const TOKEN = process.env.BOT_TOKEN;
const GUILD_ID = process.env.GUILD_ID;

client.once("ready", async () => {
  console.log(`Ligado como ${client.user.tag}`);

  try {
    const guild = await client.guilds.fetch(GUILD_ID);
    await guild.members.fetch(); // garante que tens todos os membros

    const userDir = path.join(__dirname, "../data/users");
    if (!fs.existsSync(userDir)) fs.mkdirSync(userDir, { recursive: true });

    let created = 0;
    let skipped = 0;

    for (const member of guild.members.cache.values()) {
      const user = member.user;
      // ❌ Ignorar bots
      if (user.bot) {
        skipped++;
        continue;
      }

      const userFile = path.join(userDir, `${user.id}.json`);
      if (fs.existsSync(userFile)) continue;

      const userData = {
        id: user.id,
        username: user.username,
        globalName: user.globalName ?? null,
        discriminator: user.discriminator,
        avatarURL: user.displayAvatarURL({ dynamic: true }),
        joinedAt: member.joinedAt?.toISOString() ?? null,
        createdAt: user.createdAt.toISOString(),
        plataformas: [],
        roleCount: member.roles.cache.filter((r) => r.name !== "@everyone")
          .size,
        roles: member.roles.cache
          .filter((r) => r.name !== "@everyone")
          .map((r) => r.id),
      };

      fs.writeFileSync(userFile, JSON.stringify(userData, null, 2));
      created++;
    }

    console.log(`📜 ${created} user files created.`);
  } catch (error) {
    await logError("syncUsers.js", error);
  } finally {
    await client.destroy();
    process.exit(0);
  }
});

client.login(TOKEN);
