// Libraries
import React, {FC} from 'react'
import 'src/authorizations/components/redesigned/customApiTokenOverlay.scss'

// Clockface
import {
  Accordion,
  FlexBox,
  ComponentSize,
  JustifyContent,
  FlexDirection,
  AlignItems,
  InputLabel,
  Toggle,
  InputToggleType,
} from '@influxdata/clockface'
import {PermissionType} from 'src/types/tokens'

interface Props {
  resourceName: string
  permissions: any
  onToggle?: (name, id, permission) => void
  title: string
  disabled: boolean
}

export const IndividualAccordionBody: FC<Props> = props => {
  const {resourceName, permissions, onToggle, title, disabled} = props

  const handleReadToggle = id => {
    onToggle(resourceName, id, PermissionType.Read)
  }
  const handleWriteToggle = id => {
    onToggle(resourceName, id, PermissionType.Write)
  }

  const accordionBody = telegraf => (
    <FlexBox
      margin={ComponentSize.Small}
      justifyContent={JustifyContent.SpaceBetween}
      direction={FlexDirection.Row}
      stretchToFitWidth={true}
      alignItems={AlignItems.Center}
      style={{textAlign: 'start'}}
    >
      <FlexBox.Child basis={40} grow={8}>
        <InputLabel size={ComponentSize.Small}>{telegraf.name}</InputLabel>
      </FlexBox.Child>
      <FlexBox.Child grow={1}>
        <Toggle
          id={telegraf.id}
          value={telegraf.id}
          type={InputToggleType.Checkbox}
          onChange={handleReadToggle}
          size={ComponentSize.ExtraSmall}
          checked={telegraf.permissions.read}
          style={{marginRight: '10px'}}
          tabIndex={0}
          disabled={disabled}
        ></Toggle>
      </FlexBox.Child>
      <FlexBox.Child grow={1}>
        <Toggle
          id={telegraf.id + 1}
          value={telegraf.id}
          type={InputToggleType.Checkbox}
          onChange={handleWriteToggle}
          size={ComponentSize.ExtraSmall}
          checked={telegraf.permissions.write}
          style={{marginRight: '10px'}}
          tabIndex={0}
          disabled={disabled}
        ></Toggle>
      </FlexBox.Child>
    </FlexBox>
  )

  return (
    <>
      <Accordion.AccordionBodyItem className="resource-accordion-body">
        {title}
      </Accordion.AccordionBodyItem>
      {permissions
        ? Object.keys(permissions).map(key => {
            return (
              <Accordion.AccordionBodyItem
                key={permissions[key].id}
                className="resource-accordion-body"
              >
                {accordionBody(permissions[key])}
              </Accordion.AccordionBodyItem>
            )
          })
        : null}
    </>
  )
}
