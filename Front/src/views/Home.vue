<template>
  <div @take="updateScore" @dead="died" :id="containerId" class="GameConatiner" style="background-image:url(night.jpg);">

    <NewPlayer v-bind:loadGame="!downloaded && playingGame" v-if="(!playingGame || !downloaded)" v-on:start-game="playGame" :message="playMessage"></NewPlayer>

  </div>
</template>

<script>
// @ is an alias to /src
import NewPlayer from '@/components/NewPlayer.vue'

export default {
  name: 'Home',
  data(){
      return {
          containerId: 'game-container',
          playingGame: false,
          playerScore: 0,
          gameInstance: null,
          downloaded: false,
          playMessage: {
              text: "Want to play?",
              btn: "Play Now",
              name: ""
          },
          playerName: ""
      }
  },
  components: {
      NewPlayer
  },
  methods:{
      async playGame(newPlayer){
          this.playingGame = newPlayer.playTheGame;
          this.playerName = newPlayer.name;
          const game = await import('../game/game');
          this.downloaded = true;
          this.$nextTick(() => {
              this.gameInstance = game.launch(this.containerId);
          });
          this.$emit("new-player", newPlayer);
      },
      updateScore(e){
          this.playerScore = e.score;
          this.$emit("update-score", e.score);
      },
      died(e){
          this.playMessage = {
              text: "You died",
              btn: "Play Again",
              name: this.playerName
          };
          this.playingGame = false;
          this.gameInstance.destroy(true);
          this.gameInstance = null;
          this.$emit("died")

      }
  }
}
</script>

<style>
.GameConatiner{
    width: 100%;
    float: left;
    height: 89vh;
}
canvas{
    max-height: 88vh;
    width: 100%!important;
    padding-top: 0.5vh;
}
</style>
