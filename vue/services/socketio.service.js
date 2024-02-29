import { io } from 'socket.io-client'

class SocketioService {
  //declare socket
  socket

  constructor() {}

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
    }
  }
  setupSocketConnection() {
    console.log(import.meta.env.VITE_SOCKET_ENDPOINT)
    this.socket = io(import.meta.env.VITE_SOCKET_ENDPOINT)
    this.socket.emit('my message', 'Hello there from Vue.')
    this.socket.on('my broadcast', (data) => {
      console.log(data)
    })
  }

  createRoom(roomName) {
    if (this.socket) {
      this.socket.emit('createRoom', roomName)
    }
  }
}

export default new SocketioService()
