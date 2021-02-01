// Libraries
import React, {FC, useMemo} from 'react'
import {useDispatch} from 'react-redux'
import {
  Config,
  Table,
  DomainLabel,
  lineTransform,
  getDomainDataFromLines,
} from '@influxdata/giraffe'

// Components
import EmptyGraphMessage from 'src/shared/components/EmptyGraphMessage'

// Utils
import {useAxisTicksGenerator} from 'src/shared/utils/useAxisTicksGenerator'
import {
  useLegendOpacity,
  useLegendOrientationThreshold,
  useLegendColorizeRows,
} from 'src/shared/utils/useLegendOrientation'
import {
  useVisXDomainSettings,
  useVisYDomainSettings,
} from 'src/shared/utils/useVisDomainSettings'
import {
  getFormatter,
  geomToInterpolation,
  filterNoisyColumns,
  parseXBounds,
  parseYBounds,
  defaultXColumn,
  defaultYColumn,
} from 'src/shared/utils/vis'

import {isFlagEnabled} from 'src/shared/utils/featureFlag'

import {writeThenUpdateAnnotations} from 'src/annotations/actions/thunks'

// Constants
import {VIS_THEME, VIS_THEME_LIGHT} from 'src/shared/constants'
import {DEFAULT_LINE_COLORS} from 'src/shared/constants/graphColorPalettes'
import {INVALID_DATA_COPY} from 'src/shared/copy/cell'

// Types
import {
  Annotation,
  Theme,
  TimeRange,
  TimeZone,
  XYViewProperties,
} from 'src/types'

interface Props {
  annotations: Annotation[]
  children: (config: Config) => JSX.Element
  fluxGroupKeyUnion: string[]
  table: Table
  theme: Theme
  timeRange?: TimeRange | null
  timeZone: TimeZone
  viewProperties: XYViewProperties
}

const XYPlot: FC<Props> = ({
  annotations,
  children,
  fluxGroupKeyUnion,
  table,
  theme,
  timeRange,
  timeZone,
  viewProperties: {
    geom,
    colors,
    xColumn: storedXColumn,
    yColumn: storedYColumn,
    shadeBelow,
    hoverDimension,
    legendOpacity,
    legendOrientationThreshold,
    legendColorizeRows,
    generateXAxisTicks,
    xTotalTicks,
    xTickStart,
    xTickStep,
    generateYAxisTicks,
    yTotalTicks,
    yTickStart,
    yTickStep,
    axes: {
      x: {
        label: xAxisLabel,
        prefix: xTickPrefix,
        suffix: xTickSuffix,
        base: xTickBase,
        bounds: xBounds,
      },
      y: {
        label: yAxisLabel,
        prefix: yTickPrefix,
        suffix: yTickSuffix,
        bounds: yBounds,
        base: yTickBase,
      },
    },
    position,
    timeFormat,
  },
}) => {
  const axisTicksOptions = useAxisTicksGenerator({
    generateXAxisTicks,
    xTotalTicks,
    xTickStart,
    xTickStep,
    generateYAxisTicks,
    yTotalTicks,
    yTickStart,
    yTickStep,
  })
  const tooltipOpacity = useLegendOpacity(legendOpacity)
  const tooltipOrientationThreshold = useLegendOrientationThreshold(
    legendOrientationThreshold
  )
  const tooltipColorize = useLegendColorizeRows(legendColorizeRows)

  const storedXDomain = useMemo(() => parseXBounds(xBounds), [xBounds])
  const storedYDomain = useMemo(() => parseYBounds(yBounds), [yBounds])
  const xColumn = storedXColumn || defaultXColumn(table, '_time')
  const yColumn =
    (table.columnKeys.includes(storedYColumn) && storedYColumn) ||
    defaultYColumn(table)

  const dispatch = useDispatch()

  const columnKeys = table.columnKeys

  const isValidView =
    xColumn &&
    columnKeys.includes(xColumn) &&
    yColumn &&
    columnKeys.includes(yColumn)

  const colorHexes =
    colors && colors.length
      ? colors.map(c => c.hex)
      : DEFAULT_LINE_COLORS.map(c => c.hex)

  const interpolation = geomToInterpolation(geom)

  const groupKey = [...fluxGroupKeyUnion, 'result']

  const [xDomain, onSetXDomain, onResetXDomain] = useVisXDomainSettings(
    storedXDomain,
    table.getColumn(xColumn, 'number'),
    timeRange
  )

  const memoizedYColumnData = useMemo(() => {
    if (position === 'stacked') {
      const {lineData} = lineTransform(
        table,
        xColumn,
        yColumn,
        groupKey,
        colorHexes,
        position
      )
      return getDomainDataFromLines(lineData, DomainLabel.Y)
    }
    return table.getColumn(yColumn, 'number')
  }, [table, yColumn, xColumn, position, colorHexes, groupKey])

  const [yDomain, onSetYDomain, onResetYDomain] = useVisYDomainSettings(
    storedYDomain,
    memoizedYColumnData
  )

  const legendColumns = filterNoisyColumns(
    [...groupKey, xColumn, yColumn],
    table
  )

  const xFormatter = getFormatter(table.getColumnType(xColumn), {
    prefix: xTickPrefix,
    suffix: xTickSuffix,
    base: xTickBase,
    timeZone,
    timeFormat,
  })

  const yFormatter = getFormatter(table.getColumnType(yColumn), {
    prefix: yTickPrefix,
    suffix: yTickSuffix,
    base: yTickBase,
    timeZone,
    timeFormat,
  })

  const currentTheme = theme === 'light' ? VIS_THEME_LIGHT : VIS_THEME

  const config: Config = {
    ...currentTheme,
    table,
    xAxisLabel,
    yAxisLabel,
    xDomain,
    onSetXDomain,
    onResetXDomain,
    yDomain,
    onSetYDomain,
    onResetYDomain,
    ...axisTicksOptions,
    legendColumns,
    legendOpacity: tooltipOpacity,
    legendOrientationThreshold: tooltipOrientationThreshold,
    legendColorizeRows: tooltipColorize,
    valueFormatters: {
      [xColumn]: xFormatter,
      [yColumn]: yFormatter,
    },
    layers: [
      {
        type: 'line',
        x: xColumn,
        y: yColumn,
        fill: groupKey,
        interpolation,
        position,
        colors: colorHexes,
        shadeBelow: !!shadeBelow,
        shadeBelowOpacity: 0.08,
        hoverDimension,
      },
    ],
  }

  if (!isValidView) {
    return <EmptyGraphMessage message={INVALID_DATA_COPY} />
  }

  if (isFlagEnabled('annotations')) {
    if (annotations && annotations.length) {
      const annotationLayer = {
        type: 'annotation',
        x: xColumn,
        y: yColumn,
        fill: groupKey,
        annotations: annotations.map(annotation => {
          return {
            color: 'green',
            dimension: annotation.dimension ?? 'x',
            title: annotation.summary,
            startValue: new Date(annotation.start).getTime(),
            stopValue: new Date(annotation.end).getTime()
          }
        }),
      }

      config.layers.push(annotationLayer)
    }

    const doubleClickHandler = plotInteraction => {
      const annotationTime = new Date(plotInteraction.valueX).toISOString()
      dispatch(writeThenUpdateAnnotations([
        {
          summary: 'bucky bucky bucky',
          start: annotationTime,
          end: annotationTime,
        },
      ]))
    }

    const interactionHandlers = {
      doubleClick: doubleClickHandler,
    }

    config.interactionHandlers = interactionHandlers

    console.log(config.layers)
  }

  return children(config)
}

export default XYPlot
