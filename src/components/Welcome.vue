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

    <el-row style="margin-top: 60px">
      <el-col :span="16">
        <div id="main" style="width: 1000px; height: 600px"></div>
      </el-col>
      <el-col :span="6"> </el-col>
    </el-row>
  </div>
</template>

<script>
// 1.导入echarts
import echarts from 'echarts'

export default {
  data() {
    return {
      fileName: null,
      jsonData: null
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
              this.jsonData = JSON.stringify(jsonContent, null, 2)
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
    // 3.基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'))
    // 4.准备数据项和配置项
    // 指定图表的配置项和数据
    var option = {
      legend: {},
      tooltip: {
        trigger: 'axis',
        showContent: false
      },
      dataset: {
        source: [
          ['product', '2012', '2013', '2014', '2015', '2016', '2017'],
          ['Matcha Latte', 41.1, 30.4, 65.1, 53.3, 83.8, 98.7],
          ['Milk Tea', 86.5, 92.1, 85.7, 83.1, 73.4, 55.1],
          ['Cheese Cocoa', 24.1, 67.2, 79.5, 86.4, 65.2, 82.5],
          ['Walnut Brownie', 55.2, 67.1, 69.2, 72.4, 53.9, 39.1]
        ]
      },
      xAxis: { type: 'category' },
      yAxis: { gridIndex: 0 },
      grid: { top: '55%' },
      series: [
        { type: 'line', smooth: true, seriesLayoutBy: 'row' },
        { type: 'line', smooth: true, seriesLayoutBy: 'row' },
        { type: 'line', smooth: true, seriesLayoutBy: 'row' },
        { type: 'line', smooth: true, seriesLayoutBy: 'row' },
        {
          type: 'pie',
          id: 'pie',
          radius: '30%',
          center: ['50%', '25%'],
          label: {
            formatter: '{b}: {@2012} ({d}%)'
          },
          encode: {
            itemName: 'product',
            value: '2012',
            tooltip: '2012'
          }
        }
      ]
    }

    myChart.on('updateAxisPointer', function (event) {
      var xAxisInfo = event.axesInfo[0]
      if (xAxisInfo) {
        var dimension = xAxisInfo.value + 1
        myChart.setOption({
          series: {
            id: 'pie',
            label: {
              formatter: '{b}: {@[' + dimension + ']} ({d}%)'
            },
            encode: {
              value: dimension,
              tooltip: dimension
            }
          }
        })
      }
    })
    // 数据合并
    //  const result = _.merge(res.data, this.options)
    // 5.展示数据
    myChart.setOption(option)
  }
}
</script>

<style>
div {
  margin: 0;
  padding: 0;
}
</style>
