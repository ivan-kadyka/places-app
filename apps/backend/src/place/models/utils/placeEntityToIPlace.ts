import { PlaceEntity } from "src/database/entities/place.entity";
import { IPlace } from "src/place/models/IPlace";

  export function placeEntityToIPlace(entity: PlaceEntity): IPlace {

    return {
      id: entity.id,
      name: entity.name,
      coordinate: {
        latitude: entity.latitude,
        longitude: entity.longitude,
      },
      elevation: entity.elevation ?? undefined,
      timezone: entity.timezone,
      countryCode: entity.countryCode,
      openMeteoId: entity.openMeteoId ?? undefined,
    };
  }
