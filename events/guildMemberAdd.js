const fs = require("fs");
const path = require("path");
const { logError } = require("../utils/functions");

module.exports = {
  name: "guildMemberAdd",
  async execute(member) {
    try {
      const user = member.user;
      if (user.bot) return;

      const userDir = path.join(__dirname, "../data/users");
      const userFile = path.join(userDir, `${user.id}.json`);

      if (!fs.existsSync(userDir)) fs.mkdirSync(userDir, { recursive: true });

      // Create base file if it doesn't exist
      if (!fs.existsSync(userFile)) {
        const userData = {
          id: user.id,
          username: user.username,
          globalName: user.globalName ?? null,
          discriminator: user.discriminator,
          avatarURL: user.displayAvatarURL({ dynamic: true }),
          joinedAt: member.joinedAt?.toISOString() ?? null,
          createdAt: user.createdAt.toISOString(),
          plataformas: [],
          roleCount: 0,
          roles: [],
        };

        fs.writeFileSync(userFile, JSON.stringify(userData, null, 2));
        console.log(
          `[Novo Utilizador] ${user.username} (${user.id}) registado.`
        );
      }
    } catch (error) {
      await logError("guildMemberAdd", error);
    }
  },
};
