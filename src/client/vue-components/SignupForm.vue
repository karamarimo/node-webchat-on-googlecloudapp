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
    <div class="form-group">
      <label for="input-password-confirm">Password (type again)</label>
      <input type="password" class="form-control" id="input-password-confirm" v-model="password2" required>
    </div>
    <div class="form-group clearfix">
      <button type="button" class="btn btn-default pull-left" @click="cancel">Cancel</button>
      <button type="submit" class="btn btn-primary pull-right">Sign up</button>
    </div>
    <div v-if="error" class="alert alert-danger alert-dismissible" role="alert">
      <strong>Error:</strong> {{ error_message }}
    </div>
  </form>
</template>

<script>
export default {
  name: "SignupForm",
  data: function () {
    return {
      username: "",
      password: "",
      password2: "",
      error: false,
      error_message: ""
    }
  },
  methods: {
    cancel: function () {
      this.$emit("cancel")
    },
    submit: function (e) {
      this.error = false

      if (this.password !== this.password2) {
        this.error = true
        this.error_message = 'Two passwords does not match.'
        return
      }

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
