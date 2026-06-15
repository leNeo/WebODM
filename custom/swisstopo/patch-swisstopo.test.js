const assert = require('assert');

const {
  elevationTolerance,
  epsg21781Definition,
  epsg2056Definition,
  epsg4258Definition,
  patchBundleContent,
  projectionRegistration,
  swisstopoHeightEndpoint
} = require('./patch-swisstopo');

const fixture = [
  'map_providers:[{id:"osm",label:"OpenStreetMap",maxZoom:19},',
  '{id:"bing",useBing:!0}],custom_placeholder:',
  'providers:w.default.map_providers,selected:"osm",',
  'custom_desc:w.default.custom_description,',
  'setProvider:function(){for(var e=this.state.selected,n=this.state.custom,',
  'i=this._container.querySelectorAll("li"),o=0;o<i.length;++o){',
  'var r=i[o].dataset.id;t.DomUtil.setClass(i[o],this.getProviderItemClass(r)),',
  'this.setProviderRadioButton(i[o],r)}if("custom"===e&&n)return void ',
  't.tileLayer(n,{attribution:"",maxZoom:23,maxNativeZoom:19}).addTo(this._map);',
  'var a=this.options.providers.find(function(t){return t.id===e});',
  'a&&(a.useBing?t.tileLayer.bing(a.url,{attribution:a.attribute,maxZoom:23,',
  'maxNativeZoom:a.maxZoom}).addTo(this._map):t.tileLayer(a.url,',
  '{attribution:a.attribute,maxZoom:23,maxNativeZoom:a.maxZoom})',
  '.addTo(this._map))}',
  'e.generateGcpOutput=function(t,e,n,i){var o=[];',
  'function exportProps(t){var e="EPSG:4326",n=t.controlpoints,',
  'i=n.points,o=n.status,r=t.sourceProjection;',
  'if(r&&"EPSG:4326"!==r)e=r;else{var a=i.filter(function(t){',
  'return"map"===t.type}).map(function(t){return',
  '(0,M.getUtmZoneFromLatLng)(t.coord[0],t.coord[1])});',
  'if(a=(0,y.default)(a,v.default),1===a.length){',
  'var s=a[0],u=s.zone,l=s.hemisphere;',
  'e=(0,M.getProj4Utm)(u,l)}}var c=o.errors}',
  'mapOptions:{maxZoom:23,maxNativeZoom:20},',
  'c.innerHTML="Apply",t.DomEvent.on(c,"click",function(t){',
  'n.onCustomProviderClick(t,l.value)})},setProviderRadioButton:function(t,e){',
  'this.createCustomButton(s),t.DomEvent.on(o,"click",function(t){',
  'function preview(a){try{(0,C.default)(a,"EPSG:4326",[0,0])}',
  'catch(l){errors.push("Unknown projection "+a)}}',
  'function v(t,e,n){return{type:z,loc:t,id:e,pos:n}}',
  'E=function(t,e){return u({},t,{points:t.points.map(function(t,n){',
  'return e.id===t.id?u({},t,{coord:e.pos}):t})})}',
  't.onMarkerToggle=t.onMarkerToggle.bind(t),',
  't.onMapClick=t.onMapClick.bind(t),t.state={leafletMap:null}',
  '{key:"componentDidMount",value:function(){this.initializeMap()}},',
  '{key:"onMarkerToggle",value:function(t,e,n){var i=this.props,',
  'o=i.toggleControlPointMode,r=i.controlpoints,a=i.setPointProperties,',
  's=i.joinControlPoint;return r.mode===b.CP_MODES.ADDING?',
  'a(!1,null,null,null,t,[n.lat,n.lng]):r.mode===b.CP_MODES.IMAGE_EDIT?',
  's(t):void o(t)}}'
].join('');

const first = patchBundleContent(fixture);

assert.strictEqual(first.changed, true);
assert(first.bundle.includes('window.parent.__webodmGcpiConfig'));
assert(first.bundle.includes('id:"webodm-basemap-"+e'));
assert(first.bundle.includes('type:t.type||"tms"'));
assert(first.bundle.includes('gcpProjection:t.gcpProjection||null'));
assert(first.bundle.includes('"wms"===a.type'));
assert(first.bundle.includes('t.tileLayer.wms(a.url,s)'));
assert(first.bundle.includes('return t.default'));
assert(first.bundle.includes(
  'window.__webodmGcpDestinationProjection=a&&a.gcpProjection||null'
));
assert(first.bundle.includes(
  'var e=window.__webodmGcpDestinationProjection||"EPSG:4326"'
));
assert(first.bundle.includes('window.__webodmGcpExportProjectionSupport=!0'));
assert(first.bundle.includes('window.__webodmGcpProjectionSupport=!0'));
assert(!first.bundle.includes('window.__webodmGcpProjectionSupport==!0'));
assert(first.bundle.includes(
  `s.default.defs("EPSG:2056","${epsg2056Definition}")`
));
assert(first.bundle.includes(
  `s.default.defs("EPSG:21781","${epsg21781Definition}")`
));
assert(first.bundle.includes(
  `s.default.defs("EPSG:4258","${epsg4258Definition}")`
));
assert(first.bundle.includes('"EPSG:326"+__webodmZoneCode'));
assert(first.bundle.includes('"EPSG:327"+__webodmZoneCode'));
assert(first.bundle.includes('"EPSG:258"+__webodmEtrsZone'));
assert(first.bundle.includes('maxZoom:28,maxNativeZoom:20'));
assert(first.bundle.includes('window.__webodmGcpProj4=C.default'));
assert(first.bundle.includes(`C.default.defs("EPSG:2056","${epsg2056Definition}")`));
assert(first.bundle.includes(`C.default.defs("EPSG:21781","${epsg21781Definition}")`));
assert(first.bundle.includes('(0,C.default)(a,"EPSG:4326",[0,0])'));
assert(first.bundle.includes(swisstopoHeightEndpoint));
assert(first.bundle.includes('elevation_model=COMB'));
assert(first.bundle.includes('getGcpPointWgs84'));
assert(first.bundle.includes(
  'i.sourceProjection||i.projection||window.__webodmGcpDestinationProjection'
));
assert(first.bundle.includes(
  'window.__webodmGcpProj4(o,"EPSG:4326",[n,e])'
));
assert(first.bundle.includes(
  '?easting="+encodeURIComponent(i)+"&northing="+encodeURIComponent(o)'
));
assert(first.bundle.includes(`Math.abs(i-c)>${elevationTolerance}`));
assert(first.bundle.includes('Altitude swisstopo :'));
assert(first.bundle.includes('data-testid","compare-gcp-altitudes'));
assert(first.bundle.includes('data-testid","check-all-gcp-altitudes'));
assert(first.bundle.includes('window.__webodmCompareAltitudes!==!1'));
assert(first.bundle.includes('window.__webodmCheckAllGcpAltitudes'));
assert(first.bundle.includes('checkAllGcpAltitudes'));
assert(first.bundle.includes('Contr\\u00f4ler tous les GCP'));
assert(first.bundle.includes('Utiliser les altitudes swisstopo pour ces GCP ?'));
assert(first.bundle.includes('altitude:arguments.length>3?arguments[3]:void 0'));
assert(first.bundle.includes('z:void 0===e.altitude?t.z:e.altitude'));
assert(first.bundle.includes('u("map",t,l.coord,i)'));
assert(first.bundle.includes(
  't.props.setControlPointPosition("map",e.point.id,e.point.coord,e.height)'
));

const second = patchBundleContent(first.bundle);

assert.strictEqual(second.changed, false);
assert.strictEqual(second.bundle, first.bundle);

assert.throws(
  () => patchBundleContent(
    fixture.replace(
      'try{(0,C.default)(a,"EPSG:4326",[0,0])}catch(l){',
      'try{validateProjection(a)}catch(l){'
    )
  ),
  /Could not locate the GCPI projection validation/
);

assert.throws(
  () => patchBundleContent(
    fixture.replace(
      'function v(t,e,n){return{type:z,loc:t,id:e,pos:n}}',
      'function positionActionChanged(){}'
    )
  ),
  /Could not locate the GCPI point position action/
);

const registration = projectionRegistration('proj4', 'window.supported');
assert(registration.includes('proj4.defs("EPSG:21781"'));
assert(registration.includes('proj4.defs("EPSG:326"+__webodmZoneCode'));
assert(registration.includes('proj4.defs("EPSG:327"+__webodmZoneCode'));
assert(registration.includes('proj4.defs("EPSG:258"+__webodmEtrsZone'));

const registeredDefinitions = {};
const proj4 = {
  defs(code, definition) {
    registeredDefinitions[code] = definition;
  }
};
global.window = {};
eval(registration);

assert.strictEqual(window.supported, true);
assert.strictEqual(window.__webodmGcpProj4, proj4);
assert.strictEqual(registeredDefinitions['EPSG:2056'], epsg2056Definition);
assert.strictEqual(registeredDefinitions['EPSG:21781'], epsg21781Definition);
assert(registeredDefinitions['EPSG:32632'].includes('+zone=32'));
assert(registeredDefinitions['EPSG:32732'].includes('+south'));
assert(registeredDefinitions['EPSG:25832'].includes('+ellps=GRS80'));
assert.strictEqual(Object.keys(registeredDefinitions).length, 134);

console.log('SWISSIMAGE, multi-CRS and elevation bundle patch tests passed');
