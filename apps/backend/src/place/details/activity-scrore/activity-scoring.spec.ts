import {
  scoreIndoorSightseeing,
  scoreOutdoorSightseeing,
  scoreSkiing,
  scoreSurfing,
} from './activity-scoring';
import { DailyWeatherPoint } from '../../../weather/weather.types';

function makeDay(overrides: Partial<DailyWeatherPoint> = {}): DailyWeatherPoint {
  return {
    date: '2026-06-15',
    temperatureMax: 20,
    temperatureMin: 10,
    precipitationSum: 0,
    rainSum: 0,
    snowfallSum: 0,
    weatherCode: 0,
    windSpeedMax: 15,
    windGustsMax: 25,
    sunshineDuration: 8 * 3600,
    precipitationProbabilityMax: 5,
    ...overrides,
  };
}

describe('Activity scoring', () => {
  it('prefers cold snowy days for skiing', () => {
    const snowyDay = makeDay({
      temperatureMax: -2,
      temperatureMin: -8,
      snowfallSum: 12,
      weatherCode: 73,
    });
    const warmDay = makeDay({
      temperatureMax: 18,
      temperatureMin: 12,
      weatherCode: 0,
    });

    expect(scoreSkiing(snowyDay)).toBeGreaterThan(scoreSkiing(warmDay));
  });

  it('prefers windy dry days for surfing', () => {
    const surfDay = makeDay({
      windSpeedMax: 28,
      weatherCode: 1,
      precipitationSum: 1,
    });
    const stormDay = makeDay({
      windSpeedMax: 70,
      weatherCode: 95,
      precipitationSum: 30,
    });

    expect(scoreSurfing(surfDay)).toBeGreaterThan(scoreSurfing(stormDay));
  });

  it('prefers mild clear days for outdoor sightseeing', () => {
    const niceDay = makeDay({
      temperatureMax: 22,
      temperatureMin: 14,
      weatherCode: 0,
      sunshineDuration: 9 * 3600,
    });
    const rainyDay = makeDay({
      weatherCode: 63,
      precipitationSum: 18,
      sunshineDuration: 1 * 3600,
    });

    expect(scoreOutdoorSightseeing(niceDay)).toBeGreaterThan(
      scoreOutdoorSightseeing(rainyDay),
    );
  });

  it('prefers bad weather for indoor sightseeing', () => {
    const rainyDay = makeDay({
      weatherCode: 63,
      precipitationSum: 20,
      temperatureMax: 8,
      temperatureMin: 4,
    });
    const sunnyDay = makeDay({
      weatherCode: 0,
      precipitationSum: 0,
      temperatureMax: 22,
      temperatureMin: 15,
    });

    expect(scoreIndoorSightseeing(rainyDay)).toBeGreaterThan(
      scoreIndoorSightseeing(sunnyDay),
    );
  });
});
