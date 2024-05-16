// Author: Fateme Mahdavi

import { makeStyles } from '@material-ui/core/styles';

const drawerWidth = 250;
const color_1 = '#000000';
const color_2 = '#e7e9ec';

export const Dem3DStyles = makeStyles(theme => ({
  mapDiv:{
    position: 'absolute',
    top: 0, 
    left: 0,
    width: '100%', 
    height: '100vh',
    backgroundColor: 'lightblue',
  },

  layerIconDiv:{
    position: 'absolute',
    top: 10,
    right:0,
    color: color_1,
    zIndex: 1400,
    '& .btn':{
      background: color_2,
      borderRadius: 5,
      margin:2,
      padding:1
    },
    '& .icon':{
      fontSize: 30,
      color: color_1
    }
  },

  drawerPaper:{
    overflowX: 'hidden',
    zIndex: 1400,
    borderRadius: 5,
    margin:'10px 40px 0px 0px',
    width: drawerWidth,
    height: 'auto',
    background: 'rgba(230,230,230,0.8)',
    color: color_1,
    "& .MuiPaper-root": {
        opacity:30,
    }
  },

  listBtn:{
      '&:hover': {
          backgroundColor: color_2,
          borderRadius:20
      },
  },

  contoler: {
    '& .icon': {
        fontSize: 20,
    },
    '&:hover': {
        backgroundColor: color_2,
    },
    '& .MuiSvgIcon-root': {
        color: color_1,
        fontSize: 20,

    }
  },
  
  frmCntrlLabel: {
    display: "flex",
    justifyContent: "space-between",
    margin: '20px',
    '&:hover': {
      backgroundColor: color_2,
      borderRadius:20
    }, 
  },

  divider: {
    color: color_1,
    "&::before, &::after": {
      borderColor: color_1,
    },
  },

  icon:{
      fontSize: 30,
      color: color_1,
  },

  map:{
    position: 'absolute', 
    top: 45, 
    left: 0, 
    display: 'flex',
    width: '100%', 
    height: 'calc(100% - 45px)',
    borderRadius:"0px 0px 10px 10px", 
    backgroundColor: 'lightblue',
    borderBottom:'1px solid black'
  },
}));
