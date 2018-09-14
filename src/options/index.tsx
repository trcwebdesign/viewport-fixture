import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Options } from './components/desktop'
import { Provider } from 'mobx-react'
import { OptionsPersist } from '../persist'

;(async () => {
  ReactDOM.render(
    <Provider options={ await new OptionsPersist() }>
      <Options />
    </Provider>
  , document.querySelector('main')
  )
})()
