//#region IMPORTS
const fs = require("node:fs");
const path = require("node:path");
const {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  MessageFlags,
} = require("discord.js");
require("dotenv/config");
const commandsChannel = require("./utils/constants");

//#endregion

//#region BOT INIT
const token = process.env.DISCORD_TOKEN;

const bot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildPresences,
  ],
});

bot.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

//#endregion

//#region LOAD

/*
 *  BLOCO RESPONSÁVEL POR CARREGAR OS COMANDOS
 *  QUE VÊM DIRETAMENTE DO BOT (PROVIDED BY DISCORD API)
 *  E CARREGÁ-LOS LOCALMENTE.
 */
bot.commands = new Collection();
bot.prefixCommands = new Collection();
const foldersPath = path.join(__dirname, "commands"); // C:\Dev\MonsterBot\commands
const commandFolders = fs.readdirSync(foldersPath); // Lê o conteudo da pasta commands

for (const folder of commandFolders) {
  // Correr todas as subpastas da pasta commands
  const commandsPath = path.join(foldersPath, folder); // C:\Dev\MonsterBot\commands\utility
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js")); // ["ping.js", "help.js", "user.js"]

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ("data" in command && "execute" in command) {
      bot.commands.set(command.data.name, command);
    }
    if ("prefix" in command) {
      bot.prefixCommands.set(command.prefix.name, command.prefix);
    }
  }
}
//#endregion

bot.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.channelId != commandsChannel) {
    return interaction.reply({
      content: `Para executar comandos, deves fazê-lo na sala <#${commandsChannel}>!`,
      ephemeral: true,
    });
  }

  const command = bot.commands.get(interaction.commandName);
  if (!command) return;

  // já não precisa de try/catch aqui
  await command.execute(interaction);
});

bot.on(Events.MessageCreate, async (message) => {
  if (message.author.bot || !message.content.startsWith("!")) return;
  const args = message.content.slice(1).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = bot.prefixCommands.get(commandName);
  if (!command) return;

  await command.execute(message, args);
});

// Path to your events folder
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const event = require(`./events/${file}`); // <-- CommonJS import
  if (!event || !event.name || typeof event.execute !== "function") {
    console.warn(`⚠️ Skipping invalid event file: ${file}`);
    continue;
  }

  if (event.once) {
    bot.once(event.name, (...args) => event.execute(...args, bot));
  } else {
    bot.on(event.name, (...args) => event.execute(...args, bot));
  }

  console.log(`✅ Loaded event: ${event.name}`);
}

bot.login(token);
