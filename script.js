const state = {
  player: {
    name: "Lilikins",
    level: 1,
    hp: 100,
    maxHp: 100,
    attack: 10,
    defense: 2,
    critChance: 0.08,
    cr: 25,
    inventory: ["Emergency Snack Pack"],
    party: ["Lilikins"],
    blessings: [],
    milestoneFlags: {
      metDanica: false,
      bossUnlocked: false,
      wonGame: false,
      heartfeltUnlocked: false
    }
  },
  battle: null,
  message: "",
  lastFaintThreshold: null,
  recruitOrder: [
    { name: "Johnny B", attack: 3, maxHp: 8, defense: 1 },
    { name: "Jake tha Snake", attack: 2, maxHp: 6, defense: 0 },
    { name: "Lukey Pookey", attack: 2, maxHp: 6, defense: 0 },
    { name: "Brooklyn", attack: 2, maxHp: 7, defense: 1 },
    { name: "Bella", attack: 2, maxHp: 7, defense: 1 }
  ]
};

const enemies = [
  { name: "Purple Menace Grunt", hp: 24, attack: 7, defense: 1, reward: 10 },
  { name: "Web Gremlin", hp: 28, attack: 8, defense: 1, reward: 12 },
  { name: "Cursed Grape Hound", hp: 35, attack: 9, defense: 2, reward: 16 },
  { name: "Suspiciously Large Purple Crab", hp: 42, attack: 11, defense: 3, reward: 20 }
];

const boss = {
  name: "The Purple Menace, Queen of Half Nuts",
  hp: 130,
  attack: 16,
  defense: 4,
  reward: 100,
  boss: true
};

const shopItems = [
  { name: "Strawberry Taffy", cost: 8, type: "heal", value: 18, desc: "Heals 18 HP." },
  { name: "Blue Raspberry Taffy", cost: 18, type: "attack", value: 2, desc: "+2 permanent ATK." },
  { name: "Watermelon Taffy", cost: 16, type: "maxHp", value: 8, desc: "+8 permanent max HP." },
  { name: "Mystery Taffy", cost: 14, type: "mystery", value: 0, desc: "Could be great. Could be weird." },
  { name: "Sparkly Kitten Rifle", cost: 35, type: "attack", value: 4, desc: "+4 permanent ATK." },
  { name: "Staff of Babies' Tears", cost: 30, type: "defense", value: 2, desc: "+2 permanent DEF." },
  { name: "Emergency Snack Pack", cost: 10, type: "inventory", value: 0, desc: "One-use battle heal item." }
];

function byId(id) {
  return document.getElementById(id);
}

function render() {
  const p = state.player;
  byId("stats").innerHTML = `
    <strong>${p.name}</strong> | LVL ${p.level}<br>
    HP: <strong>${p.hp}</strong> / ${p.maxHp} |
    ATK: <strong>${p.attack}</strong> |
    DEF: <strong>${p.defense}</strong> |
    CR: <strong>${p.cr}</strong><br>
    Party Size: <strong>${p.party.length}</strong>
    ${girlPowerActive() ? '<span class="good">| Girl Power Protocol active</span>' : ''}
  `;

  byId("portraitBar").innerHTML = buildPortraits();
  byId("text").innerHTML = state.message;
}

function buildPortraits() {
  const total = state.player.party.length;
  const fainted = faintedCount();
  return state.player.party.map((member, index) => {
    const isFainted = index >= total - fainted;
    return `<div class="portrait ${isFainted ? 'fainted' : ''}">${member}${isFainted ? ' (passed out)' : ''}</div>`;
  }).join("");
}

function setMessage(msg) {
  state.message = msg;
  render();
}

function setButtons(buttons) {
  const container = byId("buttons");
  container.innerHTML = "";
  buttons.forEach((b) => {
    const btn = document.createElement("button");
    btn.textContent = b.text;
    btn.addEventListener("click", b.action);
    container.appendChild(btn);
  });
}

function clampHp() {
  const p = state.player;
  p.hp = Math.max(0, Math.min(p.hp, p.maxHp));
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function girlPowerActive() {
  const party = state.player.party;
  return party.includes("Lilikins") && party.includes("Bella") && party.includes("Brooklyn");
}

function faintedCount() {
  const ratio = state.player.hp / state.player.maxHp;
  if (ratio <= 0) return state.player.party.length;
  if (ratio <= 0.25) return Math.min(3, Math.max(1, state.player.party.length - 1));
  if (ratio <= 0.5) return Math.min(2, state.player.party.length - 1);
  if (ratio <= 0.75) return Math.min(1, state.player.party.length - 1);
  return 0;
}

function maybeShowFaintTransition() {
  const ratio = state.player.hp / state.player.maxHp;
  let threshold = null;
  if (ratio <= 0.25) threshold = 25;
  else if (ratio <= 0.5) threshold = 50;
  else if (ratio <= 0.75) threshold = 75;

  if (threshold !== null && threshold !== state.lastFaintThreshold && state.player.party.length > 1) {
    state.lastFaintThreshold = threshold;
    const candidates = state.player.party.filter(name => name !== "Lilikins");
    const who = candidates[Math.min(candidates.length - 1, Math.max(0, faintedCount() - 1))] || "somebody";
    return `\n\n<span class="warn">Animated transition idea:</span> ${who} pops into frame with a ridiculously goofy face and dramatically announces they have passed out.`;
  }

  if (threshold === null) state.lastFaintThreshold = null;
  return "";
}

function mainMenu() {
  setMessage(
    `Elena narrates: Lilikins has been chosen for the quest because she is the only one left.\n\n` +
    `Malachi, the prince-ish figure, has been snatched away by the Purple Menace. Danica runs the shop. Pastor Paul handles healing at New Vintage Church. ` +
    `For reasons nobody can fully explain, the world economy runs on Candied Raisins (CR).`
  );
  setButtons([
    { text: "Go to Danica's Shop", action: shopMenu },
    { text: "Go to New Vintage Church", action: churchMenu },
    { text: "Explore", action: explore },
    { text: "View Party", action: partyMenu },
    { text: "View Inventory", action: inventoryMenu },
    { text: "Save Game", action: saveGame },
    { text: "Load Game", action: loadGame }
  ]);
}

function shopMenu() {
  state.player.milestoneFlags.metDanica = true;
  let msg = `Danica leans over the counter. "We accept CR. Don't ask why. Also don't ask where I got the Sparkly Kitten Rifle."\n\n`;
  msg += shopItems.map(item => `${item.name} - ${item.cost} CR\n${item.desc}`).join("\n\n");
  setMessage(msg);
  setButtons([
    ...shopItems.map(item => ({ text: `Buy ${item.name} (${item.cost} CR)`, action: () => buyItem(item) })),
    { text: "Leave Shop", action: mainMenu }
  ]);
}

function buyItem(item) {
  const p = state.player;
  if (p.cr < item.cost) {
    setMessage(`Danica squints at you. "You do not have enough CR for ${item.name}."`);
    return setButtons([{ text: "Back to Shop", action: shopMenu }]);
  }

  p.cr -= item.cost;
  let text = `You bought ${item.name}. `;

  switch (item.type) {
    case "heal":
      p.hp += item.value;
      clampHp();
      text += `You recover ${item.value} HP.`;
      break;
    case "attack":
      p.attack += item.value;
      text += `Permanent ATK increased by ${item.value}.`;
      break;
    case "defense":
      p.defense += item.value;
      text += `Permanent DEF increased by ${item.value}.`;
      break;
    case "maxHp":
      p.maxHp += item.value;
      p.hp += item.value;
      clampHp();
      text += `Permanent max HP increased by ${item.value}.`;
      break;
    case "inventory":
      p.inventory.push(item.name);
      text += `${item.name} was added to your inventory.`;
      break;
    case "mystery": {
      const outcomes = [
        () => { p.attack += 1; text += `It tasted electric. +1 ATK.`; },
        () => { p.maxHp += 6; p.hp += 6; clampHp(); text += `Shockingly nourishing. +6 max HP.`; },
        () => { p.cr += 8; text += `You found bonus CR stuck to the wrapper. +8 CR.`; },
        () => { p.hp -= 8; clampHp(); text += `That one was cursed. -8 HP.`; }
      ];
      outcomes[randomInt(0, outcomes.length - 1)]();
      break;
    }
    default:
      text += `Nothing happened, which would be weird.`;
  }

  setMessage(text);
  render();
  setButtons([{ text: "Back to Shop", action: shopMenu }]);
}

function churchMenu() {
  setMessage(
    `Pastor Paul stands ready at New Vintage Church.\n\n` +
    `Deliverance is for healing only. Blessings are separate, unpredictable, and maybe a little dangerous.`
  );
  setButtons([
    { text: "Receive Deliverance (Full Heal)", action: receiveDeliverance },
    { text: "Modest Blessing (15 CR)", action: () => doBlessing("Modest Blessing", 15, 0.75) },
    { text: "Faith Blessing (35 CR)", action: () => doBlessing("Faith Blessing", 35, 0.65) },
    { text: "Unhinged Revival Blessing (60 CR)", action: () => doBlessing("Unhinged Revival Blessing", 60, 0.55) },
    { text: "Leave Church", action: mainMenu }
  ]);
}

function receiveDeliverance() {
  state.player.hp = state.player.maxHp;
  setMessage(`Pastor Paul performs a deliverance. You are fully healed.`);
  render();
  setButtons([{ text: "Amen", action: churchMenu }]);
}

function doBlessing(name, cost, successRate) {
  const p = state.player;
  if (p.cr < cost) {
    setMessage(`Not enough CR for ${name}.`);
    return setButtons([{ text: "Back", action: churchMenu }]);
  }

  p.cr -= cost;
  const success = Math.random() < successRate;
  let text = `${name}: `;

  if (success) {
    const rewards = [
      () => { p.maxHp += 5; p.hp += 5; clampHp(); text += `You feel sturdier. +5 max HP.`; },
      () => { p.attack += 2; text += `You hit harder now. +2 ATK.`; },
      () => { p.hp = p.maxHp; text += `A full heal comes with it.`; },
      () => { p.cr += 12; text += `Unexpected favor. +12 CR.`; },
      () => { p.critChance += 0.04; text += `Your odds of dramatic success increase.`; }
    ];
    rewards[randomInt(0, rewards.length - 1)]();
  } else {
    const penalties = [
      () => { p.hp -= 10; clampHp(); text += `That felt bad. -10 HP.`; },
      () => { p.attack = Math.max(1, p.attack - 1); text += `You feel strangely less dangerous. -1 ATK.`; },
      () => { const lost = Math.min(10, p.cr); p.cr -= lost; text += `A weird financial backlash occurs. -${lost} CR.`; },
      () => { p.defense = Math.max(0, p.defense - 1); text += `Your confidence leaves the building. -1 DEF.`; }
    ];
    penalties[randomInt(0, penalties.length - 1)]();
  }

  render();
  setMessage(text + maybeShowFaintTransition());
  setButtons([{ text: "Back to Church", action: churchMenu }]);
}

function explore() {
  const options = ["battle", "recruit", "loot", "nothing"];
  if (state.player.party.length >= 6) {
    state.player.milestoneFlags.bossUnlocked = true;
    options.push("bossHint");
  }

  const roll = options[randomInt(0, options.length - 1)];
  if (roll === "battle") return startBattle(enemies[randomInt(0, enemies.length - 1)]);
  if (roll === "recruit") return recruitFamilyMember();
  if (roll === "loot") return findLoot();
  if (roll === "bossHint") {
    setMessage(
      `You find purple webbing stretched across the path. Elena whispers that the decrepit remains of a once glorious Half Nuts can't be far now.`
    );
    return setButtons([
      { text: "Keep Exploring", action: explore },
      { text: "Return to Town", action: mainMenu },
      { text: "Enter the Ruins of Half Nuts", action: finalDungeon }
    ]);
  }

  setMessage(`You explore for a while. Nothing happens except a deep and unsettling sense that candied raisins are somehow warm.`);
  setButtons([
    { text: "Explore Again", action: explore },
    { text: "Return to Town", action: mainMenu }
  ]);
}

function recruitFamilyMember() {
  const p = state.player;
  const remaining = state.recruitOrder.filter(member => !p.party.includes(member.name));
  if (remaining.length === 0) {
    setMessage(`You gather the whole crew, but nobody new joins. There is nobody left except destiny.`);
    return setButtons([
      { text: "Explore Again", action: explore },
      { text: "Return to Town", action: mainMenu },
      { text: "Enter the Ruins of Half Nuts", action: finalDungeon }
    ]);
  }

  const recruit = remaining[0];
  p.party.push(recruit.name);
  p.attack += recruit.attack;
  p.maxHp += recruit.maxHp;
  p.defense += recruit.defense;
  p.hp += recruit.maxHp;
  clampHp();

  let text = `${recruit.name} joins the party! +${recruit.attack} ATK, +${recruit.maxHp} max HP, +${recruit.defense} DEF.`;

  if (girlPowerActive()) {
    text += `\n\n<span class="good">Girl Power Protocol is now active.</span> Lilikins, Bella, and Brooklyn become a squad-level gameplay problem for the enemy.`;
  }

  setMessage(text);
  setButtons([
    { text: "Explore Again", action: explore },
    { text: "Return to Town", action: mainMenu }
  ]);
}

function findLoot() {
  const p = state.player;
  const crFound = randomInt(8, 18);
  p.cr += crFound;
  const extras = [
    `You found ${crFound} CR in a suspiciously sticky pouch.`,
    `You recovered ${crFound} CR from a fallen Purple Menace scout.`,
    `A loose trail of candied raisins leads directly into your pocket. +${crFound} CR.`
  ];
  setMessage(extras[randomInt(0, extras.length - 1)]);
  setButtons([
    { text: "Explore Again", action: explore },
    { text: "Return to Town", action: mainMenu }
  ]);
}

function startBattle(template) {
  state.battle = JSON.parse(JSON.stringify(template));
  setMessage(`A ${state.battle.name} appears!\n\nEnemy HP: ${state.battle.hp}`);
  battleMenu();
}

function battleMenu() {
  setButtons([
    { text: "Attack", action: playerAttack },
    { text: "Use Item", action: useItemMenu },
    { text: "Run", action: runFromBattle }
  ]);
}

function playerAttack() {
  const p = state.player;
  const e = state.battle;
  if (!e) return mainMenu();

  let damage = Math.max(1, p.attack - e.defense + randomInt(0, 3));
  let text = `Lilikins attacks ${e.name} for ${damage} damage.`;

  if (Math.random() < p.critChance) {
    damage += 4;
    text = `Critical hit! ${text}`;
  }

  if (girlPowerActive() && Math.random() < 0.22) {
    const bonus = randomInt(4, 8);
    const heal = randomInt(3, 6);
    damage += bonus;
    p.hp += heal;
    clampHp();
    text += `\n\n<span class="good">Girl Power Protocol activates.</span> Lilikins, Bella, and Brooklyn overwhelm the situation for +${bonus} bonus damage and ${heal} healing.`;
  }

  e.hp -= damage;
  if (e.hp <= 0) {
    return winBattle(text);
  }

  enemyTurn(text);
}

function enemyTurn(prefixText) {
  const p = state.player;
  const e = state.battle;
  const damage = Math.max(1, e.attack - p.defense + randomInt(0, 2));
  p.hp -= damage;
  clampHp();

  const transition = maybeShowFaintTransition();
  let text = `${prefixText}\n\n${e.name} hits back for ${damage} damage.\nEnemy HP: ${e.hp}`;
  text += transition;

  if (p.hp <= 0) {
    return loseBattle(text);
  }

  setMessage(text);
  battleMenu();
}

function winBattle(prefixText) {
  const p = state.player;
  const e = state.battle;
  p.cr += e.reward;
  if (e.boss) {
    p.milestoneFlags.wonGame = true;
    p.milestoneFlags.heartfeltUnlocked = true;
    return endingScreen(prefixText + `\n\nYou defeated ${e.name} and gained ${e.reward} CR.`);
  }

  setMessage(`${prefixText}\n\nYou defeated ${e.name} and gained ${e.reward} CR.`);
  state.battle = null;
  setButtons([
    { text: "Explore Again", action: explore },
    { text: "Return to Town", action: mainMenu }
  ]);
}

function loseBattle(prefixText) {
  state.battle = null;
  setMessage(`${prefixText}\n\nThe party collapses in dramatic fashion. You wake up in town somehow alive, which feels convenient.`);
  state.player.hp = Math.max(1, Math.floor(state.player.maxHp * 0.5));
  setButtons([{ text: "Return to Town", action: mainMenu }]);
}

function useItemMenu() {
  const items = state.player.inventory;
  if (items.length === 0) {
    setMessage(`Your inventory is empty. This is not ideal during combat.`);
    return battleMenu();
  }

  setMessage(`Choose an item to use.`);
  setButtons([
    ...items.map((item, index) => ({
      text: `Use ${item}`,
      action: () => useInventoryItem(index)
    })),
    { text: "Back", action: battleMenu }
  ]);
}

function useInventoryItem(index) {
  const item = state.player.inventory[index];
  if (item === "Emergency Snack Pack") {
    state.player.hp += 25;
    clampHp();
    state.player.inventory.splice(index, 1);
    setMessage(`You use an Emergency Snack Pack and recover 25 HP.`);
    return enemyTurn(`The item works exactly as advertised, which is rare.`);
  }

  setMessage(`You use ${item}, but nothing is implemented for it yet.`);
  battleMenu();
}

function runFromBattle() {
  if (Math.random() < 0.7) {
    state.battle = null;
    setMessage(`You successfully run away. Dignity not guaranteed.`);
    setButtons([{ text: "Return to Town", action: mainMenu }]);
  } else {
    enemyTurn(`You try to run, but the enemy takes that personally.`);
  }
}

function partyMenu() {
  const p = state.player;
  let text = `Current party:\n- ${p.party.join("\n- ")}`;
  text += `\n\nTotal combined stats are pooled to keep combat simple.`;
  if (girlPowerActive()) {
    text += `\n\n<span class="good">Girl Power Protocol:</span> active.`;
  }
  if (p.party.length >= 6) {
    text += `\n\nThe path to the Ruins of Half Nuts is now open.`;
  }
  setMessage(text);
  setButtons([
    { text: "Return to Town", action: mainMenu },
    ...(p.party.length >= 6 ? [{ text: "Enter the Ruins of Half Nuts", action: finalDungeon }] : [])
  ]);
}

function inventoryMenu() {
  const items = state.player.inventory.length ? state.player.inventory.join("\n- ") : "(empty)";
  setMessage(`Inventory:\n- ${items}`);
  setButtons([{ text: "Return to Town", action: mainMenu }]);
}

function finalDungeon() {
  setMessage(
    `You enter the decrepit remains of a once glorious Half Nuts. The counters are broken. The signs hang crooked. Purple webbing covers the walls.\n\n` +
    `Malachi is cocooned somewhere deeper inside. This is allegedly a rescue mission, but Elena reminds everyone that the real point is the adventure.`
  );
  setButtons([
    { text: "Face the Purple Menace", action: () => startBattle(boss) },
    { text: "Retreat to Town", action: mainMenu }
  ]);
}

function endingScreen(prefixText) {
  setMessage(
    `${prefixText}\n\n` +
    `Malachi is rescued. The prince-ish objective is complete.\n\n` +
    `Then the real ending lands: Lilikins and Johnny B hit a triumphant pose in the wreckage while the last of the purple webs drift down around them.`
  );
  setButtons([
    { text: "See Secret Heartfelt Ending", action: heartfeltEnding },
    { text: "Return to Title", action: mainMenu }
  ]);
}

function heartfeltEnding() {
  setMessage(
    `Elena narrates one last time:\n\n` +
    `For all the jokes, the weird items, the candied-raisin economy, and the giant spider nonsense... you were always worth showing up for.\n\n` +
    `Happy 21st, Lilikins.`
  );
  setButtons([{ text: "Back to Title", action: mainMenu }]);
}

function saveGame() {
  localStorage.setItem("lilikins-rpg-save", JSON.stringify(state.player));
  setMessage(`Game saved.`);
  setButtons([{ text: "Back", action: mainMenu }]);
}

function loadGame() {
  const raw = localStorage.getItem("lilikins-rpg-save");
  if (!raw) {
    setMessage(`No save file found in this browser yet.`);
    return setButtons([{ text: "Back", action: mainMenu }]);
  }

  const loaded = JSON.parse(raw);
  state.player = loaded;
  clampHp();
  setMessage(`Game loaded.`);
  setButtons([{ text: "Continue", action: mainMenu }]);
  render();
}

function init() {
  render();
  mainMenu();
}

init();
