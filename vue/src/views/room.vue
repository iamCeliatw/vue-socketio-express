<template lang="pug">
.room__wrapper
  .room__container
    .game__console
    .player__info
      .list
        p(v-for="i in store.userList", :key="i") {{ `歡迎玩家 ${i} 加入 ${store.roomName}` }}
      .broadcast
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import socketioService from '../../services/socketio.service'
const route = useRoute()
const players = ref([])
import { useStore } from '../../store/index'

const store = useStore()
console.log(store.roomName);

</script>

<style lang='sass' scoped>
.room__wrapper
  width: 100%
  height: 100vh
  background: #FFE6C9
  display: flex
  justify-content: center
  align-items: center
.room__container
  width: 80%
  height: 80vh
  background: #FFF6E9
  border-radius: 10px
  display: flex

.game__console
  width: 70%
  height: 100%
  background: #E3E3E3
  canvas
    width: 400px
    height: 400px
    border: 1px solid #000
.player__info
  width: 30%
  display: flex
  flex-direction: column
.list
  flex: 1
  background: #40A2E3aa
  overflow-y: scroll
  &::-webkit-scrollbar
    width: 1px
    background: #40A2E3
  p
    height: 30px
.broadcast
  flex: 1
</style>