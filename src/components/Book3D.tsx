import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { Mesh } from 'three';

function Book() {
  const group = useRef<any>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (group.current) {
      group.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={group} position={[0, 0, 0]}>
      {/* Book cover */}
      <mesh position={[0, 0, 0.11]} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
        <boxGeometry args={[1.4, 2, 0.22]} />
        <meshStandardMaterial color={hovered ? '#e0218a' : '#6b21a8'} />
      </mesh>
      {/* Book pages */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.3, 1.9, 0.2]} />
        <meshStandardMaterial color={'#fffbe9'} />
      </mesh>
      {/* Book spine */}
      <mesh position={[-0.7, 0, 0.11]}>
        <boxGeometry args={[0.1, 2, 0.22]} />
        <meshStandardMaterial color={'#a259c1'} />
      </mesh>
    </group>
  );
}

const Book3D = () => (
  <div style={{ width: '100%', height: 220 }}>
    <Canvas camera={{ position: [0, 0, 4], fov: 50 }} style={{ background: 'transparent' }}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[2, 2, 5]} intensity={0.7} />
      <Book />
    </Canvas>
  </div>
);

export default Book3D;
