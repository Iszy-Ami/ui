import React, {FC, useContext} from 'react'
import {useSelector} from 'react-redux'
import {
  Form,
  Input,
  InputType,
  ComponentSize,
  Dropdown,
  IconFont,
  ComponentColor,
} from '@influxdata/clockface'
import {PipeContext} from 'src/flows/context/pipe'
import {getAllSecrets} from 'src/resources/selectors'

const View: FC = () => {
  const {data, update} = useContext(PipeContext)
  const secrets = useSelector(getAllSecrets)

  const updateURL = evt => {
    update({
      endpointData: {
        ...data.endpointData,
        url: evt.target.value,
      },
    })
  }

  const updateAccessKey = val => {
    update({
      endpointData: {
        ...data.endpointData,
        accessKey: val,
      },
    })
  }

  const updateAuthAlgo = val => {
    update({
      endpointData: {
        ...data.endpointData,
        authAlgo: val,
      },
    })
  }

  const updateCredScope = val => {
    update({
      endpointData: {
        ...data.endpointData,
        credScope: val,
      },
    })
  }

  const updateSignedHeaders = val => {
    update({
      endpointData: {
        ...data.endpointData,
        signedHeaders: val,
      },
    })
  }

  const updateCalcSignature = val => {
    update({
      endpointData: {
        ...data.endpointData,
        calcSignature: val,
      },
    })
  }

  const updateEmail = evt => {
    update({
      endpointData: {
        ...data.endpointData,
        email: evt.target.value,
      },
    })
  }

  return (
    <div className="slack-endpoint-details--flex">
      <Form.Element label="URL" required={true}>
        <Input
          name="url"
          testID="input--url"
          type={InputType.Text}
          value={data.endpointData.url}
          onChange={updateURL}
          size={ComponentSize.Medium}
        />
      </Form.Element>
      <Form.Element label="Authorization Access Key" required={true}>
        <Dropdown
          testID="dropdown--accessKey"
          style={{width: '180px'}}
          button={(active, onClick) => (
            <Dropdown.Button
              active={active}
              onClick={onClick}
              icon={IconFont.Lock}
              color={ComponentColor.Default}
              testID="dropdown-button--accessKey"
            >
              {data.endpointData.accessKey !== ''
                ? data.endpointData.accessKey
                : 'Select a Secret'}
            </Dropdown.Button>
          )}
          menu={onCollapse => (
            <Dropdown.Menu onCollapse={onCollapse}>
              {secrets.map(s => (
                <Dropdown.Item
                  testID={`dropdown-item--${s.key}`}
                  id={s.id}
                  key={s.key}
                  value={s.key}
                  onClick={updateAccessKey}
                >
                  {s.key}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          )}
        />
      </Form.Element>
      <Form.Element label="Authorization Algorithm" required={true}>
        <Dropdown
          testID="dropdown--authAlgo"
          style={{width: '180px'}}
          button={(active, onClick) => (
            <Dropdown.Button
              active={active}
              onClick={onClick}
              icon={IconFont.Lock}
              color={ComponentColor.Default}
              testID="dropdown-button--authAlgo"
            >
              {data.endpointData.authAlgo !== ''
                ? data.endpointData.authAlgo
                : 'Select a Secret'}
            </Dropdown.Button>
          )}
          menu={onCollapse => (
            <Dropdown.Menu onCollapse={onCollapse}>
              {secrets.map(s => (
                <Dropdown.Item
                  testID={`dropdown-item--${s.key}`}
                  id={s.id}
                  key={s.key}
                  value={s.key}
                  onClick={updateAuthAlgo}
                >
                  {s.key}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          )}
        />
      </Form.Element>
      <Form.Element label="Authorization Credential Scope" required={true}>
        <Dropdown
          testID="dropdown--credScope"
          style={{width: '180px'}}
          button={(active, onClick) => (
            <Dropdown.Button
              active={active}
              onClick={onClick}
              icon={IconFont.Lock}
              color={ComponentColor.Default}
              testID="dropdown-button--credScope"
            >
              {data.endpointData.credScope !== ''
                ? data.endpointData.credScope
                : 'Select a Secret'}
            </Dropdown.Button>
          )}
          menu={onCollapse => (
            <Dropdown.Menu onCollapse={onCollapse}>
              {secrets.map(s => (
                <Dropdown.Item
                  testID={`dropdown-item--${s.key}`}
                  id={s.id}
                  key={s.key}
                  value={s.key}
                  onClick={updateCredScope}
                >
                  {s.key}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          )}
        />
      </Form.Element>
      <Form.Element label="Authorization Signed Headers" required={true}>
        <Dropdown
          testID="dropdown--signedHeaders"
          style={{width: '180px'}}
          button={(active, onClick) => (
            <Dropdown.Button
              active={active}
              onClick={onClick}
              icon={IconFont.Lock}
              color={ComponentColor.Default}
              testID="dropdown-button--signedHeaders"
            >
              {data.endpointData.signedHeaders !== ''
                ? data.endpointData.signedHeaders
                : 'Select a Secret'}
            </Dropdown.Button>
          )}
          menu={onCollapse => (
            <Dropdown.Menu onCollapse={onCollapse}>
              {secrets.map(s => (
                <Dropdown.Item
                  testID={`dropdown-item--${s.key}`}
                  id={s.id}
                  key={s.key}
                  value={s.key}
                  onClick={updateSignedHeaders}
                >
                  {s.key}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          )}
        />
      </Form.Element>
      <Form.Element label="Authorization Calculated Signature" required={true}>
        <Dropdown
          testID="dropdown--calcSignature"
          style={{width: '180px'}}
          button={(active, onClick) => (
            <Dropdown.Button
              active={active}
              onClick={onClick}
              icon={IconFont.Lock}
              color={ComponentColor.Default}
              testID="dropdown-button--calcSignature"
            >
              {data.endpointData.calcSignature !== ''
                ? data.endpointData.calcSignature
                : 'Select a Secret'}
            </Dropdown.Button>
          )}
          menu={onCollapse => (
            <Dropdown.Menu onCollapse={onCollapse}>
              {secrets.map(s => (
                <Dropdown.Item
                  testID={`dropdown-item--${s.key}`}
                  id={s.id}
                  key={s.key}
                  value={s.key}
                  onClick={updateCalcSignature}
                >
                  {s.key}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          )}
        />
      </Form.Element>
      <Form.Element label="Email" required={true}>
        <Input
          name="email"
          testID="input--email"
          type={InputType.Email}
          value={data.endpointData.email}
          onChange={updateEmail}
          size={ComponentSize.Medium}
        />
      </Form.Element>
    </div>
  )
}

export default View
