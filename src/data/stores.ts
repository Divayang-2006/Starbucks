/**
 * Seed stores for the Stage-1 picker. This is a UI concept with no backend, so
 * the file stands in for a store-locator response — the shape is `Store` from
 * `@/lib/session` exactly, nothing extra, so swapping in a real fetch later is
 * a one-line change at the call site.
 *
 * Twelve stores, three per city, because the picker's city rail is derived from
 * this list rather than hardcoded — an unbalanced seed would make the rail look
 * like a bug.
 *
 * Two fields deserve a note:
 *
 * - **`distanceKm` is seeded as if you are standing in Pune.** That is why the
 *   picker opens on Pune and why the Delhi stores read four figures. It is the
 *   honest reading rather than the flattering one, and it makes the "Near me"
 *   affordance mean something: the moment `useNearby` gets a real fix, every
 *   distance is recomputed from it and these numbers stop being used.
 * - **`etaMins` is prep time, not travel time** (see the `Store` type), so it
 *   deliberately does not track distance. A busy flagship is slower than a
 *   quiet highway kiosk 1,100 km away.
 *
 * Coordinates are [longitude, latitude] — Mapbox order, not the lat-first order
 * every mapping tutorial writes.
 */

import type { Store } from '@/lib/session';

export const STORES: readonly Store[] = [
   {
      id: 'pune-koregaon-park',
      name: 'Koregaon Park',
      area: 'North Main Road',
      city: 'Pune',
      coordinate: [73.8892, 18.5362],
      distanceKm: 1.2,
      etaMins: 6,
      opensAt: '08:00',
      closesAt: '23:00',
      isOpen: true,
      services: ['dineIn', 'takeaway', 'reserve'],
   },
   {
      id: 'pune-viman-nagar',
      name: 'Phoenix Marketcity',
      area: 'Viman Nagar',
      city: 'Pune',
      coordinate: [73.9143, 18.5619],
      distanceKm: 4.8,
      etaMins: 12,
      opensAt: '10:00',
      closesAt: '23:30',
      isOpen: true,
      services: ['dineIn', 'takeaway'],
   },
   {
      id: 'pune-wakad-highway',
      name: 'Wakad Highway',
      area: 'Mumbai–Bengaluru Expressway',
      city: 'Pune',
      coordinate: [73.762, 18.598],
      distanceKm: 11.4,
      etaMins: 4,
      opensAt: '00:00',
      closesAt: '23:59',
      isOpen: true,
      services: ['driveThru', 'takeaway'],
   },
   {
      id: 'mumbai-horniman-circle',
      name: 'Horniman Circle',
      area: 'Fort',
      city: 'Mumbai',
      coordinate: [72.8347, 18.9322],
      distanceKm: 118.6,
      etaMins: 14,
      opensAt: '08:00',
      closesAt: '00:30',
      isOpen: true,
      services: ['dineIn', 'takeaway', 'reserve'],
   },
   {
      id: 'mumbai-linking-road',
      name: 'Linking Road',
      area: 'Bandra West',
      city: 'Mumbai',
      coordinate: [72.833, 19.0607],
      distanceKm: 127.3,
      etaMins: 9,
      opensAt: '09:00',
      closesAt: '01:00',
      isOpen: true,
      services: ['dineIn', 'takeaway'],
   },
   {
      id: 'mumbai-palladium',
      name: 'Palladium',
      area: 'Lower Parel',
      city: 'Mumbai',
      coordinate: [72.8258, 18.9945],
      distanceKm: 121.9,
      etaMins: 18,
      opensAt: '11:00',
      closesAt: '23:00',
      isOpen: true,
      services: ['dineIn', 'takeaway'],
   },
   {
      id: 'bengaluru-mg-road',
      name: 'MG Road',
      area: 'Trinity Circle',
      city: 'Bengaluru',
      coordinate: [77.6094, 12.975],
      distanceKm: 736.4,
      etaMins: 8,
      opensAt: '08:00',
      closesAt: '23:00',
      isOpen: true,
      services: ['dineIn', 'takeaway'],
   },
   {
      id: 'bengaluru-koramangala',
      name: 'Koramangala 5th Block',
      area: '80 Feet Road',
      city: 'Bengaluru',
      coordinate: [77.6112, 12.9345],
      distanceKm: 740.1,
      etaMins: 11,
      opensAt: '08:30',
      closesAt: '23:30',
      isOpen: true,
      services: ['dineIn', 'takeaway', 'reserve'],
   },
   {
      id: 'bengaluru-indiranagar',
      name: 'Indiranagar',
      area: '100 Feet Road',
      city: 'Bengaluru',
      coordinate: [77.6408, 12.9719],
      distanceKm: 737.8,
      etaMins: 7,
      opensAt: '09:00',
      closesAt: '23:00',
      isOpen: true,
      services: ['dineIn', 'takeaway'],
   },
   {
      id: 'delhi-connaught-place',
      name: 'Connaught Place',
      area: 'Block A, Inner Circle',
      city: 'New Delhi',
      coordinate: [77.2195, 28.6315],
      distanceKm: 1181.2,
      etaMins: 13,
      opensAt: '08:00',
      closesAt: '23:00',
      isOpen: true,
      services: ['dineIn', 'takeaway', 'reserve'],
   },
   {
      id: 'delhi-select-citywalk',
      name: 'Select Citywalk',
      area: 'Saket District Centre',
      city: 'New Delhi',
      coordinate: [77.2197, 28.5285],
      distanceKm: 1174.6,
      etaMins: 15,
      // Mall hours. One closed store keeps the picker honest about the state.
      isOpen: false,
      opensAt: '10:30',
      closesAt: '22:30',
      services: ['dineIn', 'takeaway'],
   },
   {
      id: 'delhi-khan-market',
      name: 'Khan Market',
      area: 'Rabindra Nagar',
      city: 'New Delhi',
      coordinate: [77.227, 28.5995],
      distanceKm: 1178.9,
      etaMins: 5,
      opensAt: '09:00',
      closesAt: '23:00',
      isOpen: true,
      services: ['takeaway'],
   },
];
