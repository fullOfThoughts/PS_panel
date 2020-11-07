<template>
  <div @mouseup="mouseup">
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
      <el-container>
        <el-aside class="aside">
          <el-button type="danger" class="reset" @click="reset"
            >reset</el-button
          >
          <el-button type="primary" class="upload" @click="middleWare"
            >upload</el-button
          >
          <input
            accept="image/*"
            type="file"
            ref="ipt"
            hidden
            @input="change"
          />
        </el-aside>
        <el-main>
          <canvas
            ref="canvas"
            class="canvas"
            width="500px"
            height="500px"
            @mousedown="mousedown"
            @mousemove="mousemove"
            @mouseup="mouseup"
          ></canvas>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<style lang="less" scoped>
.con {
  width: 100vw;
  height: 100vh;
}
.head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid gray;
  height: 8vh !important;
}
.aside {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.canvas {
  border: 1px solid red;
}
.upload {
  width: 20vw;
  margin: 0;
  margin-top: 20px;
}
.reset {
  width: 20vw;
}
</style>
<script>
import moment from 'moment'
import { mapState } from 'vuex'


export default {

  data: function () {
    return {
      time: "",
      src: '',
      isDown: false,
      magnifyX: 0,
      magnifyY: 0,
      ctx: '',
      one: {},
      two: {},
      img: "",
      W: 500,
      H: 500
    }
  },
  created () {
    this.timer = setInterval(() => {
      this.time = moment(Date.now()).format('YYYY-MM-DD hh:mm:ss')
    }, 1000)
    this.$store.state.list.some(item => item.router === this.$router.history.current.path) ? this.$store.commit('change', this.$router.history.current.path) : ""
  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
  mounted () {
    this.ctx = this.$refs.canvas.getContext("2d")
    this.getImage()
    this.W = this.ctx.canvas.width
    this.H = this.ctx.canvas.height
  },
  methods: {
    //  路由跳转
    skip: function (path) {
      if (this.$router.history.current.path !== path) {
        this.$router.push(path)
      }
    },
    //  事件
    mousedown: function (event) {
      this.getImage()
      this.isDown = true
      this.getXY("one", event)
    },
    mousemove: function (event) {
      if (this.isDown) {
        this.putImage()
        this.getXY('two', event)
        this.drawRect()
      }
    },
    mouseup: function () {
      this.putImage()
      if (this.W > 10 && this.H > 10 && this.isDown === true) {
        this.ctx.drawImage(this.$refs.canvas, this.magnifyX, this.magnifyY, this.W, this.H, 0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
        this.getImage()

        this.putImage()
      }
      this.init()
      this.isDown = false
    },
    //  获取鼠标位置
    getXY: function (number, e) {
      if (number === 'one') {
        this.one.x = e.pageX - this.$refs.canvas.getBoundingClientRect().left
        this.one.y = e.pageY - this.$refs.canvas.getBoundingClientRect().top
        this.one.x = Math.round(this.one.x) + 0.5
        this.one.y = Math.round(this.one.y) + 0.5
      }
      if (number === 'two') {
        this.two.x = e.pageX - this.$refs.canvas.getBoundingClientRect().left
        this.two.y = e.pageY - this.$refs.canvas.getBoundingClientRect().top
        this.two.x = Math.round(this.two.x) + 0.5
        this.two.y = Math.round(this.two.y) + 0.5
      }
    },
    //  画出复选框和矩形
    drawRect () {
      let x2 = this.two.x;
      let y2 = this.two.y;
      let x1 = this.one.x;
      let y1 = this.one.y
      // 调整起点顺序
      if (x2 < x1 && y2 < y1) {
        this.magnifyX = x2
        this.magnifyY = y2
      } else if (x2 < x1 && y2 > y1) {
        this.magnifyX = x2
        this.magnifyY = y1
      } else if (x2 > x1 && y2 < y1) {
        this.magnifyX = x1
        this.magnifyY = y2
      } else {
        this.magnifyX = x1
        this.magnifyY = y1
      }
      this.W = Math.abs(x2 - x1)
      this.H = Math.abs(y2 - y1)
      this.ctx.save()
      this.ctx.beginPath()
      this.ctx.setLineDash([5, 5])
      this.ctx.strokeStyle = 'gray'
      this.ctx.strokeRect(this.magnifyX, this.magnifyY, this.W, this.H)
      this.ctx.restore()
    },
    getImage (x = 0, y = 0, W = this.ctx.canvas.width, H = this.ctx.canvas.height) {
      this.img = this.ctx.getImageData(x, y, W, H)
    },
    putImage () {
      this.ctx.putImageData(this.img, 0, 0)
    },
    //  image
    change () {
      if (this.$refs.ipt.files.length > 0) {
        let reader = new FileReader()
        reader.readAsDataURL(this.$refs.ipt.files[0])
        reader.onload = () => {
          let img = document.createElement("img")
          img.onload = () => {
            this.lala = reader.result
            this.src = img
          }
          img.src = reader.result
        }
      }
    },
    middleWare () {
      this.$refs.ipt.click()
    },
    //  init
    init () {
      this.W = this.H = 0
    },
    //  reset
    reset () {
      if (this.src !== '') {
        this.ctx.drawImage(this.src, 0, 0, 500, 500)
      }
    }
  },
  watch: {
    src (val) {
      this.src = val
      this.ctx.drawImage(val, 0, 0, 500, 500)
      this.getImage()
    }
  },
  computed: {
    ...mapState(['list'])
  }
}
</script>