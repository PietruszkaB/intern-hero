<template>
  <div class="hero">
    <div class="hero__health">
      HP: {{health}} / 100
      <health-component :hp="health" />
    </div>

    <div class="hero__model" >
      <img class="hero__model__image"
           :class="{'hero__model__image--attack': heroAnimation}"
           src="../assets/images/dinosaur-intern2.gif"
           alt="">
      <div class="hero__model__dmg" v-show="showDmg">
        {{monsterDmg}}
      </div>
      <div class="hero__model__attack" v-show="heroAnimation">
        {{attackWord}}
      </div>
      <div class="hero__model__heal" v-show="heroHealing">
        <div class="plus__plus-up">+</div>
        <div class="plus__plus-down">+</div>
        <div class="plus__plus-up">+</div>
        <div class="plus__plus-down">+</div>
        <div class="plus__plus-up">+</div>
        <div class="plus__plus-down">+</div>
        <div class="plus__plus-up">+</div>
      </div>
    </div>
    <div class="hero__active-items">
      <li v-for="(item, index) in activeItems"
          draggable="true"
          :key="index"
          @dragstart="startDrag(index)"
          @dragover="overDrag(index)"
          @dragend="dropItem"
          class="hero__active-items__item">
        <div v-if="item"
             class="hero__active-items__item__details">

          <img class="hero__active-items__item__details__image"
               :src="item.image"
               alt="">

          <div class="hero__active-items__item__details__durability-label">

            {{item.gameDurability}}
          </div>
        </div>
      </li>
    </div>
  </div>
</template>

<script>

import healthComponent from './health.component.vue';

export default {
  name: 'hero.component',
  props: {
    health: {
      required: true,
      value: Number,
    },
    activeItems: {
      required: true,
      value: Array,
    },
    heroAnimation: {
      required: true,
      value: Boolean,
    },
    monsterDmg: {
      required: true,
      value: Number,
    },
    attackWord: {
      required: true,
      value: String,
    },
    heroHealing: {
      required: true,
      value: Boolean,
    },
  },
  data() {
    return {
      showDmg: false,
    };
  },
  watch: {
    monsterDmg(val) {
      if (val !== null) {
        this.showDmg = true;
      } else {
        this.showDmg = false;
      }
    },
  },
  components: {
    healthComponent,
  },
  methods: {
    startDrag(index) {
      this.$store.commit('setDragged', {
        location: 'activeItems',
        id: index,
      });
    },
    overDrag(index) {
      this.$store.commit('setOver', {
        location: 'activeItems',
        id: index,
      });
    },
    dropItem(e) {
      this.$store.dispatch('swapItems');
    },
  },
};
</script>

<style lang="scss" scoped>
.hero {

  z-index: 1;
  position: relative;

  &__health {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    width: 15rem;
    z-index: 10;
    background-color: white;
  }

  &__model {
    width: 15rem;
    height: 20rem;
    z-index: 10;
    &__image {
      animation-name: hopping;
      animation-duration: 2s;
      animation-iteration-count: infinite;
      width: 30rem;
      transform: scaleX(-1) translate(25%);
      transition:1s;
      &--attack{
        z-index:999;
        transform: scale(-1.3,1.3) translate(4rem,-2rem);
      }
    }
    &__dmg{
      position:absolute;
      top:0;
      right:-5rem;
      font-size:6rem;
      color:red;
      -webkit-text-stroke:3px black;
      animation-name: floating-dmg;
      animation-duration: 1s;
    }
    &__attack{
      position: absolute;
      font-size:3rem;
      top:15rem;
      right:0;
      animation-name:text-shooting;
      animation-duration: 1s;
      -webkit-text-stroke:1px black;
      transform: rotate(-15deg);
      z-index: -1;
      font-family: "Courier New", Courier, monospace;
      font-weight: 600;
      color:#00FF41;
      //width:20rem;
    }
    &__heal{
      position:absolute;
      top:50%;
      left:60%;
      width:20rem;
      color:#01d55f;
      height:20rem;
      opacity:0.7;

      transform: translate(-50%,-50%);
      font-size:5rem;
      display:flex;
      -webkit-text-stroke:1px black;
    }
  }

  &__active-items {
    margin-top: 2rem;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    height: 5rem;
    background-color: white;
    opacity: 0.95;

    &__item {
      list-style: none;
      border: 1px solid black;
      height:5rem;
      width: 5rem;
      position:relative;

      &__details {
        &__image{
          max-width:5rem;
          padding:0.4rem;
          max-height:5rem;
        }

        &__durability-label {
          position: absolute;
          bottom: 0;
          right: 3px;
        }
      }
    }
  }
}
.plus{
  &__plus-up{
    margin-top:2rem;
    margin-left:1rem;
    animation-name: plus-down;
    animation-duration: 1s;
  }

  &__plus-down{
    margin-top:12rem;
    animation-name: plus-up;
    animation-duration: 1s;
  }
}

@keyframes hopping {
  0% {
    margin-top: 1rem;
  }
  50% {
    margin-top: 0;
  }
  100% {
    margin-top: 1rem;
  }
}

@keyframes floating-dmg {
  100%{
    transform: translateY(-10rem);
  }
}
@keyframes text-shooting {
  75%{transform:translate(50rem,-15rem) rotate(-15deg) }
  100%{transform:translate(52rem,-14rem) rotate(15deg)}
}

@keyframes plus-up{
  50%{transform: translateY(-10rem)}
}

@keyframes plus-down {
  50%{transform: translateY(10rem)}
}

</style>
