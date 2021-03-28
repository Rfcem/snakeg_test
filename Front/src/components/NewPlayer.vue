<template lang="html">
    <div class="NewPlayerContainer">
        <v-card
        color="#385F73"
        dark
        img="time.jpg"
        :loading="loadGame"
        loader-height=10
        >
            <v-card-title class="headline" >
                <div style="text-align: center;width:100%;">
                     {{message.text}}
                </div>
            </v-card-title>

            <v-card-subtitle>
                <div style="max-width: 50vw;margin: 0.5% 20%; padding:2%;">
                    <v-text-field
                    v-model="message.name"
                    @keyup.enter="startGame"
                    v-on:click:append="startGame"
                    dense
                    hide-details
                    rounded
                    solo-inverted
                    single-line
                    append-icon="mdi-controller-classic"
                    :disabled="loadGame"
                    dark
                    placeholder="Tell me your name"
                    ></v-text-field>
                </div>
            </v-card-subtitle>

            <v-card-actions>

                <div style="text-align: center;width:100%">
                    <v-btn elevation="6" text @click="startGame" :disabled="loadGame" >
                        {{message.btn}}
                    </v-btn>
                </div>

            </v-card-actions>
        </v-card>
        <v-snackbar
        v-model="snackbar"
        timeout=2500
        absolute
        left
        shaped
        top
        >
         I need your name!
        </v-snackbar>
    </div>

</template>

<script>
export default {
    name: "NewPlayer",
    data(){
        return {
            snackbar: false
        }
    },
    props: {
        loadGame:{
            type: Boolean,
            default: false,
        },
        message: Object
    },
    methods:{
        startGame(e){

            if(!this.message.name){
                this.snackbar = true
                return;
            };
            const newPlayer = {
                name: this.message.name,
                playTheGame: true
            };
            this.$emit("start-game", newPlayer)
        }
    }
}
</script>

<style lang="css" scoped>
.NewPlayerContainer {
    max-width: 100vw;
    margin: 24vh;
    padding: 30px;

}
@media screen and (max-width:600px) {
    .NewPlayerContainer {
        max-width: 100vw;
        margin: 24vh auto;
        padding: 30px auto;

    }
}
</style>
