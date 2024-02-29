<template lang="pug">
.home__wrapper
  .home__container
    button.create__btn(@click="openInputRoomNamePopup = true") 建立房間
    button.into__btn(@click="openJoinRoomPopup = true") 進入房間
    | {{ store.userId }}
  .popup(v-if="openInputRoomNamePopup")
    | 房間名稱
    input(type="text", v-model="roomName")
    | 你的名字
    input(type="text", v-model="userName")
    .button__popup
      button(@click="openInputRoomNamePopup = false") 取消
      button(@click="createRoom") 確定
  .popup(v-if="openJoinRoomPopup")
    | 房間ID
    input(type="text", v-model="roomId")
    | 你的名字
    input(type="text", v-model="userName")
    .button__popup
      button(@click="openJoinRoomPopup = false") 取消
      button(@click="joinRoom") 進入

  button.error__message {{ errorMessage }}
</template>
<script setup>
import socketioService from '../../services/socketio.service'
import { onBeforeUnmount, ref } from 'vue';
import { useRouter } from 'vue-router'
import { useStore } from '../../store/index'

const store = useStore()
const openInputRoomNamePopup = ref(false);
const openJoinRoomPopup = ref(false);
const roomName = ref('');
const roomId = ref('');
const userName = ref('');
const errorMessage = ref('');
const showError = ref(false);
const router = useRouter();

socketioService.setupSocketConnection();

const createRoom = () => {
  console.log(roomName.value);
  socketioService.createRoom(roomName.value);
  openInputRoomNamePopup.value = false;
}

socketioService.socket.on('roomCreated', (roomName, roomId) => {
  console.log('房間建立', roomName, roomId);
  store.setRoomName(roomName);
  store.setRoomId(roomId);
  router.push({ name: 'Room', params: { roomId: roomId } });
});

socketioService.socket.on('socketId', (data) => {
  console.log("我的socketID~", data);
  store.setUserId(data);
})

//找不到房間
socketioService.socket.on('roomNotFound', (data) => {
  console.log(data.error);
  errorMessage.value = data.error;
  triggerRemind();
});


function joinRoom () {
  if (!roomId.value || !userName.value) {
    errorMessage.value = !roomId.value ? '請輸入房間ID' : '請輸入你的名字';
    triggerRemind();
    return;
  }
  socketioService.socket.emit('joinRoom', { roomId: roomId.value, username: userName.value, });
  store.setUserName(userName.value);
  // router.push({ name: 'Room', params: { roomId: roomId.value } });
}
const users = ref([]);

socketioService.socket.on('joinedRoom', (data) => {
  console.log('加入房間', data);
  users.value = data.users;
  store.setUserList(users.value);
  store.setRoomName(data.roomname);
  router.push({ name: 'Room', params: { roomId: roomId.value } });
});

socketioService.socket.on('roomUpdated', (data) => {
  console.log('房間更新', data);
  users.value = data.users;
  store.setUserList(users.value);
  store.setRoomName(data.roomname);

});




//提醒UI
function triggerRemind () {
  showError.value = true;
  const errorMessageElement = document.querySelector('.error__message');
  errorMessageElement.classList.add('error__message--active');
  setTimeout(() => {
    errorMessageElement.classList.remove('error__message--active');
    showError.value = false;
  }, 3000);
}

</script>
<style lang="sass" scoped>
.home__wrapper
  overflow: hidden
  width: 100%
  background: #40A2E3
  height: 100vh
  display: flex
  justify-content: center
  align-items: center
  position: relative
.home__container
  border-radius: 10px
  width: 500px
  height: 300px
  background: #FFF6E9
  display: flex
  gap: 10px
  padding: 10px
.create__btn,
.into__btn
  cursor: pointer
  width: 80px
  height: 50px
  background: #0D9276
  border-radius: 10px
  color: #FFF
  border: none
.popup
  color: #FFF6E9
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center
  gap: 20px
  background: #BBE2EC
  position: absolute
  top: 50%
  left: 50%
  transform: translate(-50%, -50%)
  z-index: 2
  width: 500px
  height: 500px
  border-radius: 10px
  opacity: 0.9
  input
    width: 50%
    height: 30px
    border-radius: 10px
    border: none
    padding: 10px
    font-size: 2
    text-align: center

.button__popup
  display: flex
  gap: 10px
  button
    cursor: pointer
    border: none
    width: 80px
    height: 50px
    background: #0D9276
    border-radius: 10px
    color: #FFF

.error__message
  border: 1px solid red
  border-radius: 10px
  width: 150px
  height: 60px
  background: pink
  color: #FFF
  position: absolute
  bottom: -8%
  left: 50%
  transform: translateX(-50%)
  transition: bottom 0.5s

.error__message--active
  bottom: 10%
</style>
