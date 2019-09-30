<template>

  <div class="main-page">
    <div class="main-page__start" v-show="!isGameRunning && !gameOver">
      <div class="main-page__start__title">
        Intern Hero
      </div>
      <button class="main-page__start__button" @click="startNewGame">
        New Game
      </button>
    </div>
    <div class="main-page__game-over" v-show="gameOver">
      <div class="main-page__game-over__title">
        YOU DIED
      </div>
      <div class="main-page__game-over__final-stage">
        Beaten stages: {{getStage -1 }}
      </div>
      <button class="main-page__game-over__button" @click="quitGame">
        Continue
      </button>
    </div>
    <div class="main-page__game" v-show="isGameRunning && !gameOver">
      <div class="main-page__game__stats">
        Hero stats
        <br>
        Attack: {{heroStats.attack}} + {{modifiedHeroStats.attack}}
        <br>
        Defence: {{heroStats.defence}} + {{modifiedHeroStats.defence}}
        <br>
        Speed: {{heroStats.speed}} + {{modifiedHeroStats.speed}}
      </div>
      <div class="main-page__game__monster-stats">
        Monster Stats
        <br>
        Attack: {{monster.gameAttack}}
        <br>
        Defence: {{monster.gameDefence}}
        <br>
        Speed: {{monster.gameSpeed}}
      </div>
      <div class="main-page__game__stage-counter">
        STAGE {{getStage}}
      </div>
      <div class="main-page__game__arena">
        <div class="main-page__game__arena__hero-slot">
          <hero-component :health="heroStats.hp"
                          :activeItems="activeItems"
                          :monsterDmg="monsterDmg"
                          :heroAnimation="heroAnimation"
                          :heroHealing="heroHealing"
                          :attackWord="attackWord" />

          <div class="main-page__game__arena__hero-slot__background-cloud">
            <div class="main-page__game__arena__hero-slot__background-cloud__cloud-shadow"></div>
          </div>
        </div>

        <monster-component :monster="monster"
                           :monsterDead="monsterDead"
                           :monsterAnimation="monsterAnimation"
                           :heroDmg="heroDmg" />
      </div>
      <div class="main-page__game__footer">
        <div class="main-page__game__footer__backpack">
          <li v-for="(item, index) in backpack"
              draggable="true"
              @dragstart="startDrag(index)"
              @dragover="overDrag(index)"
              @dragend="endDrag"
              @mouseenter="showItemStats(index)"
              @mouseleave="hideItemStats(index)"
              class="main-page__game__footer__backpack__item">
            <div v-if="item">
              <img :src="item.image"
                   alt=""
                   class="main-page__game__footer__backpack__item__image">
              <div class="main-page__game__footer__backpack__item__durability">
                {{item.gameDurability}}
              </div>
            </div>
          </li>
          <div v-if="showItemModal && backpack[itemModalIndex] !== null"
               class="main-page__game__footer__backpack__item-stats">

            <div>{{backpack[itemModalIndex].name}}</div>

            <div v-if="backpack[itemModalIndex].stats.attack !== 0">

              + {{backpack[itemModalIndex].stats.attack}} Attack
            </div>
            <div v-if="backpack[itemModalIndex].stats.defence !== 0">

              + {{backpack[itemModalIndex].stats.defence}} Defence
            </div>
            <div v-if="backpack[itemModalIndex].stats.speed !== 0">

              + {{backpack[itemModalIndex].stats.speed}} Speed
            </div>
          </div>
        </div>
        <div class="main-page__game__footer__control-panel">
          <div @click="playTurn"
               class="main-page__game__footer__control-panel__attack" v-show="!isTurnRunning">

            ATTACK
          </div>
          <div class="main-page__game__footer__control-panel__attack--pending" v-show="isTurnRunning">

            ATTACK
          </div>
          <div @click="quitGame"
               class="main-page__game__footer__control-panel__quit">

            Quit Game
          </div>
        </div>
      </div>
    </div>

  </div>

</template>

<script>
import heroComponent    from '../components/hero.component.vue';
import monsterComponent from '../components/monster.component.vue';

export default {
  name: 'main-page',
  components: {
    heroComponent,
    monsterComponent,
  },
  data() {
    return {
      showItemModal: false,
      itemModalIndex: 0,
    };
  },
  computed: {
    isGameRunning() {
      return this.$store.state.gameRunning;
    },
    gameOver() {
      return this.$store.state.youDied;
    },
    getStage() {
      return this.$store.state.stage;
    },
    heroStats() {
      return this.$store.state.hero;
    },
    modifiedHeroStats() {
      return this.$store.state.heroModifiedStats;
    },
    monster() {
      return this.$store.state.activeMonster;
    },
    backpack() {
      return this.$store.state.backpack;
    },
    activeItems() {
      return this.$store.state.activeItems;
    },
    heroAnimation() {
      return this.$store.state.heroAnimation;
    },
    monsterAnimation() {
      return this.$store.state.monsterAnimation;
    },
    heroDmg() {
      return this.$store.state.heroAttackValue;
    },
    monsterDmg() {
      return this.$store.state.monsterAttackValue;
    },
    attackWord() {
      return this.$store.state.attackWord;
    },
    heroHealing() {
      return this.$store.state.healHero;
    },
    monsterDead() {
      return this.$store.state.monsterDead;
    },
    isTurnRunning() {
      return this.$store.state.turnRunning;
    },
  },
  methods: {
    startNewGame() {
      this.$store.dispatch('newGame');
    },
    playTurn() {
      this.$store.dispatch('playTurn');
    },
    quitGame() {
      this.$store.dispatch('quitGame');
    },
    startDrag(index) {
      this.$store.commit('setDragged', {
        location: 'backpack',
        id: index,
      });
    },
    overDrag(index) {
      this.$store.commit('setOver', {
        location: 'backpack',
        id: index,
      });
    },
    endDrag() {
      this.$store.dispatch('swapItems');
    },
    showItemStats(index) {
      this.showItemModal = true;
      this.itemModalIndex = index;
    },
    hideItemStats(index) {
      this.showItemModal = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.main-page {
  background-image: url("https://i.redd.it/6vf6qvlmehh01.png");
  background-repeat: no-repeat;
  background-size: cover;
  height: 100vh;

  &__start {
    //backdrop-filter: blur(1px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    border-radius: 10px;
    font-family: 'Metal Mania', cursive;

    &__title {
      font-size: 15rem;
      color: rgb(255, 115, 0);
      min-width: 50px;
      outline: none;
      text-shadow: 0 3px 20px red,
      0 0 20px red,
      0 0 10px orange,
      4px -5px 6px yellow,
      -4px -10px 10px yellow,
      0 -10px 30px yellow;
      animation: 2s Blazing infinite alternate linear;
    }

    &__button {
      width: 25rem;
      height: 10rem;
      font-size: 4.5rem;
      font-family: 'Metal Mania', cursive;
      cursor: pointer;
      opacity: 0.9;
    }
  }

  &__game-over {
    position: absolute;
    background-color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 25rem;
    width: 50rem;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 3rem;

    &__title {
      font-size: 6rem;
      color: red;
    }

    &__final-stage {
      font-size: 3rem
    }

    &__button {
      font-size: 2rem;
      font-family: 'Metal Mania', cursive;
      padding: 1rem;
      margin-top: 1rem;
    }
  }

  &__game {
    align-items: center;

    &__stats {
      background-color: white;
      opacity: 0.7;
      border-bottom-right-radius: 1rem;
      padding-left: 1rem;
      position: fixed;
      top: 0;
      left: 0;
      border: 1px solid black;
      font-size: 2rem;
      width: 20rem;
    }

    &__monster-stats {
      background-color: white;
      opacity: 0.7;
      border-bottom-left-radius: 1rem;
      padding-left: 1rem;
      position: fixed;
      top: 0;
      right: 0;
      border: 1px solid black;
      font-size: 2rem;
      width: 15rem;
    }

    &__stage-counter {
      padding-top: 3rem;
      font-size: 4rem;
      text-align: center;
    }

    &__arena {
      height: 40rem;
      display: flex;
      margin-top: 10rem;
      align-self: center;
      align-items: center;
      justify-content: space-around;

      &__hero-slot {

        &__background-cloud {
          animation-name: wind;
          animation-duration: 10s;
          animation-iteration-count: infinite;

          opacity: 0.6;
          width: 700px;
          height: 240px;
          background: white;
          border-radius: 200px;
          position: absolute;
          margin-top: -18rem;
          margin-left: -15rem;

          &:after {
            content: '';
            position: absolute;
            background: white;
            width: 200px;
            height: 200px;
            top: -100px;
            left: 100px;
            border-radius: 200px;
          }

          &:before {
            content: '';
            position: absolute;
            background: white;
            width: 360px;
            height: 360px;
            top: -180px;
            right: 100px;
            border-radius: 200px;
          }
        }
      }
    }

    &__footer {

      &__backpack {
        display: grid;
        grid-template-columns: repeat(10, 1fr);
        position: fixed;
        bottom: 0;
        left: 50%;
        transform: translate(-50%);
        border: 1px solid black;
        height: 5rem;
        background-color: white;
        opacity: 0.9;

        &__item {
          border: 1px solid black;
          list-style: none;
          font-size: 1rem;
          width: 5rem;
          position: relative;

          &__image {
            padding: 0.4rem;
            max-height: 5rem;
            max-width: 5rem;
          }

          &__durability {
            position: absolute;
            bottom: 5px;
            right: 3px;
          }

        }

        &__item-stats {
          position: absolute;
          padding: 1rem;
          left: 50%;
          bottom: 6rem;
          background-color: white;
          opacity: 0.99;
          border-radius: 1rem;
          transform: translate(-50%);
        }
      }

      &__control-panel {
        position: fixed;
        bottom: 0;
        right: 0;
        width: 20rem;
        height: 10rem;
        border: 1px solid white;
        background-color: white;
        opacity: 0.9;
        border-top-left-radius: 1rem;

        &__attack {
          padding-left: 2rem;
          font-size: 2rem;
          border-bottom: 1px solid black;
          height: 50%;
          line-height: 5rem;
          &--pending{
            border-top-left-radius: 1rem;
            background-color:lightgray;
            padding-left: 2rem;
            font-size: 2rem;
            border-bottom: 1px solid black;
            height: 50%;
            line-height: 5rem;
          }
        }

        &__quit {
          padding-left: 2rem;
          font-size: 2rem;
          height: 50%;
          line-height: 5rem;
        }
      }
    }
  }

}

@keyframes Blazing {
  0% {
    text-shadow: 0 3px 20px red, 0 0 20px red,
    0 0 10px orange,
    0 0 0 yellow,
    0 0 5px yellow,
    -2px -5px 5px yellow,
    4px -10px 10px yellow;
  }
  25% {
    text-shadow: 0 3px 20px red, 0 0 30px red,
    0 0 20px orange,
    0 0 5px yellow,
    -2px -5px 5px yellow,
    3px -10px 10px yellow,
    -4px -15px 20px yellow;
  }
  50% {
    text-shadow: 0 3px 20px red, 0 0 20px red,
    0 -5px 10px orange,
    -2px -5px 5px yellow,
    3px -10px 10px yellow,
    -4px -15px 20px yellow,
    2px -20px 30px rgba(255, 255, 0, 0.5);
  }
  75% {
    text-shadow: 0 3px 20px red, 0 0 20px red,
    0 -5px 10px orange,
    3px -5px 5px yellow,
    -4px -10px 10px yellow,
    2px -20px 30px rgba(255, 255, 0, 0.5),
    0px -25px 40px rgba(255, 255, 0, 0)
  }
  100% {
    text-shadow: 0 3px 20px red, 0 0 20px red,
    0 0 10px orange,
    0 0 0 yellow,
    0 0 5px yellow,
    -2px -5px 5px yellow,
    4px -10px 10px yellow;
  }
}

@keyframes wind {
  0% {
    margin-left: -16rem;
  }
  25% {
    margin-left: -15rem
  }
  50% {
    margin-left: -14rem
  }
  75% {
    margin-left: -15rem
  }
  100% {
    margin-left: -16rem
  }

}

</style>
