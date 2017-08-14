<template>
  <form @submit="submit">
    <div class="input-group">
      <input v-model="text" type="text" class="form-control" placeholder="Say somethin...">
      <span class="input-group-btn">
        <button class="btn btn-default" type="submit">Bark</button>
      </span>
    </div>
  </form>
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
    submit: function (event) {
      this.$emit('msgsubmit', this.text)
      this.text = ""
      event.preventDefault()
    }
  }
}
</script>

<style>

</style>
