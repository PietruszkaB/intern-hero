<template>
  <div class="monster">
    <div class="monster__health">
      HP: {{monster.hp}} / {{monster.gameMaxHp}}
      <health-component :hp="monster.hp/monster.gameMaxHp *100"/>
    </div>
    <div class="monster__model"
         :class="{'monster__model--dead': monsterDead, 'monster__model--alive': !monsterDead}"
         @mouseenter="showMonsterStats"
         @mouseleave="hideMonsterStats">

      <img class="monster__model__image"
           :class="{'monster__model__image--attack': monsterAnimation}"
           :src=monster.image
           alt="">
      <div class="monster__model__dmg" v-show="showDmg">
        {{heroDmg}}
      </div>
      <div class="monster__model__attack" v-show="monsterAnimation">
        Error
      </div>
    </div>
    <div class="monster__portal" >
      <img class="monster__portal__image" src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/cdfeb108-84b4-4b7e-b821-49491ab28d57/da2plgi-c8b8edcc-3cdc-432c-b2bf-02c7d72f5afb.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2NkZmViMTA4LTg0YjQtNGI3ZS1iODIxLTQ5NDkxYWIyOGQ1N1wvZGEycGxnaS1jOGI4ZWRjYy0zY2RjLTQzMmMtYjJiZi0wMmM3ZDcyZjVhZmIuZ2lmIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.j0ngZxwJAhdt7VAP4_NXJq0Yf18f3o9mlHEVtIgaBNQ" alt="">
    </div>
  </div>
</template>

<script>
import healthComponent from './health.component.vue';

export default {
  name: 'monster.component',
  props: {
    monster: {
      required: true,
      value: Object,
    },
    monsterAnimation: {
      required: true,
      value: Boolean,
    },
    heroDmg: {
      required: true,
      value: Number,
    },
    monsterDead: {
      required: true,
      value: Boolean,
    },
  },
  components: {
    healthComponent,
  },
  data() {
    return {
      showMonsterModal: false,
      showDmg: false,
    };
  },
  watch: {
    heroDmg(val) {
      if (val !== null) {
        this.showDmg = true;
      } else {
        this.showDmg = false;
      }
    },
  },
  methods: {
    showMonsterStats() {
      this.showMonsterModal = true;
    },
    hideMonsterStats() {
      this.showMonsterModal = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.monster {
  margin-top:-25rem;
  width: 15rem;
  position: relative;

  &__health {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    background-color:white;
  }

  &__model {
    margin-top:2rem;
    cursor: help;
    width: 10rem;
    height: 10rem;
    display: flex;

    &__image{
      backdrop-filter: blur(0.7);
      animation-name:hopping;
      animation-duration: 1s;
      animation-iteration-count: infinite;
      height:100%;
      transition: 1s;
      z-index: 0;
      transform: scaleX(-1);
      &--attack{
        //transform: scale(1.5,1.5);
      }
      &--dead{

      }
    }
    &--alive{
      animation-name:portal-appear;
      animation-duration:1s;
    }
    &--dead{
      //transform: rotate(180deg);
      animation-name:portal-change;
      animation-duration:1s;
    }
    &__dmg{
      position:absolute;
      top:0;
      left:-5rem;
      font-size:6rem;
      color:red;
      -webkit-text-stroke:3px black;
      animation-name: floating-dmg;
      animation-duration: 1s;
    }
    &__attack{
      position: absolute;
      font-size:3rem;
      top:10rem;
      left:0;
      animation-name:text-shooting;
      animation-duration: 1s;
      -webkit-text-stroke:1px black;
      transform: rotate(-15deg);
      z-index: 3;
      font-family: "Courier New", Courier, monospace;
      font-weight: 600;
      color:red;
    }
  }

  &__stats {
    margin-top:2rem;
    position: absolute;
    border: 1px solid black;
    font-size: 1rem;
    padding: 5px;
    background-color: white;
  }

  &__portal{
    transform: rotate(90deg);
    position:absolute;
    top:60%;
    left:-20%;
    &__image{
      width:18rem;
    }
  }

}
@keyframes hopping {
  0% {margin-top:1rem;}
  50% {margin-top:0rem;}
  100% {margin-top:1rem;}
}
@keyframes floating-dmg {
  100%{
    transform: translateY(-10rem);
  }
}
@keyframes portal-change {
  100%{
    transform: translateY(15rem);
  }
}
@keyframes portal-appear {
  0%{transform:translateY(15rem)}
}

@keyframes text-shooting {
  75%{transform:translate(-49rem,2rem) rotate(-0deg) }
  100%{transform:translate(-50rem,3rem) rotate(-0deg)}
}
</style>
