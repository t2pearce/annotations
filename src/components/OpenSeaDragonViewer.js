import OpenSeaDragon from "openseadragon";
import React, { useEffect, useState } from "react";
import * as Annotorious from '@recogito/annotorious-openseadragon';
import '@recogito/annotorious-openseadragon/dist/annotorious.min.css';
import ShapeLabelsFormatter from './ShapeLabelsFormatter.js';


const OpenSeaDragonViewer = ({ image }) => {
  const [viewer, setViewer] = useState( null);
  const [anno, setAnno] = useState(null);
  const [annotations, setAnnotations] = useState([]);
  
  useEffect(() => {
    InitOpenseadragon();
    
    return () => {
        viewer && viewer.destroy();
    };
  }, []);
  
  useEffect(() => {
    InitOpenseadragon();
    viewer.open(image.source);
    if (image && viewer) {
      getRemoteAnnotations();
    }
    if (image && anno) {
      InitAnnotations();
    }
    console.log("Render");

    return () => {
        viewer && viewer.destroy();
    };
  }, [image]);
 
  const InitOpenseadragon = () => {
    //viewer && viewer.destroy();
    
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
    const config = {formatter: ShapeLabelsFormatter};
    const annotate = Annotorious(initViewer, config);
    setAnno(annotate)
  };
  
   const InitAnnotations = () => {
    
    anno.on('createAnnotation', (annotation) => {
      console.log("creating");
      const newAnnotations = [...annotations, annotation]
      setAnnotations(newAnnotations);
      console.log(newAnnotations);
      saveRemoteAnnotation([...newAnnotations])
    });

    anno.on('updateAnnotation', (annotation, previous) => {
      const newAnnotations = annotations.map(val => {
          if (val.id === annotation.id) return annotation
          return val
      })
      console.log(newAnnotations);
      setAnnotations(newAnnotations);
      saveRemoteAnnotation([...newAnnotations])
    });
  
    anno.on('deleteAnnotation', (annotation) => {
      const newAnnotations  = annotations.filter(val => val.id !== annotation.id)
      console.log(newAnnotations);
      setAnnotations(newAnnotations);
      saveRemoteAnnotation([...newAnnotations])
    });    
  }

/*  useEffect(() => {
    if (image && viewer) {
      viewer.open(image.source);
      getRemoteAnnotations();
    }
//    if (image && anno) {
//      InitAnnotations();
//      console.log("Render");
//    }
  }, [image]);
  
  useEffect(() => {
    console.log("Render annotations");
    if (image && anno) {
      InitAnnotations();
    }
  }, [annotations]);

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
    const config = {formatter: ShapeLabelsFormatter};
    const annotate = Annotorious(initViewer, config);
    setAnno(annotate)
  };
  
  const InitAnnotations = async () => {
    
    anno.on('createAnnotation', (annotation) => {
      console.log("creating");
      const newAnnotations = [...annotations, annotation]
      setAnnotations(newAnnotations)
      console.log(newAnnotations);
      saveRemoteAnnotation([...newAnnotations])
      //setCheck(!check);
    });

    anno.on('updateAnnotation', (annotation, previous) => {
      const newAnnotations = annotations.map(val => {
          if (val.id === annotation.id) return annotation
          return val
      })
      setAnnotations([...newAnnotations])
      saveRemoteAnnotation([...newAnnotations])
      //InitOpenseadragon();
      //setCheck(!check);
    });
  
    anno.on('deleteAnnotation', (annotation) => {
      const newAnnotations  = annotations.filter(val => val.id !== annotation.id)
      setAnnotations([...newAnnotations])
      saveRemoteAnnotation([...newAnnotations])
      //InitOpenseadragon();
      //setCheck(!check);
    });
  }
*/

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
                   // setAnnotations([...newAnnotations]);
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
 /*
  useEffect(() => {
    InitOpenseadragon();

    return () => {
        viewer && viewer.destroy();
    };
  }, []);
*/
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
