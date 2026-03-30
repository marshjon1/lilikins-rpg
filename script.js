// V6 SCRIPT (Part 1+2 combined for zip delivery)

let player = {
  hp:100,maxHp:100,attack:10,gold:25,xp:0,level:1,
  inventory:[],specials:[],party:["Lilikins"],deliverances:0
};

let unlockedZones={forest:true,ruins:false,final:false};
let enemy=null;

const elena = [
"OKAY LILI LOCK IN 😆",
"STRATEGIC PANIC MODE",
"DON'T DIE PLEASE",
"YOU GOT THIS PROBABLY",
"THIS IS FINE (IT IS NOT)"
];

const battleIntro = [
"This feels illegal.",
"You hear boss music.",
"This was a mistake.",
"Violence time.",
"You regret everything."
];

const victory = [
"That worked??",
"Victory achieved.",
"You survived somehow.",
"We take those.",
"Clean enough."
];

function r(a){return a[Math.floor(Math.random()*a.length)]}

function update(){
document.getElementById("stats").innerText=
`HP:${player.hp}/${player.maxHp} ATK:${player.attack} LVL:${player.level} CR:${player.gold}`;
}

function setText(t){document.getElementById("text").innerText=t;}

function setButtons(b){
let c=document.getElementById("buttons");c.innerHTML="";
b.forEach(x=>{
let e=document.createElement("button");
e.innerText=x.text;
e.onclick=x.action;
c.appendChild(e);
});
}

function start(){update();town();}

function town(){
setText("Elena: "+r(elena));
setButtons([
{text:"Explore",action:exploreMenu},
{text:"Shop",action:shop},
{text:"Church",action:church}
]);
}

function exploreMenu(){
setText("Choose location");
setButtons([
{text:"Forest",action:()=>explore("forest")},
{text:"Ruins",action:()=>explore("ruins")},
{text:"Whole Nuts",action:()=>explore("final")},
{text:"Back",action:town}
]);
}

function explore(z){
if(!unlockedZones[z]){setText("Elena: nope.");return;}
if(Math.random()<0.75){battle(z);}else{loot();}
}

function battle(z){
enemy={
name:z==="forest"?"Goblin":"Menace",
hp:z==="forest"?30:60,
attack:z==="forest"?5:10,
reward:10
};
setText(r(battleIntro)+" A "+enemy.name+" appears!");
menu();
}

function menu(){
setButtons([
{text:"Attack",action:atk},
{text:"Run",action:town}
]);
}

function atk(){
enemy.hp-=player.attack;
if(enemy.hp<=0)return win();
player.hp-=enemy.attack;
if(player.hp<=0)return lose();
update();
setText("Trade hits.");
}

function win(){
player.gold+=enemy.reward;
player.xp+=10;

if(player.xp>=player.level*20){
player.xp=0;
player.level++;
player.attack+=2;
player.maxHp+=10;

if(player.level>=6)unlockedZones.ruins=true;
if(player.level>=10)unlockedZones.final=true;

setText("LEVEL UP!");
}else{
setText(r(victory));
}

update();
town();
}

function lose(){
setText("Elena: we died 😬");
}

function loot(){
let g=Math.floor(Math.random()*10)+5;
player.gold+=g;
setText("Found "+g+" CR.");
update();
}

function shop(){
setText("Danica: I don't know why this works, just buy it.");
setButtons([{text:"Back",action:town}]);
}

function church(){
setText("Pastor Paul: You're covered.");
setButtons([
{text:"Deliverance",action:heal},
{text:"Back",action:town}
]);
}

function heal(){
player.hp=player.maxHp;
player.deliverances++;
update();
setText("Fully restored.");
}

start();

// ===== V6 EXPANSION PACK 1 =====
// Paste this entire file at the VERY BOTTOM of your current script.js

elena.push(
  "LILI BABY WE ARE ENTERING THE DANGER ZONE WITH STYLE AND QUESTIONABLE PLANNING.",
  "I NEED BIG MAIN-CHARACTER ENERGY AND JUST A LITTLE BIT OF SPITE.",
  "YOU JUST GOT BACK FROM TOKYO AND NOW YOU GOTTA FIGHT A GREMLIN. DISRESPECTFUL.",
  "GRAPHIC ARTIST HANDS, BASS PLAYER SOUL, ABSOLUTE MENACE DESTINY.",
  "IF THIS GETS ANY WEIRDER I AM GONNA START CHARGING NARRATION FEES.",
  "YOU ARE BEAUTIFUL, DEDICATED, AND CURRENTLY ONE BAD ENCOUNTER AWAY FROM THROWING SOMEBODY.",
  "LILI I NEED YOU TO LOCK IN LIKE YOU ARE FINISHING A DEADLINE ON PURE CAFFEINE AND FAITH.",
  "THIS WHOLE ADVENTURE GOT LIP GLOSS, SPIRITUAL WARFARE, AND FAMILY CHAOS. THAT IS YOUR LANE.",
  "YOU GOT THAT LOW-KEY TEMPER THING GOING ON. USE IT FOR GOOD, BABY.",
  "I BELIEVE IN YOU WITH MY WHOLE CHAOTIC LITTLE HEART.",
  "IF SOMETHING ACTS UGLY, WE HIT IT WITH ARTISTIC INTENTION.",
  "THIS WORLD IS RUN BY BAD DECISIONS AND YOU ARE ABOUT TO OUTWORK ALL OF THEM.",
  "YOU ARE NOT JUST THE CHOSEN ONE. YOU ARE THE RELUCTANTLY DRAFTED ONE.",
  "SOMETIMES DESTINY IS JUST EVERYBODY ELSE BEING BUSY.",
  "I NEED YOU WALKING LIKE YOU ALREADY WON AND THE MONSTERS JUST HAVEN'T FOUND OUT YET.",
  "QUEEN OF THE BASS, PRINCESS OF CHAOS MANAGEMENT, PART-TIME MONSTER PROBLEM.",
  "YOU GOT FAITH, TALENT, AND A FACE CARD THAT NEVER DECLINES. THE ENEMY IS COOKED.",
  "IF ANYTHING SWINGS AT YOU, TAKE IT PERSONALLY IN A PRODUCTIVE WAY.",
  "NO PRESSURE, BUT I ALREADY TOLD THE VIBES YOU WERE GONNA WIN.",
  "THIS IS NOT A CALM DAY. THIS IS A LEGEND DAY."
);

battleIntro.push(
  "A thing with ugly intentions enters the area.",
  "A monster appears like it pays rent here. Disgusting.",
  "This creature looks handcrafted by a committee of bad choices.",
  "A problem in physical form just showed up.",
  "The enemy arrives with a face full of bad manners.",
  "Somebody let this thing out in public.",
  "That creature looks like it should have been stopped in the concept stage.",
  "A weird little beast appears and immediately becomes everybody's problem.",
  "You found trouble. Trouble found you harder.",
  "This enemy looks moist in a spiritually concerning way.",
  "A rude little nightmare rolls up like it owns the road.",
  "The air gets goofy. Enemy inbound.",
  "That thing has villain posture and I hate it.",
  "The battlefield just got uglier. Enemy sighted.",
  "You hear chaos clomping closer. Here we go.",
  "An enemy appears and it is embarrassingly confident.",
  "That thing walked in like it had a plan. We cannot allow that.",
  "The universe made a mistake and now it's your turn.",
  "Something ugly with opinions just showed up.",
  "This feels like a side quest that got way too serious."
);

victory.push(
  "THE ENEMY HAS BEEN REMOVED FROM THE CHAT.",
  "You solved that problem the old-fashioned way: aggressively.",
  "That thing had a dream and you interrupted it permanently.",
  "Messy, loud, effective. I support it.",
  "That enemy got introduced to consequences.",
  "You absolutely worked that creature over.",
  "Okayyyy that was kinda nasty in the best way.",
  "Victory with seasoning. Love that.",
  "The problem is gone and I am choosing to call that elegant.",
  "That enemy just got evicted from existence.",
  "You kept your composure and then absolutely did not keep your mercy.",
  "That was rude, direct, and honestly a little beautiful.",
  "The creature folded like cheap laundry.",
  "You handled business and made it look accidental.",
  "That was one hundred percent a win and maybe seventy percent a plan.",
  "Well look at you, collecting victories and emotional damage.",
  "That enemy is now just atmosphere.",
  "You flattened that problem into a teaching moment.",
  "I saw what you did and I am impressed in all caps.",
  "One more monster down. The legend keeps growing."
);

const lootLines = [
  "You found some CR in a place that absolutely should not contain currency.",
  "Warm candied raisins again. The economy remains cursed.",
  "You shake down the scenery and get paid for it.",
  "A little stash of CR was hiding nearby like it knew better.",
  "Pocket lint, bad vibes, and candied raisins. Jackpot.",
  "The universe coughed up some CR for your trouble.",
  "A suspicious little pile of value appears at your feet.",
  "You found CR under conditions that raise questions.",
  "This bush had money in it. Sure. Fine.",
  "A tiny treasure stash rewards your nosiness."
];

const shopFlavor = [
  "Danica: Baby, if it sparkles and causes problems, it probably works.",
  "Danica: I stocked healing, gear, and choices I refuse to explain.",
  "Danica: I keep telling myself this is normal retail. It is not.",
  "Danica: Every hero needs snacks and at least one questionable weapon.",
  "Danica: I got practical items, funny items, and funny practical items.",
  "Danica: If an item starts whispering, just set it down gentle.",
  "Danica: We are not asking why the candied raisins are hot right now.",
  "Danica: Buy what you need and maybe one thing that feels dangerous.",
  "Danica: I love you, but if you try to haggle I will become difficult.",
  "Danica: Sometimes I feel like I'm in a video game and it freaks me out."
];

const blessingSuccess = [
  "The blessing lands clean. Love that for us.",
  "You feel stronger in a way that seems medically unexplainable.",
  "Something just shifted and I am pretty sure it helped.",
  "That one actually hit. Big blessing energy.",
  "Your stats just got touched by favor."
];

const blessingFail = [
  "That did not feel like a blessing. That felt like feedback.",
  "Oof. Spiritually, that was a miss.",
  "The blessing looked at you and chose violence.",
  "Something in the room got weird and now so are your stats.",
  "Well... that backfired with confidence."
];

const wholeNutsFlavor = [
  "The old Whole Nuts sign flickers like it remembers better days.",
  "Sugar dust hangs in the air with deeply haunted energy.",
  "Broken candy displays lean like tired soldiers after a weird war.",
  "The floor looks sticky enough to have opinions.",
  "Purple webbing clings to everything like a hostile redesign.",
  "The place smells like old candy and terrible choices.",
  "This used to be joy. Now it's a boss arena waiting room.",
  "A shattered display case glints under bad lighting.",
  "Everything here feels one laugh away from horror.",
  "Whole Nuts stands in ruins, creepy and somehow still kind of funny."
];

const passOutLines = [
  "Somebody just dropped and the vibes got way more serious.",
  "OH NO SOMEBODY FOLDED. I DO NOT LIKE THIS.",
  "That hit way too hard and now the squad looks different.",
  "Somebody is down and my heart rate just got disrespectful.",
  "NOPE. NOPE. GET BACK UP, BESTIE."
];

const secretEndingStarter = [
  "The lights shift. The chaos finally settles.",
  "For one second, nobody jokes.",
  "The room gives way to a stage and a quiet kind of truth.",
  "Johnny B counts it in. Lili lifts the bass.",
  "This is bigger than the fight ever was."
];

// Optional helper functions you can call later if you want more flavor text.
function getLootFlavor() {
  return r(lootLines);
}

function getShopFlavor() {
  return r(shopFlavor);
}

function getBlessingSuccessFlavor() {
  return r(blessingSuccess);
}

function getBlessingFailFlavor() {
  return r(blessingFail);
}

function getWholeNutsFlavor() {
  return r(wholeNutsFlavor);
}

function getPassOutFlavor() {
  return r(passOutLines);
}

function getSecretEndingStarter() {
  return r(secretEndingStarter);
}


// ===== V6 EXPANSION PACK 2 =====
// PARTY + SPECIAL SYSTEMS

// ===== SPECIAL SYSTEM =====
player.specials = player.specials || [];

function addSpecial(name, effect, value, text){
  if(!player.specials.find(s=>s.name===name)){
    player.specials.push({name, effect, value, text});
  }
}

function specialMenu(){
  if(player.specials.length===0){
    setText("No specials yet.");
    setButtons([{text:"Back",action:menu}]);
    return;
  }

  setButtons([
    ...player.specials.map((s,i)=>({
      text:s.name,
      action:()=>useSpecial(i)
    })),
    {text:"Back",action:menu}
  ]);
}

function useSpecial(i){
  let s = player.specials[i];
  let txt = s.text || s.name;

  if(s.effect==="damage"){
    enemy.hp -= s.value;
  }
  if(s.effect==="heal"){
    player.hp = Math.min(player.maxHp, player.hp + s.value);
  }
  if(s.effect==="buff"){
    player.attack += s.value;
  }

  setText(txt);

  if(enemy.hp<=0){ win(); return; }

  player.hp -= enemy.attack;
  update();
}

// ===== PARTY SYSTEM =====
function party(){
  let text = "Party:\n" + player.party.join(", ");

  setButtons([
    {text:"Recruit Jake",action:recruitJake},
    {text:"Recruit Luke",action:recruitLuke},
    {text:"Back",action:town}
  ]);

  setText(text);
}

function recruitJake(){
  if(player.party.includes("Jake")){
    setText("Jake already joined.");
    return;
  }
  if(player.level < 3){
    setText("Jake unlocks at level 3.");
    return;
  }

  player.party.push("Jake");
  player.attack += 2;

  addSpecial(
    "Protect",
    "heal",
    15,
    "Jake steps in and steadies the team (+15 HP)"
  );

  update();
  setText("Jake joined the party.");
}

function recruitLuke(){
  if(player.party.includes("Luke")){
    setText("Luke already joined.");
    return;
  }
  if(player.level < 5){
    setText("Luke unlocks at level 5.");
    return;
  }

  player.party.push("Luke");
  player.attack += 2;

  addSpecial(
    "Haste",
    "buff",
    3,
    "Luke speeds things up (+3 ATK)"
  );

  update();
  setText("Luke joined the party.");
}

// ===== GIRL POWER =====
function checkGirlPower(){
  if(
    player.party.includes("Lilikins") &&
    player.party.includes("Bella") &&
    player.party.includes("Brooklyn")
  ){
    addSpecial(
      "Girl Power Protocol",
      "damage",
      30,
      "The squad goes OFF (30 damage)"
    );
  }
}

// ===== BLESSING SPECIALS =====
function blessingReward(){
  if(Math.random()<0.5){
    addSpecial(
      "Divine Chaos",
      "damage",
      25,
      "Holy chaos blast (25 dmg)"
    );
  }else{
    addSpecial(
      "Favor Surge",
      "heal",
      20,
      "You feel covered (+20 HP)"
    );
  }
}


// ===== V6 EXPANSION PACK 3 =====
// BELLA + BROOKLYN + INVENTORY + SHOP SYSTEMS

// ===== INVENTORY SYSTEM =====
player.inventory = player.inventory || [];

function addItem(name, type, value, text){
  player.inventory.push({name, type, value, text});
}

function inventoryMenu(){
  if(player.inventory.length === 0){
    setText("Inventory empty.");
    setButtons([{text:"Back", action:menu}]);
    return;
  }

  setButtons([
    ...player.inventory.map((item,i)=>({
      text:item.name,
      action:()=>useItem(i)
    })),
    {text:"Back", action:menu}
  ]);
}

function useItem(i){
  let item = player.inventory[i];

  if(item.type === "heal"){
    player.hp = Math.min(player.maxHp, player.hp + item.value);
  }
  if(item.type === "buff"){
    player.attack += item.value;
  }
  if(item.type === "gold"){
    player.gold += item.value;
  }

  setText(item.text || (item.name + " used."));
  player.inventory.splice(i,1);
  update();
}

// ===== LOOT UPGRADE =====
function loot(){
  let g = Math.floor(Math.random()*10)+5;
  player.gold += g;

  if(Math.random() < 0.3){
    addItem(
      "Strange Taffy",
      "heal",
      20,
      "You eat it. It works. Don't ask why (+20 HP)"
    );
  }

  setText("Found "+g+" CR.");
  update();
}

// ===== SHOP SYSTEM =====
function shop(){
  setText(getShopFlavor ? getShopFlavor() : "Danica: buy something.");
  setButtons([
    {text:"Buy Taffy (10)", action:()=>buy("taffy")},
    {text:"Sell Items", action:sellMenu},
    {text:"Back", action:town}
  ]);
}

function buy(type){
  if(player.gold < 10){
    setText("Not enough CR.");
    return;
  }

  player.gold -= 10;

  if(type==="taffy"){
    addItem(
      "Taffy",
      "heal",
      15,
      "Classic healing taffy (+15 HP)"
    );
  }

  update();
  setText("Purchased.");
}

function sellMenu(){
  if(player.inventory.length === 0){
    setText("Nothing to sell.");
    return;
  }

  setButtons([
    ...player.inventory.map((item,i)=>({
      text:item.name + " (5 CR)",
      action:()=>sellItem(i)
    })),
    {text:"Back", action:shop}
  ]);
}

function sellItem(i){
  player.gold += 5;
  player.inventory.splice(i,1);
  update();
  setText("Item sold.");
}

// ===== BELLA + BROOKLYN =====
function recruitBrooklyn(){
  if(player.party.includes("Brooklyn")){
    setText("Brooklyn already joined.");
    return;
  }

  if(Math.random() < 0.7){
    player.party.push("Brooklyn");
    addSpecial(
      "Shield Vibe",
      "heal",
      18,
      "Brooklyn steadies the squad (+18 HP)"
    );
    setText("Brooklyn joined.");
  }else{
    setText("Brooklyn said nah for now.");
  }

  update();
  checkGirlPower();
}

function recruitBella(){
  if(player.party.includes("Bella")){
    setText("Bella already joined.");
    return;
  }

  if(Math.random() < 0.7){
    player.party.push("Bella");
    addSpecial(
      "Savage Focus",
      "damage",
      22,
      "Bella locks in (22 damage)"
    );
    setText("Bella joined.");
  }else{
    setText("Bella just smiled and walked away.");
  }

  update();
  checkGirlPower();
}

// Extend party menu
const oldParty = party;
party = function(){
  setButtons([
    {text:"Recruit Jake",action:recruitJake},
    {text:"Recruit Luke",action:recruitLuke},
    {text:"Recruit Brooklyn",action:recruitBrooklyn},
    {text:"Recruit Bella",action:recruitBella},
    {text:"Back",action:town}
  ]);

  setText("Party:\n" + player.party.join(", "));
};


// ===== V6 EXPANSION PACK 4 (FINAL) =====
// FINAL ZONE + BOSS + ENDING

// ===== FINAL ZONE =====
function exploreFinal(){
  setText(getWholeNutsFlavor ? getWholeNutsFlavor() : "Whole Nuts is ruined...");
  setButtons([
    {text:"Go Deeper", action:startBoss},
    {text:"Back", action:exploreMenu}
  ]);
}

// Hook into explore
const oldExplore = explore;
explore = function(zone){
  if(zone==="final"){
    exploreFinal();
    return;
  }
  oldExplore(zone);
};

// ===== BOSS =====
function startBoss(){
  enemy = {
    name:"Purple Menace",
    hp:120,
    attack:15,
    reward:50,
    boss:true
  };

  setText("A massive purple spider descends. This is it.");
  menu();
}

// ===== WIN OVERRIDE =====
const oldWin = win;
win = function(){
  if(enemy && enemy.boss){
    player.gold += enemy.reward;
    setText("You defeated the Purple Menace.");

    setButtons([
      {text:"Rescue Malachi", action:ending},
    ]);
    return;
  }

  oldWin();
};

// ===== ENDING =====
function ending(){
  setText(
`Malachi is saved... kind of.

But it was never really about that.

The stage lights come up.

Johnny B hits the drums.
Lili picks up the bass.

And for a moment,
everything makes sense.

Happy 21st.

I love you tons.`
  );

  setButtons([
    {text:"Play Again", action:()=>location.reload()}
  ]);
}

// ===== SECRET ENDING HOOK =====
const oldHeal = heal;
heal = function(){
  oldHeal();

  if(player.deliverances >= 21 && !player.party.includes("Johnny B")){
    player.party.push("Johnny B");
    setText("Johnny B has joined the party.");
  }
};

// ===== SHOP FIX OVERRIDE =====

shop = function(){
  setText(getShopFlavor ? getShopFlavor() : "Danica: buy something.");

  setButtons([
    {text:"Buy Taffy (10 CR)", action:()=>buy("taffy")},
    {text:"Sell Items", action:sellMenu},
    {text:"Back", action:town}
  ]);
};
