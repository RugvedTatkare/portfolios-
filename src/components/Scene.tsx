import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Environment, Float, Sparkles, Text } from '@react-three/drei';
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

function ProjectScreen({position,index}:{position:[number,number,number];index:number}){
  const labels=[['LEGAL AID','PLATFORM'],['DATA','VISUALIZATION'],['ENGRAVA','E-COMMERCE']];
  const [a,b]=labels[index%3];
  return <group position={position} rotation={[0,index===1?.08:-.08,0]}>
    <mesh position={[0,0,-.12]} castShadow><boxGeometry args={[2.8,1.85,.14]}/><meshStandardMaterial color="#11120f" metalness={.35} roughness={.32}/></mesh>
    <mesh position={[0,0,-.035]}><boxGeometry args={[2.58,1.62,.025]}/><meshStandardMaterial color={index===0?'#17272a':index===1?'#1e2924':'#27241f'} emissive={index===1?'#101c17':'#070706'} emissiveIntensity={.4}/></mesh>
    <Text position={[-1.05,.58,.01]} anchorX="left" fontSize={.11} color="#f0eadb">{a}</Text>
    <Text position={[-1.05,.38,.01]} anchorX="left" fontSize={.11} color="#c7a46b">{b}</Text>
    {Array.from({length:5},(_,i)=><mesh key={i} position={[-.82+i*.35,-.25,.01]}><boxGeometry args={[.22,.55+(i%2)*.25,.012]}/><meshBasicMaterial color={i===3?'#d6e16a':'#718779'} transparent opacity={.72}/></mesh>)}
  </group>
}

function TennisObject({position,kind}:{position:[number,number,number];kind:'ball'|'racket'}){
  if(kind==='ball') return <Float speed={1.1} floatIntensity={.22}><mesh position={position} castShadow><sphereGeometry args={[.17,24,24]}/><meshStandardMaterial color="#d6e16a" roughness={.52}/></mesh></Float>;
  return <group position={position} rotation={[.2,-.2,.2]} scale={.82}><mesh rotation={[Math.PI/2,0,0]}><torusGeometry args={[.72,.055,12,40]}/><meshStandardMaterial color="#c3bdad" metalness={.45} roughness={.3}/></mesh><mesh position={[0,-.95,0]}><cylinderGeometry args={[.055,.055,1.7,12]}/><meshStandardMaterial color="#252720" roughness={.55}/></mesh><mesh rotation={[Math.PI/2,0,0]}><circleGeometry args={[.64,32]}/><meshBasicMaterial color="#dfe2d1" transparent opacity={.09} wireframe/></mesh></group>
}

function Stadium(){
  const seatData=useMemo(()=>{
    const arr:THREE.Matrix4[]=[];
    const dummy=new THREE.Object3D();
    for(let row=0;row<10;row++){
      const radius=19+row*1.9, y=1+row*.68;
      for(let i=0;i<72;i++){const a=i/72*Math.PI*2;dummy.position.set(Math.cos(a)*radius,y,Math.sin(a)*radius);dummy.rotation.y=-a+Math.PI/2;dummy.updateMatrix();arr.push(dummy.matrix.clone());}
    }
    return arr;
  },[]);
  const ref=useRef<THREE.InstancedMesh>(null);
  useEffect(()=>{if(ref.current) seatData.forEach((m,i)=>ref.current!.setMatrixAt(i,m)); if(ref.current) ref.current.instanceMatrix.needsUpdate=true;},[seatData]);
  return <group position={[0,0,-143]}>
    <mesh rotation={[-Math.PI/2,0,0]} receiveShadow><circleGeometry args={[39,96]}/><meshStandardMaterial color="#11130f" roughness={.92}/></mesh>
    <instancedMesh ref={ref} args={[undefined,undefined,seatData.length]} castShadow><boxGeometry args={[1.15,.48,1.45]}/><meshStandardMaterial color="#30332d" roughness={.78}/></instancedMesh>
    <mesh position={[0,.2,0]} rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[18.2,36.5]}/><meshStandardMaterial color="#426b53" roughness={.7}/></mesh>
    <mesh position={[0,.22,0]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[16.8,35.1]}/><meshStandardMaterial color="#537c60" roughness={.65}/></mesh>
    {[-17.5,-8.6,0,8.6,17.5].map((z,i)=><mesh key={i} position={[0,.25,z]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[16.8,.045]}/><meshBasicMaterial color="#f4efe0"/></mesh>)}
    <mesh position={[0,.25,0]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[.045,35.1]}/><meshBasicMaterial color="#f4efe0"/></mesh>
    <mesh position={[0,.78,0]}><boxGeometry args={[16.9,.06,.06]}/><meshBasicMaterial color="#f4efe0"/></mesh>
    <mesh position={[0,4.2,0]}><torusGeometry args={[32,.13,12,128]}/><meshStandardMaterial color="#5e6258" metalness={.4} roughness={.3}/></mesh>
    {[-18,18].map(x=><mesh key={x} position={[x,7,0]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.09,.09,42,12]}/><meshStandardMaterial color="#575a52" metalness={.4} roughness={.4}/></mesh>)}
    <mesh position={[0,8.2,-2]}><boxGeometry args={[20,.35,.12]}/><meshStandardMaterial color="#242620" metalness={.35} roughness={.3}/></mesh>
    <Text position={[-5.2,6.9,-1.85]} anchorX="left" fontSize={.34} color="#ece7d8" letterSpacing={.06}>RUGVED</Text>
    <TennisObject position={[4.8,.65,-5]} kind="ball"/>
  </group>
}

export function Scene({progress}:{progress:number}){
  const {camera}=useThree();
  const path=useMemo(()=>new THREE.CatmullRomCurve3([
    new THREE.Vector3(0,2.35,11),
    new THREE.Vector3(0,2.4,-14),
    new THREE.Vector3(-.45,2.5,-42),
    new THREE.Vector3(.5,2.55,-72),
    new THREE.Vector3(0,2.75,-100),
    new THREE.Vector3(0,3.3,-119),
    new THREE.Vector3(0,4.4,-137),
    new THREE.Vector3(0,5.2,-153),
  ],false,'catmullrom',.55),[]);
  const targetPath=useMemo(()=>new THREE.CatmullRomCurve3([
    new THREE.Vector3(0,2.35,-5),new THREE.Vector3(0,2.4,-28),new THREE.Vector3(0,2.5,-55),
    new THREE.Vector3(0,2.65,-84),new THREE.Vector3(0,3.2,-106),new THREE.Vector3(0,4,-126),
    new THREE.Vector3(0,4.8,-145),new THREE.Vector3(0,4.8,-166)
  ],false,'catmullrom',.5),[]);
  const pos=useRef(new THREE.Vector3());
  const look=useRef(new THREE.Vector3());
  const mouse=useRef({x:0,y:0});
  useEffect(()=>{const f=(e:PointerEvent)=>{mouse.current.x=(e.clientX/innerWidth-.5)*2;mouse.current.y=(e.clientY/innerHeight-.5)*2};addEventListener('pointermove',f,{passive:true});return()=>removeEventListener('pointermove',f)},[]);
  useFrame((_,dt)=>{
    const p=clamp01(progress), t=p*.99;
    path.getPointAt(t,pos.current); targetPath.getPointAt(t,look.current);
    const stadium=smooth((p-.72)/.28);
    pos.current.x+=mouse.current.x*(.16+stadium*.42);
    pos.current.y+=-mouse.current.y*.08+stadium*.25;
    look.current.x+=mouse.current.x*.08;
    look.current.y+=-mouse.current.y*.05;
    camera.position.lerp(pos.current,1-Math.pow(.0005,dt));
    camera.lookAt(look.current);
  });

  const bays=Array.from({length:13},(_,i)=>-i*8-5);
  return <>
    <color attach="background" args={['#0e0f0d']}/>
    <fog attach="fog" args={['#0e0f0d',22,170]}/>
    <ambientLight intensity={.72}/>
    <directionalLight position={[-12,18,18]} intensity={2.4} castShadow shadow-mapSize={[2048,2048]} shadow-bias={-0.0002}/>
    <pointLight position={[0,4,-25]} intensity={3.2} distance={18} color="#e9c987"/>
    <pointLight position={[0,4,-80]} intensity={2.2} distance={20} color="#d9c69d"/>
    <mesh position={[0,-.16,-55]} receiveShadow><boxGeometry args={[10.2,.32,125]}/><Concrete color="#4f5049" roughness={.62} repeat={5}/></mesh>
    <mesh position={[-5.15,3,-55]} receiveShadow><boxGeometry args={[.28,6.1,125]}/><Concrete color="#6e6c64" roughness={.82} repeat={3}/></mesh>
    <mesh position={[5.15,3,-55]} receiveShadow><boxGeometry args={[.28,6.1,125]}/><Concrete color="#6e6c64" roughness={.82} repeat={3}/></mesh>
    <mesh position={[0,6.05,-55]}><boxGeometry args={[10.4,.22,125]}/><Concrete color="#34352f" roughness={.85} repeat={4}/></mesh>
    {bays.map((z,i)=><group key={z}>
      <mesh position={[-4.65,3,z]} castShadow><boxGeometry args={[.52,6.1,.52]}/><Concrete color="#7b786f" roughness={.76} repeat={2}/></mesh>
      <mesh position={[4.65,3,z]} castShadow><boxGeometry args={[.52,6.1,.52]}/><Concrete color="#7b786f" roughness={.76} repeat={2}/></mesh>
      <WallLight x={-4.45} z={z+.2} side={1}/><WallLight x={4.45} z={z+.2} side={-1}/>
      {i%2===0&&<Skylight z={z+2}/>}
    </group>)}
    <Planter position={[-3.9,.05,-7]} scale={1.05}/><Planter position={[3.9,.05,-15]} scale={.9}/>
    <Planter position={[-3.9,.05,-31]} scale={.85}/><Planter position={[3.9,.05,-46]} scale={1.05}/>
    <Planter position={[-3.9,.05,-61]} scale={.9}/><Planter position={[3.9,.05,-77]} scale={1.0}/>
    <WallArt side={1} z={-12} title="DISCIPLINE" sub="Creativity / Progress / Repeat"/>
    <WallArt side={-1} z={-38} title="GOOD IDEAS" sub="Play longer. Think wider."/>
    <WallArt side={1} z={-66} title="BUILD" sub="Data / Design / Business"/>
    <WallArt side={-1} z={-91} title="WHAT'S NEXT" sub="Curiosity becomes opportunity."/>
    <TennisObject position={[4.15,1.75,-24]} kind="racket"/>
    <TennisObject position={[-4.15,1.85,-57]} kind="racket"/>
    <TennisObject position={[3.85,1.3,-84]} kind="ball"/>
    <ProjectScreen position={[-3.25,2.15,-88]} index={0}/>
    <ProjectScreen position={[0,2.25,-92]} index={1}/>
    <ProjectScreen position={[3.25,2.15,-88]} index={2}/>
    <mesh position={[0,3.1,-112]}><boxGeometry args={[9.9,6.2,.42]}/><Concrete color="#737067" roughness={.74} repeat={2}/></mesh>
    <mesh position={[0,3.15,-111.72]}><boxGeometry args={[6.5,4.5,.08]}/><meshStandardMaterial color="#10120f" roughness={.5}/></mesh>
    <Text position={[-1.45,5.15,-111.45]} fontSize={.28} color="#dfd8c8" letterSpacing={.12}>RUGVED</Text>
    <Text position={[-2.25,1.15,-111.4]} fontSize={.11} color="#b9b4a8" letterSpacing={.04}>THE JOURNEY LEADS SOMEWHERE BIGGER</Text>
    <Stadium/>
    <Sparkles count={90} scale={[9,6,145]} position={[0,3,-70]} size={1.1} speed={.08} opacity={.16}/>
    <Environment preset="sunset" environmentIntensity={.45}/>
  </>;
}