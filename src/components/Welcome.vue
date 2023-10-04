<template>
  <div class="app-container">
    <el-card>
      <el-row class="head-row" :gutter="20">
        <el-col :span="30">
          <el-button type="primary" @click="loadJsonFile">加载JSON文件</el-button>
          <!-- v-if="jsonData" -->
        </el-col>
        <el-divider direction="vertical"></el-divider>
        <el-col :span="30">
          <el-tag>JSON文件名称: {{ fileName }}</el-tag>
        </el-col>
        <el-divider direction="vertical"></el-divider>
        <el-col :span="30">
          <el-checkbox v-model="autoRotate">autoRotate</el-checkbox>
        </el-col>
        <el-divider direction="vertical"></el-divider>
        <el-col :span="30" class="time-interval-slider-col">
          <el-tooltip class="item" effect="dark" content="~1000 可按住左键拖移视角" placement="top-start">
            <div class="time-interval-slider-col-label">timeInterval</div>
          </el-tooltip>
          <el-slider v-model="sliderValue" :min="50" :max="2000" show-input></el-slider>
        </el-col>
        <el-divider direction="vertical"></el-divider>
        <el-col :span="30">
          <el-button size="small" :type="stopStatus ? 'primary' : 'danger'" @click="handleStop">
            {{ stopStatus ? '开始' : '停止' }}
          </el-button>
        </el-col>
      </el-row>
    </el-card>
    <!-- <el-row style="margin-top: 30px">
      <span class="demonstration">演示速度</span>
      <el-slider v-model="sliderValue"></el-slider>
    </el-row> -->

    <el-row style="margin-top: 30px">
      <el-col :span="56">
        <div id="main" style="width: 1000px; height: 700px"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// 1.导入echarts
import * as echarts from 'echarts'
import 'echarts-gl'

export default {
  data() {
    return {
      fileName: null,
      myChart: null,
      timer: null,
      sliderValue: 50,
      autoRotate: false,
      stopStatus: true,
      mmwaveScatterData: [],
      kinectScatterData: []
    }
  },
  methods: {
    loadJsonFile() {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.json'

      input.addEventListener('change', (event) => {
        const file = event.target.files[0]
        this.fileName = file.name
        if (file) {
          const reader = new FileReader()

          reader.onload = (e) => {
            try {
              this.mmwaveScatterData = []
              this.kinectScatterData = []
              let tempMmwaveData = []
              let tempKinectData = []
              const jsonContent = JSON.parse(e.target.result)
              // 遍历data
              jsonContent.data.forEach((item) => {
                // mmwave
                tempMmwaveData = []
                item.mmwave_data.forEach((item) => {
                  tempMmwaveData.push([item.x, item.y, item.z])
                })
                this.mmwaveScatterData.push(tempMmwaveData)

                // kinect
                tempKinectData = []
                tempKinectData.push([
                  item.kinect_data.torso.x,
                  item.kinect_data.torso.y,
                  item.kinect_data.torso.z
                ])
                tempKinectData.push([
                  item.kinect_data.left_hip.x,
                  item.kinect_data.left_hip.y,
                  item.kinect_data.left_hip.z
                ])
                tempKinectData.push([
                  item.kinect_data.right_hip.x,
                  item.kinect_data.right_hip.y,
                  item.kinect_data.right_hip.z
                ])
                tempKinectData.push([
                  item.kinect_data.left_shoulder.x,
                  item.kinect_data.left_shoulder.y,
                  item.kinect_data.left_shoulder.z
                ])
                tempKinectData.push([
                  item.kinect_data.right_shoulder.x,
                  item.kinect_data.right_shoulder.y,
                  item.kinect_data.right_shoulder.z
                ])
                tempKinectData.push([
                  item.kinect_data.neck.x,
                  item.kinect_data.neck.y,
                  item.kinect_data.neck.z
                ])
                this.kinectScatterData.push(tempKinectData)
              })
            } catch (error) {
              console.error('JSON解析错误:', error)
            }
            this.stopStatus = false
            this.createScatter3DChart()
          }
          reader.readAsText(file)
        }
      })

      input.click()
    },
    resetInterval(ms) {
      clearInterval(this.timer)
      this.timer = setInterval(this.updataScatter3DChart, ms)
    },
    createScatter3DChart() {
      if (this.mmwaveScatterData.length != 0) {
        this.myChart.hideLoading()
      }
      this.resetInterval(this.sliderValue)
    },
    updataScatter3DChart() {
      let mmwaveData = []
      let kinectData = []
      if (this.mmwaveScatterData.length != 0) {
        mmwaveData = this.mmwaveScatterData.shift()
        kinectData = this.kinectScatterData.shift()
      } else {
        clearInterval(this.timer)
      }
      const min = -2
      const max = 5
      const option = {
        tooltip: {},
        grid3D: {
          viewControl: {
            autoRotate: this.autoRotate // 在没有用户交互时自动旋转视图
          }
        },
        legend: {
          data: ['mmwave', 'kinect2']
        },
        series: [
          {
            name: 'mmwave',
            type: 'scatter3D', // 使用散点图
            data: mmwaveData,
            symbolSize: 10, // 点的大小
            animation: true // 启动动画效果
            // animationDuration: 1000, // 动画的时长, 以毫秒为单位
            // animationEasing: 'cubicInOut', // 缓动动画，linear:线性变化  bounceOut: 线性变化
            // animationDelay: function (idx) {
            //   console.log(idx)
            //   return 500 * idx // 不同值得到不同的动画时长
            // },
            // animationDelay: 1000,
            // animationThreshold: 5, // 动画元素的阈值,
          },
          {
            name: 'kinect2',
            type: 'scatter3D', // 使用散点图
            data: kinectData,
            symbolSize: 10, // 点的大小
            animarion: true // 启动动画效果
          }
        ]
      }
      this.myChart.setOption(option)
    },
    handleStop() {
      this.stopStatus = !this.stopStatus
    }
  },
  // 此时,页面上的元素,已经被渲染完毕了
  async mounted() {
    // 初始化echarts实例
    this.myChart = echarts.init(document.getElementById('main'))

    // this.myChart.showLoading()

    // 指定图表的配置项和数据

    const min = -2
    const max = 5
    const option = {
      tooltip: {},
      xAxis3D: { min: min, max: max, name: 'X' },
      yAxis3D: { min: min, max: max, name: 'Y' },
      zAxis3D: { min: min, max: max, name: 'Z' },
      grid3D: {
        viewControl: {
          autoRotate: this.autoRotate // 在没有用户交互时自动旋转视图
        }
      },
      legend: {
        data: ['mmwave', 'kinect2']
      },
      series: [
        {
          name: 'mmwave',
          type: 'scatter3D', // 使用散点图
          data: this.mmwaveScatterData,
          symbolSize: 10, // 点的大小
          animation: true, // 启动动画效果
          itemStyle: {
            color: 'blue' // 点的颜色
          }
        },
        {
          name: 'kinect2',
          type: 'scatter3D', // 使用散点图
          data: this.kinectScatterData,
          symbolSize: 10, // 点的大小
          animation: true, // 启动动画效果
          itemStyle: {
            color: 'red' // 点的颜色
          }
        }
      ]
    }

    // 展示数据
    this.myChart.setOption(option)
  },
  async beforeDestroy() {
    this.myChart.dispose()
  },
  watch: {
    sliderValue(val) {
      if (!this.stopStatus) {
        this.resetInterval(val)
      }
    },
    stopStatus(sta) {
      if (sta) {
        // 停止
        clearInterval(this.timer)
      } else {
        // 开始
        this.resetInterval(this.sliderValue)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.head-row {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
}

.time-interval-slider-col {
  display: flex;
  width: 400px;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;

  .time-interval-slider-col-label {
    font-size: 14px;
  }

  .el-slider {
    width: 400px;
  }

  width: 400px;
}
</style>
