window.requestAnimationFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (f) {
        return setTimeout(f, 1000 / 60)
    }

let keysDown = {};
let gameOver = false;
let gameWon = false;

addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
}, false);

class Game {

    constructor(myShip) {
        this.canvas = document.getElementById("myCanvas");
        this.ctx = this.canvas.getContext("2d");
        this.sprites = [];

        this.bgReady = false;
        this.bgImage = new Image();
        this.bgImage.onload = () => {
            this.bgReady = true;
        };

        this.bgImage.src = '/images/space-image.jpg';
        this.width = this.canvas.width;
        this.height = 3464;
        this.bgY = 0;
        this.myShip = myShip;
    }

    update() {
        let lSpritesLength = this.sprites.length;
        let canvas = this.canvas;
        for (let i = 0; i < lSpritesLength; i++)
            this.sprites[i].update(canvas);

        this.bgY += 0.25;

        if (this.bgY * 2 == this.height)
            this.bgY *= -1;
    }

    addSprites(pSprites) {
        this.sprites.push(pSprites);
    }

    draw(ctx) {
        this.myShip = myShip;
        if (this.bgReady) {
            this.ctx.beginPath();
            this.ctx.drawImage(this.bgImage, 0, this.bgY);
            this.ctx.drawImage(this.bgImage, 0, this.bgY - this.height);
        }
        let lSpritesLength = this.sprites.length;
        for (let i = 0; i < lSpritesLength; i++)
            this.sprites[i].draw(this.ctx);

        this.drawScore(this.myShip.score);

        this.drawHealth(this.myShip.health);
    }

    drawScore() {
        this.ctx.fillStyle = "rgb(250, 250, 250)";
        this.ctx.font = "24px Helvetica";
        this.ctx.textAlign = "left";
        this.ctx.textBaseline = "top";
        this.ctx.fillText("Score: " + this.myShip.score, 32, 100);
    }

    drawHealth() {
        this.ctx.fillStyle = "rgb(250, 250, 250)";
        this.ctx.font = "24px Helvetica";
        this.ctx.textAlign = "left";
        this.ctx.textBaseline = "top";
        this.ctx.fillText("Health: " + this.myShip.health, 32, 64);
    }
}

class Sprite {
    constructor() {

    }

    update() {

    }

    draw(pCtx) {

    }
}

class SpaceShip extends Sprite {

    constructor(canvas, keysDown, myGame, gameWon) {
        super()
        this.canvas = canvas;
        this.myGame = myGame;
        this.shipImage = new Image();
        this.shipReady = false;
        this.shipImage.onload = () => {
            this.shipReady = true;
        };

        this.shipImage.src = "/images/space-ship.png";
        this.keys = keysDown;
        this.width = 64;
        this.height = 64;
        this.sX = (this.canvas.width - this.width) / 2;
        this.sY = this.canvas.height - 100;
        this.score = 0;
        this.health = 3;
        this.fire = new Audio("sounds/bullet-sound.wav");
        this.counter = 80;
        this.gameWon = gameWon;
    }

    reset() {
        this.sX = (this.canvas.width - this.width) / 2;
        this.sY = this.canvas.height - this.height;
    }

    update() {

        this.myEnemyShip = myEnemyShip;
        this.myEnemyShip2 = myEnemyShip2;
        this.myEnemyShip3 = myEnemyShip3;
        this.myShip = myShip;

        if (this.keys[87]) {
            this.sY--;
        }

        if (this.keys[83]) {
            this.sY++;
        }

        if (this.keys[68]) {
            this.sX++;
        }

        if (this.keys[65]) {
            this.sX--;
        }

        var maxX = this.canvas.width - this.width;
        var minX = 0;

        var maxY = this.canvas.height - this.height;
        var minY = 0;

        this.sX = Math.min(this.sX, maxX);
        this.sX = Math.max(this.sX, minX);

        this.sY = Math.min(this.sY, maxY);
        this.sY = Math.max(this.sY, minY);

        if (this.keys[32]) {
            this.counter++;
            if (this.counter >= 80) {
                this.myGame.addSprites(new ShipBullet(this.myShip, this.myEnemyShip, this.myEnemyShip2, this.myEnemyShip3, this.gameWon));
                this.fire.play();
                this.counter = 0;
            }
        }
    }

    draw(ctx) {
        if (this.shipReady) {
            ctx.beginPath();
            ctx.drawImage(this.shipImage, this.sX, this.sY, this.width, this.height);
        }
    }
}

class ShipBullet extends Sprite {

    constructor(myShip, myEnemyShip, myEnemyShip2, myEnemyShip3, gameWon) {
        super();
        this.myShip = myShip;
        this.myEnemyShip = myEnemyShip;
        this.myEnemyShip2 = myEnemyShip2;
        this.myEnemyShip3 = myEnemyShip3;
        this.bX = this.myShip.sX + 25;
        this.bY = this.myShip.sY + 25;

        this.bulletImage = new Image();
        this.bulletReady = false;
        this.bulletImage.onload = () => {
            this.bulletReady = true;
        };
        this.bulletImage.src = "/images/space-ship-bullet.png";
        this.width = 15;
        this.height = 30;
        this.gameWon = gameWon;
    }

    update() {
        this.bY--;

        if (this.bX > this.myEnemyShip.eX &&
            this.bX < this.myEnemyShip.eX + this.myEnemyShip.width &&
            this.bY > this.myEnemyShip.eY &&
            this.bY < this.myEnemyShip.eY + this.myEnemyShip.height) {
            this.myShip.score++;
            this.reset();
            this.myEnemyShip.reset();

            if (this.myShip.score == 20) {
                this.gameWon = true;
                alert("You Won! Press enter to continue.");
                location.reload();
            }
        }

        if (this.bX > this.myEnemyShip2.eX &&
            this.bX < this.myEnemyShip2.eX + this.myEnemyShip2.width &&
            this.bY > this.myEnemyShip2.eY &&
            this.bY < this.myEnemyShip2.eY + this.myEnemyShip2.height) {
            this.myShip.score++;
            this.reset();
            this.myEnemyShip2.reset();

            if (this.myShip.score == 20) {
                this.gameWon = true;
                alert("You Won! Press enter to continue.");
                location.reload();
            }
        }

        if (this.bX > this.myEnemyShip3.eX &&
            this.bX < this.myEnemyShip3.eX + this.myEnemyShip3.width &&
            this.bY > this.myEnemyShip3.eY &&
            this.bY < this.myEnemyShip3.eY + this.myEnemyShip3.height) {
            this.myShip.score++;
            this.reset();
            this.myEnemyShip3.reset();

            if (this.myShip.score == 20) {
                this.gameWon = true;
                alert("You Won! Press enter to continue.");
                location.reload();
            }
        }
    }

    reset() {
        this.bX = this.myShip.sX + 25;
        this.bY = this.myShip.sY + 25;
    }

    draw(ctx) {
        if (this.bulletReady) {
            ctx.beginPath();
            ctx.drawImage(this.bulletImage, this.bX, this.bY, this.width, this.height);
        }
    }
}

class EnemyShip extends Sprite {

    constructor(canvas, myShip, myGame, gameOver) {
        super()
        this.canvas = canvas;
        this.myShip = myShip;
        this.myGame = myGame;
        this.enemyImage = new Image();
        this.enemyReady = false;
        this.enemyImage.onload = () => {
            this.enemyReady = true;
        };

        this.width = 50;
        this.height = 50;
        this.enemyImage.src = "/images/enemy-ship.png";
        this.eX = Math.random() * this.canvas.width;
        this.eY = Math.random() * (this.canvas.height - 400);
        this.fire = new Audio("sounds/bullet-sound2.mp3");
        this.timer = 250;
        this.gameOver = gameOver;
    }

    reset() {
        this.eX = Math.random() * this.canvas.width;
        this.eY = Math.random() * (this.canvas.height - 400);
    }

    update() {
        this.myEnemyShip = myEnemyShip;
        this.myEnemyShip2 = myEnemyShip2;
        this.myEnemyShip3 = myEnemyShip3;

        var maxX = this.canvas.width - this.width;
        var minX = 0;

        this.eX = Math.min(this.eX, maxX);
        this.eX = Math.max(this.eX, minX);

        this.eY += 0.5;

        this.timer++;
        if (this.timer >= 250) {
            this.myGame.addSprites(new EnemyShipBullet(this.myGame.canvas, this.myShip, this.myEnemyShip, this.gameOver));
            this.myGame.addSprites(new EnemyShipBullet(this.myGame.canvas, this.myShip, this.myEnemyShip2, this.gameOver));
            this.myGame.addSprites(new EnemyShipBullet(this.myGame.canvas, this.myShip, this.myEnemyShip3, this.gameOver));
            this.fire.play();
            this.timer = 0;
        }

        if ((this.eY < this.width) || (this.eY > this.canvas.height)) {
            this.reset();
        }

        if (this.eX > this.myShip.sX &&
            this.eX < this.myShip.sX + this.myShip.width &&
            this.eY > this.myShip.sY &&
            this.eY < this.myShip.sY + this.myShip.height) {
            this.myShip.reset();
            this.myShip.health--;
            this.reset();

            if (this.myShip.health == 0) {
                this.gameOver = true;
                alert("Game Over! Press enter to continue.");
                location.reload();
            }
        }
    }

    draw(ctx) {
        if (this.enemyReady) {
            ctx.beginPath();
            ctx.drawImage(this.enemyImage, this.eX, this.eY, this.width, this.height);
        }
    }
}

class EnemyShipBullet extends Sprite {

    constructor(canvas, myShip, myEnemyShip, gameOver) {
        super();
        this.canvas = canvas;
        this.myShip = myShip;
        this.myEnemyShip = myEnemyShip;
        this.ebX = this.myEnemyShip.eX + 10;
        this.ebY = this.myEnemyShip.eY + 10;

        this.enemyBulletImage = new Image();
        this.enemyBulletReady = false;
        this.enemyBulletImage.onload = () => {
            this.enemyBulletReady = true;
        };
        this.enemyBulletImage.src = "/images/enemy-bullet.png";

        this.width = 30;
        this.height = 30;
        this.gameOver = gameOver;
    }

    update() {
        this.ebY++;

        if (this.ebX > this.myShip.sX &&
            this.ebX < this.myShip.sX + this.myShip.width &&
            this.ebY > this.myShip.sY &&
            this.ebY < this.myShip.sY + this.myShip.height) {
            this.reset();
            this.myShip.reset();
            this.myShip.health--;

            if (this.myShip.health == 0) {
                this.gameOver = true;
                alert("Game Over! Press enter to continue.");
                location.reload();
            }
        }
    }

    reset() {
        this.ebX = this.myEnemyShip.eX + 10;
        this.ebY = this.myEnemyShip.eY + 10;
    }

    draw(ctx) {
        if (this.enemyBulletReady) {
            ctx.beginPath();
            ctx.drawImage(this.enemyBulletImage, this.ebX, this.ebY, this.width, this.height);
        }
    }
}

let myGame = new Game();
let myShip = new SpaceShip(myGame.canvas, keysDown, myGame);
let myEnemyShip = new EnemyShip(myGame.canvas, myShip, myGame, gameOver);
let myEnemyShip2 = new EnemyShip(myGame.canvas, myShip, myGame, gameOver);
let myEnemyShip3 = new EnemyShip(myGame.canvas, myShip, myGame, gameOver);

myGame.addSprites(myShip);
myGame.addSprites(myEnemyShip);
myGame.addSprites(myEnemyShip2);
myGame.addSprites(myEnemyShip3);

function animate() {
    let now = Date.now();
    let delta = now - then;

    myGame.update(delta / 1000);
    myGame.draw();
    requestAnimationFrame(animate);

    then = now;
}

let then = Date.now();
animate();
