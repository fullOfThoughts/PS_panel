<template>
  <div class="home" @mouseup="mouseup">
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
      <el-container>
        <el-aside class="aside">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>工具箱</span>
            </div>
            <div class="text item card_item">
              填充<el-switch
                v-model="isFill"
                active-color="#ff4949"
                inactive-color="gray"
              >
              </el-switch>
            </div>
            <div class="text item card_item">
              <el-button type="primary" @click="reset">清空</el-button>
            </div>
            <div class="text item card_item">
              <el-slider
                :min="min"
                :max="max"
                v-model="lineWidth"
                class="slider"
              ></el-slider>
            </div>
            <div class="text item card_item">
              <el-select size="mini" v-model="value" placeholder="line">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
            <div class="text item card_item">
              <el-color-picker v-model="color" show-alpha> </el-color-picker>
            </div>
          </el-card>
        </el-aside>
        <el-main>
          <canvas
            id="canvas"
            ref="canvas"
            @mousedown="mousedown"
            @mousemove="mousemove"
            @mouseup="mouseup"
            @dblclick="isOk"
          >
          </canvas>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<style lang="less" scoped>
.home {
  width: 100vw;
  height: 100vh;
}
.container {
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
  border-right: 1px solid gray;
  width: 25vw !important;
}
.box-card {
  height: 99%;
  .card_item {
    border-bottom: 2px solid rgb(235, 226, 226);
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 6vh;
    padding: 10px 0;
  }
  .slider {
    width: 20vw;
  }
}
#canvas {
  width: 500;
  height: 500;
  border: 1px solid red;
}
</style>
<script>
import moment from 'moment'
import { mapState } from 'vuex'

export default {
  data: function () {
    return {
      time: "",
      isFill: false,
      options: [
        { value: "line", label: "line" },
        { value: "rect", label: "rect" },
        { value: "circle", label: "circle" },
        { value: "eraser", label: 'eraser' },
        { value: "bessel2", label: 'bessel2' },
        { value: "polygon", label: 'polygon' },

      ],
      bgc: "#fff",
      value: "line",
      color: "rgba(255, 69, 0, 0.68)",
      one: {},
      two: {},
      isDown: false,
      ctx: '',
      img: "",
      isMove: false,
      min: 1,
      max: 50,
      lineWidth: 1,
      start: {
        isCapture: false,
        XY: []
      },
      contral: {
        isCapture: false,
        XY: []
      },
      end: {
        isCapture: false,
        XY: []
      },
      center: [],
      r: 0,
      deg: 0,
      lock: '',
      status: 'create'
    }
  },
  created () {
    this.timer = setInterval(() => {
      this.time = moment(Date.now()).format('YYYY-MM-DD hh:mm:ss')
    }, 1000)
    this.$store.state.list.some(item => item.router === this.$router.history.current.path) ? this.$store.commit('change', this.$router.history.current.path) : ""

  },
  //  获取绘图工具
  mounted () {
    this.$refs.canvas.style.backgroundColor = this.bgc
    this.$refs.canvas.width = 1000
    this.$refs.canvas.height = 575
    this.ctx = this.$refs.canvas.getContext("2d")
    this.getImage()
  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
  methods: {
    mousedown: function (event) {
      if (this.value === 'bessel2' || this.value === 'polygon') {
        this.isDown = true
        this.getXY("one", event)
      } else {
        this.isDown = true
        this.getXY("one", event)
        this.getImage()
      }
    },
    mousemove: function (event) {
      if (this.isDown) {
        this.isMove = true
        this.getXY("two", event)
        //  橡皮檫
        if (this.value === 'eraser') {
          this.eraser()
          this.getImage()
        }
        //  其他
        if (this.value === 'line') {
          this.putImage()
          this.drawRect()
          this.drawLine()
        }
        if (this.value === 'rect') {
          this.putImage()
          this.drawRect('solid')
        }
        if (this.value === 'circle') {
          this.putImage()
          this.drawCircle()
        }
        if (this.value === 'bessel2') {
          this.putImage()
          this.drawBessel2()
        }
        if (this.value === 'polygon') {
          this.putImage()
          this.drawPolygon()
        }
      }
    },
    mouseup: function () {

      if (this.value === 'bessel2' || this.value === 'polygon') {
        this.isDown = false
        if (this.status === 'create') {
          this.two.x = this.one.x;
          this.two.y = this.one.y
        }
        this.isMove ? this.status = 'modify' : ''
        this.isMove = false
        this.lock = ''
      } else {
        this.putImage()
        if (this.value === 'line') {
          this.drawLine()
        }
        if (this.value === 'rect') {
          this.drawRect("solid")
        }
        if (this.value === 'circle') {
          this.drawCircle()
        }

        if (!this.isMove) {
          this.two.x = this.one.x
          this.two.y = this.one.y
        }
        this.isDown = false
        this.isMove = false
        this.getImage()
      }
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
    drawRect (type = 'dotted') {
      this.ctx.save()
      this.ctx.beginPath()
      this.ctx.moveTo(this.one.x, this.one.y)
      this.ctx.lineTo(this.two.x, this.one.y)
      this.ctx.lineTo(this.two.x, this.two.y)
      this.ctx.lineTo(this.one.x, this.two.y)
      this.ctx.closePath()
      if (type === 'dotted') {
        this.ctx.setLineDash([5, 5])
        this.ctx.strokeStyle = 'gray'
        this.ctx.stroke()
      }
      if (type === 'solid') {
        if (this.isFill) {
          this.ctx.fillStyle = this.color
          this.ctx.fill()
        } else {
          this.ctx.strokeStyle = this.color
          this.ctx.lineWidth = this.lineWidth
          this.ctx.stroke()
        }
      }
      this.ctx.restore()
    },
    //  画出直线
    drawLine () {
      this.ctx.save()
      this.ctx.beginPath()
      this.ctx.moveTo(this.one.x, this.one.y)
      this.ctx.lineTo(this.two.x, this.two.y)
      this.ctx.strokeStyle = this.color
      this.ctx.lineWidth = this.lineWidth
      this.ctx.stroke()
      this.ctx.restore()
    },
    //  画圆
    drawCircle () {
      if (this.isMove === true) {
        this.ctx.save()
        this.ctx.beginPath()
        let x = Math.abs(this.one.x - this.two.x)
        let y = Math.abs(this.one.y - this.two.y)
        let r = Math.sqrt(x * x + y * y, 2)
        this.ctx.arc(this.one.x, this.one.y, r, 0, 2 * Math.PI)
        if (this.isFill) {
          this.ctx.fillStyle = this.color
          this.ctx.fill()
        } else {
          this.ctx.strokeStyle = this.color
          this.ctx.lineWidth = this.lineWidth
          this.ctx.stroke()
        }
        this.ctx.restore()
      }
    },
    //  eraser
    eraser () {
      this.ctx.save()
      this.ctx.beginPath()
      let r = this.lineWidth
      this.ctx.arc(this.two.x, this.two.y, r, 0, 2 * Math.PI)
      this.ctx.fillStyle = this.bgc
      this.ctx.fill()
      this.ctx.restore()
    },
    //  bessel2
    drawBessel2 () {
      let ctx = this.ctx
      let start, contral, end;
      if (this.status === 'create') {
        start = [this.one.x, this.one.y]
        contral = [(this.two.x + this.one.x) / 2, (this.two.y + this.one.y) / 2];
        end = [this.two.x, this.two.y];
        this.start = {
          isCapture: false,
          XY: start
        }
        this.contral = {
          isCapture: false,
          XY: contral
        }
        this.end = {
          isCapture: false,
          XY: end
        }
      }
      if (this.status === 'modify') {
        start = this.start.XY
        contral = this.contral.XY
        end = this.end.XY
      }
      if (this.status === 'finish') {
        start = this.start.XY
        contral = this.contral.XY
        end = this.end.XY
        ctx.save()
        ctx.beginPath()
        ctx.moveTo(...start)
        ctx.quadraticCurveTo(...contral, ...end)
        if (this.isFill) {
          ctx.fillStyle = this.color
          ctx.lineWidth = this.lineWidth
          ctx.fill()
          ctx.closePath()
        }
        ctx.strokeStyle = this.color
        ctx.lineWidth = this.lineWidth
        ctx.lineJoin = 'round'
        ctx.stroke()
        ctx.restore()
        this.status = 'create'
        return
      }

      ctx.save()
      ctx.beginPath()
      ctx.moveTo(...start)
      ctx.quadraticCurveTo(...contral, ...end)
      if (this.isFill) {
        ctx.fillStyle = this.color
        ctx.lineWidth = this.lineWidth
        ctx.fill()
        ctx.closePath()
      }
      ctx.strokeStyle = this.color
      ctx.lineWidth = this.lineWidth
      ctx.lineJoin = 'round'
      ctx.stroke()
      ctx.restore()

      ctx.save()
      ctx.beginPath()
      ctx.moveTo(...end)
      ctx.lineTo(...contral)
      ctx.strokeStyle = '#3a88fd'
      ctx.stroke()
      //  judge
      let judge = (type) => {
        if (ctx.isPointInPath(this.two.x, this.two.y)) {
          if (this.lock === '' || this.lock === type) {
            this.lock = type
            this[type] = {
              isCapture: true,
              XY: [this.two.x, this.two.y]
            }
            let arr = ['contral', 'end', 'start']
            arr.forEach(item => {
              if (item !== type) {
                this[item].isCapture = false
              }
            })
          } else {
            this[type].isCapture = false
          }
        }
      }

      ctx.beginPath()
      ctx.arc(...start, 30, 0, 2 * Math.PI)
      ctx.strokeStyle = '#3a88fd'
      ctx.stroke()
      judge('start')

      ctx.beginPath()
      ctx.arc(...contral, 30, 0, 2 * Math.PI)
      ctx.strokeStyle = '#3a88fd'
      ctx.stroke()
      judge("contral")

      ctx.beginPath()
      ctx.arc(...end, 30, 0, 2 * Math.PI)
      ctx.strokeStyle = '#3a88fd'
      ctx.stroke()
      judge('end')

      ctx.restore()
    },
    //  drawPolygon
    drawPolygon () {
      let ctx = this.ctx;
      let silderDge = 360 / this.lineWidth
      //  
      let draw = (center, deg, r) => {
        ctx.save()
        ctx.beginPath()
        for (let i = 0; i <= this.lineWidth; i++) {
          if (i === 0) {
            ctx.moveTo(center[0] + r * Math.cos(deg * Math.PI / 180), center[1] + r * Math.sin(deg * Math.PI / 180))
          } else if (i < this.lineWidth) {
            ctx.lineTo(center[0] + r * Math.cos((deg + i * silderDge) * Math.PI / 180), center[1] + r * Math.sin((deg + i * silderDge) * Math.PI / 180))
          } else {
            ctx.closePath()
            if (this.isFill) {
              ctx.fillStyle = this.color
              ctx.fill()
            }
            ctx.lineWidth = 1
            ctx.strokeStyle = this.color
            ctx.stroke()
          }
        }
        ctx.restore()
      }
      //
      if (this.status === 'create') {
        let center = [this.one.x, this.one.y];
        this.center = center
        let r = Math.sqrt(Math.pow(this.one.x - this.two.x, 2) + Math.pow(this.one.y - this.two.y, 2), 2)
        this.r = r
        let DX = Math.abs(this.one.x - this.two.x)
        let DY = Math.abs(this.one.y - this.two.y)
        let initDge = Math.atan(DY / DX) * 180 / Math.PI
        let deg;
        if (this.one.x === this.two.x) {
          if (this.one.y <= this.two.y) {
            deg = 90
          } else {
            deg = 270
          }
        } else if (this.one.y === this.two.y) {
          if (this.one.x <= this.two.x) {
            deg = 0
          } else {
            deg = 180
          }
        } else if (this.two.x > this.one.x && this.two.y > this.one.y) {
          deg = initDge
        } else if (this.two.x < this.one.x && this.two.y > this.one.y) {
          deg = 180 - initDge
        } else if (this.two.x < this.one.x && this.two.y < this.one.y) {
          deg = 180 + initDge
        } else if (this.two.x > this.one.x && this.two.y < this.one.x) {
          deg = 360 - initDge
        }
        this.deg = deg
        //  判断是否能构成polygin
        if (this.lineWidth < 3) {
          return this.$message('请通过lineWidth来模拟边数，不能小于3')
        }
        //  drawPolygon
        draw(center, deg, r,)

      } else if (this.status === 'modify') {
        let center = [this.two.x, this.two.y]
        let deg = this.deg
        let r = this.r
        draw(center, deg, r)


      } else if (this.status === 'finish') {
        let center = [this.two.x, this.two.y]

        let deg = this.deg
        let r = this.r
        draw(center, deg, r)
        this.status = 'create'
      }
    },
    //  保存画布
    getImage: function () {
      this.img = this.ctx.getImageData(0, 0, this.$refs.canvas.width, this.$refs.canvas.height)
    },
    //  恢复画布
    putImage: function () {
      this.ctx.putImageData(this.img, 0, 0)
    },
    //  清空画布
    reset: function () {
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
    },
    //  路由跳转
    skip: function (path) {
      this.$router.push(path)
    },
    //  双击事件
    isOk () {
      if (this.value === 'bessel2') {
        if (this.status === 'modify') {
          this.putImage()
          this.status = 'finish'
          this.drawBessel2()
          this.getImage()
          this.putImage()
        }
      }
      if (this.value === 'polygon') {
        if (this.status === 'modify') {
          this.putImage()
          this.status = 'finish'
          this.drawPolygon()
          this.getImage()
          this.putImage()
        }
      }
    },


  },

  computed: {
    ...mapState(['list'])
  },
  watch: {
    value: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        if (this.status === 'modify' && oldVal === 'bessel2') {
          this.putImage()
          this.status = 'finish'
          this.drawBessel2()
          this.getImage()
          this.putImage()
        }
        if (this.status === 'modify' && oldVal === 'polygon') {
          this.putImage()
          this.status = 'finish'
          this.drawPolygon()
          this.getImage()
          this.putImage()
        }
      }
    }
  }
}
</script>