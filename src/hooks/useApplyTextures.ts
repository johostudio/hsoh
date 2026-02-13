import { useEffect } from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import type { TexturePaths } from '../types';

/**
 * Hook that loads external texture files and applies them to every mesh
 * material in a GLB scene. Call after useGLTF — pass the returned scene
 * plus a TexturePaths object whose keys map to PBR channels.
 *
 * Usage:
 *   const { scene } = useGLTF('/models/landing.glb');
 *   useApplyTextures(scene, {
 *     baseColor: '/models/landing_textures/baseColor.png',
 *     normal:    '/models/landing_textures/normal.png',
 *   });
 */
export function useApplyTextures(
  scene: THREE.Group | THREE.Object3D,
  textures?: TexturePaths,
) {
  // Build a list of paths that actually have values so useTexture
  // receives a stable, non-empty map (drei throws on empty maps).
  const pathMap: Record<string, string> = {};
  if (textures?.baseColor) pathMap.baseColor = textures.baseColor;
  if (textures?.normal) pathMap.normal = textures.normal;
  if (textures?.roughness) pathMap.roughness = textures.roughness;
  if (textures?.metallic) pathMap.metallic = textures.metallic;
  if (textures?.height) pathMap.height = textures.height;
  if (textures?.ao) pathMap.ao = textures.ao;
  if (textures?.emissive) pathMap.emissive = textures.emissive;

  const hasTextures = Object.keys(pathMap).length > 0;

  // useTexture must always be called (rules of hooks), so provide a
  // harmless fallback when there are no external textures.
  const loaded = useTexture(
    hasTextures ? pathMap : { _noop: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQI12NgAAIABQABNjN9GQAAAAlwSFlzAAAWJQAAFiUBSVIk8AAAAA0lEQVQI12P4z8BQDwAEgAF/QualzQAAAABJRU5ErkJggg==' },
  );

  useEffect(() => {
    if (!hasTextures) return;

    const texMap = loaded as Record<string, THREE.Texture>;

    // Ensure all loaded textures use correct color space / wrapping.
    Object.values(texMap).forEach((tex) => {
      tex.flipY = false; // GLB/glTF convention
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    });
    if (texMap.baseColor) texMap.baseColor.colorSpace = THREE.SRGBColorSpace;

    scene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;

      const mat = child.material;
      if (!(mat instanceof THREE.MeshStandardMaterial)) return;

      if (texMap.baseColor) mat.map = texMap.baseColor;
      if (texMap.normal) mat.normalMap = texMap.normal;
      if (texMap.roughness) mat.roughnessMap = texMap.roughness;
      if (texMap.metallic) mat.metalnessMap = texMap.metallic;
      if (texMap.height) {
        mat.displacementMap = texMap.height;
        mat.displacementScale = 0.05;
      }
      if (texMap.ao) mat.aoMap = texMap.ao;
      if (texMap.emissive) mat.emissiveMap = texMap.emissive;

      mat.needsUpdate = true;
    });
  }, [scene, loaded, hasTextures]);
}
