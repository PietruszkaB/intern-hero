import Vue      from 'vue';
import Vuex     from 'vuex';
import items    from './items.data';
import monsters from './monsters.data';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    turnRunning: false,
    gameRunning: false,
    youDied: false,
    grabbedItem: {
      location: null,
      id: 0,
    },
    overItem: {
      location: null,
      id: 0,
    },
    stage: 1,
    monsterStatMultiplier: 1,
    maxPoints: 21,
    hero: {},
    heroModifiedStats: {
      attack: 0,
      defence: 0,
      speed: 0,
    },
    backpack: [null, null, null, null, null, null, null, null, null, null],
    activeItems: [null, null, null],
    activeMonster: {},
    heroAnimation: false,
    monsterAnimation: false,
    heroAttackValue: null,
    monsterAttackValue: null,
    itemId: 0,
    computerWords: ['mapMutations', 'beforeEach', 'commit', 'dispatch', 'beforeRouteEnter'],
    attackWord: '',
    healHero: false,
    monsterDead: false,
    wilhelmScream: new Audio('https://www.wilhelmscream.net/wilhelm.mp3'),
    heroDmgSound: new Audio('http://mattersofgrey.com/audio/Minecraft-hurt.mp3'),
    heroAttackSound: new Audio('http://www.sounds.beachware.com/2illionzayp3may/jspjrz/CLIPCLIP.mp3'),
    monsterDmgSound: new Audio('http://www.mario-museum.net/sons/smb_coup-de-pied.wav'),
    monsterAttackSound: new Audio('http://www.roomrecess.com/mobile/Zap-A-Zoid/sounds/zap.mp3'),
    monsterDieSound: new Audio('http://www.superluigibros.com/downloads/sounds/SNES/SMRPG/wav/smrpg_enemy_runaway.wav'),
    backgroundMusic: new Audio(require('./assets/sounds/resistors.mp3')),
  },
  mutations: {
    setGameRunning(state) {
      state.gameRunning = true;
    },
    quitGame(state) {
      state.backgroundMusic.pause()
      state.gameRunning = false;
      state.maxPoints = 21;
      state.backpack = [null, null, null, null, null, null, null, null, null, null];
      state.activeItems = [null, null, null];
      state.heroModifiedStats = {
        attack: 0,
        defence: 0,
        speed: 0,
      };
      state.activeMonster = {};
      state.stage = 1;
      state.monsterStatMultiplier = 1;
      state.youDied = false;
    },
    subtractMaxPoints(state, number) {
      state.maxPoints -= number;
    },
    setHeroStats(state, stats) {
      state.hero = { ...stats };
    },
    subtractMonsterHealth(state, dmg) {
      if (dmg > state.activeMonster.hp) {
        state.activeMonster.hp = 0;
      } else {
        state.activeMonster.hp -= dmg;
      }
    },
    subtractHeroHealth(state, dmg) {
      if (dmg > state.hero.hp) {
        state.hero.hp = 0;
      } else {
        state.hero.hp -= dmg;
      }
    },
    setDragged(state, item) {
      state.grabbedItem = item;
    },
    setOver(state, item) {
      if (state.overItem.location !== item.location || state.overItem.id !== item.id) {
        state.overItem = item;
      }
    },
    swapItems(state) {
      const tempItem = state[ state.overItem.location ][ state.overItem.id ];
      state[ state.overItem.location ].splice(state.overItem.id, 1, state[ state.grabbedItem.location ][ state.grabbedItem.id ]);
      state[ state.grabbedItem.location ].splice(state.grabbedItem.id, 1, tempItem);
    },
    countItemChange(state) {
      state.heroModifiedStats = {
        attack: 0,
        defence: 0,
        speed: 0,
      };
      state.activeItems.forEach((item) => {
        if (item) {
          state.heroModifiedStats.attack += item.stats.attack;
          state.heroModifiedStats.defence += item.stats.defence;
          state.heroModifiedStats.speed += item.stats.speed;
        }
      });
    },
    nextStage(state) {
      state.stage += 1;
      state.monsterStatMultiplier += 0.2;
    },
    youDied(state) {
      state.youDied = true;
    },
    startHeroAnimation(state) {
      state.heroAnimation = true;
    },
    healHero(state) {
      if (state.hero.hp > 90) {
        state.hero.hp = 100;
      } else {
        state.hero.hp += 10;
      }
    },
  },
  actions: {
    async newGame({ commit, state, dispatch }) {
      state.backgroundMusic.loop = true;
      state.backgroundMusic.play()

      await dispatch('drawMonster');
      const heroStats = {
        attack: null,
        speed: null,
        defence: null,
      };
      await dispatch('drawPoints', 'speed')
        .then(res => heroStats.speed = res);
      await dispatch('drawPoints')
        .then(res => heroStats.defence = res);
      heroStats.attack = state.maxPoints;
      heroStats.hp = 100;
      commit('setHeroStats', heroStats);
      await dispatch('drawItems', 3);
      commit('setGameRunning');
      state.attackWord = state.computerWords[Math.floor(Math.random() * state.computerWords.length)];
    },

    async playTurn({ commit, state, dispatch }) {
      state.turnRunning = true;
      const heroStats = {
        attack: state.hero.attack + state.heroModifiedStats.attack,
        defence: state.hero.defence + state.heroModifiedStats.defence,
        speed: state.hero.speed + state.heroModifiedStats.speed,
      };

      if (heroStats.speed > state.activeMonster.gameSpeed) {
        //random hero attack -- later

        //attack with hero
        await state.heroAttackSound.play()
        commit('startHeroAnimation');
        setTimeout(async () => {
          state.heroAttackSound.pause()
          state.heroAnimation = false;
          await dispatch('heroAttack', heroStats);
          if (state.activeMonster.hp > 0) {
            //attack with monster
            state.monsterAnimation = true;
            state.monsterAttackSound.play()
            setTimeout(async () => {
              state.turnRunning = false;
              state.monsterAnimation = false;
              await dispatch('monsterAttack', heroStats);
              if (state.hero.hp <= 0) {
                await dispatch('gameOver');
              }
            }, 1000);
          } else {
            state.turnRunning = false;
            await dispatch('newMonster');
          }
        }, 1000);
      } else {
        //attack with monster
        state.monsterAnimation = true;
        state.monsterAttackSound.play()
        setTimeout(async () => {
          state.monsterAnimation = false;
          await dispatch('monsterAttack', heroStats);
          //check if hero alive
          if (state.hero.hp > 0) {
            state.turnRunning = false;
            await state.heroAttackSound.play()
            state.heroAnimation = true;
            setTimeout(async () => {
              state.heroAttackSound.pause()
              state.heroAnimation = false;
              await dispatch('heroAttack', heroStats);
              if (state.activeMonster.hp <= 0) {
                await dispatch('newMonster');
              }
            }, 1000);
          } else {
            state.turnRunning = false;
            await dispatch('gameOver');
          }
        }, 1000);
      }
      await dispatch('adjustItemDurability');
    },
    quitGame(state) {
      state.commit('quitGame');
    },
    drawPoints({ commit, state, dispatch }, type) {
      if (type === 'speed') {
        const randomNumber = Math.floor(Math.random() * state.maxPoints * Math.random());
        if (randomNumber === 0) {
          return dispatch('drawPoints', 'speed');
        } else {
          commit('subtractMaxPoints', randomNumber);
          return randomNumber;
        }
      } else {
        const randomNumber = Math.floor(Math.random() * state.maxPoints);
        commit('subtractMaxPoints', randomNumber);
        return randomNumber;
      }
    },
    drawAttack({ commit, state }) {

    },
    specialAttack() {

    },
    drawItems({ commit, state }, number) {
      for (let i = 0; i <= number - 1; i += 1) {
        const randomItem = items[ Math.floor(Math.random() * items.length) ];
        randomItem.gameDurability = randomItem.durability;
        randomItem.id = state.itemId;
        state.itemId += 1;
        state.backpack[ state.backpack.indexOf(null) ] = { ...randomItem };
      }
    },
    drawMonster({ commit, state }) {
      state.activeMonster = {};
      const randomMonster = monsters[ Math.floor(Math.random() * monsters.length) ];
      randomMonster.gameSpeed = randomMonster.speed;
      randomMonster.gameDefence = randomMonster.defence;
      randomMonster.gameAttack = randomMonster.attack;
      randomMonster.gameMaxHp = randomMonster.maxHp;
      randomMonster.gameSpeed = Math.floor(randomMonster.gameSpeed * state.monsterStatMultiplier);
      randomMonster.gameDefence = Math.floor(randomMonster.gameDefence * state.monsterStatMultiplier);
      randomMonster.gameAttack = Math.floor(randomMonster.gameAttack * state.monsterStatMultiplier);
      randomMonster.gameMaxHp = Math.floor(randomMonster.gameMaxHp * state.monsterStatMultiplier);
      randomMonster.hp = randomMonster.gameMaxHp;
      state.activeMonster = { ...randomMonster };
    },
    async heroAttack({ commit, state }, heroStats) {

      //OLD ATTACK
      // if (heroStats.attack > state.activeMonster.gameDefence) {
      //   const heroDmgValue = heroStats.attack - state.activeMonster.gameDefence;
      //   state.heroAttackValue = heroDmgValue;
      //   commit('subtractMonsterHealth', heroDmgValue);
      // } else {
      //   state.heroAttackValue = 0;
      // }
      // setTimeout(() => {
      //   state.heroAttackValue = null;
      // }, 1000);

      //NEW ATTACK
      state.attackWord = state.computerWords[Math.floor(Math.random() * state.computerWords.length)];
      if (Math.random() * 100 > state.activeMonster.gameDefence) {
        state.heroAttackValue = heroStats.attack;
        commit('subtractMonsterHealth', heroStats.attack);
      } else {
        state.heroAttackValue = 0;
      }
      state.monsterDmgSound.play()
      setTimeout(() => {
        state.heroAttackValue = null;
      }, 1000);
    },
    async monsterAttack({ commit, state }, heroStats) {

      //OLD ATTACK
      // if (state.activeMonster.gameAttack > state.hero.defence) {
      //   const monsterDmgValue = state.activeMonster.gameAttack - state.hero.defence;
      //   state.monsterAttackValue = monsterDmgValue;
      //   commit('subtractHeroHealth', monsterDmgValue);
      // } else {
      //   state.monsterAttackValue = 0;
      // }
      // setTimeout(() => {
      //   state.monsterAttackValue = null;
      // }, 1000);

      //New attack
      if (Math.random() * 100 > heroStats.defence) {
        state.monsterAttackValue = state.activeMonster.gameAttack;
        commit('subtractHeroHealth', state.activeMonster.gameAttack);
      } else {
        state.monsterAttackValue = 0;
      }
      state.heroDmgSound.play();
      setTimeout(() => {
        state.monsterAttackValue = null;
      }, 1000);
    },
    checkTurn({ commit, state }) {
      if (state.hero.hp < 1) {
        console.log('game over');
      } else if (state.activeMonster.hp < 1) {
        console.log('new monster');
      } else {
        console.log('continue battle');
      }
    },
    swapItems({ commit }) {
      commit('swapItems');
      commit('countItemChange');
    },
    adjustItemDurability({ commit, state }) {
      const checkedItems = [];
      state.activeItems.forEach((item) => {
        if (item && !checkedItems.includes(item)) {
          if (item.gameDurability === 1) {
            state.activeItems.splice(state.activeItems.indexOf(item), 1, null);
            commit('countItemChange');
          } else {
            item.gameDurability -= 1;
          }
          checkedItems.push(item);
        }
      });
    },
    newMonster({ commit, state, dispatch }) {
      state.monsterDieSound.play()
      commit('nextStage');
      commit('healHero');
      state.healHero = true;
      state.monsterDead = true;
      setTimeout(() => {
        state.monsterDead = false;
        dispatch('drawMonster');
        const itemDropNumber = Math.floor(Math.random()) + 1;
        dispatch('drawItems', itemDropNumber);
      }, 1000)
      setTimeout(() => {
        state.healHero = false;
      }, 1000);
    },
    gameOver({ commit, state }) {
      state.wilhelmScream.play()
      commit('youDied');
    },
  },
});
