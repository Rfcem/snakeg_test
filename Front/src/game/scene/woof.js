import Phaser from "phaser"

export default class Woof {
    constructor(scene, x, y) {
        // define the woof's  head position
        this.headPosition = new Phaser.Geom.Point(x, y);
        // define the woof's body
        this.body = scene.physics.add.group();

        // add a sprite to Woof's head
        this.head = this.body.create(x * 32, y * 32, 'woofHead');
        this.head.setOrigin(0);
        // bring Woof to live
        this.alive = true;
        // this speed is in frames/move
        this.speed = 100;
        // to decide whether move or not
        this.moveTime = 0;
        // at the start the head and the tail will be at the same position
        this.tail = new Phaser.Geom.Point(x, y);

        // To decide the new direction
        this.heading = "right";
        // To store the current direction
        this.direction = "right";
    }
    // decide whether move or not
    update(time){
        if (time >= this.moveTime)
        {
            return this.move(time);
        }
    }

    //the functions shown bellow are for setting the Woof's direction
    faceLeft(){
        if (this.direction === "up" || this.direction === "down")
        {
            this.heading = "left";
        }
    }

    faceRight(){
        if (this.direction === "up" || this.direction === "down")
        {
            this.heading = "right";
        }
    }

    faceUp(){
        if (this.direction === "left" || this.direction === "right")
        {
            this.heading = "up";
        }
    }

    faceDown(){
        if (this.direction === "left" || this.direction === "right")
        {
            this.heading = "down";
        }
    }

    // this function is to make a move
    move(time)
    {
        /**
        * Based on the heading property (which is the direction the group pressed)
        * we update the headPosition value accordingly, and change the animation.
        *
        * The Math.wrap call allow the snake to wrap around the screen, so when
        * it goes off any of the sides it re-appears on the other.
        */
        switch (this.heading)
        {
            case "left":
                this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x - 1, 0, 25);
                this.head.anims.play("left", true);
                break;

            case "right":
                this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x + 1, 0, 25);
                this.head.anims.play("right", true);
                break;

            case "up":
                this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y - 1, 0, 19);
                this.head.anims.play("up", true);
                break;

            case "down":
                this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y + 1, 0, 19);
                this.head.anims.play("down", true);
                break;
        }
        // set the new direction
        this.direction = this.heading;

        //  Update the body segments and place the last coordinate into this.tail
        Phaser.Actions.ShiftPosition(this.body.getChildren(), this.headPosition.x * 32, this.headPosition.y * 32, 1, this.tail);

        //  Check to see if any of the body pieces have the same x/y as the head
        //  If they do, the head ran into the body

        let hitBody = Phaser.Actions.GetFirst(this.body.getChildren(), { x: this.head.x, y: this.head.y }, 1);

        if (hitBody)
        {
            console.log('dead');

            this.alive = false;

            return false;
        }
        else
        {
            //  Update the timer ready for the next movement
            this.moveTime = time + this.speed;

            return true;
        }
    }
    grow(){
        let newPart = this.body.create(this.tail.x, this.tail.y, 'body');

        newPart.setOrigin(0);
    }
    decrease() {
        let body_length = this.body.getLength();
        if (body_length <= 2 ){
            this.alive = false;
        } else {
            this.body.getChildren()[body_length - 1].destroy();
            this.body.getChildren()[body_length - 2].destroy();
        }
    }
    takeADiamond(diamond)
    {
        if (this.head.x === diamond.x && this.head.y === diamond.y)
        {
            if (diamond.color === "green") {
                this.grow();
            } else{
                this.decrease();
            }


            diamond.take();

            //  For every 5 diamonds taken  we'll increase woof's speed a little
            if (this.speed > 20 && diamond.total % 5 === 0)
            {
                this.speed -= 5;
            }
            return true;
        }
        else
        {
            return false;
        }
    }

    // To "add" a new diamond we'll need to check the avaible positions
    updateGrid(grid){
        //  Remove all body pieces from valid positions list
        this.body.children.each(function (segment) {

            // we set the position in the grid dividing the position(on the scens) by the width and the heigth of the sprite
            var bx = segment.x / 32;
            var by = segment.y / 32;

            grid[by][bx] = false;

        });

        return grid;
    }
}
