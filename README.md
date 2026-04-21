# d3-geo-albers-usa-mapshaper

A [d3-geo](https://d3js.org/d3-geo) composite projection that matches [Mapshaper](https://mapshaper.org/)’s `albersusa` projection, so geometries processed in Mapshaper line up when you draw them in D3 with the same projection parameters.

The lower 48 use [geoAlbers](https://d3js.org/d3-geo/conic#geoAlbers). Alaska and Hawaii use separate [geoConicEqualArea](https://d3js.org/d3-geo/conic#geoConicEqualArea) definitions with Mapshaper’s standard parallels, rotations, and inset placement (Alaska is drawn at reduced scale relative to the contiguous states).

## Installing

With npm:

```bash
npm install d3-geo-albers-usa-mapshaper
```

## Usage

```js
import { geoAlbersUsaMapshaper } from "d3-geo-albers-usa-mapshaper";

const projection = geoAlbersUsaMapshaper();

// Typical D3 pattern: size to a viewport
const path = d3.geoPath().projection(
  projection.fitSize([width, height], geojson)
);
```

## API Reference

<a name="geoAlbersUsaMapshaper" href="#geoAlbersUsaMapshaper">#</a> **geoAlbersUsaMapshaper**()

Constructs a new Mapshaper-compatible Albers USA projection. The returned object is a function `(coordinates) => [x, y]` plus the methods below.

<a name="projection_scale" href="#projection_scale">#</a> *projection*.**scale**([*scale*])

If *scale* is specified, sets the overall scale factor and updates component projections. If omitted, returns the current scale.

<a name="projection_translate" href="#projection_translate">#</a> *projection*.**translate**([*point*])

If *point* is specified, sets the translation `[x, y]` and recomputes clip extents and inset positions. If omitted, returns the current translation.

<a name="projection_precision" href="#projection_precision">#</a> *projection*.**precision**([*precision*])

If *precision* is specified, sets adaptive sampling precision on all component projections (see [projection.precision](https://d3js.org/d3-geo/projection#projection_precision)). If omitted, returns the current precision.

<a name="projection_stream" href="#projection_stream">#</a> *projection*.**stream**(*stream*)

Returns a composite [geo stream](https://d3js.org/d3-geo/stream) for rendering.

<a name="projection_invert" href="#projection_invert">#</a> *projection*.**invert**(*point*)

Given pixel coordinates `[x, y]`, returns `[longitude, latitude]` by delegating to the lower 48, Alaska, or Hawaii projection based on inset bounds.

<a name="projection_fitExtent" href="#projection_fitExtent">#</a> *projection*.**fitExtent**(*extent*, *object*)  
<a name="projection_fitSize" href="#projection_fitSize">#</a> *projection*.**fitSize**(*size*, *object*)  
<a name="projection_fitWidth" href="#projection_fitWidth">#</a> *projection*.**fitWidth**(*width*, *object*)  
<a name="projection_fitHeight" href="#projection_fitHeight">#</a> *projection*.**fitHeight**(*height*, *object*)

Convenience methods to set scale and translate so the given GeoJSON *object* fits the viewport; see [fitExtent](https://d3js.org/d3-geo/projection#projection_fitExtent) and related helpers in d3-geo.

## Limitations

This projection fixes clip extents, centers, and rotations internally to mirror Mapshaper’s layout. It does not expose generic [**projection.center**](https://d3js.org/d3-geo/projection#projection_center), [**projection.rotate**](https://d3js.org/d3-geo/projection#projection_rotate), [**projection.clipAngle**](https://d3js.org/d3-geo/projection#projection_clipAngle), or [**projection.clipExtent**](https://d3js.org/d3-geo/projection#projection_clipExtent) on the composite object the way a single-region d3 projection would.

Puerto Rico and other territories are not included as separate insets in this implementation.

## License

ISC. See [LICENSE](./LICENSE).
