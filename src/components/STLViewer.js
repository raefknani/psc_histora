import React, { Suspense } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { OrbitControls, Center, Stage, Html } from "@react-three/drei";

function Model({ url }) {
  const geom = useLoader(STLLoader, url);
  return (
    <mesh geometry={geom} castShadow receiveShadow>
      <meshStandardMaterial color="#8c5a3c" roughness={0.3} metalness={0.2} />
    </mesh>
  );
}

function Loader() {
  return (
    <Html center>
      <div className="stl-loader">
        <div className="spinner"></div>
        <p style={{ color: "white", marginTop: "10px", fontSize: "0.9rem" }}>Loading 3D Model...</p>
      </div>
    </Html>
  );
}

export default function STLViewer({ url }) {
  return (
    <div className="stl-viewer-container">
      <Canvas shadows camera={{ position: [0, 0, 10], fov: 45 }}>
        <Suspense fallback={<Loader />}>
          <Stage environment="city" intensity={0.6} contactShadow={true} adjustCamera={true}>
            <Center>
              <Model url={url} />
            </Center>
          </Stage>
          <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 1.75} />
        </Suspense>
      </Canvas>
      <div className="stl-controls-hint">
        Left-click to Rotate • Right-click to Pan • Scroll to Zoom
      </div>
    </div>
  );
}
