<template>
  <div>
    <!-- navigation bar -->
    <div class="container-fluid">
      <nav class="navbar navbar-default">
        <a class="navbar-brand"><i class="glyphicon glyphicon-fire"></i> Let's flame each other!!</a>
      </nav>
    </div>
    
    <!-- main body of our application -->
    <div class="container">
      <h2>Chat here!</h2>
      <div class="message-list">
        <Message v-for="message in messages" :key="message.id" :message="message"></Message>
      </div>
      <div class="bottom-panel">
        <MessageForm @submit="sendMessage"></MessageForm>
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
    }
  },

  components: {
    Message,
    MessageForm,
  },
}

</script>

<style>
.bottom-panel {
  
}
</style>
