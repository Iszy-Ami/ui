import React, {FC, useContext} from 'react'
import {
  Form,
  Input,
  InputType,
  ComponentSize,
  ComponentStatus,
} from '@influxdata/clockface'

import {PipeContext} from 'src/flows/context/pipe'

const ReadOnly: FC = () => {
  const {data} = useContext(PipeContext)

  return (
    <div className="slack-endpoint-details--flex">
      <Form.Element label="URL" required={true}>
        <Input
          name="url"
          type={InputType.Text}
          value={data.endpointData.url}
          size={ComponentSize.Medium}
          status={ComponentStatus.Disabled}
        />
      </Form.Element>
      <Form.Element label="API Key" required={true}>
        <Input
          name="apiKey"
          type={InputType.Password}
          value={data.endpointData.apiKey}
          size={ComponentSize.Medium}
          status={ComponentStatus.Disabled}
        />
      </Form.Element>
      <Form.Element label="Email" required={true}>
        <Input
          name="email"
          type={InputType.Email}
          value={data.endpointData.email}
          size={ComponentSize.Medium}
          status={ComponentStatus.Disabled}
        />
      </Form.Element>
    </div>
  )
}

export default ReadOnly
