import Phaser from "phaser";
import GameScene from "./scene/gamescene";

function launch(containerId) {
    let game;
    game =  new Phaser.Game({
        type : Phaser.Auto,
        parent: containerId,
        width: 800,
        height: 608,
        scene: new GameScene(containerId),
        scale: {
            mode: Phaser.Scale.FIT,
        },
        physics: {
            default: "arcade",
            arcade : {
                gravity: { y : 0}
            }
        },
    });
    return game;
}

export default launch;
export { launch }
