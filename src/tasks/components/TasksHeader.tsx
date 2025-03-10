// Libraries
import React, {FC, useContext} from 'react'
import {Link} from 'react-router-dom'

// Components
import {
  Button,
  ComponentColor,
  InputLabel,
  SlideToggle,
  ComponentSize,
  Page,
  Sort,
  FlexBox,
  FlexDirection,
  Icon,
  IconFont,
} from '@influxdata/clockface'
import SearchWidget from 'src/shared/components/search_widget/SearchWidget'
import ResourceSortDropdown from 'src/shared/components/resource_sort_dropdown/ResourceSortDropdown'
import RateLimitAlert from 'src/cloud/components/RateLimitAlert'

// Utils
import {event} from 'src/cloud/utils/reporting'
import {FeatureFlag} from 'src/shared/utils/featureFlag'

// Types
import {setSearchTerm as setSearchTermAction} from 'src/tasks/actions/creators'
import {TaskSortKey} from 'src/shared/components/resource_sort_dropdown/generateSortItems'
import {SortTypes} from 'src/shared/utils/sort'
import {ResourceType} from 'src/types'

import {AppSettingContext} from 'src/shared/contexts/app'

import 'src/shared/components/cta.scss'

interface Props {
  onCreateTask: () => void
  setShowInactive: () => void
  showInactive: boolean
  searchTerm: string
  setSearchTerm: typeof setSearchTermAction
  sortKey: TaskSortKey
  sortDirection: Sort
  sortType: SortTypes
  onSort: (
    sortKey: TaskSortKey,
    sortDirection: Sort,
    sortType: SortTypes
  ) => void
}

const TasksHeader: FC<Props> = ({
  onCreateTask,
  setShowInactive,
  showInactive,
  setSearchTerm,
  searchTerm,
  sortKey,
  sortType,
  sortDirection,
  onSort,
}) => {
  const {flowsCTA, setFlowsCTA} = useContext(AppSettingContext)
  const creator = () => {
    event('Task Created From Dropdown', {source: 'header'})
    onCreateTask()
  }

  const recordClick = () => {
    event('Tasks List Page - Clicked Notebooks CTA')
  }

  const hideFlowsCTA = () => {
    setFlowsCTA({tasks: false})
  }
  return (
    <>
      <Page.Header fullWidth={false} testID="tasks-page--header">
        <Page.Title title="Tasks" />
        <RateLimitAlert />
      </Page.Header>
      {flowsCTA.tasks && (
        <FeatureFlag name="flowsCTA">
          <div className="header-cta--tasks">
            <div className="header-cta">
              <Icon glyph={IconFont.BookPencil} />
              Now you can use Notebooks to explore your data while building a
              task
              <Link to="/notebook/from/task" onClick={recordClick}>
                Create a Task
              </Link>
              <span className="header-cta--close-icon" onClick={hideFlowsCTA}>
                <Icon glyph={IconFont.Remove_New} />
              </span>
            </div>
          </div>
        </FeatureFlag>
      )}
      <Page.ControlBar fullWidth={false}>
        <Page.ControlBarLeft>
          <SearchWidget
            placeholderText="Filter tasks..."
            onSearch={setSearchTerm}
            searchTerm={searchTerm}
          />
          <ResourceSortDropdown
            resourceType={ResourceType.Tasks}
            sortKey={sortKey}
            sortType={sortType}
            sortDirection={sortDirection}
            onSelect={onSort}
          />
        </Page.ControlBarLeft>
        <Page.ControlBarRight>
          <FlexBox direction={FlexDirection.Row} margin={ComponentSize.Medium}>
            <InputLabel>Show Inactive</InputLabel>
            <SlideToggle
              active={showInactive}
              size={ComponentSize.ExtraSmall}
              onChange={setShowInactive}
            />
          </FlexBox>
          <Button
            icon={IconFont.Plus_New}
            color={ComponentColor.Primary}
            text="Create Task"
            titleText="Click to create a Task"
            onClick={creator}
            testID="create-task--button"
          />
        </Page.ControlBarRight>
      </Page.ControlBar>
    </>
  )
}

export default TasksHeader
