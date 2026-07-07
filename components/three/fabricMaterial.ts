import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";

/**
 * Procedural "flowing fabric" plane — vertex-displaced sine waves tinted
 * navy → crimson, fresnel-dimmed at grazing angles so it reads as soft
 * drapery rather than a flat rectangle. No textures — geometry + shader only.
 */
export const FabricMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorA: new THREE.Color("#0A2240"),
    uColorB: new THREE.Color("#941C1D"),
    uOpacity: 0.4,
  },
  /* vertex */ `
    uniform float uTime;
    varying float vElevation;
    varying vec3 vNormalView;

    void main() {
      vec3 pos = position;
      float wave1 = sin(pos.x * 1.1 + uTime * 0.35) * 0.22;
      float wave2 = sin(pos.y * 1.6 + uTime * 0.5) * 0.14;
      float wave3 = sin((pos.x + pos.y) * 0.7 - uTime * 0.25) * 0.12;
      float elevation = wave1 + wave2 + wave3;
      pos.z += elevation;
      vElevation = elevation;
      vNormalView = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  /* fragment */ `
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    uniform float uOpacity;
    varying float vElevation;
    varying vec3 vNormalView;

    void main() {
      float mixFactor = smoothstep(-0.3, 0.3, vElevation);
      vec3 color = mix(uColorA, uColorB, mixFactor * 0.55);
      float fresnel = pow(1.0 - abs(vNormalView.z), 2.0);
      float alpha = uOpacity * (0.5 + fresnel * 0.6);
      gl_FragColor = vec4(color, alpha);
    }
  `
);
