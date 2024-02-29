// stores/counter.js
import { defineStore } from 'pinia'

export const useStore = defineStore('store', {
  state: () => {
    return {
      userId: '',
      roomId: '',
      userName: '',
      roomName: '',
      userList: [],
      socket: null,
    }
  },
  // could also be defined as
  // state: () => ({ count: 0 })
  actions: {
    setRoomId(roomId) {
      this.roomId = roomId
    },
    setUserId(userId) {
      this.userId = userId
    },
    setUserList(userList) {
      this.userList = userList
    },
    setUserName(userName) {
      this.userName = userName
    },
    setRoomName(roomName) {
      this.roomName = roomName
    },
    setSocket(socket) {
      this.socket = socket
    },
    disconnect() {
      if (this.socket) {
        this.socket.disconnect()
      }
    },
  },
})
