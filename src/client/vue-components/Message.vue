<template>
  <div class="message-wrapper list-group-item">
    <h4>{{message.senderName}}<small class="pull-right">{{dateToString}}</small></h4>
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
  border: none;
}
</style>

