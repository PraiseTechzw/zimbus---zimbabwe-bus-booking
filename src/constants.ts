import { City, Bus } from './types';

export const ZIM_CITIES: City[] = [
  { name: 'Harare', code: 'HRE' },
  { name: 'Bulawayo', code: 'BYO' },
  { name: 'Mutare', code: 'MTR' },
  { name: 'Gweru', code: 'GWU' },
  { name: 'Masvingo', code: 'MVG' },
  { name: 'Kwekwe', code: 'KKW' },
  { name: 'Victoria Falls', code: 'VFA' },
  { name: 'Beitbridge', code: 'BTB' },
  { name: 'Chinhoyi', code: 'CHY' },
  { name: 'Kadoma', code: 'KDM' },
];

export const BRAND_NAME = 'Inter Africa';
export const BRAND_LOGO_URL = '/weblogo.png';
export const SUPPORT_EMAIL = 'support@interafrica.co.zw';
export const PRIMARY_OPERATOR = 'Inter Africa';

export const PARTNER_OPERATORS = [
  'Intercape',
  'CAG Travellers',
  'Zupco',
  'Pioneer Coaches',
  'City Link',
  'Extra City',
  'Rimbi Tours',
];

export const BUS_OPERATORS = [
  PRIMARY_OPERATOR,
  ...PARTNER_OPERATORS,
];

const CITY_WEIGHT: Record<string, number> = {
  Harare: 0,
  Chinhoyi: 1.5,
  Kadoma: 2,
  Kwekwe: 3,
  Gweru: 4,
  Masvingo: 5,
  Mutare: 4,
  Bulawayo: 6.5,
  Beitbridge: 8,
  'Victoria Falls': 10,
};

const DEPARTURE_SLOTS = ['05:30', '07:00', '08:30', '10:00', '12:30', '14:00', '16:30', '19:00', '21:30'];

const AMENITY_PACKS: string[][] = [
  ['AC'],
  ['AC', 'Charging'],
  ['WiFi', 'AC', 'Charging'],
  ['WiFi', 'AC', 'Charging', 'Refreshments'],
  ['WiFi', 'AC', 'Charging', 'Refreshments', 'Entertainment'],
];

const toMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const toTime = (totalMinutes: number): string => {
  const safeMinutes = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60);
  const hours = Math.floor(safeMinutes / 60).toString().padStart(2, '0');
  const minutes = (safeMinutes % 60).toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

const estimateDurationMinutes = (from: string, to: string): number => {
  const fromWeight = CITY_WEIGHT[from] ?? 0;
  const toWeight = CITY_WEIGHT[to] ?? 0;
  const weightGap = Math.abs(fromWeight - toWeight);

  // 90-minute minimum, scaled by relative corridor distance.
  return Math.max(90, Math.round((1.5 + weightGap * 1.15) * 60));
};

const buildAmenities = (durationMinutes: number, routeIndex: number): string[] => {
  if (durationMinutes >= 8 * 60) return AMENITY_PACKS[4];
  if (durationMinutes >= 6 * 60) return AMENITY_PACKS[3];
  if (durationMinutes >= 4 * 60) return AMENITY_PACKS[2];
  return AMENITY_PACKS[routeIndex % 2 === 0 ? 1 : 0];
};

const buildRoutePrice = (durationMinutes: number, operatorIndex: number): number => {
  const base = Math.round(durationMinutes / 18);
  const operatorDelta = operatorIndex % 3;
  return Math.max(6, base + operatorDelta);
};

const buildSeatCapacity = (operator: string): number => {
  if (operator === PRIMARY_OPERATOR) return 58;
  if (operator === 'Zupco') return 65;
  if (operator === 'Intercape') return 50;
  return 55;
};

const generateZimbabweRouteNetwork = (): Bus[] => {
  const buses: Bus[] = [];
  let idCounter = 1;

  ZIM_CITIES.forEach((fromCity, fromIndex) => {
    ZIM_CITIES.forEach((toCity, toIndex) => {
      if (fromCity.name === toCity.name) return;

      const routeKey = fromIndex + toIndex;
      const operatorIndex = (fromIndex * 3 + toIndex * 5) % PARTNER_OPERATORS.length;
      const operator = routeKey % 6 === 0 ? PARTNER_OPERATORS[operatorIndex] : PRIMARY_OPERATOR;
      const departureTime = DEPARTURE_SLOTS[(fromIndex + toIndex) % DEPARTURE_SLOTS.length];
      const durationMinutes = estimateDurationMinutes(fromCity.name, toCity.name);
      const arrivalTime = toTime(toMinutes(departureTime) + durationMinutes);
      const price = buildRoutePrice(durationMinutes, routeKey % 6 === 0 ? operatorIndex : 0);
      const totalSeats = buildSeatCapacity(operator);
      const availabilitySeed = (fromIndex * 7 + toIndex * 11 + routeKey * 3) % 18;
      const availableSeats = Math.max(6, totalSeats - (availabilitySeed + 4));
      const amenities = buildAmenities(durationMinutes, fromIndex + toIndex);

      buses.push({
        id: String(idCounter++),
        operator,
        from: fromCity.name,
        to: toCity.name,
        departureTime,
        arrivalTime,
        price,
        totalSeats,
        availableSeats,
        amenities,
      });
    });
  });

  return buses;
};

export const MOCK_BUSES: Bus[] = generateZimbabweRouteNetwork();

