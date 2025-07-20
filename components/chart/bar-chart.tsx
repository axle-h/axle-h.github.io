'use client'

import { Chart, useChart, UseChartProps } from '@chakra-ui/charts'
import { Center } from '@chakra-ui/react'
import {
  Bar,
  BarChart as ReBarChart,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from 'recharts'
import { useColorModeValue } from '@/components/ui/color-mode'

export function BarChart({
  data,
  series,
}: Pick<UseChartProps<any>, 'data'> & { series: string }) {
  const color = useColorModeValue('blue.300', 'blue.600')
  const chart = useChart({
    data,
    series: [{ name: series, color }],
  })

  return (
    <Center>
      <Chart.Root chart={chart} maxW={800} m={3} mb={5}>
        <ReBarChart data={chart.data}>
          <XAxis
            dataKey="feature"
            interval={0}
            angle={-15}
            textAnchor="end"
            dy={10}
          />
          <YAxis dataKey="coefficient" />
          <Tooltip />
          <ReferenceLine y={0} />
          {chart.series.map((item) => (
            <Bar
              key={item.name as any}
              dataKey={chart.key(item.name) as any}
              fill={chart.color(item.color)}
            />
          ))}
        </ReBarChart>
      </Chart.Root>
    </Center>
  )
}
