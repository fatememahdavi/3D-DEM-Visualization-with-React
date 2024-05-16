// Author: Fateme Mahdavi

export const  center = [-117.796, 39.608]

export const zoom = 13

export const maxZoom = 22

export const minZoom = 5

export const layer3DInfo = [
  {
    id: 1, 
    layerName: process.env.REACT_APP_GEOSERVER_LAYERNAME, 
    layerNameTrans: 'Dem layer', 
    wmsLayersName:`${process.env.REACT_APP_GEOSERVER_WORKSPACE}:${process.env.REACT_APP_GEOSERVER_LAYERNAME}`,  
    wmsLayersNameMain:`${process.env.REACT_APP_GEOSERVER_WORKSPACE}:Dem`, 
    opacity: 1
  },
]


