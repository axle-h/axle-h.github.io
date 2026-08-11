import { Fragment } from 'react'
import { Chart, useChart } from '@chakra-ui/charts'
import type { UseChartProps } from '@chakra-ui/charts'
import { Center } from '@chakra-ui/react'
import {
  Line,
  ComposedChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useColorModeValue } from '@/components/ui/color-mode'
import type { ScatterPointItem } from 'recharts/types/cartesian/Scatter'

export function LineChart({
  data,
  x,
  y,
  trend,
}: Pick<UseChartProps<any>, 'data'> & {
  y: string
  x: string
  trend?: string
}) {
  const color = useColorModeValue('blue.300', 'blue.600')
  const chart = useChart({
    data,
    series: [{ name: y, color }],
  })

  return (
    <Center>
      <Chart.Root chart={chart} maxW={800} m={3}>
        {/* @chakra-ui/charts >=3.3x no longer wraps children in a ResponsiveContainer,
            so the chart must supply its own or recharts renders with no dimensions. */}
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chart.data}>
            <XAxis dataKey={x} label={{ value: x, dy: 20 }} />
            <YAxis
              dataKey={y}
              label={{ value: y, angle: -90, position: 'insideLeft', dx: -20 }}
            />
            <Tooltip />
            {chart.series.map((item) => (
              // The key belongs on the Fragment, not the Scatter inside it — React warns
              // otherwise, since the Fragment is what the map returns.
              <Fragment key={item.name as any}>
                <Scatter
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
                {trend && (
                  <Line
                    type="monotone"
                    dataKey={trend}
                    stroke={chart.color(item.color)}
                    dot={false}
                    activeDot={false}
                    legendType="none"
                  />
                )}
              </Fragment>
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </Chart.Root>
    </Center>
  )
}
