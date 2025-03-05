
// Drawable Tile Class
class Drawable {
    constructor(_textures, vertices, x = 0, y = 0, z = 0) { //WebglTexturesIndices, VerticesArray (x,y,z,u,v), x, y, z)
        this.textureIndices = _textures;
        this.textures = _textures.map((i) => textures[i]);
        this.textureIndex = 0; // index to active texture
        this.vertices = vertices;
        this.positionOffset = [0, 0, 0];
        this.textureOffset = [0, 0];
        this.animations = {
            "idle":
            {
                "timePerFrame": 0, // time between animation frames
                "counter": 0,      // time counter for time left until next texture is displayed
                "textureIndices": [0], // texture indices in order of appearance in the animation
                "indexPointer": 0, // current index of textureIndices
            },
        };
        this.animation = "idle"; //current animation name
        this.x = x;
        this.y = y;
        this.z = z;
        this.collisionAction = () => { };
        this.colorModifier = [1.0,1.0,1.0,1.0];
    }
    draw(dt) { // delta time from previous render
        gl.useProgram(program);
        ////////////
        gl.uniform1f(program.aspectRatioLocation, canvas.width / canvas.height);
        gl.uniform1f(program.zoomFactorLocation, zoomFactor);
        gl.uniform4f(program.colorModifierLocation, ...this.colorModifier);
        ////////////
        gl.bindBuffer(gl.ARRAY_BUFFER, program.positionBuffer);
        gl.vertexAttribPointer(program.positionLocation, 3, gl.FLOAT, false, 5 * 4, 0);
        gl.enableVertexAttribArray(program.positionLocation);
        gl.vertexAttribPointer(program.texCoordLocation, 2, gl.FLOAT, false, 5 * 4, 3 * 4);
        gl.enableVertexAttribArray(program.texCoordLocation);
        //////////
        gl.uniform2f(program.textureOffsetLocation, ...this.textureOffset);
        gl.uniform3f(program.positionOffsetLocation,
           this.x + this.positionOffset[0],
           this.y + this.positionOffset[1],
           this.z + this.positionOffset[2]
        );
        let animation = this.animations[this.animation];
        this.textureIndex = animation.textureIndices[animation.indexPointer];
        gl.bindTexture(gl.TEXTURE_2D, this.textures[this.textureIndex]);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        animation.counter -= dt;
        if (animation.counter < 0) {
            animation.counter = animation.timePerFrame;
            animation.indexPointer++;
            animation.indexPointer %= animation.textureIndices.length;
        }
        this.colorModifier = [1,1,1,1];
    }
};

class Line {
    constructor(vertices) {
        this.vertices = vertices;  //x,y,z,r,g,b,a
    }
    draw(dt) { // delta time from previous render
        gl.useProgram(program2);
        gl.uniform1f(program2.aspectRatioLocation, canvas.width / canvas.height);
        gl.uniform1f(program2.zoomFactorLocation, zoomFactor);
        ////////////
        gl.bindBuffer(gl.ARRAY_BUFFER, program2.positionBuffer);
        gl.vertexAttribPointer(program2.positionLocation, 3, gl.FLOAT, false, 7 * 4, 0);
        gl.enableVertexAttribArray(program2.positionLocation);
        gl.vertexAttribPointer(program2.colorLocation, 4, gl.FLOAT, false, 7 * 4, 3 * 4);
        gl.enableVertexAttribArray(program2.colorLocation);
        //////////
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);
        gl.drawArrays(gl.LINES, 0, this.vertices.length / 7);
    }
};

// Mixin
const Collider = {
    halfWidth: 0,
    x: 0,
    y: 0,
    isColliding: function (x2, y2, halfWidth2) {// other object's values
        let x1 = this.x;
        let y1 = this.y;
        let halfWidth1 = this.halfWidth;
        const horizontalOverlap = Math.abs(x1 - x2) < (halfWidth1 + halfWidth2);
        const verticalOverlap = Math.abs(y1 - y2) < (halfWidth1 + halfWidth2);
        return horizontalOverlap && verticalOverlap;
    },
    collisionAction: function () { } // to override; callback called when collision happens
};

// Mixin
const Doomed = {
    lifetime: 2000,
    expired: false,
    expire: function (dt) {
        this.lifetime -= dt;
        if (this.lifetime < 0) {
            this.expired = true;
            this.expiring(dt);
        }
    },
    expiring: function (dt){
        //override this callback, is called when object's lifetime expires
    },
}

// Mixin
const Mover = {
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    move: function (dt) {
        if (this.dead) return;
        this.x += this.dx;
        this.y += this.dy;
        this.updateDxy();
    },
    updateDxy: function (dt) { // to override
        //this.dx = ...;
        //this.dy = ...;
    },
};

class Puzzle {
    constructor(textureId,x,y,z){
    this.sw1 = new Switch(-sz*4+x,y,z);
    this.sw2 = new Switch(sz*4+x,y,z);
    this.sw3 = new Switch(x,sz*4+y,z);
    this.sw4 = new Switch(x,-sz*4+y,z);

    this.sw1.swapIndices = [0,2]; //left
    this.sw2.swapIndices = [1,3]; //right
    this.sw3.swapIndices = [2,3]; //bottom
    this.sw4.swapIndices = [0,1]; //top

    this.shards = [
        new Drawable([textureId],getVertices(sz,0,0.5,2),-sz+x,-sz+y,0),
        new Drawable([textureId],getVertices(sz,0.5,0.5,2),sz+x,-sz+y,0),
        new Drawable([textureId],getVertices(sz,0,0,2),-sz+x,sz+y,0),
        new Drawable([textureId],getVertices(sz,0.5,0,2),sz+x,sz+y,0),
    ];

    this.shards.forEach((s,i)=>{s.vertices.value=i;});

    this.shards.getValues = () => {
        return JSON.stringify(this.shards.map(s=>s.vertices.value));
    };

    this.solution = this.shards.getValues();
    this.switches = [this.sw1,this.sw2,this.sw3,this.sw4];

    this.switches.forEach(s=>{
        let oldCollisionAction = s.collisionAction.bind(s);
        s.collisionAction = ()=>{
            if(!s.enabled) return;
            oldCollisionAction();
            setTimeout(()=>{s.animation = 'idle';},1000);
            let shard = this.shards[s.swapIndices[0]];
            let shard2 = this.shards[s.swapIndices[1]];
            let tempv = shard2.vertices;
            shard2.vertices = shard.vertices;
            shard.vertices = tempv;
            if(this.shards.getValues() === this.solution)
                this.onSolve();
        };
    });

    this.scramble();

    }
    scramble () {
        for(let i=0;i<10 || this.shards.getValues() === this.solution;i++){
            let shard = this.shards[Math.floor(Math.random()*4)];
            let shard2 = this.shards[Math.floor(Math.random()*4)];
            let tempv = shard2.vertices;
            shard2.vertices = shard.vertices;
            shard.vertices = tempv;
        }
    }
    onSolve () {} //override, callback when puzzle is solved.
}

class Bullet extends Drawable {
    constructor(sz, textures, vertices, x = 0, y = 0, z = 0) {
        super(textures, vertices, x, y, z);
        Object.assign(this, Mover);
        Object.assign(this, Doomed);
        Object.assign(this, Collider);
        this.halfWidth = sz;
        this.x = x;
        this.y = y;
        this.power = 1; //damage power
        this.animations.spin = {
            "timePerFrame": 100, // time between animation frames
            "counter": 0,      // time counter for time left until next texture is displayed
            "textureIndices": [0, 1, 2, 3], // texture indices in order of appearance in the animation
            "indexPointer": 0, // current index of textureIndices
        };
    }
    damage = function (enemy) {
        enemy.life -= this.power;
        if (enemy.life <= 0) enemy.dead = true;
        if (enemy.dead) enemy.lifetime = 2000;
    }
}

class Bubble extends Bullet {
    constructor(x, y, z, size = sz) {
        super(size, [27], getVertices(size), x, y, z);
    }
}

class Fixture extends Drawable {
    constructor(sz, textures, vertices, x = 0, y = 0, z = 0) {
        super(textures, vertices, x, y, z);
        Object.assign(this, Collider);
        this.halfWidth = sz;
        this.x = x;
        this.y = y;
    }
}

class Enemy extends Drawable {
    constructor(sz, textures, vertices, x = 0, y = 0, z = 0) {
        super(textures, vertices, x, y, z);
        Object.assign(this, Mover);
        Object.assign(this, Collider);
        Object.assign(this, Doomed);
        this.halfWidth = sz;
        this.x = x;
        this.y = y;
        this.life = 10;
        this.lifetime = Infinity;
        this.expiring = () => {
            let shard1 = new Drawable(
                             this.textureIndices,
                             getVertices(this.halfWidth/2, 0,0,2));
            Object.assign(shard1, Mover);
            Object.assign(shard1, Doomed);
            shard1.x = this.x - sz/2;
            shard1.y = this.y + sz/2;
            shard1.dx = -0.0003;
            shard1.dy = 0.0003;
            let shard2 = new Drawable(
                             this.textureIndices,
                             getVertices(this.halfWidth/2, 0.5,0,2));
            Object.assign(shard2, Mover);
            Object.assign(shard2, Doomed);
            shard2.x = this.x + sz/2;
            shard2.y = this.y + sz/2;
            shard2.dx = 0.0003;
            shard2.dy = 0.0003;
            let shard3 = new Drawable(
                             this.textureIndices,
                             getVertices(this.halfWidth/2, 0.5,0.5,2));
            Object.assign(shard3, Mover);
            Object.assign(shard3, Doomed);
            shard3.x = this.x + sz/2;
            shard3.y = this.y - sz/2;
            shard3.dx = 0.0003;
            shard3.dy = -0.0003;
            let shard4 = new Drawable(
                             this.textureIndices,
                             getVertices(this.halfWidth/2, 0,0.5,2));
            Object.assign(shard4, Mover);
            Object.assign(shard4, Doomed);
            shard4.x = this.x - sz/2;
            shard4.y = this.y - sz/2;
            shard4.dx = -0.0003;
            shard4.dy = -0.0003;
            let particles = ((n)=>{
                let results = [];
                for (let i = 0; i < n ; i++){
                    results.push(new BloodParticle(this.x,this.y,0));
                }
                return results;
            })(20);
            level.drawables.push(shard1,shard2,shard3,shard4,...particles);
            level.movers.push(shard1,shard2,shard3,shard4,...particles);
        };
    }
    dying = function () { } // override
}

class Particle extends Drawable {
    constructor(textures, x, y) {
        const sz = 0.004;
        const vertices = new Float32Array([
            -sz, sz, 0.0, 0.0, 1.0,
            -sz, -sz, 0.0, 0.0, 0.0,
            sz, sz, 0.0, 1.0, 1.0,
            -sz, -sz, 0.0, 0.0, 0.0,
            sz, sz, 0.0, 1.0, 1.0,
            sz, -sz, 0.0, 1.0, 0.0,
        ]);
        super(textures, vertices, x, y);
        Object.assign(this, Mover);
        Object.assign(this, Doomed);
        this.x = x;
        this.y = y;
        this.dx = (Math.random() - 0.5) / 400;
        this.dy = (Math.random() - 0.5) / 400;
        this.lifetime = 1000;
    }
}

class BloodParticle extends Particle {
    constructor(x, y) {
        super([20, 21], x, y);
        this.animations.blink = {
            "timePerFrame": 40,
            "counter": 0,
            "textureIndices": [0, 1],
            "indexPointer": 0,
        };
        this.animation = 'blink';
    }
}

class Leaf extends Drawable {
    constructor(x, y) {
        super([24], tileVertices, x, y);
        Object.assign(this, Collider);
        Object.assign(this, Doomed);
        this.halfWidth = sz;
        this.x = x;
        this.y = y;
        this.lifetime = Infinity;
        this.collisionAction = () => {
            if (!collectables['leaf']) collectables['leaf'] = 1;
            else collectables['leaf'] += 1;
            dialog(`YOU FOUND A LEAF [${collectables['leaf']}]`);
            this.lifetime = 0;
            this.collisionAction = () => { };
        };
    }
};

class Brick extends Fixture {
    constructor(x, y, z) {
        super(sz, [3], tileVertices, x, y, z);
    }
}

class Switch extends Fixture {
    constructor(x, y, z) {
        super(sz, [37,38,39], tileVertices, x, y, z);
        this.animations.rotate = {
            "timePerFrame": 20,
            "counter": 0,
            "textureIndices": [0, 1, 2],
            "indexPointer": 0,
        };
        this.enabled = true;
        this.collisionAction = () => {
          //toggle
          if(this.enabled){
            this.animation = this.animation==='idle'?'rotate':'idle';
            this.enabled = false;
            setTimeout(()=>{this.enabled = true;}, 1000);
          }
        }
    }
    isActivated (){return this.animation === 'rotate';}
}

class Portal extends Fixture {
    constructor(x, y, z) {
        super(sz, [7, 8, 9, 10, 11, 12], tileVertices, x, y, z);
        this.animations.idle = {
            "timePerFrame": 20,
            "counter": 0,
            "textureIndices": [0, 1, 2, 3, 4, 5],
            "indexPointer": 0,
        };
    }
}

class Chest extends Fixture {
    constructor(x, y, z) {
        super(sz, [6, 17], tileVertices, x, y, z);
    }
    open() {
        this.animations.idle.textureIndices = [1];
        this.collisionAction = () => { };
    }
}

class DEA extends Enemy {
    constructor(x, y, z) {
        super(sz, [18, 19], tileVertices, x, y, z);
        this.collisionAction = () => {
            die();
            dialog("YOU WERE CAUGHT BY THE D.E.A.");
        };
        this.animations.walking = {
            "timePerFrame": 200,
            "counter": 0,
            "textureIndices": [0, 1],
            "indexPointer": 0,
        };
        this.animation = 'walking';
        this.life = 15;
    }
}

class DEA_Boss extends Enemy {
    constructor(x, y, z) {
        super(boss_sz, [18, 19], bossVertices, x, y, z);
        this.collisionAction = () => {
            die();
            dialog("YOU WERE CAUGHT BY THE D.E.A.");
        };
        this.animations.walking = {
            "timePerFrame": 200,
            "counter": 0,
            "textureIndices": [0, 1],
            "indexPointer": 0,
        };
        this.animation = 'walking';
        this.life = 3000;
    }
};

class Grump_Boss extends Enemy {
    constructor(x, y, z) {
        super(boss_sz, [30,31], bossVertices, x, y, z);
        this.collisionAction = () => {
            die();
            dialog("YOU WERE CAUGHT BY GRUMP");
        };
        this.animations.walking = {
            "timePerFrame": 200,
            "counter": 0,
            "textureIndices": [0, 1],
            "indexPointer": 0,
        };
        this.animation = 'walking';
        this.life = 5000;
    }
};

class Eye_Boss extends Enemy {
    constructor(x, y, z) {
        super(boss_sz, [34,35,36], bossVertices, x, y, z);
        this.collisionAction = () => {
            die();
            dialog("YOU WERE CAUGHT BY THE EVIL EYE");
        };
        this.animations.walking = {
            "timePerFrame": 200,
            "counter": 0,
            "textureIndices": [0, 1],
            "indexPointer": 0,
        };
        this.animation = 'walking';
        this.life = 5000;
    }
};

class ICE extends Enemy {
    constructor(x, y, z) {
        super(sz, [25, 26], tileVertices, x, y, z);
        this.collisionAction = () => {
            die();
            dialog("YOU WERE CAUGHT BY I.C.E.");
        };
        this.animations.walking = {
            "timePerFrame": 200,
            "counter": 0,
            "textureIndices": [0, 1],
            "indexPointer": 0,
        };
        this.animation = 'walking';
        this.life = 50;
    }
};

class ICE_Boss extends Enemy {
    constructor(x, y, z) {
        super(boss_sz, [25, 26], bossVertices, x, y, z);
        this.collisionAction = () => {
            die();
            dialog("YOU WERE CAUGHT BY I.C.E.");
        };
        this.animations.walking = {
            "timePerFrame": 200,
            "counter": 0,
            "textureIndices": [0, 1],
            "indexPointer": 0,
        };
        this.animation = 'walking';
        this.life = 4500;
    }
};

class DOGE extends Enemy {
    constructor(x, y, z) {
        super(sz, [28, 29], tileVertices, x, y, z);
        this.collisionAction = () => {
            die();
            dialog("YOU WERE CAUGHT BY D.O.G.E.");
        };
        this.animations.walking = {
            "timePerFrame": 200,
            "counter": 0,
            "textureIndices": [0, 1],
            "indexPointer": 0,
        };
        this.animation = 'walking';
        this.life = 60;
    }
};


class DOGE_Boss extends Enemy {
    constructor(x, y, z) {
        super(boss_sz, [28, 29], bossVertices, x, y, z);
        this.collisionAction = () => {
            die();
            dialog("YOU WERE CAUGHT BY D.O.G.E.");
        };
        this.animations.walking = {
            "timePerFrame": 200,
            "counter": 0,
            "textureIndices": [0, 1],
            "indexPointer": 0,
        };
        this.animation = 'walking';
        this.life = 5000;
    }
};

class Protagonist extends Drawable {
    constructor() {
        super([1, 2, 21], tileVertices, 0, 0, 0);
        this.animations.walking = {
            "timePerFrame": 200,
            "counter": 0,
            "textureIndices": [0, 1],
            "indexPointer": 0,
        };
        this.animations.attack = {
            "timePerFrame": 0,
            "counter": 0,
            "textureIndices": [0],
            "indexPointer": 0,
        };
        this.animations.blink = {
            "timePerFrame": 20,
            "counter": 0,
            "textureIndices": [0, 2],
            "indexPointer": 0,
        };
        this.weapon = null;
        this.ammoType = null;
        this.speed = 1;
        this.strength = 1;
        this.dx = 0;
        this.dy = 0;
        let bullets = [];
    }
    attack(dx, dy) {
        if (!this.weapon) return;
        if (!this.ammoType) return;
        let shoot = (offX,offY) => {
          let bullet = new Bullet(sz, [13, 14, 15, 16], tileVertices, 0.0, 0.0, 0.0);
          bullet.dx = dx;
          bullet.dy = dy;
          bullet.x = -worldOffsetX + offX;
          bullet.y = -worldOffsetY + offY;
          bullet.lifetime = 2000;
          bullet.power = this.strength;
          bullet.collisionAction = () => { };
          bullet.animation = "spin";
          bullets.push(bullet);

          let line = new Line(new Float32Array([
            worldOffsetX + bullet.x,-worldOffsetY - bullet.y,0, 1,0,1,0,
            worldOffsetX + bullet.x,-worldOffsetY - bullet.y,0, 1,1,0,1,
          ]));
          line.origin = {};
          line.origin.x = bullet.x;
          line.origin.y = bullet.y;

          Object.assign(line, Mover);
          Object.assign(line, Doomed);
          line.updateDxy = (dt) => {
              line.vertices[0] = worldOffsetX + line.origin.x;
              line.vertices[1] = -worldOffsetY - line.origin.y;
              line.vertices[7] = worldOffsetX + bullet.x;
              line.vertices[8] = -worldOffsetY - bullet.y;
          };
          line.lifetime = 2000;
          level.drawables.push(line);
          level.movers.push(line);
        }
        if(this.weapon==="gun") shoot(0,0);
        if(this.weapon==="double"){
          let angle = Math.atan2(dy,dx);
          let x1 = Math.cos(angle + Math.PI/2) * sz;
          let y1 = Math.sin(angle + Math.PI/2) * sz;
          shoot(x1,y1);
          let x2 = Math.cos(angle - Math.PI/2) * sz;
          let y2 = Math.sin(angle - Math.PI/2) * sz;
          shoot(x2,y2);
        }
    }
    getPosition() {
        return { x: -worldOffsetX, y: -worldOffsetY };
    }
};

class NPC extends Fixture {
    constructor(x, y, z, text) {
        super(sz, [22, 23], tileVertices, x, y, z);
        this.text = text;
        this.collisionAction = function () {
            dialog(this.text);
        }
    }
};

class Selena extends Fixture {
    constructor(x, y, z, text) {
        super(sz, [32, 33], tileVertices, x, y, z);
        this.text = text;
        this.collisionAction = function () {
            dialog(this.text);
        }
    }
};
