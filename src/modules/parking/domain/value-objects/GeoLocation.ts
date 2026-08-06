import { ValueObject } from 'src/shared/domain/value-object';

interface GeoLocationProps {
  lat: number;
  lng: number;
}

export class GeoLocation extends ValueObject<GeoLocationProps> {
  private constructor(props: GeoLocationProps) {
    super(props);
  }

  static create(lat: number, lng: number): GeoLocation {
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      throw new Error('Invalid coordinates');
    }
    return new GeoLocation({ lat, lng });
  }

  get lat(): number {
    return this.value.lat;
  }

  get lng(): number {
    return this.value.lng;
  }

  equals(vo?: ValueObject<GeoLocationProps>): boolean {
    if (!vo) return false;
    return (
      this.lat === (vo as GeoLocation).lat &&
      this.lng === (vo as GeoLocation).lng
    );
  }

  toString(): string {
    return `(${this.lat}, ${this.lng})`;
  }

  // pra persistir no PostGIS via raw SQL
  toWKT(): string {
    return `POINT(${this.lng} ${this.lat})`;
  }

  // pra reconstruir a partir do que o Postgres devolve
  static fromGeoJSON(geoJson: { coordinates: [number, number] }): GeoLocation {
    const [lng, lat] = geoJson.coordinates;
    return GeoLocation.create(lat, lng);
  }

  toGeoJSON() {
    return { type: 'Point', coordinates: [this.lng, this.lat] };
  }
}
