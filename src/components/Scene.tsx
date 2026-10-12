import { portfolio } from '../data/portfolio';
import { useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Environment, Float, Sky, Sparkles, Text } from '@react-three/drei';
import * as THREE from 'three';

const clamp01=(v:number)=>Math.min(1,Math.max(0,v));
const smooth=(v:number)=>{const x=clamp01(v);return x*x*(3-2*x);};

function useConcreteTexture() {
  return useMemo(() => {
    const size=64, data=new Uint8Array(size*size);
    for(let y=0;y<size;y++) for(let x=0;x<size;x++){
      const n=(Math.sin(x*12.9898+y*78.233)*43758.5453)%1;
      data[y*size+x]=Math.floor(112+Math.abs(n)*72);
    }
    const t=new THREE.DataTexture(data,size,size,THREE.RedFormat,THREE.UnsignedByteType);
    t.wrapS=t.wrapT=THREE.RepeatWrapping; t.repeat.set(7,7); t.needsUpdate=true;
    return t;
  },[]);
}

function Concrete({color="#8d8a80",roughness=.8,repeat=1}:{color?:string;roughness?:number;repeat?:number}){
  const bump=useConcreteTexture();
  bump.repeat.set(repeat,repeat);
  return <meshStandardMaterial color={color} roughness={roughness} bumpMap={bump} bumpScale={.035}/>;
}


/**
 * Finish packages for the clubhouse are deliberately architectural rather than
 * decorative clutter: dark oak wainscoting, warm brass reveals, limestone
 * insets, and a restrained terrazzo runner give the walk a premium club feel.
 */
function CorridorInteriorFinishes() {
  const panels = Array.from({ length: 9 }, (_, i) => 4.2 - i * 7.1);
  const slats = Array.from({ length: 47 }, (_, i) => 3.4 - i * 1.23);
  const floorJoints = Array.from({ length: 14 }, (_, i) => 1.8 - i * 4.15);
  const ceilingRibs = Array.from({ length: 8 }, (_, i) => 1.5 - i * 7.4);
  return (
    <group>
      {/* A bespoke stone-and-green terrazzo floor with fine brass datum lines. */}
      <mesh position={[0, 0.025, -25]}>
        <boxGeometry args={[4.55, 0.035, 57.5]} />
        <meshStandardMaterial color="#344b3e" roughness={0.38} metalness={0.08} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 3.63, 0.019, -25]}>
          <boxGeometry args={[2.35, 0.03, 57.5]} />
          <meshStandardMaterial color="#b7b5a8" roughness={0.68} metalness={0.02} />
        </mesh>
      ))}
      {[-4.78, -2.34, 2.34, 4.78].map((x) => (
        <mesh key={x} position={[x, 0.047, -25]}>
          <boxGeometry args={[0.035, 0.018, 57.5]} />
          <meshStandardMaterial color="#b99b62" metalness={0.72} roughness={0.28} />
        </mesh>
      ))}
      {floorJoints.map((z, i) => (
        <mesh key={z} position={[0, 0.047, z]}>
          <boxGeometry args={[9.48, 0.012, 0.022]} />
          <meshBasicMaterial color={i % 2 ? "#8b8b79" : "#96886d"} />
        </mesh>
      ))}

      {/* Repeated framed wall bays, deep green lower panels and pale stone above. */}
      {panels.map((z, i) => (
        <group key={z}>
          {([-1, 1] as const).map((side) => (
            <group key={side}>
              <mesh position={[side * 4.98, 1.45, z]}>
                <boxGeometry args={[0.075, 1.58, 6.42]} />
                <meshStandardMaterial color={i % 2 ? "#304b3e" : "#243f34"} roughness={0.58} metalness={0.08} />
              </mesh>
              <mesh position={[side * 4.975, 3.48, z]}>
                <boxGeometry args={[0.065, 2.36, 6.42]} />
                <meshStandardMaterial color={i % 2 ? "#777e70" : "#858779"} roughness={0.86} />
              </mesh>
              {[-3.13, 3.13].map((offset) => (
                <mesh key={offset} position={[side * 4.91, 2.8, z + offset]}>
                  <boxGeometry args={[0.045, 4.45, 0.055]} />
                  <meshStandardMaterial color="#b99b62" metalness={0.68} roughness={0.3} />
                </mesh>
              ))}
              {[0.62, 2.3, 4.72].map((y) => (
                <mesh key={y} position={[side * 4.91, y, z]}>
                  <boxGeometry args={[0.045, 0.035, 6.42]} />
                  <meshStandardMaterial color="#c0a36b" metalness={0.64} roughness={0.3} />
                </mesh>
              ))}
            </group>
          ))}
        </group>
      ))}

      {/* Fine timber battens add rhythm and real depth to the side walls. */}
      {slats.map((z, i) => (
        <group key={z}>
          {([-1, 1] as const).map((side) => (
            <mesh key={side} position={[side * 4.925, 3.0, z]}>
              <boxGeometry args={[0.07, 5.22, i % 3 === 0 ? 0.13 : 0.075]} />
              <meshStandardMaterial color={i % 3 === 0 ? "#6c553d" : "#314b3d"} roughness={0.48} metalness={0.12} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Slim timber ceiling ribs aligned with the light wells. */}
      {ceilingRibs.map((z, i) => (
        <group key={z} position={[0, 5.82, z]}>
          <mesh>
            <boxGeometry args={[9.65, 0.105, 0.17]} />
            <meshStandardMaterial color={i % 2 ? "#5e4a34" : "#8c7049"} roughness={0.52} metalness={0.12} />
          </mesh>
          <mesh position={[0, -0.075, 0]}>
            <boxGeometry args={[6.8, 0.025, 0.06]} />
            <meshBasicMaterial color="#f0d39b" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function LockerRoomInteriorFinishes() {
  const panels = Array.from({ length: 9 }, (_, i) => -56.2 - i * 6.35);
  const floorJoints = Array.from({ length: 14 }, (_, i) => -55.6 - i * 4.0);
  const ceilingSlats = [-10.25, -8.35, -6.45, -4.55, 4.55, 6.45, 8.35, 10.25];
  return (
    <group>
      {/* Custom inset-floor composition: a dark runner, stone side tiles and brass seams. */}
      <mesh position={[0, 0.026, -81.5]}>
        <boxGeometry args={[5.95, 0.04, 55.9]} />
        <meshStandardMaterial color="#324a3d" roughness={0.4} metalness={0.08} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 7.9, 0.018, -81.5]}>
          <boxGeometry args={[7.45, 0.028, 55.9]} />
          <meshStandardMaterial color={side < 0 ? "#a5a28f" : "#b8b29f"} roughness={0.72} />
        </mesh>
      ))}
      {[-10.55, -3.02, 3.02, 10.55].map((x) => (
        <mesh key={x} position={[x, 0.052, -81.5]}>
          <boxGeometry args={[0.04, 0.018, 55.9]} />
          <meshStandardMaterial color="#bd9d5f" metalness={0.72} roughness={0.27} />
        </mesh>
      ))}
      {floorJoints.map((z, i) => (
        <mesh key={z} position={[0, 0.052, z]}>
          <boxGeometry args={[23.1, 0.012, 0.025]} />
          <meshBasicMaterial color={i % 2 ? "#777b6b" : "#95886d"} />
        </mesh>
      ))}

      {/* Wall panels sit behind the sports lockers and frame the project boards as exhibits. */}
      {panels.map((z, i) => (
        <group key={z}>
          {([-1, 1] as const).map((side) => (
            <group key={side}>
              <mesh position={[side * 11.82, 3.2, z]}>
                <boxGeometry args={[0.075, 5.82, 6.0]} />
                <meshStandardMaterial color={i % 2 ? "#596355" : "#777967"} roughness={0.76} />
              </mesh>
              <mesh position={[side * 11.775, 1.26, z]}>
                <boxGeometry args={[0.045, 1.82, 5.72]} />
                <meshStandardMaterial color={i % 2 ? "#263e33" : "#304b3e"} roughness={0.54} metalness={0.12} />
              </mesh>
              {[-2.92, 2.92].map((offset) => (
                <mesh key={offset} position={[side * 11.72, 3.1, z + offset]}>
                  <boxGeometry args={[0.035, 5.48, 0.055]} />
                  <meshStandardMaterial color="#ba9a5f" metalness={0.7} roughness={0.3} />
                </mesh>
              ))}
              {[0.34, 2.22, 5.95].map((y) => (
                <mesh key={y} position={[side * 11.72, y, z]}>
                  <boxGeometry args={[0.035, 0.035, 5.98]} />
                  <meshStandardMaterial color="#b99a60" metalness={0.7} roughness={0.3} />
                </mesh>
              ))}
            </group>
          ))}
        </group>
      ))}

      {/* Ribbed timber ceiling edges leave the central skylight panels open. */}
      {ceilingSlats.map((x, i) => (
        <group key={x} position={[x, 6.54, -81.5]}>
          <mesh>
            <boxGeometry args={[0.11, 0.12, 55.2]} />
            <meshStandardMaterial color={i % 2 ? "#6b543c" : "#8c704b"} roughness={0.5} metalness={0.12} />
          </mesh>
          <mesh position={[0, -0.075, 0]}>
            <boxGeometry args={[0.025, 0.018, 55.2]} />
            <meshBasicMaterial color="#e8c789" />
          </mesh>
        </group>
      ))}

      {/* Small illuminated plaques bring the room's repeated bays together. */}
      {[-59.2, -71.4, -83.6, -95.8, -105.8].map((z, i) => (
        <group key={z} position={[0, 5.86, z]}>
          <mesh>
            <boxGeometry args={[3.3, 0.07, 0.18]} />
            <meshStandardMaterial color="#b99a60" metalness={0.68} roughness={0.28} />
          </mesh>
          <mesh position={[0, -0.14, 0]}>
            <boxGeometry args={[2.6, 0.025, 0.09]} />
            <meshBasicMaterial color={i % 2 ? "#d4d4bf" : "#a8d0c4"} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function TunnelInteriorFinishes() {
  const bays = [-114.5, -121.5, -128.5, -135];
  return (
    <group>
      <mesh position={[0, 0.04, -123.3]}>
        <boxGeometry args={[5.25, 0.035, 29.4]} />
        <meshStandardMaterial color="#253d32" roughness={0.38} metalness={0.12} />
      </mesh>
      {[-2.72, 2.72, -6.05, 6.05].map((x) => (
        <mesh key={x} position={[x, 0.067, -123.3]}>
          <boxGeometry args={[0.035, 0.018, 29.5]} />
          <meshStandardMaterial color="#c2a36b" metalness={0.72} roughness={0.26} />
        </mesh>
      ))}
      {bays.map((z, i) => (
        <group key={z}>
          {([-1, 1] as const).map((side) => (
            <group key={side}>
              <mesh position={[side * 6.47, 2.35, z]}>
                <boxGeometry args={[0.055, 2.85, 5.35]} />
                <meshStandardMaterial color={i % 2 ? "#344b3d" : "#273e33"} roughness={0.54} metalness={0.12} />
              </mesh>
              <mesh position={[side * 6.42, 2.36, z - 2.61]}>
                <boxGeometry args={[0.04, 4.25, 0.055]} />
                <meshStandardMaterial color="#b99a60" metalness={0.7} roughness={0.28} />
              </mesh>
              <mesh position={[side * 6.42, 2.36, z + 2.61]}>
                <boxGeometry args={[0.04, 4.25, 0.055]} />
                <meshStandardMaterial color="#b99a60" metalness={0.7} roughness={0.28} />
              </mesh>
              <mesh position={[side * 6.42, 0.85, z]}>
                <boxGeometry args={[0.04, 0.035, 5.3]} />
                <meshStandardMaterial color="#d4b477" metalness={0.68} roughness={0.3} />
              </mesh>
            </group>
          ))}
        </group>
      ))}
      <mesh position={[0, 5.95, -136.02]}>
        <boxGeometry args={[4.4, 0.035, 0.025]} />
        <meshBasicMaterial color="#d6b77a" />
      </mesh>
    </group>
  );
}

function Planter({position,scale=1}:{position:[number,number,number];scale?:number}){
  const leaves=useMemo(()=>Array.from({length:7},(_,i)=>({r:i*.7, a:i/7*Math.PI*2})),[]);
  return <group position={position} scale={scale}>
    <mesh position={[0,.35,0]} castShadow receiveShadow><boxGeometry args={[1.8,.7,1.15]}/><Concrete color="#77756d" roughness={.72} repeat={2}/></mesh>
    <group position={[0,.78,0]}>
      {leaves.map((l,i)=><mesh key={i} position={[Math.cos(l.a)*.22,Math.sin(i*1.3)*.28,Math.sin(l.a)*.22]} rotation={[.25+Math.sin(i)*.35,l.a,.45]} scale={[.15,.55,.06]} castShadow>
        <sphereGeometry args={[1,12,8]}/><meshStandardMaterial color={i%2?'#31533d':'#426849'} roughness={.78}/>
      </mesh>)}
      <mesh position={[0,.2,0]}><cylinderGeometry args={[.09,.13,.6,8]}/><meshStandardMaterial color="#4b684c" roughness={.8}/></mesh>
    </group>
  </group>
}

function LobbyBench({ position, rotationY = 0 }: {
  position: [number, number, number];
  rotationY?: number;
}) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.62, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.35, 0.16, 0.7]} />
        <meshStandardMaterial color="#6f604b" roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.98, -0.27]} castShadow>
        <boxGeometry args={[2.35, 0.58, 0.12]} />
        <meshStandardMaterial color="#234b3b" roughness={0.66} />
      </mesh>
      {[-0.93, 0.93].map((x) => (
        <mesh key={x} position={[x, 0.31, 0]} castShadow>
          <boxGeometry args={[0.12, 0.62, 0.54]} />
          <meshStandardMaterial color="#9c9b8d" metalness={0.42} roughness={0.4} />
        </mesh>
      ))}
      <mesh position={[0, 0.72, 0.365]}>
        <boxGeometry args={[1.95, 0.025, 0.012]} />
        <meshBasicMaterial color="#cbb080" />
      </mesh>
    </group>
  );
}

function ClubTrophyCase({ position, side }: {
  position: [number, number, number];
  side: -1 | 1;
}) {
  return (
    <group position={position} rotation={[0, side === -1 ? Math.PI / 2 : -Math.PI / 2, 0]}>
      <mesh position={[0, 0.38, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.45, 0.76, 0.78]} />
        <meshStandardMaterial color="#a5aa9c" roughness={0.48} metalness={0.18} />
      </mesh>
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[1.62, 0.08, 0.88]} />
        <meshStandardMaterial color="#4b5d4c" roughness={0.43} metalness={0.25} />
      </mesh>
      <mesh position={[0, 1.46, 0]}>
        <boxGeometry args={[1.38, 1.2, 0.7]} />
        <meshPhysicalMaterial color="#dce9df" transparent opacity={0.18} roughness={0.08} metalness={0.08} transmission={0.2} />
      </mesh>
      {[-0.42, 0, 0.42].map((x, i) => (
        <group key={x} position={[x, 1.32 + (i === 1 ? 0.1 : 0), 0.03]}>
          <mesh position={[0, -0.27, 0]}>
            <cylinderGeometry args={[0.035, 0.045, 0.34, 12]} />
            <meshStandardMaterial color="#c6a55e" metalness={0.72} roughness={0.28} />
          </mesh>
          <mesh position={[0, -0.46, 0]}>
            <cylinderGeometry args={[0.13, 0.13, 0.055, 16]} />
            <meshStandardMaterial color="#b48f4f" metalness={0.58} roughness={0.32} />
          </mesh>
          <mesh position={[0, 0.02, 0]}>
            <cylinderGeometry args={[0.12, 0.055, 0.2, 18]} />
            <meshStandardMaterial color="#ddc274" metalness={0.76} roughness={0.22} />
          </mesh>
          <mesh position={[-0.15, 0.0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.075, 0.018, 6, 12, Math.PI]} />
            <meshStandardMaterial color="#ddc274" metalness={0.72} roughness={0.25} />
          </mesh>
          <mesh position={[0.15, 0.0, 0]} rotation={[0, 0, -Math.PI / 2]}>
            <torusGeometry args={[0.075, 0.018, 6, 12, Math.PI]} />
            <meshStandardMaterial color="#ddc274" metalness={0.72} roughness={0.25} />
          </mesh>
        </group>
      ))}
      <Text position={[0, 0.43, 0.405]} anchorX="center" fontSize={0.075} color="#e5e8d8" letterSpacing={0.08}>
        CLUB HONOURS
      </Text>
    </group>
  );
}

function RacketAndBallStand({ position, side }: {
  position: [number, number, number];
  side: -1 | 1;
}) {
  return (
    <group position={position} rotation={[0, side === -1 ? Math.PI / 2 : -Math.PI / 2, 0]}>
      <mesh position={[0, 0.23, 0]} castShadow>
        <cylinderGeometry args={[0.48, 0.54, 0.38, 16]} />
        <meshStandardMaterial color="#315743" metalness={0.24} roughness={0.58} wireframe />
      </mesh>
      {[-0.3, 0, 0.3].map((x, i) => (
        <group key={x} position={[x, 1.12, -0.02]} rotation={[0.1, 0, (i - 1) * 0.16]}>
          <mesh>
            <torusGeometry args={[0.31, 0.035, 8, 26]} />
            <meshStandardMaterial color={i === 1 ? "#c3c9b8" : "#b5c5ad"} metalness={0.5} roughness={0.34} />
          </mesh>
          <mesh position={[0, -0.49, 0]}>
            <cylinderGeometry args={[0.028, 0.035, 0.72, 8]} />
            <meshStandardMaterial color="#355541" roughness={0.52} />
          </mesh>
          <mesh>
            <circleGeometry args={[0.27, 18]} />
            <meshBasicMaterial color="#dce8d8" wireframe transparent opacity={0.45} />
          </mesh>
        </group>
      ))}
      {[-0.23, 0, 0.23].map((x) => (
        <mesh key={x} position={[x, 0.48, 0.18]}>
          <sphereGeometry args={[0.105, 16, 12]} />
          <meshStandardMaterial color="#d6e265" roughness={0.62} />
        </mesh>
      ))}
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[1.1, 0.07, 1.05]} />
        <meshStandardMaterial color="#a0a799" roughness={0.52} />
      </mesh>
    </group>
  );
}

function ClubWayfindingSign({ side, z }: { side: -1 | 1; z: number }) {
  return (
    <group position={[side * 4.84, 2.75, z]} rotation={[0, side === -1 ? Math.PI / 2 : -Math.PI / 2, 0]}>
      <mesh castShadow>
        <boxGeometry args={[2.8, 2.55, 0.15]} />
        <meshStandardMaterial color="#244b3b" roughness={0.55} metalness={0.15} />
      </mesh>
      <mesh position={[0, 0, 0.09]}>
        <boxGeometry args={[2.6, 2.35, 0.035]} />
        <meshStandardMaterial color="#e6e8d9" roughness={0.74} />
      </mesh>
      <Text position={[-1.13, 0.79, 0.125]} anchorX="left" fontSize={0.115} color="#315c47" letterSpacing={0.08}>
        CLUBHOUSE / 01
      </Text>
      <Text position={[-1.13, 0.36, 0.125]} anchorX="left" fontSize={0.23} color="#1d4635" letterSpacing={0.015}>
        COURT GUIDE
      </Text>
      <mesh position={[0, 0.1, 0.13]}>
        <boxGeometry args={[2.2, 0.018, 0.012]} />
        <meshBasicMaterial color="#b7a16f" />
      </mesh>
      <Text position={[-1.13, -0.2, 0.125]} anchorX="left" fontSize={0.092} color="#42644f" lineHeight={1.3} maxWidth={2.25}>
        01  Explore the lobby
      </Text>
      <Text position={[-1.13, -0.49, 0.125]} anchorX="left" fontSize={0.092} color="#42644f" lineHeight={1.3} maxWidth={2.25}>
        02  Open a project locker
      </Text>
      <Text position={[-1.13, -0.78, 0.125]} anchorX="left" fontSize={0.092} color="#42644f" lineHeight={1.3} maxWidth={2.25}>
        03  Enter the grass court
      </Text>
      <Text position={[-1.13, -1.07, 0.125]} anchorX="left" fontSize={0.082} color="#798b7b" letterSpacing={0.04}>
        CURIOSITY IS THE FIRST MOVE
      </Text>
    </group>
  );
}

function WallLight({x,z,side=1}:{x:number;z:number;side?:number}){
  return <group position={[x,2.7,z]}>
    <mesh position={[side*.08,0,0]}><boxGeometry args={[.055,4.2,.055]}/><meshBasicMaterial color="#e8c889"/></mesh>
    <pointLight position={[side*.15,0,0]} intensity={1.7} distance={5} color="#e8c889"/>
  </group>
}

function Skylight({z}:{z:number}){
  return <group position={[0,5.9,z]}>
    <mesh><boxGeometry args={[4.8,.12,3.6]}/><meshBasicMaterial color="#d9e2e4"/></mesh>
    <mesh position={[0,.08,0]}><boxGeometry args={[4.2,.03,3]}/><meshBasicMaterial color="#bcd0d5" transparent opacity={.45}/></mesh>
  </group>
}

function WallArt({side,z,title,sub}:{side:-1|1;z:number;title:string;sub:string}){
  return <group position={[side*4.91,2.55,z]} rotation={[0,side*Math.PI/2,0]}>
    <mesh position={[0,0,-.03]}><boxGeometry args={[2.5,3.5,.08]}/><meshStandardMaterial color="#151713" roughness={.8}/></mesh>
    <mesh position={[0,0,.02]}><planeGeometry args={[2.25,3.25]}/><meshStandardMaterial color="#252721" roughness={.72}/></mesh>
    <Text position={[-.9,1.15,.08]} anchorX="left" fontSize={.17} maxWidth={1.7} color="#e7e1d3" letterSpacing={.02}>{title}</Text>
    <Text position={[-.9,.72,.08]} anchorX="left" fontSize={.09} maxWidth={1.7} color="#a8a49a" lineHeight={1.35}>{sub}</Text>
    <mesh position={[-.9,-.9,.08]}><planeGeometry args={[.95,.02]}/><meshBasicMaterial color="#c7a46b"/></mesh>
  </group>
}

type Project = (typeof portfolio.projects)[number];

function ProjectLocker({ project, index, position, rotationY = 0, onSelect }: {
  project: Project;
  index: number;
  position: [number, number, number];
  rotationY?: number;
  onSelect: () => void;
}) {
  const teamColors = ['#1e684f', '#27675e', '#2d5065'];
  const accent = teamColors[index % teamColors.length];
  const bars = [0.28, 0.42, 0.35, 0.65, 0.48, 0.76, 0.56];
  return (
    <Float speed={0.4 + index * 0.08} floatIntensity={0.035} rotationIntensity={0.006}>
      <group
        position={position}
        rotation={[0, rotationY + (index === 0 ? 0.018 : index === 2 ? -0.018 : 0), 0]}
        onClick={(event) => { event.stopPropagation(); onSelect(); }}
        onPointerOver={(event) => { event.stopPropagation(); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { document.body.style.cursor = 'auto'; }}
      >
        {/* Invisible, full-size hit target makes the complete project board easy to click. */}
        <mesh
          position={[0, 0, 0.29]}
          onClick={(event) => { event.stopPropagation(); onSelect(); }}
          onPointerOver={(event) => { event.stopPropagation(); document.body.style.cursor = 'pointer'; }}
          onPointerOut={() => { document.body.style.cursor = 'grab'; }}
        >
          <boxGeometry args={[4.48, 3.72, 0.16]} />
          <meshBasicMaterial transparent opacity={0.001} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
        {/* Painted team-kit locker shell */}
        <mesh position={[0, 0, -0.15]} castShadow receiveShadow>
          <boxGeometry args={[4.45, 3.72, 0.32]} />
          <meshStandardMaterial color="#1c302b" metalness={0.36} roughness={0.43} />
        </mesh>
        <mesh position={[0, 0, 0.025]}>
          <boxGeometry args={[4.21, 3.49, 0.06]} />
          <meshStandardMaterial color={accent} metalness={0.12} roughness={0.5} />
        </mesh>
        <mesh position={[0, -0.03, 0.07]}>
          <boxGeometry args={[3.98, 2.82, 0.045]} />
          <meshPhysicalMaterial color="#10201d" metalness={0.12} roughness={0.35} clearcoat={0.5} />
        </mesh>
        {/* Locker crown with perforated vents and club numbering */}
        <mesh position={[0, 1.55, 0.13]}>
          <boxGeometry args={[4.21, 0.36, 0.12]} />
          <meshStandardMaterial color="#173b31" metalness={0.28} roughness={0.4} />
        </mesh>
        {Array.from({ length: 10 }, (_, i) => (
          <mesh key={i} position={[-1.83 + i * 0.13, 1.56, 0.2]}>
            <boxGeometry args={[0.065, 0.09, 0.012]} />
            <meshBasicMaterial color="#91b1a1" />
          </mesh>
        ))}
        <Text position={[-1.93, 1.29, 0.19]} anchorX="left" fontSize={0.083} color="#cfdbd0" letterSpacing={0.09}>
          TEAM KIT / {String(index + 1).padStart(2, '0')}
        </Text>
        {/* Small jersey, ball and folded towel identify this as an athlete's locker */}
        <group position={[-1.48, 0.79, 0.24]}>
          <mesh castShadow>
            <boxGeometry args={[0.43, 0.59, 0.08]} />
            <meshStandardMaterial color={index === 0 ? "#e8eee5" : index === 1 ? "#dfe5c9" : "#edf0e6"} roughness={0.76} />
          </mesh>
          <mesh position={[-0.24, 0.14, 0]} rotation={[0, 0, -0.34]}>
            <boxGeometry args={[0.22, 0.31, 0.075]} />
            <meshStandardMaterial color={index === 1 ? "#dfe5c9" : "#e8eee5"} roughness={0.8} />
          </mesh>
          <mesh position={[0.24, 0.14, 0]} rotation={[0, 0, 0.34]}>
            <boxGeometry args={[0.22, 0.31, 0.075]} />
            <meshStandardMaterial color={index === 1 ? "#dfe5c9" : "#e8eee5"} roughness={0.8} />
          </mesh>
          <Text position={[0, -0.03, 0.055]} fontSize={0.2} color={accent} anchorX="center">{index + 1}</Text>
        </group>
        <mesh position={[-1.5, 0.25, 0.25]}>
          <sphereGeometry args={[0.105, 18, 16]} />
          <meshStandardMaterial color="#c8d957" roughness={0.76} />
        </mesh>
        <mesh position={[-1.48, -0.31, 0.24]}>
          <boxGeometry args={[0.48, 0.16, 0.17]} />
          <meshStandardMaterial color="#b4c9b8" roughness={0.88} />
        </mesh>
        {/* Glass project display */}
        <Text position={[-0.93, 0.94, 0.19]} anchorX="left" fontSize={0.076} color="#d7bb86" letterSpacing={0.12}>
          PROJECT / {project.number}
        </Text>
        <Text position={[-0.93, 0.63, 0.19]} anchorX="left" fontSize={0.155} maxWidth={2.68} lineHeight={1.0} color="#f4f3e9">
          {project.title}
        </Text>
        <Text position={[-0.93, 0.27, 0.19]} anchorX="left" fontSize={0.067} maxWidth={2.72} color="#bdcfc4" letterSpacing={0.035}>
          {project.type.toUpperCase()}
        </Text>
        <mesh position={[0.29, 0.05, 0.19]}>
          <boxGeometry args={[2.42, 0.018, 0.015]} />
          <meshBasicMaterial color="#78ae91" />
        </mesh>
        <Text position={[-0.93, -0.18, 0.19]} anchorX="left" fontSize={0.075} maxWidth={2.75} lineHeight={1.2} color="#e1eadf">
          {project.metric}
        </Text>
        <Text position={[-0.93, -0.54, 0.19]} anchorX="left" fontSize={0.066} maxWidth={2.75} lineHeight={1.18} color="#aabdb2">
          {project.description}
        </Text>
        {bars.map((height, i) => (
          <mesh key={i} position={[-0.8 + i * 0.17, -1.1 + height * 0.28, 0.19]}>
            <boxGeometry args={[0.08, height * 0.5, 0.012]} />
            <meshBasicMaterial color={i === 5 ? "#d3db91" : "#6c9f82"} transparent opacity={0.84} />
          </mesh>
        ))}
        <Text position={[0.48, -1.13, 0.19]} anchorX="left" fontSize={0.055} maxWidth={1.65} color="#bfcec3">
          {project.stack}
        </Text>
        <mesh position={[1.44, -1.42, 0.2]}>
          <boxGeometry args={[1.12, 0.25, 0.045]} />
          <meshStandardMaterial color="#d4e4d3" roughness={0.45} />
        </mesh>
        <Text position={[1.44, -1.42, 0.23]} anchorX="center" fontSize={0.065} color="#173b31" letterSpacing={0.02}>
          OPEN LOCKER ↗
        </Text>
      </group>
    </Float>
  );
}

function SideSportsLocker({ side, z, number }: { side: -1 | 1; z: number; number: number }) {
  const kit = ['#edf0e5', '#d5e4d4', '#d8e4e9'][number % 3];
  return (
    <group position={[side * 10.8, 2.58, z]} rotation={[0, side === -1 ? Math.PI / 2 : -Math.PI / 2, 0]}>
      <mesh position={[0, 0, -0.18]} castShadow>
        <boxGeometry args={[3.65, 2.72, 0.62]} />
        <meshStandardMaterial color="#1c4236" metalness={0.22} roughness={0.58} />
      </mesh>
      <mesh position={[0, 0.02, 0.15]}>
        <boxGeometry args={[3.35, 2.42, 0.12]} />
        <meshStandardMaterial color="#d8d3c5" roughness={0.82} />
      </mesh>
      <mesh position={[0, 0.02, 0.23]}>
        <boxGeometry args={[3.12, 2.2, 0.04]} />
        <meshStandardMaterial color="#1b2924" roughness={0.72} />
      </mesh>
      <mesh position={[0, 0.98, 0.28]}>
        <boxGeometry args={[3.16, 0.1, 0.1]} />
        <meshStandardMaterial color="#719080" metalness={0.2} roughness={0.5} />
      </mesh>
      {/* hanging club shirt */}
      <mesh position={[-0.78, 0.24, 0.32]} castShadow>
        <boxGeometry args={[0.53, 0.78, 0.09]} />
        <meshStandardMaterial color={kit} roughness={0.8} />
      </mesh>
      <mesh position={[-1.08, 0.45, 0.32]} rotation={[0, 0, -0.35]}>
        <boxGeometry args={[0.2, 0.43, 0.08]} />
        <meshStandardMaterial color={kit} roughness={0.82} />
      </mesh>
      <mesh position={[-0.48, 0.45, 0.32]} rotation={[0, 0, 0.35]}>
        <boxGeometry args={[0.2, 0.43, 0.08]} />
        <meshStandardMaterial color={kit} roughness={0.82} />
      </mesh>
      <mesh position={[-0.78, 0.82, 0.32]}>
        <torusGeometry args={[0.15, 0.024, 8, 18, Math.PI]} />
        <meshStandardMaterial color="#c4d2c7" metalness={0.3} roughness={0.45} />
      </mesh>
      {/* tennis racket resting in the cubby */}
      <group position={[0.55, 0.24, 0.34]} rotation={[0, 0, -0.16]}>
        <mesh>
          <torusGeometry args={[0.38, 0.035, 8, 28]} />
          <meshStandardMaterial color="#c6d1c2" metalness={0.55} roughness={0.36} />
        </mesh>
        <mesh position={[0, -0.59, 0]}>
          <cylinderGeometry args={[0.033, 0.045, 0.82, 8]} />
          <meshStandardMaterial color="#2c443a" roughness={0.54} />
        </mesh>
        <mesh>
          <circleGeometry args={[0.34, 20]} />
          <meshBasicMaterial color="#dfebde" transparent opacity={0.24} wireframe />
        </mesh>
      </group>
      <mesh position={[1.25, -0.67, 0.34]}>
        <sphereGeometry args={[0.12, 16, 12]} />
        <meshStandardMaterial color="#d2dd62" roughness={0.7} />
      </mesh>
      <Text position={[0, -1.07, 0.34]} anchorX="center" fontSize={0.09} color="#e3e8dd" letterSpacing={0.1}>
        PLAYER {String(number + 1).padStart(2, '0')}
      </Text>
      <Text position={[0, -1.29, 0.34]} anchorX="center" fontSize={0.062} color="#9db7a5">
        RACKET / KIT / SHOES
      </Text>
    </group>
  );
}

function LockerRoom({ onSelectProject }: { onSelectProject: (number: string) => void }) {
  const sidePositions = Array.from({ length: 8 }, (_, i) => -60 - i * 5.5);
  return (
    <group>
      <mesh position={[0, -0.16, -81.5]} receiveShadow>
        <boxGeometry args={[23.6, 0.32, 58]} />
        <Concrete color="#888b80" roughness={0.68} repeat={7} />
      </mesh>
      <mesh position={[-12, 3.35, -81.5]} receiveShadow>
        <boxGeometry args={[0.3, 6.7, 58]} />
        <Concrete color="#afb0a4" roughness={0.76} repeat={4} />
      </mesh>
      <mesh position={[12, 3.35, -81.5]} receiveShadow>
        <boxGeometry args={[0.3, 6.7, 58]} />
        <Concrete color="#afb0a4" roughness={0.76} repeat={4} />
      </mesh>
      <mesh position={[0, 6.75, -81.5]}>
        <boxGeometry args={[8.7, 0.14, 58]} />
        <meshStandardMaterial color="#b8d3d7" metalness={0.06} roughness={0.3} transparent opacity={0.56} />
      </mesh>
      {sidePositions.map((z, i) => (
        <group key={z}>
          {/* These three positions are reserved for project-filled sports lockers. */}
          {!([1, 3, 5] as number[]).includes(i) && <SideSportsLocker side={-1} z={z} number={i} />}
          <SideSportsLocker side={1} z={z} number={i + 8} />
          {[-1, 1].map((side) => (
            <mesh key={side} position={[side * 8.9, 0.42, z]} castShadow receiveShadow>
              <boxGeometry args={[1.65, 0.16, 4.55]} />
              <meshStandardMaterial color="#a18b6c" roughness={0.72} />
            </mesh>
          ))}
        </group>
      ))}
      {/* Bright translucent ceiling panels make the locker corridor read as a modern club facility */}
      {[-65, -79, -93, -107].map((z) => (
        <group key={z} position={[0, 6.52, z]}>
          <mesh>
            <boxGeometry args={[7.8, 0.04, 5.7]} />
            <meshBasicMaterial color="#d8eff5" transparent opacity={0.65} />
          </mesh>
          <pointLight position={[0, -0.8, 0]} intensity={1.3} distance={13} color="#d9edfb" />
        </group>
      ))}
      {/* Project information is built into three full sports lockers along the left wall. */}
      {portfolio.projects.map((project, i) => {
        const projectZ = [-65.5, -76.5, -87.5][i];
        return (
          <ProjectLocker
            key={project.number}
            project={project}
            index={i}
            position={[-11.64, 2.15, projectZ]}
            rotationY={Math.PI / 2}
            onSelect={() => onSelectProject(project.number)}
          />
        );
      })}
      <mesh position={[0, 5.9, -108.0]}>
        <boxGeometry args={[12.8, 0.36, 0.55]} />
        <meshStandardMaterial color="#a6b8a8" metalness={0.22} roughness={0.43} />
      </mesh>
      {[-6.25, 6.25].map((x) => (
        <mesh key={x} position={[x, 3.15, -108.0]} castShadow>
          <boxGeometry args={[0.38, 5.8, 0.55]} />
          <meshStandardMaterial color="#9eaa9b" roughness={0.62} />
        </mesh>
      ))}
      <Text position={[0, 5.3, -107.66]} fontSize={0.28} color="#f5f7ed" letterSpacing={0.12}>
        THE NEXT POINT
      </Text>
      <Text position={[0, 4.85, -107.66]} fontSize={0.105} color="#e2e9dd" letterSpacing={0.04}>
        THROUGH THE TUNNEL / TO THE COURT
      </Text>
      <pointLight position={[0, 5.7, -76]} intensity={2.2} distance={28} color="#e8f4ff" />
      <pointLight position={[0, 5.7, -101]} intensity={1.8} distance={20} color="#e8f4ff" />
    </group>
  );
}

function ApproachTunnel() {
  const lightZ = [-113, -120, -127, -134];
  return (
    <group>
      <mesh position={[0, -0.12, -123.3]} receiveShadow>
        <boxGeometry args={[13.2, 0.28, 31]} />
        <Concrete color="#4a4b45" roughness={0.52} repeat={5} />
      </mesh>
      {[-6.65, 6.65].map((x, side) => (
        <group key={x}>
          <mesh position={[x, 3.25, -123.3]}>
            <boxGeometry args={[0.34, 6.5, 31]} />
            <Concrete color="#555750" roughness={0.72} repeat={3} />
          </mesh>
          {lightZ.map((z) => (
            <group key={z} position={[x * 0.94, 5.8, z]}>
              <mesh><boxGeometry args={[0.07, 0.07, 3.8]} /><meshBasicMaterial color="#f0d09b" /></mesh>
              <pointLight position={[0, -0.65, 0]} intensity={1.25} distance={7} color="#f0cc90" />
            </group>
          ))}
        </group>
      ))}
      <mesh position={[-4.5, 6.35, -123.3]}>
        <boxGeometry args={[4.2, 0.18, 31]} />
        <Concrete color="#363831" roughness={0.82} />
      </mesh>
      <mesh position={[4.5, 6.35, -123.3]}>
        <boxGeometry args={[4.2, 0.18, 31]} />
        <Concrete color="#363831" roughness={0.82} />
      </mesh>
      <mesh position={[0, 6.5, -136.4]}>
        <boxGeometry args={[13.2, 0.5, 0.65]} />
        <meshStandardMaterial color="#6f6b60" metalness={0.4} roughness={0.38} />
      </mesh>
      {[-6.35, 6.35].map((x) => (
        <mesh key={x} position={[x, 3.15, -136.4]}>
          <boxGeometry args={[0.48, 6.2, 0.65]} />
          <meshStandardMaterial color="#7b766a" metalness={0.28} roughness={0.42} />
        </mesh>
      ))}
      <Text position={[0, 5.72, -136.05]} fontSize={0.31} color="#f0e5d0" letterSpacing={0.16}>
        COURT 01
      </Text>
      <pointLight position={[0, 4.7, -131]} intensity={4.3} distance={26} color="#f7d39c" />
    </group>
  );
}

function TennisObject({position,kind}:{position:[number,number,number];kind:'ball'|'racket'}){
  if(kind==='ball') return <Float speed={1.1} floatIntensity={.22}><mesh position={position} castShadow><sphereGeometry args={[.17,24,24]}/><meshStandardMaterial color="#d6e16a" roughness={.52}/></mesh></Float>;
  return <group position={position} rotation={[.2,-.2,.2]} scale={.82}><mesh rotation={[Math.PI/2,0,0]}><torusGeometry args={[.72,.055,12,40]}/><meshStandardMaterial color="#c3bdad" metalness={.45} roughness={.3}/></mesh><mesh position={[0,-.95,0]}><cylinderGeometry args={[.055,.055,1.7,12]}/><meshStandardMaterial color="#252720" roughness={.55}/></mesh><mesh rotation={[Math.PI/2,0,0]}><circleGeometry args={[.64,32]}/><meshBasicMaterial color="#dfe2d1" transparent opacity={.09} wireframe/></mesh></group>
}

function TennisPlayer({ basePosition, shirtColor, side, matchClock, matchPlaying }: {
  basePosition: [number, number, number];
  shirtColor: string;
  side: 0 | 1;
  matchClock: MutableRefObject<number>;
  matchPlaying: boolean;
}) {
  const root = useRef<THREE.Group>(null);
  const body = useRef<THREE.Mesh>(null);
  const racketArm = useRef<THREE.Group>(null);
  const leftLeg = useRef<THREE.Group>(null);
  const rightLeg = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!root.current || !body.current || !racketArm.current || !leftLeg.current || !rightLeg.current) return;
    const time = matchClock.current;
    const cycle = time % 2.5;
    const targetX = side === 0
      ? (cycle > 1.25 ? -3.0 : -0.25)
      : (cycle < 1.25 ? 3.0 : 0.25);
    const footwork = Math.sin(time * 3.0 + side * 1.5) * (matchPlaying ? 0.38 : 0.04);
    root.current.position.x = THREE.MathUtils.damp(root.current.position.x, basePosition[0] + targetX + footwork, 4.2, delta);
    root.current.position.z = basePosition[2] + Math.sin(time * 1.8 + side) * (matchPlaying ? 0.42 : 0);
    const distanceToHit = side === 0 ? Math.min(cycle, 2.5 - cycle) : Math.abs(cycle - 1.25);
    const swing = matchPlaying ? Math.exp(-Math.pow((distanceToHit - 0.07) / 0.12, 2)) : 0;
    root.current.rotation.y = side === 0 ? 0 : Math.PI;
    root.current.rotation.z = Math.sin(time * 2.7 + side) * (matchPlaying ? 0.025 : 0) + swing * 0.035;
    body.current.position.y = 0.88 + Math.abs(Math.sin(time * 3.2 + side)) * (matchPlaying ? 0.055 : 0);
    racketArm.current.rotation.z = -0.15 - swing * 1.55 + Math.sin(time * 2.1 + side) * (matchPlaying ? 0.1 : 0);
    leftLeg.current.rotation.x = Math.sin(time * 4.2 + side) * (matchPlaying ? 0.28 : 0);
    rightLeg.current.rotation.x = -Math.sin(time * 4.2 + side) * (matchPlaying ? 0.28 : 0);
  });

  return (
    <group ref={root} position={basePosition} rotation={[0, side === 0 ? 0 : Math.PI, 0]}>
      <mesh ref={body} position={[0, 0.88, 0]} castShadow>
        <capsuleGeometry args={[0.19, 0.46, 5, 10]} />
        <meshStandardMaterial color={shirtColor} roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.29, 0]}>
        <sphereGeometry args={[0.14, 14, 12]} />
        <meshStandardMaterial color="#d3ab86" roughness={0.8} />
      </mesh>
      <group ref={leftLeg} position={[-0.12, 0.49, 0]}>
        <mesh rotation={[0, 0, 0.06]}>
          <capsuleGeometry args={[0.065, 0.34, 4, 8]} />
          <meshStandardMaterial color="#283e34" roughness={0.8} />
        </mesh>
        <mesh position={[0, -0.19, 0.07]}>
          <boxGeometry args={[0.15, 0.07, 0.25]} />
          <meshStandardMaterial color="#eff0e6" roughness={0.65} />
        </mesh>
      </group>
      <group ref={rightLeg} position={[0.12, 0.49, 0]}>
        <mesh>
          <capsuleGeometry args={[0.065, 0.34, 4, 8]} />
          <meshStandardMaterial color="#283e34" roughness={0.8} />
        </mesh>
        <mesh position={[0, -0.19, 0.07]}>
          <boxGeometry args={[0.15, 0.07, 0.25]} />
          <meshStandardMaterial color="#eff0e6" roughness={0.65} />
        </mesh>
      </group>
      <mesh position={[-0.27, 0.98, 0]}>
        <capsuleGeometry args={[0.052, 0.32, 4, 8]} />
        <meshStandardMaterial color="#d3ab86" roughness={0.8} />
      </mesh>
      <group ref={racketArm} position={[0.25, 1.05, 0.02]}>
        <mesh position={[0.16, -0.15, 0.02]} rotation={[0.1, 0, -0.65]}>
          <capsuleGeometry args={[0.05, 0.35, 4, 8]} />
          <meshStandardMaterial color="#d3ab86" roughness={0.8} />
        </mesh>
        <group position={[0.32, -0.28, 0.05]} rotation={[0.15, 0.15, -0.35]}>
          <mesh>
            <torusGeometry args={[0.29, 0.035, 8, 28]} />
            <meshStandardMaterial color="#e7e8d9" metalness={0.48} roughness={0.36} />
          </mesh>
          <mesh position={[0, -0.43, 0]}>
            <cylinderGeometry args={[0.028, 0.034, 0.48, 8]} />
            <meshStandardMaterial color="#254737" roughness={0.58} />
          </mesh>
          <mesh>
            <circleGeometry args={[0.25, 24]} />
            <meshBasicMaterial color="#f7f5e9" wireframe transparent opacity={0.58} />
          </mesh>
        </group>
      </group>
      <mesh position={[0, 1.18, 0.03]}>
        <boxGeometry args={[0.28, 0.045, 0.29]} />
        <meshStandardMaterial color={shirtColor} roughness={0.78} />
      </mesh>
    </group>
  );
}

function Stadium({ matchPlaying, tennisGameActive, tennisHitSignal, tennisScore, onTennisPoint }: {
  matchPlaying: boolean;
  tennisGameActive: boolean;
  tennisHitSignal: number;
  tennisScore: { rugved: number; opponent: number };
  onTennisPoint: (winner: 'rugved' | 'opponent') => void;
}) {
  const { camera } = useThree();
  const seating = useMemo(() => {
    const seats: THREE.Matrix4[] = [];
    const people: { body: THREE.Matrix4; head: THREE.Matrix4; shirt: string }[] = [];
    const seatObject = new THREE.Object3D();
    const person = new THREE.Object3D();
    const palette = ['#f2eee2', '#c6d7d1', '#436e5d', '#d5b984', '#293f5e', '#d1d7db', '#8096a5', '#a8bc9b', '#bb7564'];
    const addSeat = (x: number, y: number, z: number, rotationY: number, crowdIndex: number) => {
      seatObject.position.set(x, y, z);
      seatObject.rotation.set(0, rotationY, 0);
      seatObject.updateMatrix();
      seats.push(seatObject.matrix.clone());
      if (crowdIndex % 2 === 0 || crowdIndex % 7 === 0) {
        const shirt = palette[(crowdIndex * 7 + Math.floor(Math.abs(z)) * 3) % palette.length];
        person.position.set(x, y + 0.39, z);
        person.rotation.set(0, rotationY, 0);
        person.updateMatrix();
        const body = person.matrix.clone();
        person.position.set(x, y + 0.77, z);
        person.scale.setScalar(1);
        person.updateMatrix();
        people.push({ body, head: person.matrix.clone(), shirt });
      }
    };
    for (let row = 0; row < 10; row++) {
      const y = 0.85 + row * 0.61;
      for (let seat = 0; seat < 38; seat++) {
        const z = -27 + seat * (49 / 37);
        for (const side of [-1, 1] as const) {
          const x = side * (10.6 + row * 1.34);
          addSeat(x, y, z, side === -1 ? Math.PI / 2 : -Math.PI / 2, row * 100 + seat * 2 + (side === 1 ? 1 : 0));
        }
      }
      // A broad far-end stand wraps the baseline; the near end stays open for the walkout tunnel.
      const farZ = -(19.1 + row * 1.3);
      for (let seat = 0; seat < 34; seat++) {
        const x = -20 + seat * (40 / 33);
        addSeat(x, y, farZ, 0, row * 90 + seat + 13);
      }
    }
    return { seats, people };
  }, []);
  const matchClock = useRef(0);
  const matchBall = useRef<THREE.Mesh>(null);
  const practiceBall = useRef<THREE.Mesh>(null);
  const practiceState = useRef({
    active: false,
    mode: 'incoming' as 'incoming' | 'outgoing',
    elapsed: 0,
    velocity: new THREE.Vector3(),
  });
  const previousHitSignal = useRef(tennisHitSignal);
  useFrame((_, delta) => {
    if (matchPlaying) matchClock.current += Math.min(delta, 0.05);
    if (!matchBall.current) return;
    const cycle = matchClock.current % 2.5;
    const direction = cycle < 1.25 ? 1 : -1;
    const u = cycle < 1.25 ? cycle / 1.25 : (cycle - 1.25) / 1.25;
    const startX = direction === 1 ? -3.15 : 3.15;
    const endX = direction === 1 ? 3.05 : -3.05;
    const startZ = direction === 1 ? -13.2 : 13.2;
    const endZ = -startZ;
    const x = THREE.MathUtils.lerp(startX, endX, u) + Math.sin(Math.PI * u) * (direction === 1 ? 0.7 : -0.7);
    const y = 0.24 + Math.sin(Math.PI * u) * 3.15;
    const z = THREE.MathUtils.lerp(startZ, endZ, u);
    matchBall.current.position.set(x, y, z);
    matchBall.current.rotation.x += delta * (matchPlaying ? 7 : 0);
    matchBall.current.rotation.z += delta * (matchPlaying ? 5 : 0);
  });

  useFrame((_, delta) => {
    const ball = practiceBall.current;
    const state = practiceState.current;
    if (!tennisGameActive || !ball) {
      state.active = false;
      previousHitSignal.current = tennisHitSignal;
      return;
    }

    const dt = Math.min(delta, 0.04);
    if (!state.active) {
      state.active = true;
      state.mode = 'incoming';
      state.elapsed = 0;
      state.velocity.set(0, 0, 0);
      ball.position.set(0, 2.2, -12.5);
      previousHitSignal.current = tennisHitSignal;
    }

    if (state.mode === 'incoming') {
      state.elapsed += dt;
      const u = Math.min(1, state.elapsed / 3.4);
      ball.position.set(
        Math.sin(state.elapsed * 1.7) * 2.6,
        1.1 + Math.sin(Math.PI * u) * 2.25,
        THREE.MathUtils.lerp(-12.5, 14.3, u),
      );
      if (tennisHitSignal !== previousHitSignal.current) {
        previousHitSignal.current = tennisHitSignal;
        const playerZ = camera.position.z + 162;
        const closeEnough = Math.abs(ball.position.x - camera.position.x) < 5.2
          && Math.abs(ball.position.z - playerZ) < 8.5
          && ball.position.y < 4.4;
        if (closeEnough) {
          state.mode = 'outgoing';
          state.velocity.set(
            THREE.MathUtils.clamp((ball.position.x - camera.position.x) * 0.36, -3.2, 3.2),
            4.4,
            -16,
          );
        }
      }
      if (state.elapsed >= 3.4) {
        onTennisPoint('opponent');
        state.elapsed = 0;
      }
    } else {
      state.velocity.y -= 9.3 * dt;
      ball.position.addScaledVector(state.velocity, dt);
      ball.rotation.x += dt * 8;
      ball.rotation.z += dt * 6;
      if (ball.position.y <= 0.18) {
        const landsInCourt = ball.position.z < -0.25
          && Math.abs(ball.position.x) <= 8.7;
        onTennisPoint(landsInCourt ? 'rugved' : 'opponent');
        state.mode = 'incoming';
        state.elapsed = 0;
      }
    }
  });

  const seatsRef = useRef<THREE.InstancedMesh>(null);
  const bodiesRef = useRef<THREE.InstancedMesh>(null);
  const headsRef = useRef<THREE.InstancedMesh>(null);
  useEffect(() => {
    if (seatsRef.current) {
      seating.seats.forEach((matrix, index) => seatsRef.current!.setMatrixAt(index, matrix));
      seatsRef.current.instanceMatrix.needsUpdate = true;
    }
    if (bodiesRef.current && headsRef.current) {
      seating.people.forEach((person, index) => {
        bodiesRef.current!.setMatrixAt(index, person.body);
        headsRef.current!.setMatrixAt(index, person.head);
        const shirtColor = new THREE.Color(person.shirt);
        bodiesRef.current!.setColorAt(index, shirtColor);
        headsRef.current!.setColorAt(index, new THREE.Color('#caa17c'));
      });
      bodiesRef.current.instanceMatrix.needsUpdate = true;
      headsRef.current.instanceMatrix.needsUpdate = true;
      if (bodiesRef.current.instanceColor) bodiesRef.current.instanceColor.needsUpdate = true;
      if (headsRef.current.instanceColor) headsRef.current.instanceColor.needsUpdate = true;
    }
  }, [seating]);

  const rows = Array.from({ length: 10 }, (_, i) => i);
  const stripes = Array.from({ length: 16 }, (_, i) => i);
  const roofBeams = Array.from({ length: 8 }, (_, i) => -25 + i * 7.2);

  return (
    <group position={[0, 0, -162]}>
      {/* Natural turf and mowing stripes */}
      <mesh position={[0, -0.08, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[78, 88]} />
        <meshStandardMaterial color="#47734b" roughness={0.96} />
      </mesh>
      <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[19.6, 38.2]} />
        <meshStandardMaterial color="#4c8745" roughness={0.9} />
      </mesh>
      {stripes.map((i) => (
        <mesh key={i} position={[0, 0.092, -17.2 + i * 2.28]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[19.45, 2.28]} />
          <meshStandardMaterial color={i % 2 === 0 ? '#6da94f' : '#4f8845'} roughness={0.96} />
        </mesh>
      ))}
      {/* Precise white grass-court lines */}
      {[-17.7, 17.7, -4.55, 4.55].map((z) => (
        <mesh key={z} position={[0, 0.115, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[18.9, 0.075]} />
          <meshBasicMaterial color="#fffdf0" />
        </mesh>
      ))}
      {[-8.55, 8.55, -4.12, 4.12].map((x) => (
        <mesh key={x} position={[x, 0.115, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.075, 35.4]} />
          <meshBasicMaterial color="#fffdf0" />
        </mesh>
      ))}
      <mesh position={[0, 0.115, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.07, 8.3]} />
        <meshBasicMaterial color="#fffdf0" />
      </mesh>
      {/* Tennis net */}
      <mesh position={[0, 0.72, 0]}>
        <boxGeometry args={[18.0, 0.055, 0.08]} />
        <meshStandardMaterial color="#e5e5d7" roughness={0.78} />
      </mesh>
      <mesh position={[0, 0.72, 0.015]}>
        <boxGeometry args={[17.7, 0.88, 0.03]} />
        <meshBasicMaterial color="#ecf0e3" wireframe transparent opacity={0.4} />
      </mesh>
      {[-9.05, 9.05].map((x) => (
        <mesh key={x} position={[x, 0.58, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 1.05, 10]} />
          <meshStandardMaterial color="#f0ebdb" metalness={0.32} roughness={0.3} />
        </mesh>
      ))}
      <TennisPlayer basePosition={[0, 0.12, -13]} shirtColor="#f4f2e6" side={0} matchClock={matchClock} matchPlaying={matchPlaying} />
      <TennisPlayer basePosition={[0, 0.12, 13]} shirtColor="#e4e9df" side={1} matchClock={matchClock} matchPlaying={matchPlaying} />
      <mesh ref={matchBall} visible={!tennisGameActive} position={[-3.15, 0.24, -13.2]} castShadow>
        <sphereGeometry args={[0.16, 20, 20]} />
        <meshStandardMaterial color="#d9e568" roughness={0.52} />
      </mesh>

      {/* Tiered green stands and packed crowd */}
      {rows.map((row) => {
        const y = 0.65 + row * 0.61;
        const offset = 10.25 + row * 1.34;
        const endOffset = 19.1 + row * 1.3;
        return (
          <group key={row}>
            {[-1, 1].map((side) => (
              <mesh key={side} position={[side * (offset + 0.66), y, -1.6]} receiveShadow>
                <boxGeometry args={[2.8, 0.2, 54]} />
                <meshStandardMaterial color={row % 2 ? '#315c48' : '#3d6d55'} roughness={0.86} />
              </mesh>
            ))}
            <mesh position={[0, y, -endOffset]} receiveShadow>
              <boxGeometry args={[42, 0.2, 2.5]} />
              <meshStandardMaterial color={row % 2 ? '#315c48' : '#3d6d55'} roughness={0.86} />
            </mesh>
          </group>
        );
      })}
      <instancedMesh ref={seatsRef} args={[undefined, undefined, seating.seats.length]} castShadow>
        <boxGeometry args={[0.95, 0.42, 0.82]} />
        <meshStandardMaterial color="#235a45" roughness={0.78} />
      </instancedMesh>
      <instancedMesh ref={bodiesRef} args={[undefined, undefined, seating.people.length]} castShadow>
        <capsuleGeometry args={[0.11, 0.23, 3, 5]} />
        <meshStandardMaterial roughness={0.78} />
      </instancedMesh>
      <instancedMesh ref={headsRef} args={[undefined, undefined, seating.people.length]}>
        <sphereGeometry args={[0.09, 8, 8]} />
        <meshStandardMaterial roughness={0.8} />
      </instancedMesh>

      {/* Steel truss canopy around the stands with an open-sky view over the court */}
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh position={[side * 25, 10.0, -1.5]} rotation={[0, 0, side * -0.035]}>
            <boxGeometry args={[15.8, 0.28, 62]} />
            <meshStandardMaterial color="#bbc8cc" metalness={0.42} roughness={0.38} />
          </mesh>
          {roofBeams.map((z) => (
            <group key={z} position={[side * 24.5, 10.32, z]}>
              <mesh rotation={[0, 0, side * -0.18]}>
                <boxGeometry args={[16.2, 0.12, 0.12]} />
                <meshStandardMaterial color="#e1e8e7" metalness={0.55} roughness={0.32} />
              </mesh>
              <mesh position={[side * 3.5, 0.82, 0]} rotation={[0, 0, side * 0.24]}>
                <boxGeometry args={[8.2, 0.095, 0.095]} />
                <meshStandardMaterial color="#c8d4d5" metalness={0.52} roughness={0.33} />
              </mesh>
              <mesh position={[-side * 3.5, 0.82, 0]} rotation={[0, 0, -side * 0.24]}>
                <boxGeometry args={[8.2, 0.095, 0.095]} />
                <meshStandardMaterial color="#c8d4d5" metalness={0.52} roughness={0.33} />
              </mesh>
              <mesh position={[0, 0.42, 0]}>
                <boxGeometry args={[0.08, 0.85, 0.1]} />
                <meshStandardMaterial color="#d9e2e2" metalness={0.52} roughness={0.32} />
              </mesh>
            </group>
          ))}
        </group>
      ))}
      <mesh position={[0, 10.7, -29.5]}>
        <boxGeometry args={[45, 0.28, 8.5]} />
        <meshStandardMaterial color="#b7c3c5" metalness={0.42} roughness={0.42} />
      </mesh>
      {[-21, -29, -37].map((z) => (
        <mesh key={z} position={[0, 11.0, z]}>
          <boxGeometry args={[45, 0.1, 0.1]} />
          <meshStandardMaterial color="#e3e9e7" metalness={0.55} roughness={0.3} />
        </mesh>
      ))}
      <mesh position={[0, 10.95, -24]}>
        <boxGeometry args={[0.12, 1.05, 11]} />
        <meshStandardMaterial color="#e2e8e6" metalness={0.52} roughness={0.33} />
      </mesh>
      {/* Boundary hoardings and a green courtside surround */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 20.3, 0.95, -1]} receiveShadow>
          <boxGeometry args={[0.35, 1.8, 54]} />
          <meshStandardMaterial color="#164e3d" roughness={0.82} />
        </mesh>
      ))}
      <mesh position={[0, 0.95, -29.5]} receiveShadow>
        <boxGeometry args={[42, 1.8, 0.35]} />
        <meshStandardMaterial color="#174d3b" roughness={0.82} />
      </mesh>
      <Text position={[-4.5, 8.35, -29.25]} anchorX="left" fontSize={0.36} color="#f1f2e7" letterSpacing={0.14}>
        RUGVED / COURT 01
      </Text>
      {/* Physical scoreboard at the far end of the arena. */}
      <group position={[0, 8.2, -34.2]}>
        <mesh castShadow>
          <boxGeometry args={[12.2, 3.25, 0.55]} />
          <meshStandardMaterial color="#152e25" metalness={0.22} roughness={0.44} />
        </mesh>
        <mesh position={[0, 0, 0.285]}>
          <planeGeometry args={[11.72, 2.78]} />
          <meshBasicMaterial color="#234638" />
        </mesh>
        <Text position={[0, 0.92, 0.31]} anchorX="center" fontSize={0.29} color="#dce6ce" letterSpacing={0.17}>
          RUGVED / COURT 01
        </Text>
        <Text position={[-3.25, 0.15, 0.31]} anchorX="center" fontSize={0.18} color="#b8d3bd" letterSpacing={0.04}>
          RUGVED
        </Text>
        <Text position={[0, 0.1, 0.32]} anchorX="center" fontSize={0.64} color="#f1f5dc">
          {tennisScore.rugved} : {tennisScore.opponent}
        </Text>
        <Text position={[3.25, 0.15, 0.31]} anchorX="center" fontSize={0.18} color="#b8d3bd" letterSpacing={0.04}>
          GUEST
        </Text>
        <Text position={[0, -0.83, 0.31]} anchorX="center" fontSize={0.14} color="#d5bb83" letterSpacing={0.07}>
          {tennisGameActive ? 'PRACTICE RALLY / SPACE TO HIT' : 'CLUB SCOREBOARD / PRACTICE READY'}
        </Text>
      </group>
      <mesh ref={practiceBall} visible={tennisGameActive} position={[0, 2.2, -12.5]} castShadow>
        <sphereGeometry args={[0.19, 20, 20]} />
        <meshStandardMaterial color="#e4ed6a" roughness={0.42} emissive="#656d1d" emissiveIntensity={0.13} />
      </mesh>
      <pointLight position={[0, 12, -22]} intensity={1.8} distance={54} color="#fff2d5" />
    </group>
  );
}

export function Scene({ progress, onSelectProject, matchPlaying, exploreMode, tennisGameActive, tennisHitSignal, tennisScore, onTennisPoint, onStadiumZoneChange }: {
  progress: number;
  onSelectProject: (number: string) => void;
  matchPlaying: boolean;
  exploreMode: boolean;
  tennisGameActive: boolean;
  tennisHitSignal: number;
  tennisScore: { rugved: number; opponent: number };
  onTennisPoint: (winner: 'rugved' | 'opponent') => void;
  onStadiumZoneChange: (inside: boolean) => void;
}){
  const { camera, gl } = useThree();
  const path=useMemo(()=>new THREE.CatmullRomCurve3([
    new THREE.Vector3(0,2.35,11),
    new THREE.Vector3(0,2.4,-12),
    new THREE.Vector3(-.2,2.45,-31),
    new THREE.Vector3(0,2.55,-52),
    new THREE.Vector3(0,2.65,-68),
    new THREE.Vector3(0,2.85,-87),
    new THREE.Vector3(0,3.1,-105),
    new THREE.Vector3(0,3.7,-123),
    new THREE.Vector3(0,3.1,-139),
  ],false,'catmullrom',.55),[]);
  const targetPath=useMemo(()=>new THREE.CatmullRomCurve3([
    new THREE.Vector3(0,2.35,-5),new THREE.Vector3(0,2.4,-24),new THREE.Vector3(0,2.5,-43),
    new THREE.Vector3(0,2.6,-63),new THREE.Vector3(0,2.7,-81),new THREE.Vector3(0,3,-101),
    new THREE.Vector3(0,4,-128),new THREE.Vector3(0,2.1,-162)
  ],false,'catmullrom',.5),[]);
  const pos=useRef(new THREE.Vector3());
  const look=useRef(new THREE.Vector3());
  const mouse=useRef({x:0,y:0});
  const stadiumZone = useRef(false);
  const explorer = useRef({
    position: new THREE.Vector3(0, 2.5, -73),
    yaw: 0,
    pitch: 0,
    keys: new Set<string>(),
    dragging: false,
    lastX: 0,
    lastY: 0,
  });

  useEffect(() => {
    const f = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / innerWidth - .5) * 2;
      mouse.current.y = (e.clientY / innerHeight - .5) * 2;
    };
    addEventListener('pointermove', f, { passive: true });
    return () => removeEventListener('pointermove', f);
  }, []);

  useEffect(() => {
    const state = explorer.current;
    state.keys.clear();
    state.dragging = false;
    if (!exploreMode) {
      gl.domElement.style.cursor = 'auto';
      if (stadiumZone.current) {
        stadiumZone.current = false;
        onStadiumZoneChange(false);
      }
      return;
    }

    // Start in the current view. Movement constraints widen as the corridor opens into the court.
    state.position.copy(camera.position);
    state.position.x = THREE.MathUtils.clamp(state.position.x, -10.5, 10.2);
    state.position.y = 2.5;
    state.position.z = THREE.MathUtils.clamp(state.position.z, -203.5, -57.5);
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    state.yaw = Math.atan2(direction.x, -direction.z);
    state.pitch = THREE.MathUtils.clamp(Math.asin(THREE.MathUtils.clamp(direction.y, -1, 1)), -0.58, 0.58);

    const canvas = gl.domElement;
    canvas.style.cursor = 'grab';
    const movementKeys = new Set(['w', 'a', 's', 'd', 'arrowup', 'arrowleft', 'arrowdown', 'arrowright', 'shift']);

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      state.dragging = true;
      state.lastX = event.clientX;
      state.lastY = event.clientY;
      canvas.style.cursor = 'grabbing';
      try {
        canvas.setPointerCapture(event.pointerId);
      } catch {
        // Pointer capture is optional on older browsers; drag tracking also uses the canvas.
      }
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!state.dragging) return;
      const dx = event.clientX - state.lastX;
      const dy = event.clientY - state.lastY;
      state.lastX = event.clientX;
      state.lastY = event.clientY;
      state.yaw += dx * 0.0058;
      state.pitch = THREE.MathUtils.clamp(state.pitch - dy * 0.004, -0.82, 0.82);
    };
    const onPointerUp = (event: PointerEvent) => {
      state.dragging = false;
      try {
        if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
      } catch {
        // Ignore unsupported pointer capture.
      }
      canvas.style.cursor = 'grab';
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (document.querySelector('.project-detail-backdrop')) return;
      const key = event.key.toLowerCase();
      if (!movementKeys.has(key)) return;
      state.keys.add(key);
      event.preventDefault();
    };
    const onKeyUp = (event: KeyboardEvent) => {
      state.keys.delete(event.key.toLowerCase());
    };
    const onBlur = () => {
      state.keys.clear();
      state.dragging = false;
      canvas.style.cursor = 'grab';
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    // Track motion on window capture so the view keeps turning even if the
    // pointer briefly leaves the canvas during a drag.
    window.addEventListener('pointermove', onPointerMove, true);
    window.addEventListener('pointerup', onPointerUp, true);
    window.addEventListener('pointercancel', onPointerUp, true);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);
    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove, true);
      window.removeEventListener('pointerup', onPointerUp, true);
      window.removeEventListener('pointercancel', onPointerUp, true);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
      state.keys.clear();
      state.dragging = false;
      canvas.style.cursor = 'auto';
    };
  }, [exploreMode, camera, gl, onStadiumZoneChange]);

  useEffect(() => {
    if (!exploreMode || !tennisGameActive) return;
    const state = explorer.current;
    state.position.set(0, 2.5, -146.4);
    state.yaw = 0;
    state.pitch = -0.025;
    camera.position.copy(state.position);
    camera.lookAt(0, 2.35, -162);
  }, [tennisGameActive, exploreMode, camera]);

  useFrame((_,dt)=>{
    if (exploreMode) {
      const state = explorer.current;
      const keys = state.keys;
      const forward = new THREE.Vector3(Math.sin(state.yaw), 0, -Math.cos(state.yaw));
      const right = new THREE.Vector3(Math.cos(state.yaw), 0, Math.sin(state.yaw));
      const direction = new THREE.Vector3();
      const speed = (keys.has('shift') ? 7.4 : 4.6) * Math.min(dt, 0.05);
      if (keys.has('w') || keys.has('arrowup')) state.position.addScaledVector(forward, speed);
      if (keys.has('s') || keys.has('arrowdown')) state.position.addScaledVector(forward, -speed);
      if (keys.has('d') || keys.has('arrowright')) state.position.addScaledVector(right, speed);
      if (keys.has('a') || keys.has('arrowleft')) state.position.addScaledVector(right, -speed);
      if (tennisGameActive) {
        state.position.x = THREE.MathUtils.clamp(state.position.x, -7.8, 7.8);
        state.position.z = THREE.MathUtils.clamp(state.position.z, -178.5, -143.4);
      } else {
        const tunnel = state.position.z < -111.5 && state.position.z >= -137;
        const corridor = state.position.z >= -111.5;
        const xLimit = corridor ? 10.55 : tunnel ? 5.5 : 18.4;
        state.position.x = THREE.MathUtils.clamp(state.position.x, -xLimit, xLimit);
        state.position.z = THREE.MathUtils.clamp(state.position.z, -203.5, -57.2);
      }
      state.position.y = 2.5;
      const isInStadium = state.position.z < -132.5;
      if (isInStadium !== stadiumZone.current) {
        stadiumZone.current = isInStadium;
        onStadiumZoneChange(isInStadium);
      }
      direction.set(
        Math.sin(state.yaw) * Math.cos(state.pitch),
        Math.sin(state.pitch),
        -Math.cos(state.yaw) * Math.cos(state.pitch)
      );
      camera.position.copy(state.position);
      look.current.copy(state.position).add(direction);
      camera.lookAt(look.current);
      return;
    }

    const p = clamp01(progress);
    const t = p < 0.4 ? p * 0.75 : p < 0.68 ? 0.3 + (p - 0.4) * 0.75 : 0.51 + (p - 0.68) * 1.5;
    path.getPointAt(t, pos.current); targetPath.getPointAt(t, look.current);
    const gallery = smooth((p - 0.37) / 0.12) * (1 - smooth((p - 0.63) / 0.12));
    const perspective = camera as THREE.PerspectiveCamera;
    const targetFov = 48 + gallery * 16;
    if (Math.abs(perspective.fov - targetFov) > 0.08) {
      perspective.fov = targetFov;
      perspective.updateProjectionMatrix();
    }
    const stadium=smooth((p-.72)/.28);
    pos.current.x+=mouse.current.x*(.16+stadium*.42);
    pos.current.y+=-mouse.current.y*.08+stadium*.25;
    look.current.x+=mouse.current.x*.08;
    look.current.y+=-mouse.current.y*.05;
    camera.position.lerp(pos.current,1-Math.pow(.0005,dt));
    camera.lookAt(look.current);
  });

  const bays=Array.from({length:7},(_,i)=>-i*8-5);
  return <>
    <color attach="background" args={['#afd8ef']}/>
    <fog attach="fog" args={['#b7d7e2',82,245]}/>
    <Sky distance={450000} sunPosition={[70, 92, 35]} turbidity={6.5} rayleigh={2.4} mieCoefficient={0.004} mieDirectionalG={0.82}/>
    <hemisphereLight args={["#c9eaff", "#879679", 1.65]}/>
    <ambientLight intensity={0.9} color="#f0f4e9"/>
    <directionalLight position={[-28, 48, 15]} intensity={3.4} color="#fff4dc" castShadow shadow-mapSize={[2048,2048]} shadow-bias={-0.0002}/>
    <directionalLight position={[14, 28, -165]} intensity={1.8} color="#e1f2ff"/>
    <pointLight position={[0,4,-22]} intensity={1.1} distance={18} color="#fff3da"/>
    <pointLight position={[0,4,-43]} intensity={0.9} distance={18} color="#e6f4fa"/>
    <mesh position={[0,-.16,-25]} receiveShadow><boxGeometry args={[10.2,.32,65]}/><Concrete color="#85897f" roughness={.62} repeat={5}/></mesh>
    <mesh position={[-5.15,3,-25]} receiveShadow><boxGeometry args={[.28,6.1,65]}/><Concrete color="#a8aaa0" roughness={.78} repeat={3}/></mesh>
    <mesh position={[5.15,3,-25]} receiveShadow><boxGeometry args={[.28,6.1,65]}/><Concrete color="#a8aaa0" roughness={.78} repeat={3}/></mesh>
    <mesh position={[0,6.05,-25]}><boxGeometry args={[10.4,.22,65]}/><Concrete color="#c2c7bf" roughness={.84} repeat={4}/></mesh>
    {bays.map((z,i)=><group key={z}>
      <mesh position={[-4.65,3,z]} castShadow><boxGeometry args={[.52,6.1,.52]}/><Concrete color="#7b786f" roughness={.76} repeat={2}/></mesh>
      <mesh position={[4.65,3,z]} castShadow><boxGeometry args={[.52,6.1,.52]}/><Concrete color="#7b786f" roughness={.76} repeat={2}/></mesh>
      <WallLight x={-4.45} z={z+.2} side={1}/><WallLight x={4.45} z={z+.2} side={-1}/>
      {i%2===0&&<Skylight z={z+2}/>}
    </group>)}
    <Planter position={[-3.9,.05,-7]} scale={1.05}/><Planter position={[3.9,.05,-15]} scale={.9}/>
    <Planter position={[-3.9,.05,-35]} scale={.85}/><Planter position={[3.9,.05,-46]} scale={1.05}/>
    <WallArt side={1} z={-12} title="DISCIPLINE" sub="Creativity / Progress / Repeat"/>
    <WallArt side={-1} z={-38} title="GOOD IDEAS" sub="Play longer. Think wider."/>
    <ClubWayfindingSign side={1} z={-26}/>
    <LobbyBench position={[-3.65,0,-20]} rotationY={Math.PI/2}/>
    <LobbyBench position={[3.65,0,-43]} rotationY={-Math.PI/2}/>
    <ClubTrophyCase position={[-3.68,0,-27]} side={-1}/>
    <RacketAndBallStand position={[3.55,0,-27]} side={1}/>
    <TennisObject position={[4.15,1.75,-24]} kind="racket"/>
    <TennisObject position={[-3.9,1.15,-43]} kind="ball"/>
    <LockerRoom onSelectProject={onSelectProject}/>
    <ApproachTunnel/>
    <Stadium
      matchPlaying={matchPlaying && !tennisGameActive}
      tennisGameActive={tennisGameActive}
      tennisHitSignal={tennisHitSignal}
      tennisScore={tennisScore}
      onTennisPoint={onTennisPoint}
    />
    <Sparkles count={34} scale={[9,6,125]} position={[0,4,-72]} size={0.9} speed={0.1} opacity={0.11}/>
    <Environment preset="dawn" environmentIntensity={0.58} background={false}/>
  </>;
}