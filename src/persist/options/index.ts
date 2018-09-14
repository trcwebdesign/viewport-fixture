import { observable, autorun, toJS, action, configure } from 'mobx'
import { AsyncConstructor } from 'async-constructor'

configure({ enforceActions: 'observed' })

export async function getOptions(): Promise<MetaViewportProperties> {
  const { options } = await browser.storage.local.get({
    options: {
      'width': undefined
    , 'initial-scale': undefined
    , 'minimum-scale': undefined
    , 'maximum-scale': undefined
    , 'user-scalable': undefined
    }
  }) as { options: MetaViewportProperties }
  return options
}

export async function setOptions(options: MetaViewportProperties) {
  await browser.storage.local.set({
    version: browser.runtime.getManifest().version
  , options
  })
}

export class OptionsPersist extends AsyncConstructor implements MetaViewportProperties {
  @observable width: MetaViewportLength = undefined
  @observable 'initial-scale': MetaViewportScale = undefined
  @observable 'minimum-scale': MetaViewportScale = undefined
  @observable 'maximum-scale': MetaViewportScale = undefined
  @observable 'user-scalable': MetaViewportUserScalable = undefined

  constructor() {
    super(async () => {
      const syncPersist = async () => {
        const options = await getOptions()
        this.changeWidth(options.width)
        this.changeInitialScale(options['initial-scale'])
        this.changeMinimumScale(options['minimum-scale'])
        this.changeMaximumScale(options['maximum-scale'])
        this.changeUserScalable(options['user-scalable'])
      }

      await syncPersist()

      autorun(((firstrun = true) => async () => {
        const options: MetaViewportProperties = {
          'width': toJS(this.width)
        , 'initial-scale': toJS(this['initial-scale'])
        , 'minimum-scale': toJS(this['minimum-scale'])
        , 'maximum-scale': toJS(this['maximum-scale'])
        , 'user-scalable': toJS(this['user-scalable'])
        }

        if (firstrun) {
          return firstrun = false
        }

        setOptions(options)
      })())
    })
  }

  @action.bound changeWidth(value: MetaViewportLength) {
    if (typeof value === 'number') {
      if (value < 1 || value > 10000) {
        throw Error('width: [1, 10000]')
      }
      value = parseInt(value.toFixed(0), 10)
    }
    this.width = value
  }

  @action.bound changeInitialScale(value: MetaViewportScale) {
    if (typeof value === 'number') {
      if (value < 0.1 || value > 10) {
        throw Error('initial-scale: [0.1, 10]')
      }
      value = parseFloat(value.toFixed(1))
    }
    this['initial-scale'] = value
  }

  @action.bound changeMinimumScale(value: MetaViewportScale) {
    if (typeof value === 'number') {
      if (value < 0.1 || value > 10) {
        throw Error('minimum-scale: [0.1, 10]')
      }
      value = parseFloat(value.toFixed(1))
    }
    this['minimum-scale'] = value
  }

  @action.bound changeMaximumScale(value: MetaViewportScale) {
    if (typeof value === 'number') {
      if (value < 0.1 || value > 10) {
        throw Error('maximum-scale: [0.1, 10]')
      }
      value = parseFloat(value.toFixed(1))
    }
    this['maximum-scale'] = value
  }

  @action.bound changeUserScalable(value: MetaViewportUserScalable) {
    this['user-scalable'] = value
  }
}

export default OptionsPersist
