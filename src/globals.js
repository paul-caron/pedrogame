        // Globals
        let level;
        let protagonist;
        let background;
        let foreground;
        let bullets;
        let audios = ["#fmtechno", "#hardgroove", "#dorienigm", "#mom"];
        let audioIndex = 2;
        let audio = document.querySelector(audios[audioIndex]);
        let gl;
        let program;
        let textures;
        let zoomFactor = 1.25;
        // Variables for world offset and control keys
        let worldOffsetX = 0;
        let worldOffsetY = 0;
        let keys = {};
        let controlsEnabled = true;
        let collectables = {
            //'item': number,
        };

        function dialog(text, callback = () => { }) {
            const dialogBox = document.getElementById('dialogBox');
            dialogBox.innerText = text;
            setTimeout(() => {
                dialogBox.innerText = "";
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
            let answer = confirm('restart level?');
            if(answer) restart();
        }

        function initLevel() {
            controlsEnabled = true;
            bullets = [];
            worldOffsetX = 0;
            worldOffsetY = 0;
            return { colliders: [], enemies: [], drawables: [], movers: [], transitionProgress: 0.0 }
        }

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
        const sz = 0.03125;
        const tileVertices = new Float32Array([
            -sz, sz, 0.0, 0.0, 1.0,
            -sz, -sz, 0.0, 0.0, 0.0,
            sz, sz, 0.0, 1.0, 1.0,
            -sz, -sz, 0.0, 0.0, 0.0,
            sz, sz, 0.0, 1.0, 1.0,
            sz, -sz, 0.0, 1.0, 0.0,
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

        // boss vertices x,y,z,u,v
        const boss_sz = sz * 4;
        const bossVertices = new Float32Array([
            -boss_sz, boss_sz, 0.0, 0.0, 1.0,
            -boss_sz, -boss_sz, 0.0, 0.0, 0.0,
            boss_sz, boss_sz, 0.0, 1.0, 1.0,
            -boss_sz, -boss_sz, 0.0, 0.0, 0.0,
            boss_sz, boss_sz, 0.0, 1.0, 1.0,
            boss_sz, -boss_sz, 0.0, 1.0, 0.0,
        ]);
