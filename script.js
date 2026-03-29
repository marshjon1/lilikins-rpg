let player={hp:100,maxHp:100,attack:10,gold:25,xp:0,level:1,inventory:[],specials:[],party:["Lilikins"],deliverances:0};
let enemy=null;
let unlockedZones={forest:true,ruins:false,final:false};

const elenaLines=["OKAY FOCUS LILI FOCUS 😆","DON'T DIE THAT WOULD BE BAD","YOU GOT THIS PROBABLY","STRATEGIC PANIC MODE","WE ARE THRIVING... KIND OF"];
const battleLines=["This feels illegal.","You hear boss music.","This was a mistake.","Violence time.","You regret everything."];
const victoryLines=["You survived somehow.","That worked??","Victory achieved.","We take those.","That was chaotic."];
const shopLines=["I don't know why this works.","This feels like a game.","Buy something please.","Don't ask questions.","It's probably fine."];

function r(a){return a[Math.floor(Math.random()*a.length)]}

function updateStats(){document.getElementById("stats").innerText=`HP:${player.hp}/${player.maxHp} ATK:${player.attack} LVL:${player.level} CR:${player.gold}`;}
function setText(t){document.getElementById("text").innerText=t;}
function setButtons(b){let c=document.getElementById("buttons");c.innerHTML="";b.forEach(x=>{let e=document.createElement("button");e.innerText=x.text;e.onclick=x.action;c.appendChild(e);});}

function start(){updateStats();town();}

function town(){setText("Elena: "+r(elenaLines));setButtons([
{text:"Explore",action:exploreMenu},
{text:"Shop",action:shop},
{text:"Church",action:church}
]);}

function exploreMenu(){setText("Where to?");setButtons([
{text:"Forest",action:()=>explore("forest")},
{text:"Ruins",action:()=>explore("ruins")},
{text:"Final",action:()=>explore("final")},
{text:"Back",action:town}
]);}

function explore(z){
if(!unlockedZones[z]){setText("Elena: nope.");return;}
if(Math.random()<0.75){battle(z);}else{loot();}
}

function battle(z){
enemy={name:z==="forest"?"Goblin":"Menace",hp:z==="forest"?30:60,attack:z==="forest"?5:10,reward:10};
setText(r(battleLines)+" A "+enemy.name+" appears!");
menu();
}

function menu(){setButtons([
{text:"Attack",action:atk},
{text:"Special",action:spec},
{text:"Item",action:inv},
{text:"Run",action:town}
]);}

function atk(){
enemy.hp-=player.attack;
if(enemy.hp<=0)return win();
player.hp-=enemy.attack;
if(player.hp<=0)return lose();
updateStats();
setText("Trade hits.");
}

function spec(){setText("No specials yet.");}

function inv(){setText("Inventory empty.");}

function shop(){
setText("Danica: "+r(shopLines));
setButtons([
{text:"Taffy (10)",action:buy},
{text:"Back",action:town}
]);
}

function buy(){
if(player.gold<10){setText("No CR.");return;}
player.gold-=10;
player.inventory.push({type:"heal",value:10});
updateStats();
setText("Bought.");
}

function church(){
setText("Pastor Paul nods.");
setButtons([
{text:"Deliverance",action:heal},
{text:"Blessing",action:bless},
{text:"Back",action:town}
]);
}

function heal(){
player.hp=player.maxHp;
player.deliverances++;
updateStats();
setText("Restored.");
}

function bless(){
if(player.gold<15){setText("No CR.");return;}
player.gold-=15;
if(Math.random()<0.7){player.attack+=2;setText("Blessed.");}
else{player.hp-=10;setText("That hurt.");}
updateStats();
}

function loot(){
let g=Math.floor(Math.random()*10)+5;
player.gold+=g;
setText("Found "+g+" CR.");
updateStats();
}

function win(){
player.gold+=enemy.reward;
player.xp+=10;
if(player.xp>=player.level*20){
player.xp=0;player.level++;player.attack+=2;player.maxHp+=10;
if(player.level>=6)unlockedZones.ruins=true;
if(player.level>=10)unlockedZones.final=true;
setText("LEVEL UP!");
}else{setText(r(victoryLines));}
updateStats();town();
}

function lose(){setText("Elena: we died 😬");}

start();