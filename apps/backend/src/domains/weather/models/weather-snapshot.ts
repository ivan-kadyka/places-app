export interface IDayWeatherSnapshot extends IWeatherSnapshot {
  date: Date
}

export interface IWeatherSnapshot {
  temperatureMax: number
  temperatureMin: number
  precipitationSum: number
  rainSum: number
  snowfallSum: number
  windSpeedMax: number
  windGustsMax: number
  sunshineDuration: number
  weatherCode: number
  precipitationProbabilityMax: number
}

