import Phaser from "phaser"
import Diamond from "./diamond"
import Woof from "./woof"

export default class GameScene extends Phaser.Scene{
    constructor(containerId) {
       super();
       this.score = 0;
       this.containerId = containerId;
   }

   preload() {
       this.load.image("floor", "floor.jpg");
       this.load.image("diamond", "diamond.png");
       this.load.image("body", "body.png")
       this.load.spritesheet("woofHead", "woof2.png",
           {frameWidth: 32, frameHeight: 32}
       );
       this.load.image("bomb", "bomb.png");
   }

   create() {
       // Add the background
       this.add.image(400, 300, "floor").setScale(0.5,0.7);
       // Add the diamond woof and create the threat(bomb) group
       this.diamond = new Diamond(this, 3, 4);
       this.woof = new Woof(this, 8, 8);
       this.bombs = this.physics.add.group();
       this.physics.add.collider(this.woof.head, this.bombs, this.hitBomb, null, this);

       // Add the animatons of woof
       this.anims.create({
           key: "left",
           frames: this.anims.generateFrameNumbers("woofHead",
               {start: 0, end: 1}
           ),
           frameRate: 10,
           repeat : -1
       });
       this.anims.create({
           key: "right",
           frames: this.anims.generateFrameNumbers("woofHead",
               {start: 2, end: 3}
           ),
           frameRate: 10,
           repeat : -1
       });
       this.anims.create({
           key: "down",
           frames: this.anims.generateFrameNumbers("woofHead",
               {start: 4, end: 5}
           ),
           frameRate: 10,
           repeat : -1
       });
       this.anims.create({
           key: "up",
           frames: this.anims.generateFrameNumbers("woofHead",
               {start: 6, end: 7}
           ),
           frameRate: 10,
           repeat : -1
       });

       // Create our keyboard controls
       this.cursors = this.input.keyboard.createCursorKeys();
   }

   update(time){

       // End the game when Woof is dead
       if (!this.woof.alive)
       {
           this.physics.pause();
           // Create an evet to send the last score to the UI
           const event = new Event('dead');
           event.score = this.score
           const cb = document.getElementById(this.containerId);
           cb.dispatchEvent(event);

           return;
       }

       /**
       * Check which key is pressed, and then change the woof's direction
       * is heading based on that. The checks ensure you don't double-back
       * on yourself, for example if you're moving to the right and you press
       * the LEFT cursor, it ignores it, because the only valid directions you
       * can move in at that time is up and down.
       */
       if (this.cursors.left.isDown)
       {
           this.woof.faceLeft();
       }
       else if (this.cursors.right.isDown)
       {
           this.woof.faceRight();
       }
       else if (this.cursors.up.isDown)
       {
           this.woof.faceUp();
       }
       else if (this.cursors.down.isDown)
       {
           this.woof.faceDown();
       }

       if (this.woof.update(time))
       {
           //  If the woof updated, we need to check for collision against diamond

           if (this.woof.takeADiamond(this.diamond))
           {
               if (this.diamond.color === "green"){
                   this.score += 10 + 3 * this.bombs.getLength();
               }else{

                   this.score += 20 + 4 * this.bombs.getLength();
               }
               // create an event to update the player's score
                const event = new Event('take');
                event.score = this.score
                const cb = document.getElementById(this.containerId);
                cb.dispatchEvent(event);

               placeANewDiamond(this.woof, this.diamond);

               // Checks if the number of diamonds taken is divisible by 10
               // if so, place a new bomb.
               if (this.diamond.total %10 === 0) {
                   let x = ( this.woof.head.x <400 )? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
                   let bomb = this.bombs.create(x, 16, "bomb");
                   bomb.setBounce(1);
                   bomb.setCollideWorldBounds(true);
                   bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
               }
           }

       }
    }

    hitBomb(head, bomb) {
        head.setTint(0xff0000);
        this.woof.alive = false;
        this.physics.pause();

    }

}

/*
* We can place the diamond anywhere in our 25x19 grid
* *except* on woof's space, so we need
* to filter those out of the possible diamond locations.
* If there aren't any locations left, they've won!
*
*/
function placeANewDiamond( woof, diamond) {
    //  First create an array that assumes all positions
    //  are valid for the new diamond

    //  A Grid we'll use to reposition the diamond each time it's taken
    var testGrid = [];

    for (var y = 0; y < 19; y++)
    {
        testGrid[y] = [];

        for (var x = 0; x < 25; x++)
        {
            testGrid[y][x] = true;
        }
    }

    woof.updateGrid(testGrid);

    //  Purge out false positions
    var validLocations = [];

    for (var y = 0; y < 19; y++)
    {
        for (var x = 0; x < 25; x++)
        {
            if (testGrid[y][x] === true)
            {
                //  Is this position valid for a diamond? If so, add it here ...
                validLocations.push({ x: x, y: y });
            }
        }
    }

    if (validLocations.length > 0)
    {
        //  Use the RNG to pick a random diamond position
        var pos = Phaser.Math.RND.pick(validLocations);

        //  And place it
        diamond.setPosition(pos.x * 32, pos.y * 32);

        return true;
    }
    else
    {
        return false;
    }
}
