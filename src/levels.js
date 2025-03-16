"use strict";

function initLevel() {
    controlsEnabled = true;
    bullets = [];
    worldOffsetX = 0;
    worldOffsetY = 0;
    return { colliders: [], enemies: [], drawables: [], movers: [], transitionProgress: 0.0 };
}

function gridToBricks(grid){ //takes array of strings of 0 and 1 and returns all brick object in positions where '1' were found
    let results = [];
    grid.forEach((row,i)=>{
        row.split('').forEach((cell,j)=>{
            if(cell == '0') return;
            let x = 2*sz*(j-row.length/2);
            let y = 2*sz*(i-grid.length/2);
            let z = 0;
            let brick = new Brick(x,y,z);
            results.push(brick);
        });
    });
    return results;
}

function Level8(){
    Object.assign(this, initLevel());
    let grid = [
        "1111111111111111111111111",
        "1000000000000000000000001",
        "1000000000000000000000001",
        "1000000000000000000000001",
        "1000000000000000000000001",
        "1111111111111111111111111",
        "1000000000000000000000001",
        "1000000000000000000000001",
        "1000000000000000000000001",
        "1000000000000000000000001",
        "1000000000000000000000001",
        "1000000000000000000000001",
        "1000000000000000000000001",
        "1000000000000000000000001",
        "1000000000000000000000001",
        "1000000000000000000000001",
        "1000000000000000000000001",
        "1000000000000000000000001",
        "1000000000000000000000001",
        "1000000000000000000000001",
        "1000000000000000000000001",
        "1000000000000000000000001",
        "1111111111111111111111111",
    ];
    protagonist.setPosition(0,sz*12);
    let bricks = gridToBricks(grid);
    let door = bricks.filter(b=> {return b.x >= -sz*4 && b.x <sz*4 && b.y >-sz*20 && b.y <0;});
    let puzzle = new Puzzle(25, 0, 0, 0);
    puzzle.onSolve = ()=>{
        door.forEach(d=>{Object.assign(d,Doomed);d.lifetime=0;});
    };
    let portal = new Portal(0,-20*sz,0);
    portal.onCollision = () => {
        protagonist.animation = "blink";
        controlsEnabled = false;
        dialogBlocking("YOU FOUND THE EXIT",
            () => {
                protagonist.animation = "idle";
                level = new Level9();
            },
            'assets/portal.png');
        portal.onCollision = () => { };
    };
    let generatorsCount = 2;
    let generator = new Generator(-sz*22,-sz*20,0,ICE,8000);
    generator.dying = ()=>{
        generatorsCount--;
        if(generatorsCount<=0){
            level.drawables.push(portal);
            level.colliders.push(portal);
        }
    };
    let generator2 = new Generator(sz*20,-sz*20,0);
    generator2.dying = ()=>{
        generatorsCount--;
        if(generatorsCount<=0){
            level.drawables.push(portal);
            level.colliders.push(portal);
        }
    };
    let crate = new Crate(-sz*22,sz*18,0);
    let crate2 = new Crate(sz*20,sz*18,0);
    this.drawables.push(generator,generator2,crate,crate2,...bricks,...puzzle.switches,...puzzle.shards);
    this.colliders.push(generator,generator2,crate,crate2,...bricks,...puzzle.switches);
    this.movers.push(generator,generator2);
    this.enemies.push(crate,crate2,generator,generator2);
}

function Level4(){
    Object.assign(this, initLevel());
    let grid = [
        "1111111111111111111111111",
        "1000000100000000001000001",
        "1000000100000000001000001",
        "1000000100000000001000001",
        "1000000100000000001000001",
        "1000000100000000001000001",
        "1000000100000000001000001",
        "1000000100000000001000001",
        "1000000100000000001000001",
        "1000000100000000000000001",
        "1000000100000000000000001",
        "1111111111111111111111111",
        "1000000100000000001000001",
        "1000000100000000001000001",
        "1000000100000000001000001",
        "1000000100000000001000001",
        "1000000100000000001000001",
        "1000000100000000001000001",
        "1000000100000000001000001",
        "1000000100000000001000001",
        "1000000100000000000000001",
        "1000000100000000000000001",
        "1111111111111111111111111",
    ];
    protagonist.setPosition(0,-sz*12);
    let bricks = gridToBricks(grid);

    let door = bricks.filter(b=>{return b.x == -sz * 11 && b.y >= -sz*14 && b.y < -sz*10;});
    let door2 = bricks.filter(b=>{return b.x >= -sz * 20 && b.x < -sz*16 && b.y == -sz*1;});
    let door3 = bricks.filter(b=>{return b.x == -sz * 11 && b.y < sz*12 && b.y >= sz*8;});
    let generator = new Generator(-18*sz,-sz*18,0);
    let generator2 = new Generator(8*sz,sz*4,0);
    generator.dying = ()=>{
        door2.forEach(d=>{
            Object.assign(d, Doomed);
            d.lifetime = 0;
        });
    };
    generator2.dying = ()=>{
        this.drawables.push(portal);
        this.colliders.push(portal);
    };
    let portal = new Portal(17*sz,10*sz,0);
    portal.onCollision = () => {
        protagonist.animation = "blink";
        controlsEnabled = false;
        dialogBlocking("YOU FOUND THE EXIT",
            () => {
                protagonist.animation = "idle";
                level = new Level5();
            },
            'assets/portal.png');
        portal.onCollision = () => { };
    };
    let crate = new Crate(17*sz,-12*sz,0);
    let crate2 = new Crate(-20*sz,12*sz,0);
    let sw = new Switch(17*sz,-12*sz,0);
    let oldonCollision = sw.onCollision.bind(sw);
    sw.onCollision=()=>{
        oldonCollision();
        door.forEach(d=>{
            Object.assign(d, Doomed);
            d.lifetime = 0;
        });
        this.drawables.push(generator2);
        this.movers.push(generator2);
        this.colliders.push(generator2);
        this.enemies.push(generator2);
        sw.onCollision = ()=>{};
    };
    let sw2 = new Switch(-20*sz,12*sz,0);
    let oldonCollision2 = sw2.onCollision.bind(sw2);
    sw2.onCollision=()=>{
        oldonCollision2();
        door3.forEach(d=>{
            Object.assign(d, Doomed);
            d.lifetime = 0;
        });
        sw.onCollision = ()=>{};
    };
    let oldonExpire = crate.onExpire.bind(crate);
    crate.onExpire = ()=>{
        oldonExpire();
        this.drawables.push(sw);
        this.colliders.push(sw);
    };
    let oldonExpire2 = crate2.onExpire.bind(crate2);
    crate2.onExpire = ()=>{
        oldonExpire2();
        this.drawables.push(sw2);
        this.colliders.push(sw2);
    };
    this.drawables = [...bricks,generator,crate,crate2];
    this.colliders = [...bricks,generator,crate,crate2];
    this.enemies = [generator,crate,crate2];
    this.movers = [generator];
}

function LevelCredits() {
    Object.assign(this, initLevel());
    audio.pause();
    audio = document.querySelector("#fmtechno");
    audio.play();
    background = new Drawable([41], backgroundVertices);
    die = () => {protagonist.dead = false;};
}

function Level13() {
    Object.assign(this, initLevel());
    let makeBricks = (x,y)=>{
        let results = [];
        for(let i = 0; i<=24; ++i)
        for(let j = 0; j<=24; j+=24)
            results.push(new Brick((i+x)*2*sz,(j+y)*2*sz,0));
        for(let j = 0; j<=24; j+=24)
        for(let i = 0; i<=24; ++i)
            results.push(new Brick((j+x)*2*sz,(i+y)*2*sz,0));
        return results;
    };
    let bricks = (()=>{
        return [
            ...makeBricks(-12-24,-12),
            ...makeBricks(-12,-12-24),
            ...makeBricks(-12+24,-12),
            ...makeBricks(-12,-12+24),
        ];
    })();

    let puzzle  = new Puzzle(35, 0,-sz*10, 0);
    let puzzle2 = new Puzzle(34,-sz*10, 0, 0);
    let puzzle3 = new Puzzle(36, sz*10, 0, 0);

    let sw1 = new Switch(0, -sz * 48, 0);
    let sw2 = new Switch(-sz * 48, 0, 0);
    let sw3 = new Switch(sz * 48, 0, 0);
    let switches = [sw1,sw2,sw3];

    switches.forEach(s=>{
        let oldonCollision = s.onCollision.bind(s);
        s.onCollision = () => {
            if(!s.enabled) return;
            oldonCollision();
            if(sw1.isActivated() && sw2.isActivated() && sw3.isActivated()){
                this.drawables = this.drawables.filter(d=>{
                    return !((d.y === sz * 24) && (d.x>-sz*24) && (d.x<sz*24));
                });
                this.colliders = this.colliders.filter(d=>{
                    return !((d.y === sz * 24) && (d.x>-sz*24) && (d.x<sz*24));
                });
            }
        };
    });

    let portal = new Portal(0.0, sz * 54, 0.0);
    portal.onCollision = () => {
        protagonist.animation = "blink";
        controlsEnabled = false;
        dialogBlocking(
            "YOU FOUND THE EXIT",
            () => {
                protagonist.animation = "idle";
                level = new Level14();
            },
            "assets/portal.png"
        );
        portal.onCollision = () => { };
    };


    this.drawables = [
        ...puzzle.switches,
        ...puzzle.shards,
        ...puzzle2.switches,
        ...puzzle2.shards,
        ...puzzle3.switches,
        ...puzzle3.shards,
        ...bricks,
        sw1,sw2,sw3,portal,
    ];
    this.colliders = [
        ...puzzle.switches,
        ...puzzle2.switches,
        ...puzzle3.switches,
        ...bricks,
        sw1,sw2,sw3,portal,
    ];
    puzzle.onSolve = () => {
        this.drawables = this.drawables.filter(d=>{
            return !((d.y === -sz * 24) && (d.x>-sz*24) && (d.x<sz*24));
        });
        this.colliders = this.colliders.filter(d=>{
            return !((d.y === -sz * 24) && (d.x>-sz*24) && (d.x<sz*24));
        });
    };
    puzzle2.onSolve = () => {
        this.drawables = this.drawables.filter(d=>{
            return !((d.x === -sz * 24) && (d.y>-sz*24) && (d.y<sz*24));
        });
        this.colliders = this.colliders.filter(d=>{
            return !((d.x === -sz * 24) && (d.y>-sz*24) && (d.y<sz*24));
        });
    };
    puzzle3.onSolve = () => {
        this.drawables = this.drawables.filter(d=>{
            return !((d.x === sz * 24) && (d.y>-sz*24) && (d.y<sz*24));
        });
        this.colliders = this.colliders.filter(d=>{
            return !((d.x === sz * 24) && (d.y>-sz*24) && (d.y<sz*24));
        });
    };
}

function Level1() {
    Object.assign(this, initLevel());

    dialogBlocking("USE ARROW KEYS TO MOVE AROUND",
        () => { dialogBlocking("SPACE BAR FOR ATTACK") });

    let chest = new Chest(-0.2, -0.0, 0.0);
    chest.onCollision = () => {
        protagonist.weapon = "gun";
        dialogBlocking("YOU FOUND A TRANQUILIZER GUN",null,'assets/chest3.png');
        chest.open();
    };

    let chest2 = new Chest(0.0, -0.2, 0.0);
    chest2.onCollision = () => {
        protagonist.ammoType = "fentanyl";
        dialogBlocking("YOU FOUND FENTANYL TRANQUILIZER SHOTS",null,'assets/chest3.png');
        chest2.open();
    };
    let chest3 = new Chest(0.2, -0.0, 0.0);
    chest3.onCollision = () => {
        dialogBlocking("YOU FOUND A LETTER FROM CHICKA MI AMOR:", () => { dialogBlocking('"Help me Pedro!"<Selena Gomez>',null,'assets/selena.png'); },'assets/chest3.png');
        chest3.open();
    };
    let portal = new Portal(0.0, 0.2 + sz * 2, 0.0);
    portal.onCollision = () => {
        protagonist.animation = "blink";
        controlsEnabled = false;
        dialogBlocking("YOU FOUND THE EXIT",
            () => {
                protagonist.animation = "idle";
                level = new Level2();
            },
            'assets/portal.png');
        portal.onCollision = () => { };
    };

    let npc = new NPC(0, -0.35, 0, `"I think Grump took her to prison. Be careful of your enemies and of the booby traps."`);

    let sw = new Switch(0.0, 0.2, 0.0);
    let oldonCollision = sw.onCollision.bind(sw);
    sw.onCollision = () => {
        if(!sw.enabled) return;
        oldonCollision();
        if(sw.isActivated()){
           this.drawables.push(portal);
           this.colliders.push(portal);
        }else{
           this.drawables = this.drawables.filter(e=>e!=portal);
           this.colliders = this.colliders.filter(e=>e!=portal);
        }
    }

    this.drawables = [chest, chest2, chest3, sw, npc];
    this.colliders = [chest, chest2, chest3, sw, npc];
    this.movers = [];
    this.enemies = [];
};

function Level2() {
    Object.assign(this, initLevel());

    let bricks = (() => {
        let result = [];
        for (let x = -15, y = 2; x < -8; x += 2, y += 2) {
            result.push(new Brick(x * sz, -0.2 - sz * y, 0.0));
            result.push(new Brick(x * sz, -0.2 + sz * y, 0.0));
        }
        for (let x = 15, y = 2; x > 8; x -= 2, y += 2) {
            result.push(new Brick(x * sz, -0.2 - sz * y, 0.0));
            result.push(new Brick(x * sz, -0.2 + sz * y, 0.0));
        }
        for (let x = -sz * 16; x <= sz * 16; x += sz * 2)
            result.push(new Brick(x, -0.2, 0.0));
        return result;
    })();

    let bullet = new Bullet(sz, [13, 14, 15, 16], tileVertices, 0.0, 0.4, 0.0);
    bullet.dx = 0;
    bullet.dy = -0.003;
    bullet.lifetime = 2000;
    bullet.onCollision = () => {
        die();
        dialogBlocking("YOU STEPPED ON DIRTY NEEDLE", () => {
            dialogBlocking("NOW YOU ARE HIV POSITIVE AND GAY!",null,'assets/syringe_down.png');
        },'assets/syringe_down.png');
        bullet.dy = 0;
        bullet.dx = 0;
    }

    let chest = new Chest(2.0, -0.2, 0.0);
    chest.onCollision = () => {
        dialogBlocking("YOU FOUND THE COCAINA (SPEED BUFF)",null,'assets/chest3.png');
        protagonist.speed = 2.0;
        chest.open();
    };

    let portal = new Portal(-2.0, -0.2, 0.0);
    portal.onCollision = () => {
        protagonist.animation = "blink";
        controlsEnabled = false;
        dialogBlocking("YOU FOUND THE EXIT",
            () => {
                protagonist.animation = "idle";
                level = new Level3();
            },'assets/portal.png');
        portal.onCollision = () => { };
    };

    let npc = new NPC(0, -0.35, 0, `"It is a very big world we live in. Don't get lost."`);
    this.colliders = [...bricks, bullet, chest, portal, npc];
    this.drawables = [bullet, ...bricks, chest, portal, npc];
    this.movers = [bullet];
    this.enemies = [];
}

function Level3() {
    Object.assign(this, initLevel());

    let bricks = (() => {
        let result = [];
        for (let y = -0.4; y <= 0.4; y += sz * 2)
            result.push(new Brick(-sz * 16, y, 0.0));
        for (let y = -0.4; y <= 0.4; y += sz * 2)
            result.push(new Brick(sz * 16, y, 0.0));
        for (let x = -sz * 16; x < sz * 16; x += sz * 2)
            result.push(new Brick(x, -0.4, 0.0));
        for (let x = -sz * 16; x <= sz * 16; x += sz * 2)
            result.push(new Brick(x, 0.4, 0.0));
        return result;
    })();

    let dea = new DEA(0.2, -0.2, 0.0);
    dea.update = (dt) => {
        dea.dy = 0;
        if (dea.x >= 0.2) dea.dx = -0.0003 * dt;
        if (dea.x <= -0.2) dea.dx = 0.0003 * dt;
    };

    let portal = new Portal(0.0, 0.2, 0.0);
    portal.onCollision = () => {
        protagonist.animation = "blink";
        controlsEnabled = false;
        dialogBlocking("YOU FOUND THE EXIT",
            () => {
                protagonist.animation = "idle";
                level = new Level4();
            },'assets/portal.png');
        portal.onCollision = () => { };
    };

    this.colliders = [...bricks, dea];
    this.enemies = [dea];
    this.drawables = [...bricks, dea];
    this.movers = [dea];
    dea.dying = () => {
        dialogBlocking("CONGRATS. YOUR FIRST KILL! CARTEL PRESTIGE GOES UP",null,'assets/dea.png');
        this.colliders.push(portal);
        this.drawables.push(portal);
    };
}

function Level4b() {
    Object.assign(this, initLevel());
    let portal = new Portal(0.0, 0.2, 0.0);
    portal.onCollision = () => {
        protagonist.animation = "blink";
        controlsEnabled = false;
        dialogBlocking("YOU FOUND THE EXIT",
            () => {
                protagonist.animation = "idle";
                level = new Level5();
            }, 'assets/portal.png');
        portal.onCollision = () => { };
    };
    let enemies = [];
    let enemyCount = 30;
    for (let i = 1; i <= enemyCount; i++) {
        let radius = 0.1 * i + 0.5;
        let angle = Math.PI / 7 * i;
        let x = Math.cos(angle) * radius;
        let y = Math.sin(angle) * radius;
        let dea = new DEA(x, y, 0.0);
        dea.dying = () => {
            dialog(`${--enemyCount} enemies left`,null,'assets/dea.png');
            if (enemyCount === 0) {
                this.drawables.push(portal);
                this.colliders.push(portal);
            }
        };
        enemies.push(dea);
    }
    this.colliders = [...enemies];
    this.enemies = [...enemies];
    this.drawables = [...enemies];
    this.movers = [...enemies];
}

function Level5() {
    Object.assign(this, initLevel());

    let bricks = (() => {
        let result = [];
        let q = 30;//18;
        for (let y = -q; y <= q; y += 12)
            for (let x = -q; x <= q; x += 2)
                result.push(new Brick(sz * x, sz * y, 0.0));
        for (let y = -q; y <= q; y += 2)
            for (let x = -q; x <= q; x += 12)
                result.push(new Brick(sz * x, sz * y, 0.0));
        return result;
    })();

    let portals = (() => {
        let results = [];
        for (let y = -18; y < 18; y += 12)
            for (let x = -18; x < 18; x += 12) {
                let portal = new Portal((x + 2) * sz, (y + 2) * sz, 0.0);
                results.push(portal);
            }
        for (let y = -18; y < 18; y += 12)
            for (let x = -18; x < 18; x += 12) {
                let portal = new Portal((x + 10) * sz, (y + 10) * sz, 0.0);
                results.push(portal);
            }
        return results;
    })();

    for (let i = 0; i < 9; i++)
        portals[i].onCollision = () => { worldOffsetX = -(portals[i + 1].x + sz * 4); worldOffsetY = -(portals[i + 1]).y - sz * 4; };
    for (let i = 9; i < 18; i++)
        portals[i].onCollision = () => { worldOffsetX = -(portals[i - 1].x - sz * 4); worldOffsetY = -(portals[i - 1]).y + sz * 4; };

    let ports = portals.toSpliced(9, 1);
    ports[8].onCollision = () => { worldOffsetX = -0; worldOffsetY = 0; };
    ports[ports.length - 1].onCollision = () => {
        controlsEnabled = false;
        protagonist.animation = "blink";
        dialogBlocking("YOU FOUND THE EXIT",
            () => {
                protagonist.animation = "idle";
                level = new Level6();
            }, 'assets/portal.png');
        ports[ports.length - 1].onCollision = () => { };
    };

    let chest = new Chest(-sz * 8, -sz * 8, 0.0);
    chest.onCollision = () => {
        dialogBlocking("YOU FOUND THE SHROOMS (STRENGTH BUFF)",null,'assets/chest3.png');
        protagonist.strength += 1;
        chest.open();
    };

    this.colliders = [...bricks, ...ports, chest];
    this.enemies = [];
    this.drawables = [...bricks, ...ports, chest];
    this.movers = [];
}

function Level6() {
    Object.assign(this, initLevel());
    protagonist.defaultEffect = 5;
    framebuffer.option = 5;

    dialogBlocking(`"It is here that you die"`, () => {
        dialogBlocking(`"The big booty latina, Selena Gomez, is ours. Mouhahaha!"`,null,'assets/dea.png');
    },'assets/dea.png');

    let portal = new Portal(0.0, -32 * sz, 0.0);
    portal.onCollision = () => {
        controlsEnabled = false;
        protagonist.animation = "blink";
        dialogBlocking("YOU FOUND THE EXIT",
            () => {
                protagonist.animation = "idle";
                level = new Level7();
            },'assets/portal.png');
        portal.onCollision = () => { };
    };

    let bricks = (() => {
        let result = [];
        for (let y = -18; y <= 18; y += 36)
            for (let x = -18; x <= 18; x += 2)
                result.push(new Brick(sz * x, sz * y, 0.0));
        for (let y = -18; y <= 18; y += 2)
            for (let x = -18; x <= 18; x += 36)
                result.push(new Brick(sz * x, sz * y, 0.0));
        return result;
    })();

    let otherBricks = (() => {
        let result = [];
        for (let y = -36; y <= -18; y += 2)
            for (let x = -18; x <= 18; x += 36)
                result.push(new Brick(sz * x, sz * y, 0.0));
        for (let x = -18; x <= 18; x += 2)
            result.push(new Brick(sz * x, sz * -36, 0.0));
        return result;
    })();

    let dea = new DEA_Boss(0, -0.4, 0.0);
    let animationCounter = 10000;
    dea.update = function (dt) {//dt, {x:,y:}
        let target = { x: 0, y: -0.4 };
        let speed = 0.5;
        if (animationCounter < 2000) {
            target = protagonist.getPosition();
            speed = 1.2;
        }
        if (!dt) return;
        let dy = -dea.y + target.y;
        let dx = -dea.x + target.x;
        let angle = Math.atan2(dy, dx);
        dea.dx = speed * 0.0003 * dt * Math.cos(angle);
        dea.dy = speed * 0.0003 * dt * Math.sin(angle);

        animationCounter -= dt;
        if (animationCounter < 0) animationCounter = 10000;
    };

    this.colliders = [dea, ...bricks];
    this.enemies = [dea];
    this.drawables = [dea, ...bricks];
    this.movers = [dea];
    dea.dying = () => {
        this.drawables.push(portal);
        this.colliders.push(portal);
        this.colliders = this.colliders.filter(c => c.y != -18 * sz);
        this.drawables = this.drawables.filter(d => d.y != -18 * sz);
        this.colliders.push(...otherBricks);
        this.drawables.push(...otherBricks);
        protagonist.defaultEffect = 0;
        framebuffer.option = 0;
    };
}

function Level7() {
    Object.assign(this, initLevel());

    let portal = new Portal(0.0, sz * 5, 0.0);
    portal.onCollision = () => {
        controlsEnabled = false;
        protagonist.animation = "blink";
        dialogBlocking("YOU FOUND THE EXIT",
            () => {
                protagonist.animation = "idle";
                level = new Level8();
            },'assets/portal.png');
        portal.onCollision = () => { };
    };

    let ice = new ICE(0,-sz*30,0);

    const n = 100;
    let npc = new NPC(0, -sz * 6, 0, `"Help this poor old farmer. Please collect ${n} of these plants"`);
    let oldonCollision = npc.onCollision.bind(npc);
    npc.onCollision = () => {
        if (collectables['leaf'] && collectables['leaf'] >= n) {
            dialogBlocking(`"Thank you very much. Here is the exit"`,null,'assets/npc.png');
            this.colliders.push(portal);
            this.drawables.push(portal);
            npc.onCollision = () => {};
        } else {
            oldonCollision();
        }
    }
    let leaves = (() => {
        let results = [];
        for (let i = 0; i < (n); i++) {
            let angle = i * Math.PI * 2 / (n);
            let r = 1 + Math.sin(angle * 13);
            let x = r * Math.cos(angle) * sz * 16;
            let y = r * Math.sin(angle) * sz * 16 - sz * 30;
            results.push(new Leaf(x, y));
        }
        return results;
    })();
    this.drawables = [ice,npc, ...leaves];
    this.colliders = [ice,npc, ...leaves];
    this.movers = [ice];
}

function Level8b() {
    Object.assign(this, initLevel());
    let portal = new Portal(0.0,0.2,0.0);
    portal.onCollision = () => {
        controlsEnabled = false;
        protagonist.animation = "blink";
        dialogBlocking("YOU FOUND THE EXIT",
            () => {
                protagonist.animation = "idle";
                level = new Level9();
            },'assets/portal.png');
        portal.onCollision = () => { };
    };
    let ices = (()=>{
        let results = [];
        let n = 15;
        let da = 4 * Math.PI * 2 / n;
        for(let i = 0; i < n; ++i){
            let radius = 0.7 + i * 0.1;
            let ice = new ICE(Math.cos(da*i)*radius, Math.sin(da*i)*radius, 0);
            results.push(ice);
        }
        return results;
    })();
    this.colliders = [...ices];
    this.enemies = [...ices];
    this.drawables = [...ices];
    this.movers = [...ices];
}

function Level9() {
    Object.assign(this, initLevel());
    let chest = new Chest(0, sz*16, 0.0);
    chest.onCollision = () => {
        protagonist.weapon = "double";
        dialogBlocking("YOU FOUND THE DOUBLE BARRELED GUN",null,'assets/chest3.png');
        chest.open();
    };
    let portal = new Portal(0.0,-sz*12,0.0);
    portal.onCollision = () => {
        controlsEnabled = false;
        protagonist.animation = "blink";
        dialogBlocking("YOU FOUND THE EXIT",
            () => {
                protagonist.animation = "idle";
                level = new Level10();
            },'assets/portal.png');
        portal.onCollision = () => { };
    };
    let movingBrick = (upper,right,lower,left,x,y,reverse)=>{
        let brick = new Brick(x,y,0);
        Object.assign(brick, Mover);
        brick.x = x;
        brick.y = y;
        let oldMove = brick.move.bind(brick);
        brick.move = (dt) => {
          if(brick.moving){oldMove(dt);}
        };
        if(!reverse){
          brick.update = (dt)=>{
           const d = 0.001;
           //if in top row
           if(brick.y <= upper){
               brick.y = upper;
               // if not end of row on right
               if(brick.x <= right){
                  brick.dx = d;
                  brick.dy = 0.000;
               }else{
                  brick.dx = 0.000;
                  brick.dy = d;
               }
           }
           //if in right column
           else if(brick.x >= right){
               brick.x = right;
               // if not end of column
               if(brick.y <= lower){
                  brick.dx = 0.000;
                  brick.dy = d;
               }else{
                  brick.dx = -d;
                  brick.dy = 0.000;
               }
           }
           //if in bottom row
           else if(brick.y >= lower){
               brick.y = lower;
               // if not end of row
               if(brick.x >= left){
                  brick.dx = -d;
                  brick.dy = 0.000;
               }else{
                  brick.dx = 0.000;
                  brick.dy = -d;
               }
           }
           //if in left column
           else if(brick.x <= left){
               brick.x = left;
               // if not end of column
               if(brick.y >= upper){
                  brick.dx = 0.000;
                  brick.dy = -d;
               }else{
                  brick.dx = d;
                  brick.dy = 0.000;
               }
           }
          };
        }else{
          brick.update = (dt)=>{
           //if in top row
           const d = 0.001;
           if(brick.y <= upper){
               brick.y = upper;
               // if not end of row on left
               if(brick.x >= left){
                  brick.dx = -d;
                  brick.dy = 0.000;
               }else{
                  brick.dx = 0.000;
                  brick.dy = d;
               }
           }
           //if in left column
           else if(brick.x <= left){
               brick.x = left;
               // if not end of column
               if(brick.y <= lower){
                  brick.dx = 0.000;
                  brick.dy = d;
               }else{
                  brick.dx = d;
                  brick.dy = 0.000;
               }
           }
           //if in bottom row
           else if(brick.y >= lower){
               brick.y = lower;
               // if not end of row
               if(brick.x <= right){
                  brick.dx = d;
                  brick.dy = 0.000;
               }else{
                  brick.dx = 0.000;
                  brick.dy = -d;
               }
           }
           //if in right column
           else if(brick.x >= right){
               brick.x = right;
               // if not end of column
               if(brick.y >= upper){
                  brick.dx = 0.000;
                  brick.dy = -d;
               }else{
                  brick.dx = -d;
                  brick.dy = 0.000;
               }
           }
          };
        }
        return brick;
    };
    let square = (top,right,bottom,left,reverse)=>{
        let results = [];
        for(let y = top; y<=bottom; y+=bottom-top)
        for(let x = left; x <= right; x+= 2*sz){
            let brick = movingBrick(top,right,bottom,left,x,y,reverse);
            results.push(brick);
        }
        for(let x = left; x<=right; x+=right-left)
        for(let y = top+(2*sz); y < bottom; y+= 2*sz){
            let brick = movingBrick(top,right,bottom,left,x,y,reverse);
            results.push(brick);
        }
        return results;
    };
    let bricks = [];
    let bricks1 = square(-sz*8,sz*8,sz*8,-sz*8,false);
    bricks1.pop();
    bricks1.pop();
    let switch1 = new Switch(-sz*3,sz*3,0);
    let oldonCollision1 = switch1.onCollision.bind(switch1);
    switch1.onCollision = ()=>{
        oldonCollision1();
        if(switch1.animation === 'rotate'){
            bricks1.forEach(b=>{b.moving=true;});
        }else{
            bricks1.forEach(b=>{b.moving=false;});
        }
    };
    let bricks2 = square(-sz*10,sz*10,sz*10,-sz*10,true);
    bricks2.shift();
    bricks2.shift();
    let switch2 = new Switch(0,sz*3,0);
    let oldonCollision2 = switch2.onCollision.bind(switch2);
    switch2.onCollision = ()=>{
        oldonCollision2();
        if(switch2.animation === 'rotate'){
            bricks2.forEach(b=>{b.moving=true;});
        }else{
            bricks2.forEach(b=>{b.moving=false;});
        }
    };
    let bricks3 = square(-sz*12,sz*12,sz*12,-sz*12,false);
    bricks3.pop();
    bricks3.pop();
    let switch3 = new Switch(sz*3,sz*3,0);
    let oldonCollision3 = switch3.onCollision.bind(switch3);
    switch3.onCollision = ()=>{
        oldonCollision3();
        if(switch3.animation === 'rotate'){
            bricks3.forEach(b=>{b.moving=true;});
        }else{
            bricks3.forEach(b=>{b.moving=false;});
        }
    };
    bricks.push(...bricks1,...bricks2,...bricks3);
    this.drawables = [chest,portal,...bricks,switch1,switch2,switch3];
    this.colliders = [chest,portal,...bricks,switch1,switch2,switch3];
    this.movers = [...bricks];
}

function Level10() {
    Object.assign(this, initLevel());
    protagonist.defaultEffect = 5;
    framebuffer.option = 5;

    dialogBlocking(`"You came here illegally, you fool."`, () => {
        dialogBlocking(`"I will deport your corpse."`,null,'assets/ice.png');
    },'assets/ice.png');

    let portal = new Portal(0.0, -32 * sz, 0.0);
    portal.onCollision = () => {
        controlsEnabled = false;
        protagonist.animation = "blink";
        dialogBlocking("YOU FOUND THE EXIT",
            () => {
                protagonist.animation = "idle";
                level = new Level11();
            }, 'assets/portal.png');
        portal.onCollision = () => { };
    };

    let bricks = (() => {
        let result = [];
        for (let y = -18; y <= 18; y += 36)
            for (let x = -18; x <= 18; x += 2)
                result.push(new Brick(sz * x, sz * y, 0.0));
        for (let y = -18; y <= 18; y += 2)
            for (let x = -18; x <= 18; x += 36)
                result.push(new Brick(sz * x, sz * y, 0.0));
        return result;
    })();

    let otherBricks = (() => {
        let result = [];
        for (let y = -36; y <= -18; y += 2)
            for (let x = -18; x <= 18; x += 36)
                result.push(new Brick(sz * x, sz * y, 0.0));
        for (let x = -18; x <= 18; x += 2)
            result.push(new Brick(sz * x, sz * -36, 0.0));
        return result;
    })();

    let ice = new ICE_Boss(0, -0.4, 0.0);
    this.colliders = [ice, ...bricks];
    this.enemies = [ice];
    this.drawables = [ice, ...bricks];
    this.movers = [ice];
    ice.dying = () => {
        this.drawables.push(portal);
        this.colliders.push(portal);
        this.colliders = this.colliders.filter(c => c.y != -18 * sz);
        this.drawables = this.drawables.filter(d => d.y != -18 * sz);
        this.colliders.push(...otherBricks);
        this.drawables.push(...otherBricks);
        protagonist.defaultEffect = 0;
        framebuffer.option = 0;
    };
}

function Level11(){
    Object.assign(this, initLevel());
    let portal = new Portal(0.0, 0.2, 0.0);
    portal.onCollision = () => {
        controlsEnabled = false;
        protagonist.animation = "blink";
        dialogBlocking("YOU FOUND THE EXIT",
            () => {
                protagonist.animation = "idle";
                level = new Level12();
            },'assets/portal.png');
        portal.onCollision = () => { };
    };
    let n = 2;
    let enemies = [];
    for(let i=0;i<n;++i){
        let angle = (i + 0.5) * Math.PI / n;
        let x = Math.cos(angle) * sz * (10);
        let y = Math.sin(angle) * sz * (10);
        let doge = new DOGE(x, y, 0);
        doge.dying = () => {
            dialog(`${--n} enemies left`,null,'assets/doge.png');
            if(n === 0){
              this.drawables.push(portal);
              this.colliders.push(portal);
            }
        };
        enemies.push(doge);
    }

    let bricks = (() => {
        let result = [];
        for (let y = -0.4; y <= 0.4; y += sz * 2)
            result.push(new Brick(-sz * 16, y, 0.0));
        for (let y = -0.4; y <= 0.4; y += sz * 2)
            result.push(new Brick(sz * 16, y, 0.0));
        for (let x = -sz * 16; x < sz * 16; x += sz * 2)
            result.push(new Brick(x, -0.4, 0.0));
        for (let x = -sz * 16; x <= sz * 16; x += sz * 2)
            result.push(new Brick(x, 0.4, 0.0));
        return result;
    })();

    this.drawables=[...enemies, ...bricks];
    this.colliders=[...enemies, ...bricks];
    this.movers=[...enemies];
    this.enemies=[...enemies];
}

function Level12() {
    Object.assign(this, initLevel());
    protagonist.defaultEffect = 5;
    framebuffer.option = 5;

    dialogBlocking(`"Grump put me in charge."`, () => {
        dialogBlocking(`"I am in charge of killing you!"`,null,'assets/doge.png');
    },'assets/doge.png');

    let portal = new Portal(0.0, -32 * sz, 0.0);
    portal.onCollision = () => {
        controlsEnabled = false;
        protagonist.animation = "blink";
        dialogBlocking("YOU FOUND THE EXIT",
            () => {
                protagonist.animation = "idle";
                level = new Level13();
            },'assets/portal.png');
        portal.onCollision = () => { };
    };

    let bricks = (() => {
        let result = [];
        for (let y = -18; y <= 18; y += 36)
            for (let x = -18; x <= 18; x += 2)
                result.push(new Brick(sz * x, sz * y, 0.0));
        for (let y = -18; y <= 18; y += 2)
            for (let x = -18; x <= 18; x += 36)
                result.push(new Brick(sz * x, sz * y, 0.0));
        return result;
    })();

    let otherBricks = (() => {
        let result = [];
        for (let y = -36; y <= -18; y += 2)
            for (let x = -18; x <= 18; x += 36)
                result.push(new Brick(sz * x, sz * y, 0.0));
        for (let x = -18; x <= 18; x += 2)
            result.push(new Brick(sz * x, sz * -36, 0.0));
        return result;
    })();

    let doge = new DOGE_Boss(0, -0.4, 0.0);

    this.colliders = [doge, ...bricks];
    this.enemies = [doge];
    this.drawables = [doge, ...bricks];
    this.movers = [doge];
    doge.dying = () => {
        this.drawables.push(portal);
        this.colliders.push(portal);
        this.colliders = this.colliders.filter(c => c.y != -18 * sz);
        this.drawables = this.drawables.filter(d => d.y != -18 * sz);
        this.colliders.push(...otherBricks);
        this.drawables.push(...otherBricks);
        protagonist.defaultEffect = 0;
        framebuffer.option = 0;
    };
}

function Level14() {
    Object.assign(this, initLevel());
    protagonist.defaultEffect = 5;
    framebuffer.option = 5;

    dialogBlocking(`"I am Grump."`, () => {
        dialogBlocking(`"I will make your nightmares great again!"`,null,'assets/grump.png');
    },'assets/grump.png');

    let portal = new Portal(0.0, -32 * sz, 0.0);
    portal.onCollision = () => {
        controlsEnabled = false;
        protagonist.animation = "blink";
        dialogBlocking("YOU FOUND THE EXIT",
            () => {
                protagonist.animation = "idle";
                level = new LevelEnding();
            },'assets/portal.png');
        portal.onCollision = () => { };
    };

    let bricks = (() => {
        let result = [];
        for (let y = -18; y <= 18; y += 36)
            for (let x = -18; x <= 18; x += 2)
                result.push(new Brick(sz * x, sz * y, 0.0));
        for (let y = -18; y <= 18; y += 2)
            for (let x = -18; x <= 18; x += 36)
                result.push(new Brick(sz * x, sz * y, 0.0));
        return result;
    })();

    let otherBricks = (() => {
        let result = [];
        for (let y = -36; y <= -18; y += 2)
            for (let x = -18; x <= 18; x += 36)
                result.push(new Brick(sz * x, sz * y, 0.0));
        for (let x = -18; x <= 18; x += 2)
            result.push(new Brick(sz * x, sz * -36, 0.0));
        return result;
    })();

    let eye = new Eye_Boss(0,-0.4,0);

    let grump = new Grump_Boss(0,-0.4,0);

    this.colliders = [grump, ...bricks];
    this.enemies = [grump];
    this.drawables = [grump, ...bricks];
    this.movers = [grump];

    eye.dying = () => {
        this.drawables.push(portal);
        this.colliders.push(portal);
        this.colliders = this.colliders.filter(c => c.y != -18 * sz);
        this.drawables = this.drawables.filter(d => d.y != -18 * sz);
        this.colliders.push(...otherBricks);
        this.drawables.push(...otherBricks);
        protagonist.defaultEffect = 0;
        framebuffer.option = 0;
    };

    grump.onExpire = () => {
        eye.x = grump.x;
        eye.y = grump.y;
        this.colliders.push(eye);
        this.enemies.push(eye);
        this.drawables.push(eye);
        this.movers.push(eye);
    }
}

function LevelEnding() {
    Object.assign(this, initLevel());
    audio.pause();
    audio = document.querySelector("#mom");
    let t = audio.currentTime;
    audio.currentTime = t + 6;
    audio.play();

    let portal = new Portal(0.0, -0.6, 0.0);
    portal.onCollision = () => {
        protagonist.animation = "blink";
        controlsEnabled = false;
        dialogBlocking("YOU FOUND THE EXIT",
            () => {
                protagonist.animation = "idle";
                level = new LevelCredits();
            },'assets/portal.png');
        portal.onCollision = () => { };
    };

    let selena = new Selena(0,-0.2,0,`"Thanks my love for rescuing me, Pedro. I want some latynx babies with you." (THE END)`);
    let oldonCollision = selena.onCollision.bind(selena);
    let p1 = {x:-0.5,y:-0.0};
    let p2 = {x:0.5,y:0.0};
    let p3 = {x:0,y:0.5};
    let p4 = {x:0,y:-0.5};
    let ps = [p1,p2,p3,p4];
    let randomP = () => {
        return ps[Math.floor(Math.random()*ps.length)];
    };
    let v = {x:0,y:0};
    selena.onCollision = () => {
       oldonCollision();
       let classes = [Selena, Protagonist];
       let babyType = classes[Math.floor(Math.random()*2)];
       let rp = randomP();
       let newv = {x:(rp.x + v.x)/3,y:(rp.y + v.y)/3};
       let x = newv.x;
       let y = newv.y + selena.y;
       v = newv;
       let baby = new babyType(x,y,0);
       baby.x = x;
       baby.y = y;
       baby.halfWidth = sz/3;
       baby.vertices = getVertices(sz/3);
       this.drawables.push(baby);
    };
    this.drawables = [selena, portal];
    this.colliders = [selena, portal];
}


