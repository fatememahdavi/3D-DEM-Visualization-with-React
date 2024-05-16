// Author: Fateme Mahdavi

import React, { useEffect, useRef, useState } from 'react';
import Stats from 'stats.js';
import * as THREE from 'three';
import * as maptalks from 'maptalks';
import { ThreeLayer } from 'maptalks.three';
import { fromArrayBuffer } from "geotiff";
import proj4 from 'proj4';
import 'maptalks/dist/maptalks.css';

import { layer3DInfo, center, zoom} from "../constants/LayersConstant";
import demTexture from "../statics/texture.png";
import demTiff from "../statics/dem.tif";

import {Dem3DStyles} from "../styles/Dem3DStyles";

import LayersRoundedIcon from '@mui/icons-material/LayersRounded';
import {
  Box,
  Drawer,
  IconButton, 
  Checkbox, 
  FormControlLabel, 
  List,
  Radio,
  Divider,
} from '@mui/material';


export default function Model3D (props) {

  // ---------------- use styles --------------------------------------------------------------------
  const classes = Dem3DStyles();
  
  // ---------------- define local states and consts ------------------------------------------------
  const [openLayers, setOpenLayers] = React.useState(false);
  const [baseMap, setBaseMap] = useState('osm');
  const [threeLayerMap, setThreeLayerMap] = React.useState({
    map:null,
    threeLayer: null,
  });
  const [meshes, setMeshes] = React.useState({
    Dem: null,
  });
  const [layerVisible, setLayerVisible] = React.useState({
    Dem: false,
  });

  const mapRef = useRef(null);

  const wgs84 = '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs';
  const epsg3857 = '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs';

  const planeCenterLng = Number(process.env.REACT_APP_PLANE_CENTER_LNG);
  const planeCenterLat = Number(process.env.REACT_APP_PLANE_CENTER_LAT);
  const scaleX= Number(process.env.REACT_APP_XSCALE)
  const scaleY= Number(process.env.REACT_APP_YSCALE)
  const scaleH= Number(process.env.REACT_APP_HSCALE)

  // ---------------- define landlers -------------------------------------------------------------
  const transformCoordinates = (lon, lat) => {
    const point = proj4(wgs84, epsg3857, [lon, lat]);
    return { x: point[0], y: point[1] };
  };

  const load_Dem = () => {
    fetch(demTiff)
    .then((response) => response.arrayBuffer())
    .then((arrayBuffer) => {
      fromArrayBuffer(arrayBuffer)
        .then((tiff) => {
          return tiff.getImage();
        })
        .then((image) => {
          const width = image.getWidth();
          const height = image.getHeight();
          return image.readRasters({ samples: [0], interleave: true, window: [0, 0, width, height] })
            .then((rasters) => {
              return { width, height, rasters, image };
            });
        })
        .then(({ width, height, rasters , image}) => {
          const elevationData = rasters;

          let minHeight = Number.POSITIVE_INFINITY;
          for (let index = 0; index < elevationData.length; index++) {
            if (elevationData[index] < minHeight &&  elevationData[index] >= 0) {
              minHeight = elevationData[index];
            }
          }

          const geometry = new THREE.PlaneGeometry(width * scaleX, height * scaleY, width - 1, height - 1);
          const arrayTemp = new Array(geometry.attributes.position.count);
          const arrayFilled = arrayTemp.fill(0);
          arrayFilled.forEach((a, index) => {
            geometry.attributes.position.setZ(index,elevationData[index]-minHeight>0? (elevationData[index]-minHeight) / scaleH : a );
          });

          const texture_dem = new THREE.TextureLoader().load(demTexture);
          texture_dem.minFilter = THREE.LinearFilter;

          var materia_dem = new THREE.MeshBasicMaterial({ transparent: false, wireframe: false, map: texture_dem, opacity:1});
          const mesh_dem = new THREE.Mesh(geometry, materia_dem);

          const transformedCoords = transformCoordinates(planeCenterLng, planeCenterLat);
          mesh_dem.position.x = transformedCoords.x;
          mesh_dem.position.y = transformedCoords.y;

          mesh_dem.name = 'Dem'
          setMeshes({...meshes, Dem: mesh_dem})
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    });
  }

  const handleOpenLayers =() =>{
    setOpenLayers(!openLayers)
  }

  const handleChangeLayercheck = (event) => {
    setLayerVisible({
      ...layerVisible,
      [event.target.name]: event.target.checked,
    });
  }

  const handleBaseMapChange = (event) => {
    setBaseMap(event.target.value);
  }
  
  const controlBaseMapradio = (item) => ({
    checked: baseMap === item,
    onChange: handleBaseMapChange,
    value: item,
    name: 'radio-button',
    inputProps: { 'aria-label': item },
  });

  // --------------- sync component with chenge states ------------------------------------------
  useEffect(()=>{
    if (!meshes.Dem){
      load_Dem()
    }
  },[layerVisible])

  useEffect(() =>{
      const map = new maptalks.Map(mapRef.current, {
        center: center,
        zoom: zoom,
        pitch: 0,
        attribution: false,
        spatialReference:{
          projection:'EPSG:3857'
        },
        baseLayer: 
          baseMap==='osm'? 
            new maptalks.TileLayer('base', {
              spatialReference:{
                projection:'EPSG:3857'
              },
              urlTemplate: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
              subdomains: ['a', 'b', 'c'],
            })
          : baseMap==='sat'? 
            new maptalks.TileLayer('base', {
              spatialReference:{
                projection:'EPSG:3857'
              },
              urlTemplate:'https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
              subdomains:['mt1','mt2','mt3']
            })
          :baseMap==='topo'? 
            new maptalks.TileLayer('base', {
              spatialReference:{
                projection:'EPSG:3857'
              },
              urlTemplate: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
              subdomains: ['a', 'b', 'c'],
              attribution: '&copy; <a href="http://osm.org">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>'
            })
          :baseMap==='dark'? 
            new maptalks.TileLayer('base', {
              spatialReference:{
                projection:'EPSG:3857'
              },
              urlTemplate: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
              subdomains: ['a', 'b', 'c', 'd'],
              attribution: '&copy; <a href="http://osm.org">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>'
            })
          :
          null
          ,
      });

      var threeLayer = new ThreeLayer('t', {
        forceRenderOnMoving: true,
        forceRenderOnRotating: true
      });

      threeLayer.prepareToDraw = function (gl, scene, camera) {
        const stats = new Stats();
        stats.domElement.style.zIndex = 100;
        document.getElementById('map').appendChild(stats.domElement);

        var light = new THREE.DirectionalLight(0xffffff);
        light.position.set(0, 10, 10).normalize();
        scene.add(light);
        scene.add(new THREE.AmbientLight(0xffffff, 0.5));
      };

      threeLayer.addTo(map);

      setThreeLayerMap({
        map: map,
        threeLayer: threeLayer,
      })
 
      return () => {
        map.remove();
      };
    
  },[baseMap])

  useEffect(()=>{  
    for (const [key, value] of Object.entries(layerVisible)) {
      if(threeLayerMap.threeLayer && meshes[key]){
          var check_mesh_added = threeLayerMap.threeLayer._meshes.map(mesh => mesh.name).includes(key)
          if(value && !check_mesh_added){
            threeLayerMap.threeLayer.addMesh(meshes[key])
          }else if (value && check_mesh_added){
            threeLayerMap.threeLayer._meshes.filter(mesh => mesh.name === key)[0].visible = true
            threeLayerMap.map.setView(threeLayerMap.map.getView())
          }else if (!value && check_mesh_added){
            threeLayerMap.threeLayer._meshes.filter(mesh => mesh.name === key)[0].visible = false
            threeLayerMap.map.setView(threeLayerMap.map.getView())
          }
      }
    }
  },[layerVisible, baseMap, threeLayerMap])

  // ---------------- return jsx elements ------------------------------------------------
  return (
    <div>
      <div className={classes.layerIconDiv}>
        <IconButton onClick={handleOpenLayers} className='btn'>
          <LayersRoundedIcon className='icon'/>
        </IconButton>
      </div>
      <Drawer
        classes={{paper: classes.drawerPaper}}
        anchor='right'
        open={openLayers}
        variant={"persistent"}
        BackdropProps={{ invisible: true }}
        PaperProps={{
          sx: {
            background: 'transparent',
          }
        }}
      >
        <Box>
          <List>
            <Divider variant="middle" classes={{root: classes.divider}} >
              3D Layers 
            </Divider>
            {layer3DInfo.map((layer, index) => {
              return(
                <Box key={layer.layerNameTrans}>
                  <FormControlLabel
                    className={classes.frmCntrlLabel}
                    labelPlacement="start"
                    label={layer.layerNameTrans}
                    control={
                      <Checkbox checked={layerVisible[layer.layerName]} name={layer.layerName} 
                        onChange={handleChangeLayercheck} 
                        sx={{'& .MuiSvgIcon-root': {color: 'black', fontSize: 20}}}
                      />
                    }
                  /> 
                </Box>
              )
            })}
            <Divider variant="middle" classes={{root: classes.divider}} >
              Base Maps 
            </Divider>
            <Box>
              <Box className={classes.listBtn}>
                <FormControlLabel
                  className={classes.frmCntrlLabel}
                  labelPlacement="start"
                  value="osm"
                  label="OSM Map"
                  control={<Radio {...controlBaseMapradio('osm')} className={classes.contoler}/>}
                />
              </Box>
              <Box className={classes.listBtn}>
                <FormControlLabel
                  className={classes.frmCntrlLabel}
                  labelPlacement="start"
                  value="sat"
                  label="Google Satellite"
                  control={<Radio {...controlBaseMapradio('sat')} className={classes.contoler} />}
                />
              </Box>
              <Box className={classes.listBtn}>
                <FormControlLabel
                  className={classes.frmCntrlLabel}
                  labelPlacement="start"
                  value="topo"
                  label="Topography Map"
                  control={<Radio {...controlBaseMapradio('topo')} className={classes.contoler} />}
                />
              </Box>
              <Box className={classes.listBtn}>
                <FormControlLabel
                  className={classes.frmCntrlLabel}
                  labelPlacement="start"
                  value="dark"
                  label="Dark Map"
                  control={<Radio {...controlBaseMapradio('dark')} className={classes.contoler} />}
                />
              </Box>
            </Box>
          </List>
        </Box>
      </Drawer>
      <div ref={mapRef} id='map' className={classes.mapDiv}/>
    </div>
  )
};
