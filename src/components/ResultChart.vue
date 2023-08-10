<script>

import Plotly from 'plotly.js/dist/plotly-basic.js'
import _map from 'lodash/map'

export default {
  props: ['time', 'timeEntries', 'pidOptions', 'baseLine'],
  data() {
    return {
      
    }
  },
  mounted() {
    let layout= {
      title: this.time,
      plot_bgcolor:"black",
      paper_bgcolor:"black",
      font: {
        color: '#eee'
      },
      showlegend: false,
      autosize: true,
      width: 200,
      height: 80,
      margin: {
        l: 0,
        b: 0,
        r: 0,
        t: 0,
      },
      yaxis: {
        autorange: true,
        range: [0, 3]
      }
    }
    Plotly.newPlot(this.$refs.plot, [{
      x: _map(this.timeEntries, 'time'),
      y: _map(this.timeEntries, 'value'),
      mode: 'lines',
      line: {color: '#eee', shape: 'spline'}
    },
    {
      y: [this.baseLine],
      mode: 'lines',
      line: {color: '#9999', shape: 'spline'}
    }
  ], layout);
  },
  methods: {
    
  },
  watch: {
    
  }
}
// module aliases

</script>

<template>
  <div class="text-white text-small position-absolute pl-2" style="z-index: 10000;"><small>T: {{  Math.round(this.time) }} ms P: {{ pidOptions.p}} I: {{ pidOptions.i}} D: {{ pidOptions.d}}</small></div>
  <div class="plot" ref="plot"></div>
</template>
<style>
  
</style>
