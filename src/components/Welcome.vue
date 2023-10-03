<template>
  <div>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="30">
          <el-button type="primary" @click="loadJsonFile"
            >加载JSON文件</el-button
          >
          <el-divider direction="vertical"></el-divider>
          <!-- v-if="jsonData" -->
        </el-col>
        <el-col :span="30">
          <el-tag>JSON文件名称: {{ fileName }}</el-tag>
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
      // jsonData: null,
      scatterData: []
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
              this.scatterData = []
              var tempMmwaveData = []
              const jsonContent = JSON.parse(e.target.result)
              // 遍历data
              jsonContent.data.forEach((item) => {
                tempMmwaveData = []
                item.mmwave_data.forEach((item) => {
                  tempMmwaveData.push([item.x, item.y, item.z])
                })
                this.scatterData.push(tempMmwaveData)
              })
              // setTimeout(() => {
              //   // 创建散点图并设置动画效果
              //   this.createScatter3DChart()
              // }, 1000) // 模拟加载延迟
              // this.jsonData = JSON.stringify(jsonContent, null, 2)
            } catch (error) {
              console.error('JSON解析错误:', error)
            }
            // console.log(this.scatterData)
            this.createScatter3DChart()
          }
          reader.readAsText(file)
        }
      })

      input.click()
    },
    sleep(time) {
      var timeOut = new Date().getTime() + parseInt(time, 10)
      while (new Date().getTime() <= timeOut) {}
    },
    createScatter3DChart() {
      if (this.scatterData.length != 0) {
        this.myChart.hideLoading()
      }

      this.timer = setInterval(this.updataScatter3DChart, this.sliderValue)
    },
    updataScatter3DChart() {
      // while (this.scatterData.length != 0) {
      var data = []
      if (this.scatterData.length != 0) {
        data = this.scatterData.shift()
        // console.log(data)
      } else {
        clearInterval(this.timer)
      }
      // console.log(this.scatterData.length)
      const min = -2
      const max = 5
      var option = {
        tooltip: {},
        // xAxis3D: { min: min, max: max, name: 'X' },
        // yAxis3D: { min: min, max: max, name: 'Y' },
        // zAxis3D: { min: min, max: max, name: 'Z' },
        grid3D: {},
        series: [
          {
            name: 'mmwave',
            type: 'scatter3D', // 使用散点图
            data: data,
            symbolSize: 10, // 点的大小
            animarion: true, // 启动动画效果
            // animationDuration: 1000, // 动画的时长, 以毫秒为单位
            // animationEasing: 'cubicInOut', // 缓动动画，linear:线性变化  bounceOut: 线性变化
            // animationDelay: function (idx) {
            //   console.log(idx)
            //   return 500 * idx // 不同值得到不同的动画时长
            // },
            // animationDelay: 1000,
            // animationThreshold: 5, // 动画元素的阈值,
            itemStyle: {
              color: 'blue' // 点的颜色
            }
          }
        ]
        // animationEasing: 'bounceOut', // 缓动动画，linear:线性变化  bounceOut: 线性变化
        // animationDelayUpdate: function (idx) {
        //   return idx * 500
        // }
      }
      this.myChart.setOption(option)
    }
    // }
  },
  // 此时,页面上的元素,已经被渲染完毕了
  async mounted() {
    //createScatter3DChart() {
    // 初始化echarts实例
    this.myChart = echarts.init(document.getElementById('main'))

    this.myChart.showLoading()

    // 指定图表的配置项和数据

    const min = -2
    const max = 5
    var option = {
      tooltip: {},
      xAxis3D: { min: min, max: max, name: 'X' },
      yAxis3D: { min: min, max: max, name: 'Y' },
      zAxis3D: { min: min, max: max, name: 'Z' },
      grid3D: {},

      series: [
        {
          type: 'scatter3D', // 使用散点图
          data: this.scatterData,
          symbolSize: 10, // 点的大小
          animarion: true, // 启动动画效果
          itemStyle: {
            color: 'blue' // 点的颜色
          }
        }
      ]
    }

    // 展示数据
    this.myChart.setOption(option)
  }
}
</script>

<style>
div {
  margin: 0;
  padding: 0;
}
</style>
