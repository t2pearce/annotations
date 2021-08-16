import OpenSeaDragon from "openseadragon";
import React, { useEffect, useState } from "react";
import * as Annotorious from '@recogito/annotorious-openseadragon';
import '@recogito/annotorious-openseadragon/dist/annotorious.min.css';
import ShapeLabelsFormatter from './ShapeLabelsFormatter.js';
import ColorFormatter from './ColorFormatter.js';


const OperatorOpenSeaDragonViewer = ({ image }) => {
  const [viewer, setViewer] = useState( null);
  const [anno, setAnno] = useState(null);

  useEffect(() => {
    if (image && viewer) {
      viewer.open(image.source);
    }
    if (image && anno) {    
      anno.destroy();
      const config = {formatter: ColorFormatter};
      const annotate = new Annotorious(viewer, config);
      setAnno(annotate)
    }
  }, [image]);
  
  useEffect(() => {
    if (image && anno) {    
      InitAnnotations();
    }
  }, [anno]);

  const InitOpenseadragon = () => {
    viewer && viewer.destroy();
    
    const initViewer = OpenSeaDragon({
        id: "openSeaDragon",
        prefixUrl: "openseadragon-images/",
        animationTime: 0.5,
        blendTime: 0.1,
        constrainDuringPan: true,
        maxZoomPixelRatio: 2,
        visibilityRatio: 1,
        zoomPerScroll: 2
      });

    setViewer(initViewer);
    const config = {formatter: ColorFormatter};
    const annotate = new Annotorious(initViewer, config);
    setAnno(annotate)
  };
  
  const InitAnnotations = async () => {
    
    getRemoteAnnotations();
    
    anno.on('createAnnotation', (annotation) => {
      console.log("creating");
      const annotationList = anno.getAnnotations();
      console.log(annotationList);
      saveRemoteAnnotation([...annotationList])
    });

    anno.on('updateAnnotation', (annotation, previous) => {
      const annotationList = anno.getAnnotations();
      saveRemoteAnnotation([...annotationList])
    });
  
    anno.on('deleteAnnotation', (annotation) => {
      const annotationList = anno.getAnnotations();
      saveRemoteAnnotation([...annotationList])
    });
    
  }

    async function getUserInfo() {
      const response = await fetch('./auth/me');
      const payload = await response.json();
      const { clientPrincipal } = payload;
      return clientPrincipal;
    }

    async function setUserInfo() {
      let clientPrincipal = await getUserInfo();
      
      anno.setAuthInfo({
            id: clientPrincipal.userId,
            displayName: clientPrincipal.userDetails
          });

          console.log(clientPrincipal);
    }
  
  const saveRemoteAnnotation =  (newAnnotations) => {
    console.log("saving");
    if (!newAnnotations)
      return;

    var json = JSON.stringify(newAnnotations); 
    var encodedId = btoa(image.source.Image.Url);
    fetch("/api/annotation/" + encodedId , { 
          method: 'POST',
          credentials: 'include',
          headers: {'Access-Control-Allow-Credentials': 'true',
                    'Content-Type': 'application/json'},
          body: json } )
      .then((response) => response.json())
      .then(
            (result) => {
              console.log(result);
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
              console.log(error);
            }
          )
    }

  
  const getRemoteAnnotations =  () => {
    var encodedId = btoa(image.source.Image.Url);
        fetch("/api/annotation/" + encodedId , { 
                method: 'GET',
                credentials: 'include',
                headers: {'Access-Control-Allow-Credentials': 'true'}
              })
        .then((response) => response.json())
        .then(
              (result) => {
                  let newAnnotations = result;     
                  if (newAnnotations) {
                    anno.setAnnotations(newAnnotations);
                    console.log("getting");
                    console.log(newAnnotations);
                  }
              },
              // Note: it's important to handle errors here
              // instead of a catch() block so that we don't swallow
              // exceptions from actual bugs in components.
              (error) => {
                console.log(error);
              }
            )
    } 
 
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

export { OperatorOpenSeaDragonViewer };