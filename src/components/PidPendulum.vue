<script>
import PID from './../pid'
import ResultChart from './ResultChart.vue'
import PendulumControlObject from './ControlObjects/Pendulum.vue'
import CartControlObject from './ControlObjects/Cart.vue'
import MainChart from './MainChart.vue'

export default {
  components: {ResultChart, PendulumControlObject, CartControlObject, MainChart},
  data() {
    return {
      pidOptions: {
        p: 5,
        i: 0,
        d: 50,
      },
      resultCharts: [],                  
      pid: null,
      desiredPosition: 1.5708
    }
  },
  beforeMount() {
    this.pid = PID.setup(this.pidOptions.p, this.pidOptions.i, this.pidOptions.d);
  },
  mounted() {
    

  },
  methods: {

    drawMainPlot($event) {
        this.$refs.mainChart.extend($event.position);
    },
    addChart($event) {
      this.resultCharts.push(
        $event
      )
    },
  },
  watch: {
    pidOptions: {
      handler(newVal, oldVal) {
        PID.setup(newVal.p, newVal.i, newVal.d);
      },
      deep: true
    }
  }
}
// module aliases

</script>

<template>
  <div class="row">
    <div class="col">
      <div class="options">
        <div><span>P</span> <input type="number" v-model="pidOptions.p" style="width: 100px;" /></div>
        <div><span>I</span> <input type="number" v-model="pidOptions.i" style="width: 100px;" /></div>
        <div><span>D</span> <input type="number" v-model="pidOptions.d" style="width: 100px;" /></div>
      </div>
      <pendulum-control-object :pid="pid" @tick="drawMainPlot($event)" @process-finished="addChart($event)"></pendulum-control-object>      
      <main-chart ref="mainChart" :base-line="desiredPosition"></main-chart>      
    </div>
    <div class="col">
      <div v-for="(resultChart, id) in resultCharts" :key="id" class="mb-2">
        <result-chart v-bind="resultChart" :baseLine="desiredPosition"></result-chart>
      </div>
    </div>
  </div>
</template>
<style>
  .options {
    z-index: 100000;
    padding: 10px 0 0 10px;
    position: absolute;
  }

  .options span {
    width: 10px; display: inline-block;
    color: #fff;
  }

  .options input {
    width: 100px;
    border: 1px solid #eee;
    color: #fff;
    background-color: transparent;
  }
</style>
