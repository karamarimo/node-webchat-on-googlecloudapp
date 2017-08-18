<template>
  <div class="list-group">
    <a href="#" class="list-group-item" :class="{active: room.id == active_room}" 
        v-for="room in rooms" :key="room.id" @click="select(room.id)">
      <h4 class="list-group-item-heading">{{ room.name }}</h4>
      <p class="list-group-item-text">{{ room.description }}</p>
    </a>
  </div>
</template>

<script>
export default {
  name: "RoomList",
  props: {
    rooms: {
      type: Array,
      default: []
    }
  },
  data: function () {
    return {
      active_room: null
    }
  },
  methods: {
    select: function (room_id) {
      this.active_room = room_id
      this.$emit("select", room_id)
    }
  },
  computed: {
    isActive: function (id) {
      return id === this.active_room
    }
  }
}   
</script>

<style>

</style>
