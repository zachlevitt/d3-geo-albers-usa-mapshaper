// export const R = 6370997; // Earth radius in meters (matches proj4/mapshaper)

// export const PROJECTIONS = {
//   lower48: { rotate: [96, 0],    center: [0, 37.5],  parallels: [29.5, 45.5] },
//   alaska:  { rotate: [148, 0],   center: [0, 65],    parallels: [55, 70]     },
//   hawaii:  { rotate: [156.5, 0], center: [0, 20.9],  parallels: [19, 24]     },
//   prvi:    { rotate: [66.43, 0], center: [0, 17.83], parallels: [18, 18.43]  }
// };

// // Geographic bounding boxes [[lon_min, lat_min], [lon_max, lat_max]]
// export const BBOXES = {
//   lower48: [[-129, 23],      [-62, 52]       ],
//   alaska:  [[-172.26, 50.89], [-127, 73.21]  ],
//   hawaii:  [[-160.5, 18.72], [-154.57, 22.58]],
//   pr:      [[-68.092, 17.824], [-65.151, 18.787]],
//   vi:      [[-65.104, 17.665], [-64.454, 18.505]]
// };

// // Inset placement params: placement in AEA meters (main proj space), origin lon/lat, scale factor
// export const INSETS = {
//   alaska: { placement: [-1882782, -969242],  origin: [-152, 63],          scale: 0.37 },
//   hawaii: { placement: [-1050326, -1055362], origin: [-157, 21],          scale: 1.0  },
//   prvi:   { placement: [1993101,  -1254517], origin: [-66.431, 18.228],   scale: 1.0  }
// };

// Normalized-space inset regions used by the simplified geoAlbersUsaMapshaper
// projection for invert() bbox tests and sub-projection clipExtent rectangles.
// Coordinates are in units of k (scale) relative to the main translate point.
// Tight axis-aligned bounds in k-normalized space (vs. lower-48 translate) for the
// Alaska/Hawaii clipExtent and invert() hit tests; recomputed when inset translates change.
export const alaskaXRange = [-0.373, -0.189];
export const alaskaYRange = [ 0.099,  0.253];
export const hawaiiXRange = [-0.215, -0.116];
export const hawaiiYRange = [ 0.16,   0.229];

export const epsilon = 1e-6;
