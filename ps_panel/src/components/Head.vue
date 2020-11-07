<template>
  <el-header class="head">
        <div>
          <el-button
            v-for="item in list"
            :key="item.name"
            :type="item.type"
            @click="skip(item.router)"
            >{{ item.name }}</el-button
          >
        </div>
        <h4>{{ time }}</h4>
      </el-header>
</template>
<style lang="less" scoped>
.head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid gray;
  height: 8vh !important;
}
</style>
<script>
import moment from 'moment'
export default {
  data() {
    return {
      time:""
    }
  },
   created () {
    this.timer = setInterval(() => {
      this.time = moment(Date.now()).format('YYYY-MM-DD hh:mm:ss')
    }, 1000)
    this.$store.state.list.some(item => item.router === this.$router.history.current.path) ? this.$store.commit('change', this.$router.history.current.path) : ""
  },
}
</script>