<template>
  <div class="window-wrapper">
    <!-- navigation bar -->
      <nav class="navbar navbar-inverse navbar-static-top">
        <div class="container-fluid">
          <div class="navbar-header">
            <a class="navbar-brand" href="#"><i class="glyphicon glyphicon-bullhorn"></i> Bark</a>
          </div>
          <ul class="nav navbar-nav navbar-right">
            <li><a href="#">Login</a></li>
          </ul>
        </div>
      </nav>
    
    <!-- main body of our application -->
    <div class="container-fluid main-panel">
      <div class="message-list" ref="list">
        <Message v-for="message in messages" :key="message.id" :message="message"></Message>
      </div>
      <div class="panel panel-default bottom-panel">
        <div class="panel-body">
          <MessageForm @submit="sendMessage"></MessageForm>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Message from './Message.vue'
import MessageForm from './MessageForm.vue'

import axios from 'axios'

export default {
  name: "Chatter",
  // Here we can register any values or collections that hold data
  // for the application
  data () {
      return {
        messages: []
      }
  },

  computed: {
    "messages-reversed": function () {
      return this.messages.slice().reverse()
    }
  },

  // Anything within the ready function will run when the application loads
  mounted: function () {
    // axios.get('/api/messages/').then(response => {
    //   this.messages = response.data.items;
    // }).catch(error => {
    //   console.error(error);
    // });
    this.messages = [
      {id: 0, content: 'hi i am your father', senderName: 'Truth Teller', date: new Date()},
      {id: 1, content: 'u want me now?', senderName: 'Seducer', date: new Date()}
    ]
  },

  // Methods we want to use in our application are registered here
  methods: {
    sendMessage: function (text) {
      this.messages.push({
        id: this.messages.length,
        content: text,
        senderName: 'Anonymous',
        date: new Date()
      })

      // scroll the list to the bottom when the dom is updated
      this.$nextTick(function () {
        const list = this.$refs.list
        list.scrollTop = list.scrollHeight
      })
    }
  },

  components: {
    Message,
    MessageForm,
  },
}

</script>

<style>
html, body {
  height: 100%;
}

.window-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.main-panel {
  flex-shrink: 1;
  flex-grow: 1;
  /* overflow: hidden; */
  display: flex;
  flex-direction: column;
}

.message-list {
  flex-shrink: 1;
  flex-grow: 1;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
}
</style>
