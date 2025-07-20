'use client'

import { Chart, useChart, UseChartProps } from '@chakra-ui/charts'
import { Center } from '@chakra-ui/react'
import {
  Line,
  LineChart as ReLineChart,
  ComposedChart,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'
import { useColorModeValue } from '@/components/ui/color-mode'
import { ScatterPointItem } from 'recharts/types/cartesian/Scatter'

export function LineChart({
  data,
  x,
  y,
  trend,
}: Pick<UseChartProps<any>, 'data'> & { y: string; x: string; trend: string }) {
  const color = useColorModeValue('blue.300', 'blue.600')
  const chart = useChart({
    data,
    series: [{ name: y, color }],
  })

  return (
    <Center>
      <Chart.Root chart={chart} maxW={800} m={3}>
        <ComposedChart data={chart.data}>
          <XAxis dataKey={x} label={{ value: x, dy: 20 }} />
          <YAxis
            dataKey={y}
            label={{ value: y, angle: -90, position: 'insideLeft', dx: -20 }}
          />
          <Tooltip />
          {chart.series.map((item) => (
            <>
              <Scatter
                key={item.name as any}
                dataKey={chart.key(item.name) as any}
                stroke={chart.color(item.color)}
                fill={chart.color(item.color)}
                line={true}
                shape={(props: ScatterPointItem) => (
                  <circle
                    cx={props.cx}
                    cy={props.cy}
                    r={3}
                    fill={chart.color(item.color)}
                    stroke="none"
                  />
                )}
              />
              <Line
                type="monotone"
                dataKey={trend}
                stroke={chart.color(item.color)}
                dot={false}
                activeDot={false}
                legendType="none"
              />
            </>
          ))}
        </ComposedChart>
      </Chart.Root>
    </Center>
  )
}
