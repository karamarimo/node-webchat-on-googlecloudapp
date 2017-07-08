<template>
  <div class="message-wrapper">
    <strong>{{message.senderName}}</strong><small class="pull-right">{{dateToString}}</small>
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
    dateToString: function () {
      return this.message.date.toLocaleString()
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

