import config, { type IConfig } from 'config'

export const stormGlassResourcesConfig: IConfig = config.get(
  'App.resources.StormGlass'
)
