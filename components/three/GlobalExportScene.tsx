"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, extend } from "@react-three/fiber";
import { QuadraticBezierLine } from "@react-three/drei";
import { FabricMaterial } from "./fabricMaterial";

extend({ FabricMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    fabricMaterial: ThreeElements["shaderMaterial"] & {
      uTime?: number;
      uOpacity?: number;
    };
  }
}

/** Export hubs as [lat, lon] degrees — Faisalabad origin plus five destination markets. */
const ORIGIN: [number, number] = [31.4, 73.1];
const HUBS: [number, number][] = [
  [40.7, -74.0], // North America
  [51.5, 0.0], // United Kingdom
  [52.5, 13.4], // Continental Europe
  [25.2, 55.3], // Middle East
  [-33.9, 151.2], // Australia
];

function latLongToVector3(lat: number, lon: number, radius: number) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

const GLOBE_RADIUS = 1.55;

function TradeRoute({ start, end, speed }: { start: THREE.Vector3; end: THREE.Vector3; speed: number }) {
  const pulseRef = useRef<THREE.Mesh>(null);
  const curve = useMemo(() => {
    const mid = start.clone().add(end).multiplyScalar(0.5);
    mid.setLength(GLOBE_RADIUS * 1.45);
    return new THREE.QuadraticBezierCurve3(start, mid, end);
  }, [start, end]);

  useFrame(({ clock }) => {
    if (!pulseRef.current) return;
    const t = (clock.getElapsedTime() * speed) % 1;
    const p = curve.getPoint(t);
    pulseRef.current.position.copy(p);
    const s = 1 - Math.abs(t - 0.5) * 1.2;
    pulseRef.current.scale.setScalar(Math.max(0.001, s) * 0.045);
  });

  return (
    <group>
      <QuadraticBezierLine
        start={start}
        end={end}
        mid={curve.v1}
        color="#B02A28"
        lineWidth={1}
        transparent
        opacity={0.35}
      />
      <mesh ref={pulseRef}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color="#EDE6D6" />
      </mesh>
    </group>
  );
}

function Globe() {
  const groupRef = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.09;
    pointer.current.x = state.pointer.x;
    pointer.current.y = state.pointer.y;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      pointer.current.y * 0.12,
      0.03
    );
  });

  const origin = useMemo(() => latLongToVector3(ORIGIN[0], ORIGIN[1], GLOBE_RADIUS), []);
  const hubs = useMemo(() => HUBS.map(([lat, lon]) => latLongToVector3(lat, lon, GLOBE_RADIUS)), []);

  return (
    <group ref={groupRef}>
      <mesh>
        <icosahedronGeometry args={[GLOBE_RADIUS, 2]} />
        <meshBasicMaterial color="#3A5578" wireframe transparent opacity={0.32} />
      </mesh>
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS * 0.985, 24, 24]} />
        <meshBasicMaterial color="#0A2240" transparent opacity={0.55} />
      </mesh>

      <mesh position={origin}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshBasicMaterial color="#941C1D" />
      </mesh>
      {hubs.map((hub, i) => (
        <group key={i}>
          <mesh position={hub}>
            <sphereGeometry args={[0.035, 10, 10]} />
            <meshBasicMaterial color="#EDE6D6" />
          </mesh>
          <TradeRoute start={origin} end={hub} speed={0.12 + i * 0.03} />
        </group>
      ))}
    </group>
  );
}

function FabricPlane() {
  const ref = useRef<THREE.ShaderMaterial>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.uniforms.uTime.value = clock.getElapsedTime();
  });
  return (
    <mesh position={[0.6, -0.4, -1.8]} rotation={[-0.3, 0.5, 0.15]}>
      <planeGeometry args={[6, 4, 32, 20]} />
      <fabricMaterial ref={ref} uOpacity={0.4} transparent depthWrite={false} />
    </mesh>
  );
}

export default function GlobalExportScene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[3, 2, 4]} intensity={40} color="#B02A28" />
      <pointLight position={[-4, -2, -2]} intensity={25} color="#0A2240" />
      <FabricPlane />
      <Globe />
    </>
  );
}
