<template>
  <!-- <div class="panel panel-default">
    <div class="panel-heading">
      <h2 class="panel-title">Insecure Log-in Form</h2>
    </div>
    <div class="panel-body"> -->
      <form class="clearfix" @submit="submit">
        <div class="form-group">
          <label for="input-username">Username</label>
          <input type="text" class="form-control" id="input-username" v-model="username">
        </div>
        <div class="form-group">
          <label for="input-password">Password</label>
          <input type="password" class="form-control" id="input-password" v-model="password">
        </div>
        <button type="button" class="btn btn-default pull-left" @click="cancel">Cancel</button>
        <button type="submit" class="btn btn-primary pull-right">Log in</button>
      </form>
<!--   
    </div>  </div> -->
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
    submit: function () {
      this.$emit("submit", {
        username: this.username,
        password: this.password
      })
    }
  }
}
</script>

<style>

</style>
