//#region IMPORTS
const { REST, Routes } = require("discord.js");
require("dotenv/config");
const fs = require("node:fs");
const path = require("node:path");
//#endregion

//#region .ENV
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const token = process.env.DISCORD_TOKEN;
//#endregion

//#region REGISTER
/*
 * BLOCO RESPONSÁVEL POR REGISTAR OS COMANDOS
 * EXISTENTES NA API DO DISCORD, ATRAVÉS
 * DE UMA CHAMADA HTTP
 */

const slashCommands = [];
const prefixCommands = [];

const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    // Slash commands
    if ("data" in command && "execute" in command) {
      slashCommands.push(command.data.toJSON());
    }

    // Prefix commands
    if ("prefix" in command) {
      prefixCommands.push(command.prefix.name);
    }
  }
}

if (prefixCommands.length > 0) {
  console.log(`📘 Found ${prefixCommands.length} prefix (!) commands`);
}

// Register slash commands
const rest = new REST().setToken(token);

(async () => {
  try {
    console.log(
      `🚀 Started refreshing ${slashCommands.length} application (/) command(s).`
    );

    const data = await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: slashCommands }
    );

    console.log(
      `✅ Successfully reloaded ${data.length} application (/) command(s).`
    );
  } catch (error) {
    console.error("❌ Error registering commands:", error);
  }
})();
//#endregion
