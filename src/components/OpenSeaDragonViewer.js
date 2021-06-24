import OpenSeaDragon from "openseadragon";
import React, { useEffect, useRef, useState } from "react";
import { Annotorious } from '@recogito/annotorious';

import '@recogito/annotorious/dist/annotorious.min.css';


const OpenSeaDragonViewer = ({ image }) => {
  const [viewer, setViewer] = useState( null);
  const [ anno, setAnno]= useState();
  const [ mode, setMode] = useState();
  const [ tool, setTool] = useState('rect');
  const imgEl = useRef();

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
    );
  };

  useEffect(() => {
    InitOpenseadragon();
    return () => {
        viewer && viewer.destroy();
    };
  }, []);
  
  useEffect(() => {
    let annotorious = null;

    if (imgEl.current) {
      // Init
      annotorious = new Annotorious({
        image: imgEl.current
      });

      // Attach event handlers here
      annotorious.on('createAnnotation', annotation => {
        console.log('created', annotation);
      });

      annotorious.on('updateAnnotation', (annotation, previous) => {
        console.log('updated', annotation, previous);
      });

      annotorious.on('deleteAnnotation', annotation => {
        console.log('deleted', annotation);
      });
    }
    
    setAnno(annotorious);
    
    return () => annotorious.destroy();
  }, []);
  
  const toggleTool = () => {
    if (tool === 'rect') {
      setTool('polygon');
      anno.setDrawingTool('polygon');
    } else {
      setTool('rect');
      anno.setDrawingTool('rect');
    }
  }
  
    const modeTool = () => {
    if (mode === 'view') {
      setMode('view');
      anno.setDrawingEnabled('disable');
    } else {
      setTool('annotate');
      anno.setDrawingEnabled('enable');
    }
  }

  return (
  <div
  id="openSeaDragon"
  style={{
    height: "65vh",
    width: "75vw"
  }}
  >
    <div>
        <button
          onClick={toggleTool}>
            { tool === 'rect' ? 'RECTANGLE' : 'POLYGON' }
        </button>
        <button
          onClick={modeTool}>
            { mode === 'view' ? 'VIEW' : 'ANNOTATE' }
        </button>
      </div>
  </div>
 
  );
};

export { OpenSeaDragonViewer };
