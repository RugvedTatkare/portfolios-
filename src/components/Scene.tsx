import { portfolio } from '../data/portfolio';
import { useEffect, useMemo, useRef } from 'react';
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

type Project = (typeof portfolio.projects)[number];

function ProjectLocker({ project, index, position, onSelect }: {
  project: Project;
  index: number;
  position: [number, number, number];
  onSelect: () => void;
}) {
  const teamColors = ['#1e684f', '#27675e', '#2d5065'];
  const accent = teamColors[index % teamColors.length];
  const bars = [0.28, 0.42, 0.35, 0.65, 0.48, 0.76, 0.56];
  return (
    <Float speed={0.4 + index * 0.08} floatIntensity={0.035} rotationIntensity={0.006}>
      <group
        position={position}
        rotation={[0, index === 0 ? 0.045 : index === 2 ? -0.045 : 0, 0]}
        onClick={(event) => { event.stopPropagation(); onSelect(); }}
        onPointerOver={(event) => { event.stopPropagation(); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { document.body.style.cursor = 'auto'; }}
      >
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
  const lockerPositions: [number, number, number][] = [
    [-6.25, 2.95, -82.2],
    [0, 3.1, -84.0],
    [6.25, 2.95, -82.2],
  ];
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
          <SideSportsLocker side={-1} z={z} number={i} />
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
      {/* Project lockers are the feature wall: kit details + an interactive data display */}
      {portfolio.projects.map((project, i) => (
        <group key={project.number}>
          <ProjectLocker
            project={project}
            index={i}
            position={lockerPositions[i]}
            onSelect={() => onSelectProject(project.number)}
          />
          <mesh position={[lockerPositions[i][0], 0.42, lockerPositions[i][2] - 1.2]} castShadow receiveShadow>
            <boxGeometry args={[3.55, 0.84, 2.1]} />
            <meshStandardMaterial color="#879083" roughness={0.5} metalness={0.12} />
          </mesh>
          <mesh position={[lockerPositions[i][0], 0.86, lockerPositions[i][2] - 1.2]}>
            <boxGeometry args={[3.28, 0.035, 1.8]} />
            <meshStandardMaterial color="#c9d6c5" roughness={0.48} />
          </mesh>
        </group>
      ))}
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

function Stadium() {
  const seatData = useMemo(() => {
    const matrices: THREE.Matrix4[] = [];
    const seat = new THREE.Object3D();
    for (let row = 0; row < 10; row++) {
      const radius = 19 + row * 1.9;
      const y = 1 + row * 0.68;
      for (let i = 0; i < 72; i++) {
        const angle = (i / 72) * Math.PI * 2;
        seat.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
        seat.rotation.y = -angle + Math.PI / 2;
        seat.updateMatrix();
        matrices.push(seat.matrix.clone());
      }
    }
    return matrices;
  }, []);
  const seats = useRef<THREE.InstancedMesh>(null);
  useEffect(() => {
    if (!seats.current) return;
    seatData.forEach((matrix, index) => seats.current!.setMatrixAt(index, matrix));
    seats.current.instanceMatrix.needsUpdate = true;
  }, [seatData]);

  return (
    <group position={[0, 0, -143]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[39, 96]} />
        <meshStandardMaterial color="#11130f" roughness={0.92} />
      </mesh>
      <instancedMesh ref={seats} args={[undefined, undefined, seatData.length]} castShadow>
        <boxGeometry args={[1.15, 0.48, 1.45]} />
        <meshStandardMaterial color="#3c4038" roughness={0.74} />
      </instancedMesh>

      <mesh position={[0, 0.2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[18.2, 36.5]} />
        <meshStandardMaterial color="#426b53" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.22, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[16.8, 35.1]} />
        <meshStandardMaterial color="#537c60" roughness={0.65} />
      </mesh>

      {[-17.5, 17.5, -4.5, 4.5].map((z) => (
        <mesh key={z} position={[0, 0.245, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[16.8, 0.055]} />
          <meshBasicMaterial color="#f6f0df" />
        </mesh>
      ))}
      {[-8.35, 8.35, -4.1, 4.1].map((x) => (
        <mesh key={x} position={[x, 0.245, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.055, 35.1]} />
          <meshBasicMaterial color="#f6f0df" />
        </mesh>
      ))}
      <mesh position={[0, 0.245, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.055, 9]} />
        <meshBasicMaterial color="#f6f0df" />
      </mesh>

      <mesh position={[-8.35, 0.62, 0]}>
        <cylinderGeometry args={[0.055, 0.055, 0.78, 10]} />
        <meshStandardMaterial color="#d5c7a7" metalness={0.6} roughness={0.28} />
      </mesh>
      <mesh position={[8.35, 0.62, 0]}>
        <cylinderGeometry args={[0.055, 0.055, 0.78, 10]} />
        <meshStandardMaterial color="#d5c7a7" metalness={0.6} roughness={0.28} />
      </mesh>
      <mesh position={[0, 0.76, 0]}>
        <planeGeometry args={[16.7, 0.98]} />
        <meshBasicMaterial color="#e4e8dc" transparent opacity={0.2} side={THREE.DoubleSide} wireframe />
      </mesh>
      <mesh position={[0, 1.13, 0]}>
        <boxGeometry args={[16.7, 0.035, 0.035]} />
        <meshBasicMaterial color="#f6f0df" />
      </mesh>

      <mesh position={[0, 4.2, 0]}>
        <torusGeometry args={[32, 0.13, 12, 128]} />
        <meshStandardMaterial color="#77786c" metalness={0.45} roughness={0.3} />
      </mesh>
      {[-18, 18].map((x) => (
        <mesh key={x} position={[x, 7, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.09, 0.09, 42, 12]} />
          <meshStandardMaterial color="#575a52" metalness={0.4} roughness={0.4} />
        </mesh>
      ))}
      <mesh position={[0, 8.2, -2]}>
        <boxGeometry args={[20, 0.35, 0.12]} />
        <meshStandardMaterial color="#242620" metalness={0.35} roughness={0.3} />
      </mesh>
      <Text position={[-5.2, 6.9, -1.85]} anchorX="left" fontSize={0.34} color="#ece7d8" letterSpacing={0.06}>RUGVED</Text>
      <TennisObject position={[4.8, 0.65, -5]} kind="ball" />

      <mesh position={[0, 13, -28]}>
        <sphereGeometry args={[5.2, 48, 32]} />
        <meshBasicMaterial color="#f2bb78" />
      </mesh>
      <mesh position={[0, 13, -28.2]}>
        <sphereGeometry args={[6.5, 48, 32]} />
        <meshBasicMaterial color="#f2bb78" transparent opacity={0.14} />
      </mesh>
      <pointLight position={[0, 14, -7]} intensity={7} distance={44} color="#ffcc8d" />
      <pointLight position={[-13, 11, 1]} intensity={4.5} distance={32} color="#f4d2a0" />
      <pointLight position={[13, 11, 1]} intensity={4.5} distance={32} color="#f4d2a0" />
    </group>
  );
}

export function Scene({ progress, onSelectProject }: { progress: number; onSelectProject: (number: string) => void }){
  const {camera}=useThree();
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
  useEffect(()=>{const f=(e:PointerEvent)=>{mouse.current.x=(e.clientX/innerWidth-.5)*2;mouse.current.y=(e.clientY/innerHeight-.5)*2};addEventListener('pointermove',f,{passive:true});return()=>removeEventListener('pointermove',f)},[]);
  useFrame((_,dt)=>{
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
    <hemisphereLight skyColor="#c9eaff" groundColor="#879679" intensity={1.65}/>
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
    <Planter position={[-3.9,.05,-31]} scale={.85}/><Planter position={[3.9,.05,-46]} scale={1.05}/>
    <WallArt side={1} z={-12} title="DISCIPLINE" sub="Creativity / Progress / Repeat"/>
    <WallArt side={-1} z={-38} title="GOOD IDEAS" sub="Play longer. Think wider."/>
    <TennisObject position={[4.15,1.75,-24]} kind="racket"/>
    <TennisObject position={[-3.9,1.15,-43]} kind="ball"/>
    <LockerRoom onSelectProject={onSelectProject}/>
    <ApproachTunnel/>
    <Stadium/>
    <Sparkles count={34} scale={[9,6,125]} position={[0,4,-72]} size={0.9} speed={0.1} opacity={0.11}/>
    <Environment preset="dawn" environmentIntensity={0.58} background={false}/>
  </>;
}