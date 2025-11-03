const commandsChannel = "1434226551490089051";

const PLATFORMS = {
  Steam: {
    emoji: "<Steam:1435001083582742617>",
    regex: /^https?:\/\/(www\.)?steamcommunity\.com\/id\/[A-Za-z0-9_-]+\/?$/i,
  },
  PlayStation: {
    emoji: "<Playstation:1435003517978018015>",
    regex: /^https?:\/\/(my\.|www\.)?playstation\.com\/[A-Za-z0-9_-]+\/?$/i,
  },
  Xbox: {
    emoji: "<XBox:1435003474223042640>",
    regex: /^https?:\/\/(account\.|www\.)?xbox\.com\/[A-Za-z0-9_-]+\/?$/i,
  },
  "Epic Games": {
    emoji: "<EpicGames:1435003428668707008>",
    regex: /^https?:\/\/(www\.)?epicgames\.com\/id\/[A-Za-z0-9_-]+\/?$/i,
  },
  Nintendo: {
    emoji: "<Nintendo:1435003376445161645>",
    regex: /^https?:\/\/(my\.|accounts\.)?nintendo\.com\/[A-Za-z0-9_-]+\/?$/i,
  },
  "Battle.net": {
    emoji: "<BattleNet:1435003328714117233>",
    regex: /^https?:\/\/(www\.)?battle\.net\/[A-Za-z0-9_-]+\/?$/i,
  },
  Twitch: {
    emoji: "<Twitch:1435001130219208725>",
    regex: /^https?:\/\/(www\.)?twitch\.tv\/[A-Za-z0-9_]+\/?$/i,
  },
  YouTube: {
    emoji: "<YouTube:1435001177052807250>",
    regex:
      /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/[A-Za-z0-9_\-\/?=]+$/i,
  },
  Linktree: {
    emoji: "<Linktree:1435001220166058064>",
    regex: /^https?:\/\/(www\.)?linktr\.ee\/[A-Za-z0-9_.-]+\/?$/i,
  },
  "Beacons.ai": {
    emoji: "<Beacons:1435001263220592801>",
    regex: /^https?:\/\/(www\.)?beacons\.ai\/[A-Za-z0-9_.-]+\/?$/i,
  },
  Instagram: {
    emoji: "<Instagram:1435000941169479800>",
    regex: /^https?:\/\/(www\.)?instagram\.com\/[A-Za-z0-9_.-]+\/?$/i,
  },
  X: {
    emoji: "<Twitter:1435001793913421865>",
    regex: /^https?:\/\/(www\.)?(x\.com|twitter\.com)\/[A-Za-z0-9_]+\/?$/i,
  },
  TikTok: {
    emoji: "<Tiktok:1435001036807999679>",
    regex: /^https?:\/\/(www\.)?tiktok\.com\/@?[A-Za-z0-9_.-]+\/?$/i,
  },
};

(module.exports = commandsChannel), { PLATFORMS };
