const MODULE_ID = "dice-obs-overlay";

const DEFAULTS = {
  displayDurationMs: 5000,
  maxPopups: 2,
  positionX: 30,
  positionY: 30,
  width: 360,
  ignoreGM: false,
  ignoreWhispers: true,
  userMode: "all",
  userList: ""
};

function registerSettings() {
  game.settings.register(MODULE_ID, "displayDurationMs", {
    name: "Durée d'affichage (ms)",
    hint: "Temps pendant lequel un jet reste visible sur l'overlay.",
    scope: "world",
    config: true,
    type: Number,
    default: DEFAULTS.displayDurationMs
  });

  game.settings.register(MODULE_ID, "maxPopups", {
    name: "Nombre max de pop-ups",
    hint: "Nombre maximal de jets visibles simultanément.",
    scope: "world",
    config: true,
    type: Number,
    default: DEFAULTS.maxPopups
  });

  game.settings.register(MODULE_ID, "positionX", {
    name: "Position X",
    hint: "Décalage horizontal en pixels pour l'overlay.",
    scope: "world",
    config: true,
    type: Number,
    default: DEFAULTS.positionX
  });

  game.settings.register(MODULE_ID, "positionY", {
    name: "Position Y",
    hint: "Décalage vertical en pixels pour l'overlay.",
    scope: "world",
    config: true,
    type: Number,
    default: DEFAULTS.positionY
  });

  game.settings.register(MODULE_ID, "width", {
    name: "Largeur (px)",
    hint: "Largeur des pop-ups de jets.",
    scope: "world",
    config: true,
    type: Number,
    default: DEFAULTS.width
  });

  game.settings.register(MODULE_ID, "ignoreGM", {
    name: "Ignorer les jets du MJ",
    hint: "N'affiche pas les jets effectués par un MJ.",
    scope: "world",
    config: true,
    type: Boolean,
    default: DEFAULTS.ignoreGM
  });

  game.settings.register(MODULE_ID, "ignoreWhispers", {
    name: "Ignorer les chuchotements",
    hint: "N'affiche pas les jets privés/whispers.",
    scope: "world",
    config: true,
    type: Boolean,
    default: DEFAULTS.ignoreWhispers
  });

  game.settings.register(MODULE_ID, "userMode", {
    name: "Filtrage utilisateurs",
    hint: "Choisir une whitelist ou blacklist pour filtrer les jets.",
    scope: "world",
    config: true,
    type: String,
    choices: {
      all: "Tous",
      whitelist: "Whitelist",
      blacklist: "Blacklist"
    },
    default: DEFAULTS.userMode
  });

  game.settings.register(MODULE_ID, "userList", {
    name: "Liste utilisateurs",
    hint: "Liste de noms d'utilisateurs séparés par des virgules.",
    scope: "world",
    config: true,
    type: String,
    default: DEFAULTS.userList
  });
}

function getSettings() {
  return {
    displayDurationMs: game.settings.get(MODULE_ID, "displayDurationMs"),
    maxPopups: game.settings.get(MODULE_ID, "maxPopups"),
    positionX: game.settings.get(MODULE_ID, "positionX"),
    positionY: game.settings.get(MODULE_ID, "positionY"),
    width: game.settings.get(MODULE_ID, "width"),
    ignoreGM: game.settings.get(MODULE_ID, "ignoreGM"),
    ignoreWhispers: game.settings.get(MODULE_ID, "ignoreWhispers"),
    userMode: game.settings.get(MODULE_ID, "userMode"),
    userList: game.settings.get(MODULE_ID, "userList")
  };
}

function normalizeUserList(value) {
  if (!value) return [];
  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
}

function shouldDisplayMessage(message) {
  if (!message?.rolls?.length) return false;

  const settings = getSettings();
  const author = message.user ?? game.users?.get(message.userId);

  if (settings.ignoreGM && author?.isGM) return false;

  if (settings.ignoreWhispers) {
    const hasWhisperTargets = Array.isArray(message.whisper) && message.whisper.length > 0;
    if (message.isPrivate || hasWhisperTargets) return false;
  }

  const mode = settings.userMode;
  const list = normalizeUserList(settings.userList);
  if (mode === "all" || list.length === 0) return true;

  const authorName = author?.name ?? "";
  if (mode === "whitelist") return list.includes(authorName);
  if (mode === "blacklist") return !list.includes(authorName);

  return true;
}

function buildPayload(message) {
  const roll = message.rolls[0];
  const author = message.user ?? game.users?.get(message.userId);

  return {
    timestamp: Date.now(),
    user: author?.name ?? "Unknown",
    speaker: message.speaker?.alias ?? "",
    flavor: message.flavor ?? "",
    formula: roll?.formula ?? "",
    total: roll?.total ?? null,
    roll: roll?.toJSON ? roll.toJSON() : null,
    settings: {
      displayDurationMs: game.settings.get(MODULE_ID, "displayDurationMs"),
      maxPopups: game.settings.get(MODULE_ID, "maxPopups"),
      positionX: game.settings.get(MODULE_ID, "positionX"),
      positionY: game.settings.get(MODULE_ID, "positionY"),
      width: game.settings.get(MODULE_ID, "width")
    }
  };
}

Hooks.once("init", () => {
  registerSettings();
});

Hooks.on("createChatMessage", (message) => {
  if (!shouldDisplayMessage(message)) return;

  const payload = buildPayload(message);
  game.socket.emit(`module.${MODULE_ID}`, payload);
});
