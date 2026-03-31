
const player = {
  name: "Lilikins",
  hp: 100,
  maxHp: 100,
  attack: 10,
  gold: 25,
  xp: 0,
  level: 1,
  inventory: [],
  specials: [],
  party: ["Lilikins"],
  deliverances: 0,
  johnnyUnlocked: false,
  flags: {
    ruinsUnlocked: false,
    finalUnlocked: false,
    jakeRecruited: false,
    lukeRecruited: false,
    brooklynRecruited: false,
    bellaRecruited: false,
    girlPowerUnlocked: false,
    bossBeaten: false
  }
};

let enemy = null;
let currentZone = "town";

const imageMap = {
  portrait: "images/portrait_pixel.png",
  reaction: "images/reaction_sticker.png",
  boss: "images/boss_wholenuts.png",
  ending: "images/ending_comic.png",
  wholeNuts: "images/wholenuts_bg.png"
};

const textBank = {
  elenaTown: [
    "OKAY LILI LOCK IN 😆",
    "STRATEGIC PANIC MODE, BABY.",
    "DON'T DIE PLEASE. IT WOULD BE BAD FOR THE BRAND.",
    "YOU GOT THIS PROBABLY.",
    "THIS IS FINE (IT IS NOT FINE).",
    "YOU JUST GOT BACK FROM TOKYO AND NOW YOU GOTTA FIGHT MONSTERS. DISRESPECTFUL.",
    "GRAPHIC ARTIST HANDS. BASS PLAYER SOUL. CHAOS APPOINTMENT SCHEDULED.",
    "QUEEN OF THE BASS, RELUCTANT HERO BY DEFAULT.",
    "I BELIEVE IN YOU WITH MY WHOLE LITTLE GREMLIN HEART.",
    "IF SOMETHING ACTS UGLY, WE HIT IT WITH ARTISTIC INTENTION.",
    "YOU ARE BEAUTIFUL, DEDICATED, AND ONE BAD ENCOUNTER AWAY FROM THROWING SOMEBODY.",
    "MAIN CHARACTER ENERGY DETECTED. SLIGHTLY ANNOYED MAIN CHARACTER ENERGY, BUT STILL."
  ],
  battleIntro: [
    "This feels illegal. A {enemy} appears!",
    "You hear boss music. A {enemy} rolls up!",
    "Violence time. A {enemy} enters the area!",
    "This was a mistake. A {enemy} arrives!",
    "You regret everything. A {enemy} appears!",
    "WHY DOES THIS EXIST? It's a {enemy}.",
    "That thing has bad manners and a worse face. A {enemy} appears!",
    "Something ugly with opinions just showed up: {enemy}.",
    "The universe made a mistake and named it {enemy}.",
    "A rude little nightmare stomps in: {enemy}."
  ],
  victory: [
    "That worked??",
    "Victory achieved.",
    "You survived somehow.",
    "We take those.",
    "Clean enough.",
    "THE ENEMY HAS BEEN REMOVED FROM THE CHAT.",
    "That thing got introduced to consequences.",
    "Messy, loud, effective. I support it.",
    "The problem is gone and I am choosing to call that elegant.",
    "One more monster down. The legend keeps growing."
  ],
  loot: [
    "You found {amount} CR in a place that absolutely should not contain currency.",
    "Warm candied raisins again. The economy remains cursed. +{amount} CR.",
    "A suspicious little pile of value appears at your feet. +{amount} CR.",
    "You shake down the scenery and get paid for it. +{amount} CR.",
    "Pocket lint, bad vibes, and candied raisins. Jackpot. +{amount} CR."
  ],
  shop: [
    "Danica: Baby, if it sparkles and causes problems, it probably works.",
    "Danica: I stocked healing, gear, and choices I refuse to explain.",
    "Danica: Every hero needs snacks and at least one questionable weapon.",
    "Danica: We are not asking why the candied raisins are hot right now.",
    "Danica: Sometimes I feel like I'm in a video game and it freaks me out."
  ],
  blessingGood: [
    "The blessing lands clean. Love that for us.",
    "You feel stronger in a way that seems medically unexplainable.",
    "That one actually hit. Big blessing energy.",
    "Your stats just got touched by favor."
  ],
  blessingBad: [
    "That did not feel like a blessing. That felt like feedback.",
    "Spiritually? That was a miss.",
    "The blessing looked at you and chose violence.",
    "Well... that backfired with confidence."
  ],
  wholeNuts: [
    "The old Whole Nuts sign flickers like it remembers better days.",
    "Sugar dust hangs in the air with deeply haunted energy.",
    "Broken candy displays lean like tired soldiers after a weird war.",
    "Purple webbing clings to everything like a hostile redesign.",
    "Whole Nuts stands in ruins, creepy and somehow still kind of funny."
  ],
  ending: [
    "The lights shift. The chaos finally settles.",
    "For one second, nobody jokes.",
    "The room gives way to a stage and a quiet kind of truth."
  ]
};

const itemDB = {
  strawberryTaffy: {name:"Strawberry Taffy", type:"heal", value:15, price:10, sell:5, desc:"Classic healing taffy."},
  blueRaspberryTaffy: {name:"Blue Raspberry Taffy", type:"heal", value:22, price:15, sell:8, desc:"Aggressively blue and weirdly effective."},
  mysteryTaffy: {name:"Mystery Taffy", type:"mystery", value:0, price:24, sell:12, desc:"Could heal. Could bully you."},
  churchCoffee: {name:"Church Coffee of Speed", type:"buff", value:2, price:18, sell:9, desc:"A little haste in a paper cup."},
  sparklyKittenRifle: {name:"Sparkly Kitten Rifle", type:"gear", value:3, price:32, sell:16, desc:"No bullets. Just aura."},
  staffOfBabiesTears: {name:"Staff of Babies' Tears", type:"gear", value:5, price:40, sell:20, desc:"Deeply concerning. Very effective."},
  candiedRaisinPouch: {name:"Candied Raisin Pouch", type:"gold", value:15, price:20, sell:10, desc:"Open for instant CR."}
};

let shopStock = ["strawberryTaffy", "blueRaspberryTaffy", "mysteryTaffy", "churchCoffee", "sparklyKittenRifle", "staffOfBabiesTears", "candiedRaisinPouch"];

const forestEnemies = [
  {name:"Purple Goblin", hp:32, attack:5, reward:10, xp:10},
  {name:"Suspicious Blob", hp:28, attack:6, reward:10, xp:10},
  {name:"Cursed Intern", hp:34, attack:5, reward:12, xp:12},
  {name:"Weird Dog", hp:30, attack:7, reward:11, xp:11}
];

const ruinsEnemies = [
  {name:"Web Knight", hp:56, attack:10, reward:20, xp:18},
  {name:"Elite Menace", hp:60, attack:11, reward:22, xp:18},
  {name:"Tax Beast", hp:62, attack:10, reward:21, xp:17},
  {name:"Bad Decision Elemental", hp:70, attack:12, reward:24, xp:20}
];

const finalEnemies = [
  {name:"Spiderling of Retail Doom", hp:84, attack:14, reward:34, xp:28},
  {name:"Sticky Floor Mimic", hp:88, attack:15, reward:36, xp:30},
  {name:"Cursed Jawbreaker Warden", hp:95, attack:16, reward:38, xp:31}
];

const finalBoss = {name:"The Purple Menace, Queen of Whole Nuts", hp:170, attack:18, reward:100, xp:100, boss:true};

function r(a){ return a[Math.floor(Math.random()*a.length)]; }
function fmt(str, vars){ return Object.keys(vars).reduce((s,k)=>s.replaceAll("{"+k+"}", vars[k]), str); }
function clone(x){ return JSON.parse(JSON.stringify(x)); }

function setImage(key, caption=""){
  const img = document.getElementById("scene-image");
  const cap = document.getElementById("image-caption");
  img.src = imageMap[key] || imageMap.portrait;
  cap.innerText = caption;
}

function updateStats(){
  document.getElementById("stats").innerText =
`HP: ${player.hp}/${player.maxHp} | ATK: ${player.attack} | LVL: ${player.level} | XP: ${player.xp}/${player.level*24} | CR: ${player.gold}
Party: ${player.party.join(", ")}
Deliverances: ${player.deliverances}/21 | Ruins: ${player.flags.ruinsUnlocked ? "Unlocked" : "Locked"} | Whole Nuts: ${player.flags.finalUnlocked ? "Unlocked" : "Locked"}`;
}

function setText(t){ document.getElementById("text").innerText = t; }
function setButtons(buttons){
  const c = document.getElementById("buttons");
  c.innerHTML = "";
  buttons.forEach(b=>{
    const e = document.createElement("button");
    e.innerText = b.text;
    e.onclick = b.action;
    c.appendChild(e);
  });
}
function addSpecial(name, effect, value, text){
  if(!player.specials.find(s=>s.name===name)){
    player.specials.push({name, effect, value, text});
  }
}
function addItem(key){
  const item = clone(itemDB[key]);
  player.inventory.push(item);
}
function canFinal(){ return player.flags.finalUnlocked; }

function town(){
  currentZone = "town";
  setImage("portrait", "Retro pixel portrait stand-in");
  let extra = [];
  if(player.level >= 3 && !player.flags.jakeRecruited) extra.push("Elena: Jake is ready to join the squad.");
  if(player.level >= 5 && !player.flags.lukeRecruited) extra.push("Elena: Luke is ready too. Youngest-sibling engineering arc.");
  if(!player.johnnyUnlocked) extra.push(`Elena: ${Math.max(0,21-player.deliverances)} more deliverances until Johnny B hits like a drum fill.`);
  setText("Elena: " + r(textBank.elenaTown) + (extra.length ? "\n\n" + extra.join("\n") : ""));
  updateStats();
  setButtons([
    {text:"Explore", action: exploreMenu},
    {text:"Shop", action: shopMenu},
    {text:"Church", action: churchMenu},
    {text:"Party", action: partyMenu},
    {text:"Inventory", action: inventoryTown}
  ]);
}

function exploreMenu(){
  setImage("portrait", "Choose your zone");
  setText("Choose a location.\n\nForest = early fights\nRuins = harder enemies\nWhole Nuts = final area");
  setButtons([
    {text:"Forest", action: ()=>explore("forest")},
    {text:"Ruins", action: ()=>explore("ruins")},
    {text:"Whole Nuts", action: ()=>explore("final")},
    {text:"Boss Arena", action: bossArena},
    {text:"Back", action: town}
  ]);
}

function explore(zone){
  if(zone === "ruins" && !player.flags.ruinsUnlocked){
    setText("Elena: Nope. We are not built for that yet.");
    setButtons([{text:"Back", action: exploreMenu}]);
    return;
  }
  if(zone === "final" && !player.flags.finalUnlocked){
    setText("Elena: Whole Nuts is still endgame energy. Not yet.");
    setButtons([{text:"Back", action: exploreMenu}]);
    return;
  }
  currentZone = zone;
  if(zone === "final"){
    setImage("wholeNuts", "Dark-funny fantasy stand-in for Whole Nuts");
    setText(r(textBank.wholeNuts) + "\n\nElena: This place is creepy, sticky, and deeply rude.");
    setButtons([
      {text:"Keep Moving", action: ()=>battleRoll(zone)},
      {text:"Back", action: exploreMenu}
    ]);
    return;
  }
  battleRoll(zone);
}

function battleRoll(zone){
  if(Math.random() < 0.78) startBattle(zone);
  else findLoot(zone);
}

function poolFor(zone){
  if(zone==="forest") return forestEnemies;
  if(zone==="ruins") return ruinsEnemies;
  return finalEnemies;
}

function startBattle(zone){
  enemy = clone(r(poolFor(zone)));
  setImage("reaction", "Sticker-style reaction stand-in");
  let text = fmt(r(textBank.battleIntro), {enemy: enemy.name});
  if(player.hp <= Math.floor(player.maxHp * 0.35)) text += "\n\nElena: YOUR HEALTH BAR LOOKS DISRESPECTFUL.";
  setText(text);
  battleMenu();
}

function battleMenu(){
  setButtons([
    {text:"Attack", action: attackEnemy},
    {text:"Special", action: specialMenu},
    {text:"Item", action: inventoryBattle},
    {text:"Run", action: town}
  ]);
  updateStats();
}

function attackEnemy(){
  enemy.hp -= player.attack;
  if(enemy.hp <= 0){ winBattle(); return; }
  enemyTurn(`You hit ${enemy.name} for ${player.attack}.`);
}

function enemyTurn(prefix){
  player.hp -= enemy.attack;
  if(player.hp <= 0){ loseBattle(); return; }
  setText(prefix + `\n\n${enemy.name} hits back for ${enemy.attack}.`);
  battleMenu();
}

function specialMenu(){
  if(player.specials.length === 0){
    setText("No specials yet.\n\nTry blessings, recruits, or shop gear.");
    setButtons([{text:"Back", action: battleMenu}]);
    return;
  }
  setButtons([
    ...player.specials.map((s,i)=>({text:s.name, action:()=>useSpecial(i)})),
    {text:"Back", action:battleMenu}
  ]);
}

function useSpecial(i){
  const s = player.specials[i];
  let text = s.text || s.name;
  if(s.effect === "damage") enemy.hp -= s.value;
  if(s.effect === "heal") player.hp = Math.min(player.maxHp, player.hp + s.value);
  if(s.effect === "buff") player.attack += s.value;

  if(enemy.hp <= 0){
    setText(text);
    winBattle();
    return;
  }
  enemyTurn(text);
}

function inventoryTown(){
  if(player.inventory.length === 0){
    setText("Inventory empty.");
    setButtons([{text:"Back", action:town}]);
    return;
  }
  setButtons([
    ...player.inventory.map((item,i)=>({text:item.name, action:()=>useItemTown(i)})),
    {text:"Back", action:town}
  ]);
  setText("Inventory:\nChoose an item.");
}

function inventoryBattle(){
  if(player.inventory.length === 0){
    setText("Inventory empty.");
    setButtons([{text:"Back", action:battleMenu}]);
    return;
  }
  setButtons([
    ...player.inventory.map((item,i)=>({text:item.name, action:()=>useItemBattle(i)})),
    {text:"Back", action:battleMenu}
  ]);
  setText("Choose an item to use.");
}

function resolveItem(item){
  let text = `${item.name} used. `;
  if(item.type === "heal"){
    player.hp = Math.min(player.maxHp, player.hp + item.value);
    text += `Recovered ${item.value} HP.`;
  } else if(item.type === "buff"){
    player.attack += item.value;
    text += `ATK +${item.value}.`;
  } else if(item.type === "gold"){
    player.gold += item.value;
    text += `Gained ${item.value} CR.`;
  } else if(item.type === "gear"){
    player.attack += item.value;
    text += `Permanent ATK +${item.value}.`;
  } else if(item.type === "mystery"){
    if(Math.random() < 0.65){
      player.hp = Math.min(player.maxHp, player.hp + 20);
      text += "It behaved. +20 HP.";
    } else {
      player.hp = Math.max(1, player.hp - 10);
      text += "It fought back. -10 HP.";
    }
  }
  return text + `\n\n${item.desc}`;
}

function useItemTown(i){
  const item = player.inventory.splice(i,1)[0];
  setText(resolveItem(item));
  updateStats();
  setButtons([{text:"Back", action:town}]);
}

function useItemBattle(i){
  const item = player.inventory.splice(i,1)[0];
  const text = resolveItem(item);
  updateStats();
  if(enemy && enemy.hp > 0) enemyTurn(text);
  else battleMenu();
}

function findLoot(zone){
  const amount = zone==="forest" ? rand(6,14) : zone==="ruins" ? rand(12,22) : rand(18,30);
  player.gold += amount;
  let text = fmt(r(textBank.loot), {amount});
  if(Math.random() < 0.3){
    const key = r(["strawberryTaffy","blueRaspberryTaffy","churchCoffee","candiedRaisinPouch"]);
    addItem(key);
    text += `\n\nYou also found: ${itemDB[key].name}`;
  }
  setImage("reaction", "Sticker-style loot stand-in");
  setText(text);
  updateStats();
  setButtons([{text:"Back", action: exploreMenu}]);
}

function shopMenu(){
  setImage("reaction", "Sticker/cartoon style stand-in");
  setText(r(textBank.shop));
  setButtons([
    {text:"Buy", action: shopBuy},
    {text:"Sell", action: shopSell},
    {text:"Back", action: town}
  ]);
}

function shopBuy(){
  setText("Buy something questionable but useful.");
  setButtons([
    ...shopStock.map((key, i)=>({text:`${itemDB[key].name} (${itemDB[key].price} CR)`, action:()=>buyItem(key)})),
    {text:"Back", action: shopMenu}
  ]);
}

function buyItem(key){
  const item = itemDB[key];
  if(player.gold < item.price){
    setText("Danica: Baby, you do not have the CR for that.");
    setButtons([{text:"Back", action: shopBuy}]);
    return;
  }
  player.gold -= item.price;
  player.inventory.push(clone(item));
  updateStats();
  setText(`Purchased: ${item.name}\n\n${item.desc}`);
  setButtons([{text:"Back", action: shopBuy}]);
}

function shopSell(){
  if(player.inventory.length === 0){
    setText("Nothing to sell.");
    setButtons([{text:"Back", action: shopMenu}]);
    return;
  }
  setText("Pick an item to sell.");
  setButtons([
    ...player.inventory.map((item,i)=>({text:`${item.name} (${item.sell} CR)`, action:()=>sellItem(i)})),
    {text:"Back", action: shopMenu}
  ]);
}

function sellItem(i){
  const item = player.inventory.splice(i,1)[0];
  player.gold += item.sell;
  updateStats();
  setText(`Sold ${item.name} for ${item.sell} CR.`);
  setButtons([{text:"Back", action: shopSell}]);
}

function churchMenu(){
  setImage("portrait", "Pastor/healer portrait stand-in");
  setText("New Vintage Church\n\nHealing is Deliverance.\nBlessings stay blessings.");
  setButtons([
    {text:"Deliverance (Full Heal)", action: deliverance},
    {text:"Modest Blessing (15 CR)", action: ()=>blessing("modest")},
    {text:"Faith Blessing (35 CR)", action: ()=>blessing("faith")},
    {text:"Unhinged Revival Blessing (60 CR)", action: ()=>blessing("unhinged")},
    {text:"Back", action: town}
  ]);
}

function deliverance(){
  player.hp = player.maxHp;
  player.deliverances += 1;
  let text = "Pastor Paul: You're covered.\n\nFully restored.";
  if(player.deliverances >= 21 && !player.johnnyUnlocked){
    player.johnnyUnlocked = true;
    player.party.push("Johnny B");
    addSpecial("Johnny B Hype", "buff", 4, "Johnny B erupts like a live intro. ATK +4.");
    text += "\n\nJohnny B joins the party with loud hype energy.";
  }
  updateStats();
  setText(text);
  setButtons([{text:"Back", action: churchMenu}]);
}

function blessing(tier){
  const cfg = {
    modest: {cost:15, chance:0.75, atk:2, hp:5},
    faith: {cost:35, chance:0.68, atk:4, hp:10},
    unhinged: {cost:60, chance:0.60, atk:7, hp:16}
  }[tier];
  if(player.gold < cfg.cost){
    setText("Not enough CR.");
    setButtons([{text:"Back", action: churchMenu}]);
    return;
  }
  player.gold -= cfg.cost;
  if(Math.random() < cfg.chance){
    player.attack += cfg.atk;
    player.maxHp += cfg.hp;
    player.hp = Math.min(player.maxHp, player.hp + Math.floor(cfg.hp/2));
    let text = r(textBank.blessingGood) + `\n\nATK +${cfg.atk}, Max HP +${cfg.hp}.`;
    if(tier === "unhinged" && Math.random() < 0.55){
      if(Math.random() < 0.5) addSpecial("Divine Chaos", "damage", 30, "Holy nonsense detonates for 30 damage.");
      else addSpecial("Favor Surge", "heal", 22, "Favor lands. Recover 22 HP.");
      text += "\n\nUnlocked a special.";
    }
    updateStats();
    setText(text);
  } else {
    const mode = Math.random();
    if(mode < 0.34){ player.hp = Math.max(1, player.hp - 10); setText(r(textBank.blessingBad) + "\n\nLost 10 HP."); }
    else if(mode < 0.67){ player.gold = Math.max(0, player.gold - 10); setText(r(textBank.blessingBad) + "\n\nLost 10 CR."); }
    else { player.attack = Math.max(1, player.attack - 2); setText(r(textBank.blessingBad) + "\n\nLost 2 ATK."); }
    updateStats();
  }
  setButtons([{text:"Back", action: churchMenu}]);
}

function partyMenu(){
  setImage("portrait", "Party portrait stand-in");
  let text = "Party:\n- " + player.party.join("\n- ");
  if(player.flags.girlPowerUnlocked) text += "\n\nGirl Power Protocol: ONLINE";
  setText(text);
  setButtons([
    {text:"Recruit Jake", action: recruitJake},
    {text:"Recruit Luke", action: recruitLuke},
    {text:"Recruit Brooklyn", action: recruitBrooklyn},
    {text:"Recruit Bella", action: recruitBella},
    {text:"Back", action: town}
  ]);
}

function recruitJake(){
  if(player.flags.jakeRecruited){ setText("Jake already joined."); setButtons([{text:"Back", action: partyMenu}]); return; }
  if(player.level < 3){ setText("Jake unlocks at level 3."); setButtons([{text:"Back", action: partyMenu}]); return; }
  player.flags.jakeRecruited = true;
  player.party.push("Jake");
  player.attack += 2;
  addSpecial("Protect", "heal", 15, "Jake steps in and steadies the team (+15 HP).");
  updateStats();
  setText("Jake joins with quiet big-brother energy.");
  setButtons([{text:"Back", action: partyMenu}]);
}

function recruitLuke(){
  if(player.flags.lukeRecruited){ setText("Luke already joined."); setButtons([{text:"Back", action: partyMenu}]); return; }
  if(player.level < 5){ setText("Luke unlocks at level 5."); setButtons([{text:"Back", action: partyMenu}]); return; }
  player.flags.lukeRecruited = true;
  player.party.push("Luke");
  player.attack += 2;
  addSpecial("Haste", "buff", 3, "Luke speeds things up (+3 ATK).");
  updateStats();
  setText("Luke joins with youngest-sibling engineering energy.");
  setButtons([{text:"Back", action: partyMenu}]);
}

function recruitBrooklyn(){
  if(player.flags.brooklynRecruited){ setText("Brooklyn already joined."); setButtons([{text:"Back", action: partyMenu}]); return; }
  if(!player.flags.jakeRecruited){ setText("Jake needs to join first."); setButtons([{text:"Back", action: partyMenu}]); return; }
  if(Math.random() < 0.75){
    player.flags.brooklynRecruited = true;
    player.party.push("Brooklyn");
    addSpecial("Shield Vibe", "heal", 18, "Brooklyn steadies the squad (+18 HP).");
    setText("Brooklyn joins with chill confidence and wilderness calm.");
  } else {
    setText("Brooklyn says maybe later.");
  }
  checkGirlPower();
  updateStats();
  setButtons([{text:"Back", action: partyMenu}]);
}

function recruitBella(){
  if(player.flags.bellaRecruited){ setText("Bella already joined."); setButtons([{text:"Back", action: partyMenu}]); return; }
  if(!player.flags.lukeRecruited){ setText("Luke needs to join first."); setButtons([{text:"Back", action: partyMenu}]); return; }
  if(Math.random() < 0.75){
    player.flags.bellaRecruited = true;
    player.party.push("Bella");
    addSpecial("Savage Focus", "damage", 22, "Bella locks in and lands 22 damage.");
    setText("Bella joins sweetly, which is less comforting than it sounds.");
  } else {
    setText("Bella just smiled and walked away. Ruthless.");
  }
  checkGirlPower();
  updateStats();
  setButtons([{text:"Back", action: partyMenu}]);
}

function checkGirlPower(){
  if(!player.flags.girlPowerUnlocked && player.flags.brooklynRecruited && player.flags.bellaRecruited){
    player.flags.girlPowerUnlocked = true;
    addSpecial("Girl Power Protocol", "damage", 34, "Lili, Bella, and Brooklyn go OFF (34 damage).");
  }
}

function gainXP(amount){
  player.xp += amount;
  while(player.xp >= player.level * 24){
    player.xp -= player.level * 24;
    player.level += 1;
    player.attack += 2;
    player.maxHp += 10;
    if(player.level >= 6) player.flags.ruinsUnlocked = true;
    if(player.level >= 10) player.flags.finalUnlocked = true;
  }
}

function winBattle(){
  if(!enemy) return;
  player.gold += enemy.reward;
  gainXP(25 * enemy.xp);

  if(enemy.boss){
    player.flags.bossBeaten = true;
    setImage("ending", "Comic-style ending stand-in");
    let text = `${r(textBank.ending)}\n\nYou defeated the Purple Menace.\n\nMalachi is saved... kind of.\n\nBut it was never really about that.\n\nJohnny B hits the drums.\nLili picks up the bass.\n\nHappy 21st.\n\nI haven't always been able to be there the way I wanted, but I love you tons.`;
    setText(text);
    setButtons([{text:"Play Again", action: ()=>location.reload()}]);
    enemy = null;
    updateStats();
    return;
  }

  setText(r(textBank.victory) + `\n\n+${enemy.reward} CR, +${enemy.xp} XP.`);
  enemy = null;
  updateStats();
  setButtons([{text:"Back to Town", action: town}]);
}

function loseBattle(){
  setText("Elena: NOPE. We died.\n\nEverybody regroups and pretends that was strategic.");
  player.hp = Math.max(1, Math.floor(player.maxHp * 0.6));
  updateStats();
  enemy = null;
  setButtons([{text:"Back to Town", action: town}]);
}

function bossArena(){
  if(!player.flags.finalUnlocked){
    setText("Whole Nuts is not unlocked yet.");
    setButtons([{text:"Back", action: exploreMenu}]);
    return;
  }
  setImage("wholeNuts", "Whole Nuts final area stand-in");
  setText(r(textBank.wholeNuts) + "\n\nElena: If you're going in, go in loud.");
  setButtons([
    {text:"Fight the Purple Menace", action: startBossFight},
    {text:"Back", action: exploreMenu}
  ]);
}

function startBossFight(){
  enemy = clone(finalBoss);
  setImage("boss", "Dark-funny fantasy boss stand-in");
  setText("A massive purple spider descends.\n\nThis is it.\n\nMalachi is webbed up somewhere overhead.");
  battleMenu();
}

function rand(a,b){ return Math.floor(Math.random()*(b-a+1))+a; }

town();
