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
        <li v-for="book in messages" :key="book.id">{{ book.title }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  // Here we can register any values or collections that hold data
  // for the application
  data () {
      return {
        messages: []
      }
  },

  // Anything within the ready function will run when the application loads
  mounted: function () {
    // GET /someUrl
    axios.get('/api/messages/').then(response => {

      // get body data
      this.messages = response.data.items;

    }).catch(error => {
      // error callback
      console.error(error);
    });
  },

  // Methods we want to use in our application are registered here
  methods: {}
}

</script>
