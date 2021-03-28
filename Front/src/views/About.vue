<template>
  <div class="about" >
    <v-card  dark>
        <v-card-text>
            <v-row class="mb-4"align="center">
                <strong class="title">About The Game</strong>
                <v-spacer></v-spacer>
            </v-row>

            <p>
                Woof is a game based on the snake game, but it differs in two points. The first is that in this game you collect gems instead of apples and when you colect a red gem (which is like a ruby) your length decreases by 2, this is normally good but if your length is lees than or equal to 2 it's game over for you. The other difference are the bombs, these elements move around the map and every time you collect 10 gems, one of them spawns. Be careful with this because if you collide with them you may die.
            </p>
            <v-row class="mb-4"align="center">
                <strong class="title">Credits</strong>
                <v-spacer></v-spacer>
            </v-row>
            <p>
                This game was made with <a style="color:white;"href="https://phaser.io">Phaser</a> as it's engine, <a style="color:white;"href="https://v3.vuejs.org">Vue.js</a> and <a style="color:white;"href="https://vuetifyjs.com">Vuetify</a> were used to create the UI and this page as well.

            </p>

            <p>
                The images were taken from <a style="color:white;"href="https://pixabay.com">pixabay</a>
            </p>

        </v-card-text>

    </v-card>

    <v-row
    align="center"
    justify="center">
    <v-col
      class="d-flex child-flex"
      cols="3"
    >
      <v-img
        src="phaser.png"
        lazy-src="phaser.png"
      >
        <template v-slot:placeholder>
          <v-row
            class="fill-height ma-0"
            align="center"
            justify="center"
          >
            <v-progress-circular
              indeterminate
              color="grey lighten-5"
            ></v-progress-circular>
          </v-row>
        </template>
      </v-img>
    </v-col>
    <v-col
      class="d-flex child-flex"
      cols="3"
    >
      <v-img
        src="vue.png"
        lazy-src="vue.png"
      >
        <template v-slot:placeholder>
          <v-row
            class="fill-height ma-0"
            align="center"
            justify="center"
          >
            <v-progress-circular
              indeterminate
              color="grey lighten-5"
            ></v-progress-circular>
          </v-row>
        </template>
      </v-img>
    </v-col>
    <v-col
      class="d-flex child-flex"
      cols="3"
    >
      <v-img
        src="vuetify.png"
        lazy-src="vuetify.png"
      >
        <template v-slot:placeholder>
          <v-row
            class="fill-height ma-0"
            align="center"
            justify="center"
          >
            <v-progress-circular
              indeterminate
              color="grey lighten-5"
            ></v-progress-circular>
          </v-row>
        </template>
      </v-img>
    </v-col>
  </v-row>


    <!-- <p>This game use <a href="https://phaser.io">Phaser</a> as </p>
    Image by <a href="https://pixabay.com/users/thedigitalartist-202249/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=6062954">Pete Linforth</a> from <a href="https://pixabay.com/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=6062954">Pixabay</a>
    Image by <a href="https://pixabay.com/users/kropekk_pl-114936/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=354010">kropekk_pl</a> from <a href="https://pixabay.com/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=354010">Pixabay</a> -->
  </div>
</template>
