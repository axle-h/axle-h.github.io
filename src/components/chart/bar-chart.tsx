import { Chart, useChart } from '@chakra-ui/charts'
import type { UseChartProps } from '@chakra-ui/charts'
import { Center } from '@chakra-ui/react'
import {
  Bar,
  BarChart as ReBarChart,
  ResponsiveContainer,
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
        {/* @chakra-ui/charts >=3.3x no longer wraps children in a ResponsiveContainer,
            so the chart must supply its own or recharts renders with no dimensions. */}
        <ResponsiveContainer width="100%" height="100%">
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
        </ResponsiveContainer>
      </Chart.Root>
    </Center>
  )
}
