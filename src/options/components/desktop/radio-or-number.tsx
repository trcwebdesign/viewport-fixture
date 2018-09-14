import * as React from 'react'
import { Radio, InputNumber, Slider } from 'antd'
import produce from 'immer'
import { RadioChangeEvent } from 'antd/lib/radio'
import { SliderValue } from 'antd/lib/slider'
import styled from 'styled-components'

interface RadioOrNumberProps {
  radioCandidates: { [index: string]: string | undefined }
  numberMin: number
  numberMax: number
  numberStep: number
  numberDefault: number
  value: string | number | void
  onChange: (value: string | number | void) => void
}

interface RadioOrNumberState {
  radioValue: string | 'number' | void
  numberValue: number
}

const Container = styled.div`
  user-select: none;
  display: flex;
  flex-direction: column;

  & > * {
    margin-bottom: 1em;

    &:last-child {
      margin-bottom: inherit;
    }
  }
`

const Row = styled.div`
  display: flex;
`

const StyledSlider = styled(Slider)`
  flex: 1;
`

function getPrecisionFromStep(step: number): number {
  if (!isFinite(step)) return 0
  let e = 1, precision = 0
  while (Math.round(step * e) / e !== step) {
    e *= 10
    precision++
  }
  return precision
}

function getSafeRangeNumber(value: number, min: number, max: number): number {
  return Math.max(Math.min(value, max), min)
}

export class RadioOrNumber extends React.Component<RadioOrNumberProps, RadioOrNumberState> {
  numberPrecision: number

  constructor(props: RadioOrNumberProps) {
    super(props)
    const { value, numberDefault, numberStep } = props
    this.numberPrecision = getPrecisionFromStep(numberStep)
    if (typeof value === 'number') {
      this.state = {
        radioValue: 'number'
      , numberValue: props.value as number
      }
    } else {
      this.state = {
        radioValue: value
      , numberValue: numberDefault
      }
    }
  }

  triggerOnChange = () => {
    const { radioValue, numberValue } = this.state
    this.props.onChange(radioValue === 'number' ? numberValue : radioValue)
  }

  onRadioChange = (e: RadioChangeEvent) => {
    this.setState(produce<RadioOrNumberState>(draft => {
      draft.radioValue = e.target.value
    }), this.triggerOnChange)
  }

  onInputNumberChange = (value: string | number | undefined) => {
    if (typeof value === 'number') {
      this.setState(produce<RadioOrNumberState>(draft => {
        const rightPrecisionNumber = parseFloat(value.toFixed(this.numberPrecision))
        const safeRangeNumber= getSafeRangeNumber(rightPrecisionNumber, this.props.numberMin, this.props.numberMax)
        draft.numberValue = safeRangeNumber
      }), this.triggerOnChange)
    }
  }

  onSliderChange = (value: SliderValue) => {
    this.setState(produce<RadioOrNumberState>(draft => {
      draft.numberValue = value as number
    }), this.triggerOnChange)
  }

  render() {
    const { radioCandidates, numberMin, numberMax, numberStep, value } = this.props
    const { radioValue, numberValue } = this.state
    const { numberPrecision } = this
    return <Container>
      <Row>
        <Radio.Group
          onChange={ this.onRadioChange }
          defaultValue={ typeof value === 'number' ? 'number' : value }
          value={ typeof value === 'number' ? 'number' : value }
        >
          <Radio.Button value={ undefined }>Default</Radio.Button>
          {
            Object.entries(radioCandidates).map(([displayName, value]) =>
              <Radio.Button key={ value } value={ value }>{ displayName }</Radio.Button>
            )
          }
          <Radio.Button value='number'>Number</Radio.Button>
        </Radio.Group>
      </Row>
      {
        radioValue === 'number' && <Row>
          <StyledSlider
            onChange={ this.onSliderChange }
            value={ numberValue }
            min={ numberMin } max={ numberMax } step={ numberStep }
          />
          <InputNumber
            onChange={ this.onInputNumberChange }
            value={ numberValue }
            min={ numberMin } max={ numberMax } step={ numberStep }
            precision={ numberPrecision }
          />
        </Row>
      }
    </Container>
  }
}

export default RadioOrNumber
