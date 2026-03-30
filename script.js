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
