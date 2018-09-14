import * as React from 'react'
import { Radio, Divider } from 'antd'
import { RadioOrNumber } from './radio-or-number'
import { observer, inject } from 'mobx-react'
import { OptionsPersist } from '../../../persist/options'
import styled from 'styled-components'
import * as Scrollbar from 'react-smooth-scrollbar'
import produce from 'immer'

const HeightContainer = styled.div<{ height?: number }>`
  ${ ({ height }) => height && `height: ${ height }px` }
`

const PaddingContainer = styled.div`
  padding: 1em;
`

const ContentContainer = styled.div`
  white-space: nowrap;
`

const Label = styled.label`
  font-size: 1.5em;
  line-height: 1em;
  display: block;
  margin-bottom: 0.5em;
`

const StyledDivider = styled(Divider)`
  margin-top: 1em;
  margin-bottom: 1em;
`

const Section = styled.section`
  margin-bottom: 1em;

  &:last-child {
    margin-bottom: inherit;
  }
`

interface OptionsProps {
  options?: OptionsPersist
}

interface OptionsState {
  height?: number
}

@inject('options')
@observer
export class Options extends React.Component<OptionsProps, OptionsState> {
  state = { height: undefined }
  heightContainerRef = React.createRef<HTMLElement>()

  componentDidMount() {
    if (this.heightContainerRef.current) {
      const height = document.documentElement.offsetHeight
      this.setState(produce<OptionsState>(draft => {
        draft.height = height
      }))
    }
  }

  render() {
    const { height } = this.state
    const options = this.props.options!
    return (
      <Scrollbar>
        <HeightContainer innerRef={ this.heightContainerRef } height={ height }>
          <PaddingContainer>
            <ContentContainer>
              <Section>
                <Label>width</Label>
                <RadioOrNumber
                  radioCandidates={{ 'Device-width': 'device-width' }}
                  numberMin={ 1 } numberMax={ 10000 } numberStep={ 1 } numberDefault={ 1 }
                  value={ options.width }
                  onChange={ value => options.changeWidth(value as MetaViewportLength) }
                />
              </Section>
              <Section>
                <Label>initial-scale</Label>
                <RadioOrNumber
                  radioCandidates={{ 'Device-width': 'device-width' }}
                  numberMin={ 0.1 } numberMax={ 10 } numberStep={ 0.1 } numberDefault={ 1 }
                  value={ options['initial-scale'] }
                  onChange={ value => options.changeInitialScale(value as MetaViewportScale) }
                />
              </Section>
              <Section>
                <Label>minimum-scale</Label>
                <RadioOrNumber
                  radioCandidates={{ 'Device-width': 'device-width' }}
                  numberMin={ 0.1 } numberMax={ 10 } numberStep={ 0.1 } numberDefault={ 1 }
                  value={ options['minimum-scale'] }
                  onChange={ value => options.changeMinimumScale(value as MetaViewportScale) }
                />
              </Section>
              <Section>
                <Label>maximum-scale</Label>
                <RadioOrNumber
                  radioCandidates={{ 'Device-width': 'device-width' }}
                  numberMin={ 0.1 } numberMax={ 10 } numberStep={ 0.1 } numberDefault={ 1 }
                  value={ options['maximum-scale'] }
                  onChange={ value => options.changeMaximumScale(value as MetaViewportScale) }
                />
              </Section>
              <Section>
                <Label>user-scalable</Label>
                <Radio.Group
                  value={ options['user-scalable'] }
                  onChange={ e => options.changeUserScalable(e.target.value as MetaViewportUserScalable) }
                >
                  <Radio.Button value={ undefined }>Default</Radio.Button>
                  <Radio.Button value='yes'>Yes</Radio.Button>
                  <Radio.Button value='no'>No</Radio.Button>
                </Radio.Group>
              </Section>
            </ContentContainer>
          </PaddingContainer>
        </HeightContainer>
      </Scrollbar>
    )
  }
}

export default Options
