<template>
    <v-app id="inspire">

        <v-app-bar
        app
        clipped-right
        flat
        height="72"
        color="blue-grey darken"
        >
        <v-app-bar-nav-icon @click.stop="drawer = !drawer">
        </v-app-bar-nav-icon>
        <v-spacer >
            <div style="width:100%;text-align:center;">
                <span v-if="playingGame">
                    <b>{{currentPlayer.name}} Score: </b>
                    {{currentPlayer.score}}
                </span>
                <h3 v-else>Welcome to the "Snake" game</h3>
            </div>

        </v-spacer>

        <v-responsive max-width="156">
            <v-text-field
            dense
            flat
            hide-details
            rounded
            solo-inverted
            v-if="false"
            ></v-text-field>
        </v-responsive>
        </v-app-bar>

        <v-navigation-drawer
        v-model="drawer"
        color="blue-grey darken-3"
        mini-variant
        app

        >
        <router-link to="/">
            <v-avatar
            class="d-block text-center mx-auto mt-4"
            color="grey darken-1"
            size="36">
                <img src="woof.png" alt="Game">
            </v-avatar>
        </router-link>

        <v-divider class="mx-3 my-5"></v-divider>
        <router-link to="/about">
            <v-avatar
            class="d-block text-center mx-auto mb-9"
            color="grey lighten-1"
            size="28"
            >
                <img src="about.png" alt="Game">
            </v-avatar>
        </router-link>
        </v-navigation-drawer>

        <v-navigation-drawer
        app
        clipped
        right
        v-model="drawer"
        color="blue-grey darken-1"
        >
            <v-list>
                <v-list-item
                    v-for="player in TopPlayers"
                    :key="player.id"
                    link
                    >
                    <v-list-item-icon>
                        <v-icon
                        v-if="player.id === 1"
                        color="#FFD700"
                        >
                        mdi-crown
                        </v-icon>
                        <v-icon
                        v-else-if="player.id < 4"
                        color="#FFD700"
                        >
                        mdi-trophy
                    </v-icon>
                    <v-icon
                    v-else-if= "player.id < 101"
                    :color="player.id < 11? '#FFEE58':'#C0C0C0'"
                    >
                    mdi-medal
                    </v-icon>
                    <v-icon
                    v-else
                    color="transparent"
                    >
                    mdi-thumb-up
                    </v-icon>
                </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>
                            {{ player.name }}
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            <b>Score: {{player.score}}</b>
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-main>
            <router-view v-on:new-player="newName" @update-score="updateScore"
            @died="sendScore"/>
            <!-- place to put the game  and other things-->
        </v-main>


    </v-app>
</template>

<script>

export default {
    name: 'App',

    components: {
    },

    data() {
        return {
            drawer: null,
            currentPlayer: {
                name: "",
                score: 0
            },
            playingGame: false,
            TopPlayers: []
        };
    },
    methods:{
        async fetchTopPlayers(){
            const res = await fetch("api/TopPlayers");

            const data = await res.json();

            return data;
        },
        newName(newPlayer){
            this.currentPlayer.name = newPlayer.name;
            this.playingGame = newPlayer.playTheGame;
            this.currentPlayer.score = 0;
        },
        updateScore(score){
            this.currentPlayer.score = score;
        },
        async sendScore(){
            let playerPreviousInfo;
            let playerCurrentInfo;


            playerCurrentInfo = this.currentPlayer;

            // Search the current player in the actual list of players
            playerPreviousInfo = this.TopPlayers.find(
                (player) => player.name === playerCurrentInfo.name
            );

            if (typeof playerPreviousInfo !== "undefined" && playerPreviousInfo.score >= playerCurrentInfo.score) {
                // if the player's current score is lower than the previous one, do nothing
                return;
            }

            const res = await fetch("api/TopPlayers", {
                    method: "POST",
                    headers : {
                        "content-type": "application/json",
                    },
                    body: JSON.stringify(playerCurrentInfo)
                }
            );

            const data = await res.json();
            this.TopPlayers = data;

        }
    },
    async created(){
        this.TopPlayers = await this.fetchTopPlayers()
    }
};
</script>

<style >
main{
    background-color: #90A4AE;
}
/* width */
::-webkit-scrollbar {
  width: 0.6vw;
}

/* Track */
::-webkit-scrollbar-track {
  background: #78909C;
  border-radius: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #455A64;
  border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #263238;
}
</style>
