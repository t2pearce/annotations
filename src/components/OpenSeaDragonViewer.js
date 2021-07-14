import OpenSeaDragon,  { parseJSON } from "openseadragon";
import React, { useEffect, useState } from "react";
import * as Annotorious from '@recogito/annotorious-openseadragon';
import '@recogito/annotorious-openseadragon/dist/annotorious.min.css';


const OpenSeaDragonViewer = ({ image }) => {
  const [viewer, setViewer] = useState( null);
  const[anno, setAnno] = useState(null);

  useEffect(() => {
    if (image && viewer) {
      viewer.open(image.source);
    }
    if (image && anno){
      console.log("re-render");
      InitAnnotations()
  } 
  }, [image, annotations]);

  const InitOpenseadragon = () => {
    viewer && viewer.destroy();
    
    const initViewer = OpenSeaDragon({
        id: "openSeaDragon",
        prefixUrl: "openseadragon-images/",
        animationTime: 0.5,
        blendTime: 0.1,
        constrainDuringPan: true,
        maxZoomPixelRatio: 2,
        minZoomLevel: 1,
        visibilityRatio: 1,
        zoomPerScroll: 2
      });

    setViewer(initViewer );
    const config = {};
    const annotate = Annotorious(initViewer, config);
    setAnno(annotate)
  };

  


  const [annotations, setAnnotations] = useState([])
  
  const InitAnnotations = async () => {
    //setUserInfo();

    getRemoteAnnotations();
    
    anno.on('createAnnotation', (annotation) => {
      console.log("creating");
      const newAnnotations = [...annotations, annotation]
      setAnnotations([...newAnnotations])
      saveRemoteAnnotation(newAnnotations)
      console.log(newAnnotations);
    });

    anno.on('updateAnnotation', (annotation, previous) => {
      console.log("updating");
      const newAnnotations = annotations.map(val => {
          if (val.id === annotation.id) return annotation
          return val
      })
      setAnnotations([...newAnnotations])
      saveRemoteAnnotation(newAnnotations)
    });
  
    anno.on('deleteAnnotation', (annotation) => {
      console.log("deleting");
      const newAnnotations  = annotations.filter(val => val.id !== annotation.id)
      setAnnotations([...newAnnotations])
      saveRemoteAnnotation(newAnnotations)
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
    if (!newAnnotations)
      return;

    var json = JSON.stringify(newAnnotations); 
    var encodedId = btoa(image.source.Image.Url);
    fetch("/api/annotation/" + encodedId , { 
          method: 'POST',
          credentials: 'include',
          headers: {'Access-Control-Allow-Credentials': 'true',
                    'Content-Type': 'application/json'},
          body: json} )
      .then((response) => response.json())
      .then(
            (result) => {
              console.log("test");
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
                  let annotations = result;     
                  if (annotations) {
                    console.log(annotations)
                    //const annotations = parseJSON(storedAnnotations)
                    setAnnotations([...annotations]);
                    anno.setAnnotations(annotations);
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

export { OpenSeaDragonViewer };
