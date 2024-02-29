var { nanoid } = require('nanoid')

// express init
const app = require('express')()
const http = require('http').createServer(app)
//socket.io init
const io = require('socket.io')(http, {
  cors: {
    origins: ['http://localhost::8080'],
  },
})
let rooms = []

app.get('/', (req, res) => {
  res.send('<h1> Hey socket.io</h1>')
})

io.on('connection', (socket) => {
  console.log('A user connected with socket ID:', socket.id)
  io.to(socket.id).emit('socketId', socket.id)
  socket.on('disconnect', () => {
    console.log('user disconnected!')
  })

  socket.on('my message', (msg) => {
    console.log('message: ' + msg)
    io.emit('my broadcast', `server: ${msg}`)
  })

  socket.on('createRoom', (roomName) => {
    console.log(`Creating room: ${roomName}`)
    // 在這裡處理房間創建邏輯，例如添加到房間列表
    const roomId = nanoid()
    const newRoom = {
      name: roomName,
      users: [],
      id: roomId,
    }
    rooms.push(newRoom)
    console.log('Rooms:', roomName, roomId, newRoom)
    io.emit('roomCreated', roomName, roomId)
  })

  socket.on('joinRoom', ({ roomId, username }) => {
    console.log(roomId, username, rooms[roomId], rooms)
    const room = rooms.find((room) => room.id === roomId)
    if (room) {
      console.log('加入凡間！', rooms)
      room.users.push(username)
      socket.join(roomId)
      // 向房間內的所有用戶廣播新用戶加入
      io.to(roomId).emit('roomUpdated', {
        roomId,
        users: room.users,
        roomname: room.name,
      })
      // 單獨向加入的用戶回傳房間信息
      socket.emit('joinedRoom', {
        roomId,
        username,
        users: room.users,
        roomname: room.name,
      })
    } else {
      // 如果房間不存在，可以選擇創建房間或返回錯誤
      socket.emit('roomNotFound', { error: 'Room not found', roomId: roomId })
    }
  })
})

http.listen(3000, () => {
  console.log('listening on *:3000')
})
