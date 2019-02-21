<template>
    <el-card class="box">
         <cus-bread level1="数据统计" level2="数据报表"></cus-bread>
    </el-card>
</template>
<script>
import MyEcharts form 'echarts';
export default {
    data(){
        return
    }
},
methods: {
    initEcharts() {
        var myChart = echarts.init(document.getElementById('main'));
        myChart.setOption({
    title: {
        text: 'ECharts 入门示例'
    },
    tooltip: {},
    xAxis: {
        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
    },
    yAxis: {},
    series: [{
        name: '销量',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
    }]
});
    }
}
</script>
<style>
.box {
    height: 100%;
}

</style>


