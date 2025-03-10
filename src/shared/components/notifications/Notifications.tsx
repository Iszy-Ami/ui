import React, {FC} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {get} from 'lodash'
import {ComponentSize, Gradients, Notification} from '@influxdata/clockface'

// Utils
import {dismissNotification} from 'src/shared/actions/notifications'

// Types
import {NotificationStyle} from 'src/types'

// Selectors
import {getNotifications} from 'src/shared/selectors/notifications'

const matchGradientToColor = (style: NotificationStyle): Gradients => {
  const converter = {
    [NotificationStyle.Primary]: Gradients.Info,
    [NotificationStyle.Warning]: Gradients.WarningLight,
    [NotificationStyle.Success]: Gradients.HotelBreakfast,
    [NotificationStyle.Error]: Gradients.DangerDark,
    [NotificationStyle.Info]: Gradients.DefaultLight,
    [NotificationStyle.Secondary]: Gradients.SecondaryDark,
  }
  return get(converter, style, Gradients.DefaultLight)
}

const Notifications: FC = () => {
  const notifications = useSelector(getNotifications)
  const dispatch = useDispatch()

  return (
    <>
      {notifications.map(
        ({duration, icon, id, message, style, styles = {}, buttonElement}) => {
          const gradient = matchGradientToColor(style)

          const handleDismiss = (): void => {
            dispatch(dismissNotification(id))
          }

          return (
            <Notification
              key={id}
              id={id}
              icon={icon}
              duration={duration}
              size={ComponentSize.Small}
              gradient={gradient}
              onTimeout={handleDismiss}
              onDismiss={handleDismiss}
              testID={`notification-${style}`}
              style={{maxWidth: '600px', alignItems: 'center'}}
            >
              <span style={styles}>
                <span className="notification--message">{message}</span>
                {buttonElement && buttonElement(handleDismiss)}
              </span>
            </Notification>
          )
        }
      )}
    </>
  )
}

export default Notifications
