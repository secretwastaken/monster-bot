const fs = require("fs");
const path = require("path");
const { logError } = require("../utils/functions");

module.exports = {
  name: "guildMemberRemove",
  async execute(member) {
    try {
      const user = member.user;
      if (user.bot) return;

      const userDir = path.join(__dirname, "../data/users");
      const userFile = path.join(userDir, `${user.id}.json`);

      if (fs.existsSync(userFile)) {
        fs.unlinkSync(userFile);
        console.log(
          `[User Left] ${user.username} (${user.id}) — ficheiro removido.`
        );
      } else {
        console.log(
          `[User Left] ${user.username} (${user.id}) — ficheiro não encontrado.`
        );
      }
    } catch (error) {
      await logError("guildMemberRemove", error);
    }
  },
};
