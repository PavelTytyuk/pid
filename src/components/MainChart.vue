<script>
import Plotly from 'plotly.js/dist/plotly-basic.js'
export default {
  props: {
    baseLine: {
        type: Number,
        default: 0
    },
    min: {
        type: Number,
        default: 0
    },
    max: {
        type: Number,
        default: 3
    },
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    let that  = this;
    
    let layout= {
      plot_bgcolor:"black",
      paper_bgcolor:"black",
      font: {
        color: '#eee'
      },
      showlegend: false,
      autosize: true,
      width: 800,
      height: 150,
      margin: {
        l: 0,
        b: 0,
        r: 0,
        t: 0,
      },
      yaxis: {
        autorange: false,
        range: [this.min, this.max]
      }
    }
    Plotly.newPlot(this.$refs.chart, [{
      y: [],
      mode: 'lines',
      line: {color: '#eee', shape: 'spline'}
    },
                  {
      y: [this.baseLine],
      mode: 'lines',
      line: {color: '#9999', shape: 'spline'}
    }], layout);
  },
  methods: {
    extend(value){
        Plotly.extendTraces(this.$refs.chart, {
          y: [[value], [this.baseLine]]
        }, [0, 1], 100)
    }
  }
}
</script>
<template>
    <div>
        <div ref="chart"></div>
    </div>
</template>