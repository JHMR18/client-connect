<template>
  <div class="chart-container">
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import {
  Chart,
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

Chart.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

interface ChartData {
  labels: string[]
  datasets: Array<{
    data: number[]
    backgroundColor: string[]
    borderColor: string[]
    borderWidth: number
  }>
}

interface Props {
  data: ChartData
}

const props = defineProps<Props>()
const chartRef = ref<HTMLCanvasElement>()
let chartInstance: Chart | null = null

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'bottom' as const,
      labels: {
        usePointStyle: true,
        padding: 15,
        font: {
          size: 11,
          family: 'system-ui, -apple-system, sans-serif'
        },
        generateLabels: (chart: any) => {
          const data = chart.data
          if (data.labels.length && data.datasets.length) {
            const dataset = data.datasets[0]
            const total = dataset.data.reduce((a: number, b: number) => a + b, 0)

            return data.labels.map((label: string, i: number) => {
              const value = dataset.data[i]
              const percentage = total > 0 ? Math.round((value / total) * 100) : 0

              return {
                text: `${label} (${percentage}%)`,
                fillStyle: dataset.backgroundColor[i],
                strokeStyle: dataset.borderColor[i],
                lineWidth: dataset.borderWidth,
                hidden: false,
                index: i
              }
            })
          }
          return []
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      titleColor: '#1a1a1a',
      bodyColor: '#666',
      borderColor: '#e0e0e0',
      borderWidth: 1,
      padding: 12,
      displayColors: true,
      callbacks: {
        label: (context: any) => {
          const label = context.label || ''
          const value = context.parsed
          const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
          const percentage = total > 0 ? Math.round((value / total) * 100) : 0

          return [
            `${label}: ${value}`,
            `Percentage: ${percentage}%`
          ]
        }
      }
    }
  },
  cutout: '60%',
  borderWidth: 2,
  elements: {
    arc: {
      borderWidth: 2,
      hoverOffset: 8,
      hoverBorderWidth: 3
    }
  }
}

const createChart = () => {
  if (!chartRef.value) return

  // Destroy existing chart if it exists
  if (chartInstance) {
    chartInstance.destroy()
  }

  // Create new chart
  chartInstance = new Chart(chartRef.value, {
    type: 'doughnut',
    data: props.data,
    options: chartOptions
  })
}

onMounted(() => {
  nextTick(() => {
    createChart()
  })
})

watch(() => props.data, () => {
  createChart()
}, { deep: true })
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 100%;
  width: 100%;
}
</style>