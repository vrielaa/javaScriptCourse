const startBtn = document.getElementById('start-btn');
const canvas = document.getElementById('canvas');
const startScreen = document.querySelector(".start-screen");
const checkpointScreen = document.querySelector(".checkpoint-screen");

const checkpointMessage = document.querySelector('.checkpoint-screen > p');

const ctx = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;
const gravity = 0.5;
let isCheckpointCollisionDetectionActive = true;  // if its true, the player can move, if false, the player can't move - it means the player has reached the checkpoint so detecting collisions is not necessary anymore

const proportionalSize = (size) => {
    return innerHeight < 500 ? Math.ceil((size/500) * innerHeight) : size;
}

class Player{
    constructor(){
        this.position = {
            x:proportionalSize(10),
            y:proportionalSize(400)
        }

        this.velocity = {
            x:0,
            y:0
        }

        this.width = proportionalSize(40);
        this.height = proportionalSize(40);
    }

    draw(){
        ctx.fillStyle = "#99c9ff";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    update(){
        this.draw()
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        if(this.position.y + this.height + this.velocity.y  <= canvas.height){// if the player is above the ground
            if(this.position.y < 0){ // if the player is above the canvas (y = 0 is the top of the canvas)
                this.position.y = 0;
                this.velocity.y = gravity;
            }
            this.velocity.y += gravity;
        }else { // if the player is on the ground
            this.velocity.y = 0;
        }
        if(this.position.x < this.width){ // if the player is going out of the canvas on the left side
            this.position.x = this.width; // stop the player at the left edge (x = 0, width is the width of the player)
        }
        if(this.position.x >= canvas.width - this.width *2){ // if the player is going out of the canvas on the right side (canvas.width - this.width*2: canvas.width - this.width would be enough but this way we make sure the player will not touch the edge)
        }
    }


}

const player = new Player();

const animate = () => {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.update();
    if (keys.rightKey.pressed && player.position.x < proportionalSize(400)) {
        player.velocity.x = 5;
    } else if(keys.leftKey.pressed && player.position.x > proportionalSize(100)) {
        player.velocity.x = -5;

    }else {
        player.velocity.x=0;
    }
}

const movePlayer = (key,xVelocity,isPressed)=>{
 if(!isCheckpointCollisionDetectionActive){// if the player has reached the checkpoint, we disable the movement
     this.player.velocity.x = 0;
     this.player.velocity.y = 0;
     return;
 }

 switch (key){
     case "ArrowLeft":
            keys.leftKey.pressed = isPressed;
            if(xVelocity === 0 ){
                player.velocity.x = xVelocity;
            }
            player.velocity.x-=xVelocity;
            break;
     case "ArrowUp":
     case " ":
     case"Spacebar":
         player.velocity.y -= 8;// why -8? because the y axis is inverted in canvas (the top is 0 and the bottom is the height of the canvas)
         break;
        case "ArrowRight":
            keys.rightKey.pressed = isPressed;
            if(xVelocity === 0 ){
                player.velocity.x = xVelocity;
            }
            player.velocity.x+=xVelocity;
            break;

 }
}
const keys = {
    rightKey: {pressed: false},
    leftKey: {pressed: false}
}
const startGame = () => {
    canvas.style.display = "block";
    startScreen.style.display = "none";
    animate();
}

startBtn.addEventListener('click', startGame);
window.addEventListener('keydown', ({key}) => {
    movePlayer(key,8,true);
    })

window.addEventListener('keyup',({key}) => {
    movePlayer(key,0,false);
});

class Platform{
    constructor(x,y) {
        this.position = {
            x,
            y
        }
        this.width=200;
        this.height = proportionalSize(40);


    }
    draw(){

    }
}