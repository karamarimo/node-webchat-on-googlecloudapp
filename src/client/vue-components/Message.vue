<template>
  <div class="message-wrapper">
    <strong>{{message.sender_name}}</strong><small class="pull-right">{{localDate}}</small>
    <p class="message-content">{{message.content}}</p>
  </div>
</template>

<script>
export default {
  name: "Message",

  props: {
    message: Object
  },

  computed: {
    localDate: function () {
      return new Date(this.message.date).toLocaleString()
    }
  },
}
</script>

<style>
.message-wrapper {
  /* border: none; */
}

.message-content {
  word-wrap: break-word;
}
</style>

