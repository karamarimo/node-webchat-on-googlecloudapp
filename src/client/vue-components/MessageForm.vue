<template>
  <form>
    <div class="input-group">
      <input v-model="text" type="text" class="form-control" placeholder="Say somethin...">
      <span class="input-group-btn">
        <button @click="submit" class="btn btn-default" type="submit">Bark</button>
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
    submit: function () {
      this.$emit('submit', this.text)
      this.text = ""
    }
  }
}
</script>

<style>

</style>
