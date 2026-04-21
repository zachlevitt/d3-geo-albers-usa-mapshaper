import { geoAlbers, geoConicEqualArea } from "d3-geo";

import { 
  alaskaXRange,
  alaskaYRange,
  hawaiiXRange,
  hawaiiYRange,
  epsilon
} from "./constants.js";

import {
  fitExtent,
  fitHeight,
  fitSize,
  fitWidth,
  multiplex
} from "./geo.js";

// Simplified projection that uses base geoAlbers for lower 48 without split
// Only customizes positioning for Alaska and Hawaii
export function geoAlbersUsaMapshaper() { 
  let cache,
      cacheStream,
      lower48 = geoAlbers(),
      lower48Point,
      // Alaska configuration: Albers Equal Area with lat_1=55, lat_2=70, lat_0=65, lon_0=-148
      alaska = geoConicEqualArea().rotate([148, 0]).center([0, 65]).parallels([55, 70]),
      alaskaPoint,
      hawaii = geoConicEqualArea().rotate([157, 0]).center([-3, 19.9]).parallels([19,20.9]),
      hawaiiPoint,
      point,
      pointStream = {point: function(x, y) { point = [x, y]; }};
    
  // Main projection state
  let k = 1070, x = 480, y = 250;

  function albersUsaMapshaper(coordinates) {
    const lon = coordinates[0], lat = coordinates[1];
    return point = null,
        (lower48Point.point(lon, lat), point) ||
        (alaskaPoint.point(lon, lat), point) ||
        (hawaiiPoint.point(lon, lat), point);
  }

  albersUsaMapshaper.invert = function(coordinates) {
    // Normalized coordinates relative to the projection's frame
    const t = lower48.translate();
    const x_norm = (coordinates[0] - t[0]) / k;
    const y_norm = (coordinates[1] - t[1]) / k;

    // Check if coordinates are in Alaska bounds
    if (y_norm >= alaskaYRange[0] && y_norm < alaskaYRange[1] && 
        x_norm >= alaskaXRange[0] && x_norm < alaskaXRange[1]) {
      return alaska.invert(coordinates);
    }
    
    // Check if coordinates are in Hawaii bounds
    if (y_norm >= hawaiiYRange[0] && y_norm < hawaiiYRange[1] && 
        x_norm >= hawaiiXRange[0] && x_norm < hawaiiXRange[1]) {
      return hawaii.invert(coordinates);
    }
    
    // Default to lower 48
    return lower48.invert(coordinates);
  };

  albersUsaMapshaper.stream = function(stream) {
    return cache && cacheStream === stream ?
      cache :
      cache = multiplex([
        lower48.stream(cacheStream = stream),
        alaska.stream(stream),
        hawaii.stream(stream)
      ]);
  };

  albersUsaMapshaper.precision = function(_) {
    if (!arguments.length) return lower48.precision();
    lower48.precision(_), alaska.precision(_), hawaii.precision(_);
    return reset();
  };

  albersUsaMapshaper.scale = function(_) {
    if (!arguments.length) return k;
    k = +_;
    return albersUsaMapshaper.translate([x, y]);
  };

  albersUsaMapshaper.translate = function(_) {
    if (!arguments.length) return [x, y];
    x = +_[0];
    y = +_[1];
    
    // Set scales on component projections using base geoAlbers scale
    lower48.scale(k);
    alaska.scale(k * 0.37);
    hawaii.scale(k);
    
    // Use standard geoAlbers translate for lower 48, clipped to contiguous US bounds
    lower48Point = lower48
        .translate([x, y])
        .clipExtent([[x - 0.455 * k, y - 0.238 * k], [x + 0.455 * k, y + 0.234 * k]])
        .stream(pointStream);

    // Position Alaska below the lower 48 on the left
    alaskaPoint = alaska
        .translate([x - 0.2755 * k, y + 0.161 * k])
        .clipExtent([
          [x + alaskaXRange[0] * k + epsilon, y + alaskaYRange[0] * k + epsilon],
          [x + alaskaXRange[1] * k - epsilon, y + alaskaYRange[1] * k - epsilon]
        ])
        .stream(pointStream);

    // Position Hawaii below the lower 48 on the right
    hawaiiPoint = hawaii
        .translate([x - 0.209 * k, y + 0.207 * k])
        .clipExtent([
          [x + hawaiiXRange[0] * k + epsilon, y + hawaiiYRange[0] * k + epsilon],
          [x + hawaiiXRange[1] * k - epsilon, y + hawaiiYRange[1] * k - epsilon]
        ])
        .stream(pointStream);

    return reset();
  };
  
  albersUsaMapshaper.fitExtent = function(extent, object) {
    return fitExtent(albersUsaMapshaper, extent, object);
  };

  albersUsaMapshaper.fitSize = function(size, object) {
    return fitSize(albersUsaMapshaper, size, object);
  };

  albersUsaMapshaper.fitWidth = function(width, object) {
    return fitWidth(albersUsaMapshaper, width, object);
  };

  albersUsaMapshaper.fitHeight = function(height, object) {
    return fitHeight(albersUsaMapshaper, height, object);
  };

  function reset() {
    cache = cacheStream = null;
    return albersUsaMapshaper;
  }

  return albersUsaMapshaper.scale(k);
}