<template>
  <div @mouseup="mouseup">
    <el-container class="container">
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
      <el-main class="main">
        <canvas
          ref="canvas"
          width="1000px"
          height="500px"
          @mousedown="mousedown"
          @mousemove="mousemove"
          @mouseup="mouseup"
        ></canvas>
      </el-main>
    </el-container>
  </div>
</template>
<style lang="less" scoped>
.head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid gray;
  height: 8vh !important;
}
.container {
  width: 100vw;
  height: 100vh;
}
.main {
  background-color: black;
  display: flex;
  justify-content: center;
  align-items: center;
}
canvas {
  border: 1px solid red;
}
</style>
<script>
import { mapState } from 'vuex'

export default {
  data: function () {
    return {
      time: "",
      ctx: "",
      arr: [],
      r: 2,
      one: {},
      color: 'rgb(219,255,69)',
      isDown: false
    }
  },
  mounted () {
    this.ctx = this.$refs.canvas.getContext('2d')
    this.drawCenter()
    this.draw()
  },
  created () {
    this.$store.state.list.some(item => item.router === this.$router.history.current.path) ? this.$store.commit('change', this.$router.history.current.path) : ""
  },
  methods: {
    //  路由跳转
    skip: function (path) {
      if (this.$router.history.current.path !== path) {
        this.$router.push(path)
      }
    },
    //  drawCenter
    drawCenter () {
      let ctx = this.ctx
      ctx.save()
      ctx.beginPath()
      ctx.arc(ctx.canvas.width / 2, ctx.canvas.height / 2, 6, 0, 2 * Math.PI)
      ctx.fillStyle = 'hotpink'
      ctx.fill()
      ctx.restore()
    },
    //  addDotted
    mousedown (e) {
      this.getXY(e)
      this.isDown = true
    },
    mousemove (e) {
      if (this.isDown) {
        this.getXY(e)
      }
    },
    mouseup () {
      this.isDown = false
    },
    getXY: function (e) {
      let center = {
        x: this.ctx.canvas.width / 2,
        y: this.ctx.canvas.height / 2
      }
      this.one.x = e.pageX - this.$refs.canvas.getBoundingClientRect().left
      this.one.y = e.pageY - this.$refs.canvas.getBoundingClientRect().top
      let deg = Math.atan((this.one.y - center.y) / (this.one.x - center.x)) * 180 / Math.PI
      // if (this.one.x >= center.x && this.one.y >= center.y) {
      // }
      if (this.one.x <= center.x && this.one.y >= center.y) {
        deg = 180 - Math.abs(deg)
      }
      if (this.one.x <= center.x && this.one.y <= center.y) {
        deg = Math.abs(deg) + 180
      }
      if (this.one.x >= center.x && this.one.y <= center.y) {
        deg = 360 - Math.abs(deg)
      }
      let r = Math.sqrt(Math.pow(this.one.y - center.y, 2) + Math.pow(this.one.x - center.x, 2), 2)
      this.arr.push({ r, deg })
    },
    // draw
    drawCircle () {
      let ctx = this.ctx
      this.arr.forEach(item => {
        ctx.save()
        ctx.beginPath()
        let x = this.ctx.canvas.width / 2 + item.r * Math.cos(item.deg * Math.PI / 180)
        let y = this.ctx.canvas.height / 2 + item.r * Math.sin(item.deg * Math.PI / 180)
        ctx.arc(x, y, this.r, 0, 2 * Math.PI)
        let color = 255 - ((item.deg % 360) / 360) * 255
        ctx.fillStyle = `rgb(219,${color},69)`
        ctx.fill()
        ctx.restore()
        item.deg += 1
      })
    },
    draw () {
      requestAnimationFrame(this.draw)
      this.clearCanvas()
      this.drawCircle()
      this.drawCenter()

    },
    //  clearCanvas
    clearCanvas () {
      this.ctx.save()
      this.ctx.beginPath()
      this.ctx.fillStyle = 'rgba(0,0,0,0.1)'
      this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
      this.ctx.restore()
    },
  },
  computed: {
    ...mapState(['list'])
  }
}
</script>>