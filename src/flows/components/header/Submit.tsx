// Libraries
import React, {FC, MouseEvent, useContext, useMemo} from 'react'
import {
  Dropdown,
  IconFont,
  ComponentColor,
  Gradients,
  SquareButton,
  List,
  ButtonGroup,
} from '@influxdata/clockface'

import {SubmitQueryButton} from 'src/timeMachine/components/SubmitQueryButton'
import {QueryContext} from 'src/shared/contexts/query'
import {FlowQueryContext} from 'src/flows/context/flow.query'
import {RunModeContext, RunMode} from 'src/flows/context/runMode'
import {notify} from 'src/shared/actions/notifications'

// Utils
import {event} from 'src/cloud/utils/reporting'

// Styles
import 'src/flows/components/header/Submit.scss'

// Types
import {RemoteDataState} from 'src/types'

const fakeNotify = notify

export const Submit: FC = () => {
  const {cancel} = useContext(QueryContext)
  const {runMode, setRunMode} = useContext(RunModeContext)
  const {generateMap, queryAll, status} = useContext(FlowQueryContext)

  const hasQueries = useMemo(() => generateMap().length > 0, [generateMap])

  const handleSubmit = () => {
    event('Notebook Submit Button Clicked')
    queryAll()
  }

  const DropdownButton = (
    active: boolean,
    onClick: (e: MouseEvent<HTMLButtonElement>) => void
  ) => {
    return (
      <ButtonGroup>
        <SubmitQueryButton
          className="submit-btn"
          text={runMode}
          icon={IconFont.Play}
          submitButtonDisabled={hasQueries === false}
          queryStatus={status}
          onSubmit={handleSubmit}
          onNotify={fakeNotify}
          queryID=""
          cancelAllRunningQueries={cancel}
        />
        {status !== RemoteDataState.Loading && (
          <SquareButton
            active={active}
            onClick={onClick}
            icon={IconFont.CaretDown_New}
            color={ComponentColor.Primary}
          />
        )}
      </ButtonGroup>
    )
  }

  const DropdownMenu = (onCollapse: () => void) => (
    <Dropdown.Menu onCollapse={onCollapse}>
      <List.Item
        key="Preview"
        value="Preview"
        onClick={() => setRunMode(RunMode.Preview)}
        className="submit-btn--item"
        testID="flow-preview-button"
        selected={runMode === RunMode.Preview}
        gradient={Gradients.PolarExpress}
      >
        <div className="submit-btn--item-details">
          <span className="submit-btn--item-name">Preview</span>
          <span className="submit-btn--item-desc">
            See results of each cell, no data will be written
          </span>
        </div>
      </List.Item>
      <List.Item
        key="Run"
        value="Run"
        onClick={() => setRunMode(RunMode.Run)}
        className="submit-btn--item"
        testID="flow-run-button"
        selected={runMode === RunMode.Run}
        gradient={Gradients.PolarExpress}
      >
        <div className="submit-btn--item-details">
          <span className="submit-btn--item-name">Run</span>
          <span className="submit-btn--item-desc">
            See results of each cell, outputs will write data to buckets
          </span>
        </div>
      </List.Item>
    </Dropdown.Menu>
  )

  return (
    <Dropdown
      button={DropdownButton}
      menu={DropdownMenu}
      style={{width: '205px'}}
    />
  )
}

export default Submit
