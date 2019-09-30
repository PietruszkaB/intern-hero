<template>
  <div class="health">
    <div class="health__active" :style="{width:`${hp}%` }" >
    </div>
  </div>
</template>

<script>
export default {
  name: 'health.component',
  props: {
    hp: Number,
  },
};
</script>

<style lang="scss" scoped>
.health{
  width:15rem;
  height:2rem;
  border: 3px solid black;
  &__active{
    background-color: red;
    height:100%;
  }
}
</style>
