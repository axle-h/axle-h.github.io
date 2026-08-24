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
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { useColorModeValue } from '@/components/ui/color-mode'
import type { ScatterPointItem } from 'recharts/types/cartesian/Scatter'

export function LineChart({
  data,
  x,
  y,
  yLabel,
  numericX,
  yMillions,
  trend,
}: Pick<UseChartProps<any>, 'data'> & {
  /** one series name, or several to plot as separately coloured lines with a legend */
  y: string | string[]
  x: string
  /** y axis label, defaults to the first series name */
  yLabel?: string
  /** treat the x values as a continuous number line rather than evenly spaced categories */
  numericX?: boolean
  /** label the y axis ticks in millions, e.g. 8000000 -> 8M */
  yMillions?: boolean
  trend?: string
}) {
  const colors = useColorModeValue(
    ['blue.300', 'red.400', 'green.400'],
    ['blue.600', 'red.500', 'green.500'],
  )
  const names = Array.isArray(y) ? y : [y]
  const chart = useChart({
    data,
    series: names.map((name, i) => ({ name, color: colors[i % colors.length] })),
  })

  return (
    <Center>
      <Chart.Root chart={chart} maxW={800} m={3}>
        {/* @chakra-ui/charts >=3.3x no longer wraps children in a ResponsiveContainer,
            so the chart must supply its own or recharts renders with no dimensions. */}
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chart.data}>
            <XAxis
              dataKey={x}
              label={{ value: x, dy: 20 }}
              {...(numericX
                ? { type: 'number' as const, domain: [0, 'auto' as const] }
                : {})}
            />
            <YAxis
              {...(names.length === 1 ? { dataKey: names[0] } : {})}
              {...(yMillions
                ? {
                    tickFormatter: (v: number) =>
                      `${Math.round((v / 1_000_000) * 10) / 10}M`,
                  }
                : {})}
              label={{
                value: yLabel ?? names[0],
                angle: -90,
                position: 'insideLeft',
                dx: -20,
              }}
            />
            <Tooltip />
            {names.length > 1 && <Legend verticalAlign="top" />}
            {chart.series.map((item) => (
              // The key belongs on the Fragment, not the Scatter inside it — React warns
              // otherwise, since the Fragment is what the map returns.
              <Fragment key={item.name as any}>
                <Scatter
                  dataKey={chart.key(item.name) as any}
                  // rows that don't carry this series' key confuse a Scatter on the shared
                  // data, so each series gets only its own rows
                  data={
                    names.length > 1
                      ? chart.data.filter(
                          (row: any) => row[item.name as string] != null,
                        )
                      : undefined
                  }
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
