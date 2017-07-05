<template>
  <div class="wrapper">
    <div class="sender">
      {{message.senderName}}
    </div>
    <div class="content">
      {{message.content}}
    </div>
    <div class="date">
      {{dateToString}}
    </div>
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
  
</style>

