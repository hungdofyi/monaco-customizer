/**
 * Holistics color palette extracted from @holistics/configs tailwind tokens.
 * Used by the theme editor swatch picker.
 */

export interface ColorShade {
  label: string
  token: string
  hex: string
}

export interface ColorFamily {
  name: string
  shades: ColorShade[]
}

function shades(family: string, entries: [string, string][]): ColorShade[] {
  return entries.map(([label, hex]) => ({
    label,
    token: `${family}-${label}`,
    hex,
  }))
}

export const colorFamilies: ColorFamily[] = [
  {
    name: 'Gray',
    shades: shades('gray', [
      ['50', '#f9fbfc'], ['100', '#f5f8fa'], ['200', '#edf1f5'], ['300', '#e3e7ed'], ['400', '#cbd0d7'],
      ['500', '#989ca6'], ['600', '#727685'], ['700', '#505157'], ['800', '#212327'], ['900', '#13151a'],
    ]),
  },
  {
    name: 'Blue',
    shades: shades('blue', [
      ['50', '#e8f2fd'], ['100', '#d1e5fa'], ['200', '#bbd7f7'], ['300', '#8dbef2'], ['400', '#5ea3ed'],
      ['500', '#4896ea'], ['600', '#1b7ce4'], ['700', '#1663b6'], ['800', '#104a89'], ['900', '#05264c'],
    ]),
  },
  {
    name: 'Green',
    shades: shades('green', [
      ['50', '#eaf8f2'], ['100', '#ccede0'], ['200', '#a4e0c8'], ['300', '#7ad1ae'], ['400', '#52c396'],
      ['500', '#2cb67f'], ['600', '#259b6c'], ['700', '#1f815a'], ['800', '#196848'], ['900', '#145239'],
    ]),
  },
  {
    name: 'Red',
    shades: shades('red', [
      ['50', '#fff5f5'], ['100', '#fde8e8'], ['200', '#fad2d1'], ['300', '#f6a5a2'], ['400', '#f17874'],
      ['500', '#ec4c46'], ['600', '#e71f18'], ['700', '#d01c16'], ['800', '#bf0e08'], ['900', '#8b120e'],
    ]),
  },
  {
    name: 'Orange',
    shades: shades('orange', [
      ['50', '#fff7ea'], ['100', '#fff4d8'], ['200', '#ffe7af'], ['300', '#fecf7f'], ['400', '#faac2e'],
      ['500', '#f28100'], ['600', '#e36a01'], ['700', '#b04a00'], ['800', '#913d00'], ['900', '#662900'],
    ]),
  },
  {
    name: 'Purple',
    shades: shades('purple', [
      ['50', '#f4eefd'], ['100', '#e9dcfa'], ['200', '#decbf7'], ['300', '#d0b5f4'], ['400', '#b184ec'],
      ['500', '#a46de9'], ['600', '#9250e5'], ['700', '#7c2ce0'], ['800', '#5f1bb4'], ['900', '#38097a'],
    ]),
  },
  {
    name: 'Dark Gray',
    shades: shades('dark-gray', [
      ['00', '#13151a'], ['50', '#191b1f'], ['75', '#212327'], ['100', '#292b2e'], ['200', '#2e3033'],
      ['300', '#424347'], ['400', '#505157'], ['500', '#666970'], ['600', '#989ca6'], ['700', '#d2d4d9'],
      ['800', '#e8eaed'], ['900', '#ffffff'],
    ]),
  },
  {
    name: 'Dark Blue',
    shades: shades('dark-blue', [
      ['50', '#252e47'], ['100', '#253547'], ['200', '#314052'], ['300', '#485970'], ['400', '#4e617a'],
      ['500', '#637fa6'], ['600', '#6eb1f5'], ['700', '#94c6f7'], ['800', '#a7d2fc'], ['900', '#b2d9ff'],
    ]),
  },
  {
    name: 'Dark Green',
    shades: shades('dark-green', [
      ['50', '#243830'], ['100', '#2a3d35'], ['200', '#3b5248'], ['300', '#49665b'], ['400', '#587a6d'],
      ['500', '#62a389'], ['600', '#47cc97'], ['700', '#77d9b2'], ['800', '#8ae5c1'], ['900', '#a6edd1'],
    ]),
  },
  {
    name: 'Dark Red',
    shades: shades('dark-red', [
      ['50', '#3d2527'], ['100', '#472e2e'], ['200', '#523738'], ['300', '#705556'], ['400', '#7a6362'],
      ['500', '#a3716f'], ['600', '#f5837f'], ['700', '#f7a3a1'], ['800', '#fab1af'], ['900', '#ffc1bf'],
    ]),
  },
  {
    name: 'Dark Orange',
    shades: shades('dark-orange', [
      ['50', '#3b2d26'], ['100', '#473827'], ['200', '#52412e'], ['300', '#6b5d4d'], ['400', '#7a6d58'],
      ['500', '#a38562'], ['600', '#f2b96d'], ['700', '#f5ba87'], ['800', '#facba2'], ['900', '#ffd9b8'],
    ]),
  },
  {
    name: 'Dark Purple',
    shades: shades('dark-purple', [
      ['50', '#322b47'], ['100', '#3b344d'], ['200', '#403952'], ['300', '#534966'], ['400', '#67587a'],
      ['500', '#7e659e'], ['600', '#b899f7'], ['700', '#cbb4fa'], ['800', '#d7c5fc'], ['900', '#e4d6ff'],
    ]),
  },
]

/** Extra standalone colors */
export const standaloneColors: ColorShade[] = [
  { label: 'White', token: 'white', hex: '#ffffff' },
  { label: 'Black', token: 'black', hex: '#000000' },
]
