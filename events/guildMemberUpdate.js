const fs = require("fs");
const path = require("path");
const { logError } = require("../utils/functions");

module.exports = {
  name: "guildMemberUpdate",
  async execute(oldMember, newMember) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 5000));

      const user = newMember.user;
      if (user.bot) return;

      const userDir = path.join(__dirname, "../data/users");
      const userFile = path.join(userDir, `${user.id}.json`);

      if (!fs.existsSync(userDir)) fs.mkdirSync(userDir, { recursive: true });

      // 🧩 Ensure the file exists (create minimal data if missing)
      let userData = {};
      if (fs.existsSync(userFile)) {
        userData = JSON.parse(fs.readFileSync(userFile));
      }

      // 🆕 Use role IDs instead of names
      const roles = newMember.roles.cache
        .filter((r) => r.name !== "@everyone")
        .map((r) => r.id);

      const oldRoles = userData.roles || [];

      const rolesChanged =
        roles.length !== oldRoles.length ||
        roles.some((role) => !oldRoles.includes(role));

      if (rolesChanged) {
        userData.roleCount = roles.length;
        userData.roles = roles;
        userData.lastInteraction = new Date().toISOString();

        fs.writeFileSync(userFile, JSON.stringify(userData, null, 2));

        console.log(
          `[Roles Updated] ${user.username}: ${
            roles.length ? roles.join(", ") : "sem roles"
          }`
        );
      }
    } catch (error) {
      await logError("guildMemberUpdate", error);
    }
  },
};
