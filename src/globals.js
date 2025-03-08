// Globals
let dialogTimeoutId;
let canvas;
let level;
let protagonist;
let background;
let foreground;
let bullets;
let audios = ["#fmtechno", "#hardgroove", "#dorienigm", "#mom"];
let audioIndex = 2;
let audio = document.querySelector(audios[audioIndex]);
let gl;
let textureImages = [];
let program;  //textures
let program2; //lines
let textures;
let zoomFactor = 1.25;
let worldOffsetX = 0;
let worldOffsetY = 0;
let keys = {};
let controlsEnabled = true;
let collectables = {
    //'item': number,
};
//halfwidth of a standard sized tile
const sz = 0.03125;
//halfwidth of a boss sized tile
const boss_sz = sz * 4;

const assetsRoot = "assets/";

const textureURLs = [
    assetsRoot + 'sierpinski.png',
    assetsRoot + 'pedro.png',
    assetsRoot + 'pedro2.png',
    assetsRoot + 'brick.png',
    assetsRoot + 'chest.png',
    assetsRoot + 'chest2.png',
    assetsRoot + 'chest3.png',
    assetsRoot + 'portal.png',
    assetsRoot + 'portal1.png',
    assetsRoot + 'portal2.png',
    assetsRoot + 'portal3.png',
    assetsRoot + 'portal4.png',
    assetsRoot + 'portal5.png',
    assetsRoot + 'syringe_up.png',
    assetsRoot + 'syringe_right.png',
    assetsRoot + 'syringe_down.png',
    assetsRoot + 'syringe_left.png',
    assetsRoot + 'chestopen.png',
    assetsRoot + 'dea.png',
    assetsRoot + 'dea2.png',
    assetsRoot + 'bloodparticle.png',
    assetsRoot + 'transparent.png',
    assetsRoot + 'npc.png',
    assetsRoot + 'npc2.png',
    assetsRoot + 'leaff.png',
    assetsRoot + 'ice.png',
    assetsRoot + 'ice2.png',
    assetsRoot + 'bubble.png',
    assetsRoot + 'doge.png',
    assetsRoot + 'doge2.png',
    assetsRoot + 'grump.png',
    assetsRoot + 'grump2.png',
    assetsRoot + 'selena.png',
    assetsRoot + 'selena2.png',
    assetsRoot + 'eye.png',
    assetsRoot + 'eye2.png',
    assetsRoot + 'eye3.png',
    assetsRoot + 'switch.png',
    assetsRoot + 'switch2.png',
    assetsRoot + 'switch3.png',
    assetsRoot + 'fogofwar.png',
    assetsRoot + 'credits.png',
    assetsRoot + 'bubblered.png',
    assetsRoot + 'font.png',
];

// vertices for the background x,y,z,u,v
const backgroundVertices = new Float32Array([
    -1, 1, 0.0, 0.0, 1.0,
    -1, -1, 0.0, 0.0, 0.0,
    1, 1, 0.0, 1.0, 1.0,
    -1, -1, 0.0, 0.0, 0.0,
    1, 1, 0.0, 1.0, 1.0,
    1, -1, 0.0, 1.0, 0.0,
]);

// tile vertices x,y,z,u,v
const tileVertices = new Float32Array([
    -sz, sz, 0.0, 0.0, 1.0,
    -sz, -sz, 0.0, 0.0, 0.0,
    sz, sz, 0.0, 1.0, 1.0,
    -sz, -sz, 0.0, 0.0, 0.0,
    sz, sz, 0.0, 1.0, 1.0,
    sz, -sz, 0.0, 1.0, 0.0,
]);

// boss vertices x,y,z,u,v
const bossVertices = new Float32Array([
    -boss_sz, boss_sz, 0.0, 0.0, 1.0,
    -boss_sz, -boss_sz, 0.0, 0.0, 0.0,
    boss_sz, boss_sz, 0.0, 1.0, 1.0,
    -boss_sz, -boss_sz, 0.0, 0.0, 0.0,
    boss_sz, boss_sz, 0.0, 1.0, 1.0,
    boss_sz, -boss_sz, 0.0, 1.0, 0.0,
]);


const getVertices = (size, offsetU = 0, offsetV = 0, div = 1) => {
    const vertices = new Float32Array([
        -size, size, 0.0, (0.0/div+offsetU), (1.0/div+offsetV),
        -size, -size, 0.0, (0.0/div+offsetU), (0.0/div+offsetV),
        size, size, 0.0, (1.0/div+offsetU), (1.0/div+offsetV),
        -size, -size, 0.0, (0.0/div+offsetU), (0.0/div+offsetV),
        size, size, 0.0, (1.0/div+offsetU), (1.0/div+offsetV),
        size, -size, 0.0, (1.0/div+offsetU), (0.0/div+offsetV),
    ]);
    return vertices;
};


function dialog(text, callback = () => { }, avatarSrc = "assets/pedro.png") {
    clearTimeout(dialogTimeoutId);
    if(!callback) callback =()=>{};
    const dialogBox = document.getElementById('dialogBox');
    const dialogText = document.getElementById('dialogText');
    const avatar = document.getElementById('dialogAvatar');
    dialogBox.style.display = 'block';
    avatar.style.borderImage= `url(assets/border2.png) 8 / 32`;
    dialogBox.style.backgroundImage= 'url(assets/fogofwar.png)';
    dialogBox.style.borderImage= `url(assets/border.png) 14 / 32`;
    avatar.src = avatarSrc;
    dialogText.innerText = text;
    dialogTimeoutId = setTimeout(() => {
        dialogText.innerText = "";
        avatar.src = "";
        dialogBox.style.display = 'none';
        callback();
    },
    2000);
}

function dialogBlocking(text, callback = () => { }, avatarSrc = "assets/pedro.png") {
    clearTimeout(dialogTimeoutId);
    if(!callback) callback =()=>{};
    const dialogBox = document.getElementById('dialogBox');
    const dialogText = document.getElementById('dialogText');
    const avatar = document.getElementById('dialogAvatar');
    controlsEnabled = false;
    avatar.style.borderImage= `url(assets/border2.png) 8 / 32`;
    dialogBox.style.backgroundImage= 'url(assets/fogofwar.png)';
    dialogBox.style.borderImage= `url(assets/border.png) 14 / 32`;
    dialogBox.style.display = 'block';
    avatar.src = avatarSrc;
    dialogText.innerText = text;
    dialogTimeoutId = setTimeout(() => {
        dialogText.innerText = "";
        avatar.src = "";
        dialogBox.style.display = 'none';
        controlsEnabled = true;
        callback();
    },
    3000);
}

function restart(){
    keys = {};
    level = new window[level.constructor.name]();
    let weapon = protagonist.weapon;
    let ammoType = protagonist.ammoType;
    let strength = protagonist.strength;
    let speed = protagonist.speed;
    protagonist = new Protagonist();
    protagonist.weapon = weapon;
    protagonist.ammoType = ammoType;
    protagonist.strength = strength;
    protagonist.speed = speed;
    audio.pause();
    audio = document.querySelector(audios[audioIndex]);
    audio.play();
}

function die() {
    protagonist.dead = true;
    audio.pause();
    audio = document.querySelector("#ether");
    audio.play();
    setTimeout(()=>{
        let answer = confirm('restart level?');
        if(answer) restart();
    }, 6000);
}

function initLevel() {
    controlsEnabled = true;
    bullets = [];
    worldOffsetX = 0;
    worldOffsetY = 0;
    return { colliders: [], enemies: [], drawables: [], movers: [], transitionProgress: 0.0 }
}

