import Phaser from "phaser"


export default class Diamond extends Phaser.GameObjects.Image {
    constructor (scene, x, y) {
        // initialize the image
        super(scene, x * 32 , y * 32 , 'diamond')
        this.setOrigin(0);
        // set the color of the diamond
        this.setTint(0x00ff00);
        // this propierty would be usefull later
        this.color = "green";
        // number of times the diamond was taken
        this.total = 0;
        // add the diamond to the current scene
        scene.children.add(this);
    }
    take(){
        // decide whether the next diamond will be red  or  green
        if (Math.random() > 0.9) {
            this.color = "red"
            this.setTint(0xff0000);
        } else{
            this.color = "green"
            this.setTint(0x00ff00);
        }
        // count the previous diamond
        this.total++;
    }
}
