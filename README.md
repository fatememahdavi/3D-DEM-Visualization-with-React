
<video src="./doc/video.mp4" autoplay loop controls>
  Your browser does not support the video tag.
</video>

<br/>

# 3D DEM Visualization with React, MapTalks, and Three.js

This repository contains a React application that visualizes Digital Elevation Model (DEM) data on a map using MapTalks and Three.js. Additionally, it provides features like toggling the visibility of the 3D layer and changing the base map.

## Table of Contents
1. [Features](#features)
2. [Requirements](#requirements)
3. [Installation](#installation)
5. [Configuration](#configuration)
4. [Usage](#usage)


## Features

- Visualize DEM data as a 3D model on a map.
- Toggle the visibility of the 3D layer.
- Change the base map (OpenStreetMap, Google Satellite, Topographic).

## Requirements

- Node.js
- npm

## Installation

1. Clone the repository to your local machine. 
2. Navigate to the project directory.
3. Install the dependencies by running:
    ```shell
    npm install
    ```
## Configuration

Before running the application, you need to set the following environment variables based on your DEM resolution and map projection:
1. Create a `.env` file in the root directory of the project.
2. Open the `.env` file and set the following parameters:
    - `REACT_APP_XSCALE`: The scaling factor in the X-axis direction.
    - `REACT_APP_YSCALE`: The scaling factor in the Y-axis direction.
    - `REACT_APP_HSCALE`: The scaling factor for the height of the DEM model.
    - `REACT_APP_PLANE_CENTER_LAT`: The latitude coordinate of the center of the DEM plane.
    - `REACT_APP_PLANE_CENTER_LNG`: The longitude coordinate of the center of the DEM plane.

Adjust the values of these parameters based on your specific DEM resolution and map projection.

## Usage

1. Place the `dem.tif` and `texture.png` files in the `src/statics/` directory of the project. These files contain the DEM data and texture for the 3D model, respectively.

2. Start the development server:
    ```shell
    npm start
    ```
3. Open your web browser and navigate to `http://localhost:3000` to view the application.

