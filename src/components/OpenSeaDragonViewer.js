import OpenSeaDragon from "openseadragon";
import React, { useEffect, useState } from "react";
import Annotations from "openseadragon-annotations";


const OpenSeaDragonViewer = ({ image }) => {
  const [viewer, setViewer] = useState( null);

  useEffect(() => {
    if (image && viewer) {
      viewer.open(image.source);
    }
  }, [image]);

  const InitOpenseadragon = () => {
    viewer && viewer.destroy();
    setViewer(
      OpenSeaDragon({
        id: "openSeaDragon",
        prefixUrl: "openseadragon-images/",
        animationTime: 0.5,
        blendTime: 0.1,
        constrainDuringPan: true,
        maxZoomPixelRatio: 2,
        minZoomLevel: 1,
        visibilityRatio: 1,
        zoomPerScroll: 2
      })
      viewer.initializeAnnotations();

      var overlay = viewer.svgOverlay();

      overlay.node().parentNode.style.pointerEvents = 'none';
    );
  };

  useEffect(() => {
    InitOpenseadragon();
    return () => {
        viewer && viewer.destroy();
    };
  }, []);

  return (
  <div
  id="openSeaDragon"
  style={{
    height: "65vh",
    width: "75vw"
  }}
  >
  </div>
 
  );
};

export { OpenSeaDragonViewer };
