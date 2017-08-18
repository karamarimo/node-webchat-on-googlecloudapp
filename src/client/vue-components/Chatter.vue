<template>
  <div class="window-wrapper">
    <!-- navigation bar -->
    <nav class="navbar navbar-inverse navbar-static-top">
      <div class="container-fluid">
        <div class="navbar-header">
          <a class="navbar-brand" href="#">
            <i class="glyphicon glyphicon-bullhorn"></i> Bark</a>
        </div>
        <ul class="nav navbar-nav navbar-right">
          <li>
            <a href="#">Login</a>
          </li>
        </ul>
      </div>
    </nav>
  
    <!-- main body of our application -->
    <div class="content">
      <div class="left-panel">
        <h3>Rooms</h3>
        <RoomList :rooms="rooms" @select="selectRoom"></RoomList>
      </div>
      <div class="main-panel">
        <div class="message-list" ref="list">
          <Message v-for="message in messages" :key="message.id" :message="message"></Message>
        </div>
        <div class="panel panel-default bottom-panel">
          <div class="panel-body">
            <MessageForm @msgsubmit="sendMessage"></MessageForm>
          </div>
        </div>
      </div>
    
    </div>
  </div>
</template>

<script>
import Message from './Message.vue'
import MessageForm from './MessageForm.vue'
import RoomList from './RoomList.vue'

import axios from 'axios'
import io from 'socket.io-client'

const guestId = 1

export default {
  name: "Chatter",
  data: function () {
    return {
      messages: [],
      rooms: [],
      currentRoom: null,
      socket: null,
      token: null
    }
  },

  watch: {
  },

  computed: {
    "messages-reversed": function () {
      return this.messages.slice().reverse()
    }
  },

  // Anything within the ready function will run when the application loads
  mounted: function () {
    // socket.io instance
    this.socket = io("http://localhost:8090")

    // on receiving old messages
    this.socket.on('old messages', (messages, token) => {
      console.log("old messages received")
      this.messages = messages.reverse().concat(this.messages)
      this.token = token
      this.scroll()
    })
    // on receiving a new message
    this.socket.on('message', (message) => {
      console.log('message received')
      // if (message.room_id === this.currentRoom) {
        this.messages.push(message)
      // }
      this.scroll()
    })

    this.socket.on('rooms', (rooms) => {
      this.rooms.push(...rooms)
    })

    // request rooms
    this.socket.emit('get rooms')
  },

  // Methods we want to use in our application are registered here
  methods: {
    selectRoom: function (id) {
      if (id !== this.currentRoom) {
        this.messages = []
        this.socket.emit('join room', id)
          .emit('get old messages', id, null)
        this.currentRoom = id
      }
    },
    sendMessage: function (text) {
      if (text === null || text === '' || this.currentRoom === null) {
        return
      }

      const message = {
        sender_id: guestId,
        sender_name: 'Anonymous',
        room_id: this.currentRoom,
        content: text
      }

      this.socket.emit('message', message)
    },
    scroll: function () {
      // if currently at the bottom, scroll to the bottom after list is updated
      const list = this.$refs.list
      if (list && list.scrollTop + list.clientHeight === list.scrollHeight) {
        this.$nextTick(function () {
          list.scrollTop = list.scrollHeight
        })
      }
    }
  },

  components: {
    Message,
    MessageForm,
    RoomList,
  },
}

</script>

<style>
html,
body {
  height: 100%;
}

.navbar {
  flex-shrink: 0;
}

.window-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.content {
  display: flex;
  flex-direction: row;
  align-content: stretch;
  height: 100%;
}

.left-panel {
  width: 300px;
  flex-shrink: 0;
  flex-grow: 0;
  margin-left: 15px;
  margin-right: 15px;
}

.main-panel {
  flex-shrink: 1;
  flex-grow: 1;
  /* overflow: hidden; */
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  margin-left: 15px;
  margin-right: 15px;
}

.message-list {
  flex-shrink: 1;
  overflow: auto;
  /* display: flex;
  justify-content: flex-end;
  flex-direction: column; */
}

.bottom-panel {
  flex-shrink: 0;
}
</style>
