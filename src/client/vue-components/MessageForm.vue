<template>
  <div class="input-group">
    <input v-model="text" @keyup.enter="submit" type="text" class="form-control" placeholder="Say somethin...">
    <span class="input-group-btn">
      <button class="btn btn-default" type="button">Go!</button>
    </span>
  </div>
</template>

<script>
export default {
  name: "MessageForm",
  data: function () {
    return {
      text: ""
    }
  },
  methods: {
    submit: function () {
      this.$emit('submit', this.text)
      this.text = ""
    }
  }
}
</script>

<style>

</style>
