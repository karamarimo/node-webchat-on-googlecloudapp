<template>
  <div>
    <!-- navigation bar -->
    <nav class="navbar navbar-default">
      <div class="container-fluid">
        <a class="navbar-brand"><i class="glyphicon glyphicon-fire"></i> Let's flame each other!!</a>
      </div>
    </nav>
    
    <!-- main body of our application -->
    <div class="container" id="events">
      <p>Chatter</p>
      <ul>
        <li v-for="message in messages" :key="message.id">{{ message.content }}</li>
        <Message :message="{content: 'aa', senderName: 'iamsender', date: new Date()}"></Message>
      </ul>
    </div>
  </div>
</template>

<script>
import Message from './Message.vue'

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

  // Anything within the ready function will run when the application loads
  mounted: function () {
    // axios.get('/api/messages/').then(response => {
    //   this.messages = response.data.items;
    // }).catch(error => {
    //   console.error(error);
    // });
  },

  // Methods we want to use in our application are registered here
  methods: {},

  components: {
    Message,
  },
}

</script>
