// https://drafts.csswg.org/css-device-adapt/#meta-properties

declare type MetaViewportLength = number /*[1px, 10000px]*/ | 'device-width' | void
declare type MetaViewportScale = number /*[0.1, 10]*/ | void
declare type MetaViewportUserScalable = 'yes' | 'no' | void

declare interface MetaViewportProperties {
  'width': MetaViewportLength
  'initial-scale': MetaViewportScale
  'minimum-scale': MetaViewportScale
  'maximum-scale': MetaViewportScale
  'user-scalable': MetaViewportUserScalable
}
