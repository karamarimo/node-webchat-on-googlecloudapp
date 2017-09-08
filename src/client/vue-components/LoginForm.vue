<template>
  <form @submit="submit">
    <div class="form-group">
      <label for="input-username">Username</label>
      <input type="text" class="form-control" id="input-username" v-model="username" required>
    </div>
    <div class="form-group">
      <label for="input-password">Password</label>
      <input type="password" class="form-control" id="input-password" v-model="password" required>
    </div>
    <div class="form-group clearfix">
      <button type="button" class="btn btn-default pull-left" @click="cancel">Cancel</button>
      <button type="submit" class="btn btn-primary pull-right">Log in</button>
    </div>
  </form>
</template>

<script>
export default {
  name: "LoginForm",
  data: function () {
    return {
      username: "",
      password: ""
    }
  },
  methods: {
    cancel: function () {
      this.$emit("cancel")
    },
    submit: function (e) {
      this.$emit("submit", {
        username: this.username,
        password: this.password
      })
      e.preventDefault()  // prevent page loading
    }
  }
}
</script>

<style>

</style>
