// Libraries
import React, {FC, useEffect, useMemo} from 'react'
import {connect, ConnectedProps} from 'react-redux'

// Components
import {
  Button,
  ComponentColor,
  ComponentStatus,
  Overlay,
} from '@influxdata/clockface'

// Actions
import {createOrUpdateTelegrafConfigAsync} from 'src/dataLoaders/actions/dataLoaders'
import {updateTelegraf} from 'src/telegrafs/actions/thunks'

// Types
import {AppState, ResourceType, Telegraf} from 'src/types'
import {PluginConfigurationStepProps} from 'src/writeData/components/AddPluginToConfiguration'

// Selectors
import {getDataLoaders} from 'src/dataLoaders/selectors'
import {getAll} from 'src/resources/selectors'
import {getQuartzMe} from 'src/me/selectors'

// Utils
import {CLOUD} from 'src/shared/constants'

type ReduxProps = ConnectedProps<typeof connector>
type Props = PluginConfigurationStepProps & ReduxProps

const agentSettingPatternDefault = `[agent]
  ## Default data collection interval for all inputs
  interval = "10s"`

const agentSettingPatternFreeTier = `[agent]
  ## Default data collection interval for all inputs
  interval = "20s"`

const FooterComponent: FC<Props> = props => {
  const {
    accountType,
    currentStepIndex,
    isValidConfiguration,
    onDecrementCurrentStepIndex,
    onExit,
    onIncrementCurrentStepIndex,
    onSaveTelegrafConfig,
    onUpdateTelegraf,
    pluginConfig,
    pluginConfigName,
    setIsValidConfiguration,
    substepIndex,
    telegrafConfig,
  } = props

  const shouldTelegrafUpdate = useMemo(() => {
    return Boolean(telegrafConfig)
  }, [telegrafConfig])

  useEffect(() => {
    if (telegrafConfig) {
      let {config} = telegrafConfig
      if (CLOUD && accountType === 'free') {
        config = config.replace(
          agentSettingPatternDefault,
          agentSettingPatternFreeTier
        )
      }
      const position =
        typeof config === 'string'
          ? config.indexOf(`[[inputs.${pluginConfigName}]]`)
          : -1
      const updatedConfig =
        position >= 0
          ? `${config.substring(0, position)}${pluginConfig}`
          : `${config}${pluginConfig}`

      onUpdateTelegraf({
        ...telegrafConfig,
        config: updatedConfig,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldTelegrafUpdate])

  const handleSaveAndTest = () => {
    onSaveTelegrafConfig()
    onIncrementCurrentStepIndex()
  }

  const handleContinueFromStepZero = () => {
    setIsValidConfiguration(false)
    onIncrementCurrentStepIndex()
  }

  if (substepIndex === 1 || currentStepIndex === 2) {
    return null
  }

  if (currentStepIndex === 0) {
    return (
      <Overlay.Footer>
        <Button
          color={ComponentColor.Tertiary}
          onClick={onExit}
          tabIndex={1}
          testID="plugin-create-configuration-cancel"
          text="Cancel"
        />
        <Button
          color={ComponentColor.Primary}
          onClick={handleContinueFromStepZero}
          status={
            isValidConfiguration
              ? ComponentStatus.Valid
              : ComponentStatus.Disabled
          }
          tabIndex={0}
          testID="plugin-create-configuration-continue-configuring"
          text="Continue Configuring"
        />
      </Overlay.Footer>
    )
  }
  return (
    <Overlay.Footer>
      <Button
        color={ComponentColor.Default}
        onClick={onDecrementCurrentStepIndex}
        tabIndex={1}
        testID="plugin-create-configuration-previous"
        text="Previous"
      />
      <Button
        color={ComponentColor.Primary}
        onClick={handleSaveAndTest}
        status={
          isValidConfiguration
            ? ComponentStatus.Valid
            : ComponentStatus.Disabled
        }
        tabIndex={0}
        testID="plugin-create-configuration-save-and-test"
        text="Save and Test"
      />
    </Overlay.Footer>
  )
}

const mstp = (state: AppState) => {
  const {telegrafConfigID} = getDataLoaders(state)
  const accountType = getQuartzMe(state)?.accountType ?? 'free'
  let telegrafConfig = null
  if (telegrafConfigID) {
    const telegrafs = getAll<Telegraf>(state, ResourceType.Telegrafs)
    telegrafConfig = telegrafs.find(
      telegraf => telegraf.id === telegrafConfigID
    )
  }
  return {accountType, telegrafConfig}
}

const mdtp = {
  onSaveTelegrafConfig: createOrUpdateTelegrafConfigAsync,
  onUpdateTelegraf: updateTelegraf,
}

const connector = connect(mstp, mdtp)

export const Footer = connector(FooterComponent)
