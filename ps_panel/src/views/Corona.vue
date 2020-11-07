<template>
  <div class="box">
    <el-container class="con">
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
          width="1300px"
          height="550px"
          ref="canvas"
          @mousemove="move"
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
.con {
  width: 100vw;
  height: 100vh;
}
canvas {
  border: 1px solid red;
  background-color: black;
}
.main {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
<script>
import moment from 'moment'
import { mapState } from 'vuex'

export default {
  data: function () {

    return {
      r1: 80,
      r2: 10,
      time: "",
      one: {},
      two: {},
      cycle: 3000,
      step: 20,
      def: 0,
      DX: 0
    }
  },
  created () {
    this.timer = setInterval(() => {
      this.time = moment(Date.now()).format('YYYY-MM-DD hh:mm:ss')
    }, 1000)
    this.$store.state.list.some(item => item.router === this.$router.history.current.path) ? this.$store.commit('change', this.$router.history.current.path) : ""
  },
  mounted () {
    this.ctx = this.$refs.canvas.getContext("2d")
    this.animation()
    // this.two = this.one
  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
  methods: {
    //  路由跳转
    skip: function (path) {
      if (this.$router.history.current.path !== path) {
        this.$router.push(path)

      }
    },
    //  move
    move (e) {
      this.DX = Math.abs(e.pageX - (this.one.x + this.$refs.canvas.getBoundingClientRect().left))
      this.getXY(e)
    },
    //  get-coord
    getXY: function (e) {
      this.one.x = e.pageX - this.$refs.canvas.getBoundingClientRect().left
      this.one.y = e.pageY - this.$refs.canvas.getBoundingClientRect().top
      this.one.x = Math.round(this.one.x) + 0.5
      this.one.y = Math.round(this.one.y) + 0.5
    },
    //  drawCircle
    drawCircle (x, y, color) {
      this.ctx.beginPath()
      this.ctx.arc(x, y, this.r2, 0, 2 * Math.PI)
      this.ctx.fillStyle = color
      this.ctx.fill()
    },
    //  get-circle-coord
    getCircleCoord (deg) {
      if (this.DX < 3) {
        if (this.r1 <= 80) {
          this.r1 += 1
        }
        if (this.step > 20) {
          this.step -= 1
        }
      }
      if (this.DX > 3) {
        if (this.r1 >= 50) {
          this.r1 -= 1
        }
        if (this.step < 100) {
          this.step += 1
        }
      }
      let x = this.one.x + this.r1 * Math.cos(deg)
      let y = this.one.y + this.r1 * Math.sin(deg)
      return { x, y }
    },
    //  animation
    animation () {
      requestAnimationFrame(this.animation)
      this.clearCanvas()
      this.def += this.step
      this.def >= 3000 ? this.def = 0 : ""
      this.deg = this.def / this.cycle * 360
      let coord = this.getCircleCoord(this.deg * Math.PI / 180)
      let coord2 = this.getCircleCoord((this.deg + 60) * Math.PI / 180)
      let coord3 = this.getCircleCoord((this.deg + 120) * Math.PI / 180)
      let coord4 = this.getCircleCoord((this.deg + 180) * Math.PI / 180)
      let coord5 = this.getCircleCoord((this.deg + 240) * Math.PI / 180)
      let coord6 = this.getCircleCoord((this.deg + 300) * Math.PI / 180)

      this.drawCircle(coord.x, coord.y, "#99CC33")
      this.drawCircle(coord2.x, coord2.y, '#FF9900')
      this.drawCircle(coord3.x, coord3.y, "#FFCC00")
      this.drawCircle(coord4.x, coord4.y, "#FF0033")
      this.drawCircle(coord5.x, coord5.y, "#FFFFFF")
      this.drawCircle(coord6.x, coord6.y, "#FF9966")
    },
    //  clearCanvas
    clearCanvas () {
      this.ctx.save()
      this.ctx.beginPath()
      this.ctx.fillStyle = 'rgba(0,0,0,0.15)'
      this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
      this.ctx.restore()
    },

  },

  computed: {
    ...mapState(['list'])
  }

}
</script>