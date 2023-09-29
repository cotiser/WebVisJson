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

    <el-row>
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
              const jsonContent = JSON.parse(e.target.result)
              // 遍历data
              jsonContent.data.forEach((item) => {
                this.scatterData.push([
                  item.mmwave_data[0].x,
                  item.mmwave_data[0].y,
                  item.mmwave_data[0].z
                ])
              })
              // setTimeout(() => {
              //   // 创建散点图并设置动画效果
              //   this.createScatter3DChart()
              // }, 1000) // 模拟加载延迟
              // this.jsonData = JSON.stringify(jsonContent, null, 2)
            } catch (error) {
              console.error('JSON解析错误:', error)
            }
          }

          reader.readAsText(file)
        }
      })

      input.click()
    }
  },
  // 此时,页面上的元素,已经被渲染完毕了
  async mounted() {
    //createScatter3DChart() {
    // 初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'))

    // 准备数据项和配置项
    // const data = [
    //   [6.5423455238342285, 0.8681341409683228, 2.162891149520874],
    //   [3.5882620811462402, 1.1126402616500854, 1.23966646194458],
    //   [3.5893783569335938, 1.1002776622772217, 1.1001211404800415]
    //   // 添加更多数据点...
    // ]
    // 指定图表的配置项和数据
    while (this.scatterData.length != 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000)) // 异步等待 3 秒
      console.log(this.scatterData)
      var option = {
        tooltip: {},
        xAxis3D: { name: 'X' },
        yAxis3D: { name: 'Y' },
        zAxis3D: { name: 'Z' },
        grid3D: {},
        series: [
          {
            type: 'scatter3D', // 使用散点图
            data: this.scatterData.shift(),
            symbolSize: 10, // 点的大小
            animarion: true, // 启动动画效果
            itemStyle: {
              color: 'blue' // 点的颜色
            }
          }
        ]
      }
      // 展示数据
      myChart.setOption(option)
    }

    // 鼠标事件处理
    // myChart.on('updateAxisPointer', function (event) {
    //   var xAxisInfo = event.axesInfo[0]
    //   if (xAxisInfo) {
    //     var dimension = xAxisInfo.value + 1
    //     myChart.setOption({
    //       series: {
    //         id: 'pie',
    //         label: {
    //           formatter: '{b}: {@[' + dimension + ']} ({d}%)'
    //         },
    //         encode: {
    //           value: dimension,
    //           tooltip: dimension
    //         }
    //       }
    //     })
    //   }
    // })

    // 数据合并
    //  const result = _.merge(res.data, this.options)
  }
}
</script>

<style>
div {
  margin: 0;
  padding: 0;
}
</style>
