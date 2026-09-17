import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const ASSET_BASE_URL = 'https://api.getlayers.ai/storage/v1/object/public/public/assets/laocoon-59f84455c6'
const NAV_TARGETS = [0, 0.34, 0.62, 0.94]
const SLIDES = [
  { id: 1, title: <>Bronze <br />and Time</>, descriptions: [
    'A timeless material holding centuries of human history. Fluid in hot flames, eternal in its form. Each curve captures a tense, dramatic moment.',
    'Born of molten fire and creative will, it stands to bridge our ancient memory and modern vision. A fluid energy frozen in still, heavy bronze.',
  ]},
  { id: 2, title: <>Marble <br />Emotion</>, descriptions: ['A sculpture frozen at the peak of human suffering and heroic struggle. Laocoön and his sons, bound by ruthless fate.'] },
  { id: 3, title: <>Liquid Metal</>, descriptions: ['Art that breathes. Mesmerizing waves of liquid bronze flow through space, reflecting every contour and tensed muscle of the ancient masterpiece.'] },
  { id: 4, title: <>Eternal <br />Moment</>, descriptions: ['Contemplating antique form through the lens of new dimensions. A classic masterpiece reborn in the currents of radiant digital matter.'] },
]

function AnimatedTitle({ children }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    const parts = el.innerHTML.split(/(<br\s*\/?>)/i)
    let delay = 0
    el.innerHTML = parts.map((part) => {
      if (part.toLowerCase().startsWith('<br')) return part
      return [...part].map((char) => char === ' ' ? ' ' : `<span class="char" style="transition-delay:${delay++ * 0.035}s">${char}</span>`).join('')
    }).join('')
  }, [])
  return <h2 ref={ref} className="slide-title">{children}</h2>
}

function Header() {
  const names = ['Bronze', 'Marble', 'Fluid', 'Digital']
  const goTo = (event, index) => {
    event.preventDefault()
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight
    window.scrollTo({ top: maxScroll * NAV_TARGETS[index], behavior: 'smooth' })
  }
  return (
    <header className="main-header">
      <div className="brand">Laocoön</div>
      <nav className="header-nav" aria-label="Story navigation">
        {names.map((name, index) => <span className="nav-item" key={name}>
          <a className="nav-link" href={`#slide-${index + 1}`} onClick={(e) => goTo(e, index)}>{name}</a>
          {index < names.length - 1 && <span className="nav-dot" />}
        </span>)}
      </nav>
      <a href="mailto:hello@example.com" className="contact-btn">Contact <span className="btn-circle" /></a>
    </header>
  )
}

function Overlay() {
  return <>
    <div className="cursor-inner" /><div className="cursor-outer" />
    <div className="cinematic-container">
      <Header />
      {SLIDES.map((slide) => <section className={`slide ${slide.id === 1 ? 'active' : ''}`} id={`slide-${slide.id}`} key={slide.id}>
        <AnimatedTitle>{slide.title}</AnimatedTitle>
        {slide.id === 1 ? <div className="desc-row">{slide.descriptions.map((text, i) => <p className={`slide-desc col-${i + 1}`} key={text}>{text}</p>)}</div>
          : <p className="slide-desc">{slide.descriptions[0]}</p>}
      </section>)}
    </div>
    <div className="slide-image-mask" id="slide-2-img"><img src={`${ASSET_BASE_URL}/1.png`} alt="Editorial Concept" /></div>
    <div className="grid-horizontal-line" />
    <div className="grid-lines">
      {[0,1,2,3,4].map((line) => <div className={`grid-line ${line === 4 ? 'story-progress-container' : ''}`} key={line}>
        <div className="grid-dot" /><div className="grid-dot" />
        {line === 4 && <div className="story-dashes">{[1,2,3,4].map((n) => <div className="story-dash" key={n}><div className="story-dash-fill" id={`dash-fill-${n}`} /></div>)}</div>}
      </div>)}
    </div>
  </>
}

function Experience() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#000000')
    scene.fog = new THREE.FogExp2('#000000', 0.01)
    const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 100)
    camera.position.set(0, 0.2, 3)
    scene.add(camera)
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' })
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 2.2
    const clock = new THREE.Clock()
    const uniforms = { uTime: { value: 0 }, uResolution: { value: new THREE.Vector2(innerWidth, innerHeight) }, uMouse: { value: new THREE.Vector2() }, uScroll: { value: 0 } }
    const vertexShader = `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`
    const fragmentShader = `varying vec2 vUv;uniform float uTime;uniform vec2 uResolution;uniform vec2 uMouse;uniform float uScroll;void main(){vec2 uv=(gl_FragCoord.xy-.5*uResolution.xy)/uResolution.y;float aspect=uResolution.x/uResolution.y;float time=uTime*.08,scroll=uScroll;vec2 w=uv;float sd=scroll*5.;w.x+=sin(uv.y*2.5+time*.2+sd)*.35;w.y+=cos(uv.x*2.5-time*.15-sd*.8)*.35;w.x+=sin(uv.y*1.2-time*.1-sd*1.5)*.25;w.y+=cos(uv.x*1.2+time*.18+sd*1.2)*.25;w+=vec2(scroll*.04,-scroll*.02)+vec2(uMouse.x*aspect*.05,uMouse.y*.05);vec2 d1=vec2(cos(.6),sin(.6)),d2=vec2(cos(-.7),sin(-.7)),d3=vec2(cos(1.2),sin(1.2));float a=sin(dot(w,d1)*2.4+time),b=cos(dot(w,d2)*3.2-time*1.4+a*.4),c=sin(dot(w,d3)*4.+time*1.8+b*.5),f=a*.5+b*.35+c*.15;float wide=pow(max(0.,1.-abs(f-.1)),2.5),spec=pow(max(0.,1.-abs(f-.15)),8.),crest=wide*.5+spec*.9,t=smoothstep(0.,1.,scroll);vec3 shadow=mix(vec3(.001,.0006,.0004),vec3(.0004,.0006,.0012),t),body=mix(vec3(.05,.022,.008),vec3(.008,.02,.045),t),wave=mix(vec3(.085,.04,.015),vec3(.015,.035,.065),t),shine=mix(vec3(.45,.3,.18),vec3(.18,.35,.55),t),color=shadow;color=mix(color,body,smoothstep(-.6,.2,f));color=mix(color,wave,smoothstep(0.,.8,f));color+=shine*crest*1.4;color*=1.-dot(uv,uv)*.12;gl_FragColor=vec4(color,1.);}`
    const background = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms, depthWrite: false, depthTest: false }))
    background.position.z = -8; background.renderOrder = -10; camera.add(background)
    scene.add(new THREE.AmbientLight('#ffffff', 0.1))
    const key = new THREE.SpotLight('#ffffff', 18); key.position.set(4,6,3); key.angle=Math.PI/4; key.penumbra=.9; key.castShadow=true; key.shadow.mapSize.set(2048,2048); key.shadow.camera.near=1; key.shadow.camera.far=15; key.shadow.bias=-.001; scene.add(key)
    const rim = new THREE.DirectionalLight('#e3f2ff', 10); rim.position.set(-5,3,-4); scene.add(rim)
    const fill = new THREE.DirectionalLight('#fff3e6', .8); fill.position.set(-2,-4,2); scene.add(fill)
    const sparkCount = 450, sparkData = [], geometry = new THREE.BufferGeometry(), positions = new Float32Array(sparkCount * 3), colors = new Float32Array(sparkCount * 3)
    for(let i=0;i<sparkCount;i++){positions[i*3]=(Math.random()-.5)*6.5;positions[i*3+1]=(Math.random()-.5)*5-.5;positions[i*3+2]=(Math.random()-.5)*6.5;if(Math.random()<.6)colors.set([1,.4+Math.random()*.15,.05+Math.random()*.1],i*3);else colors.set([.55+Math.random()*.15,.82+Math.random()*.12,1],i*3);sparkData.push({x:(Math.random()-.5)*.4,y:.15+Math.random()*.3,z:(Math.random()-.5)*.4,s:.5+Math.random()*1.5,r:.05+Math.random()*.15,p:Math.random()*Math.PI*2})}
    geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));geometry.setAttribute('color',new THREE.BufferAttribute(colors,3))
    const tc=document.createElement('canvas');tc.width=tc.height=16;const ctx=tc.getContext('2d'),gradient=ctx.createRadialGradient(8,8,0,8,8,8);gradient.addColorStop(0,'#fff');gradient.addColorStop(.25,'rgba(255,255,255,.85)');gradient.addColorStop(.6,'rgba(255,255,255,.3)');gradient.addColorStop(1,'transparent');ctx.fillStyle=gradient;ctx.fillRect(0,0,16,16)
    const sparks=new THREE.Points(geometry,new THREE.PointsMaterial({size:.025,vertexColors:true,transparent:true,opacity:.85,blending:THREE.AdditiveBlending,depthWrite:false,map:new THREE.CanvasTexture(tc)}));scene.add(sparks)
    let modelPivot, mixer
    new GLTFLoader().load(`${ASSET_BASE_URL}/bronze_horse.glb`,(gltf)=>{const model=gltf.scene;modelPivot=new THREE.Group();scene.add(modelPivot);modelPivot.add(model);model.traverse((child)=>{if(child.isMesh){child.castShadow=child.receiveShadow=true;if(child.material){child.material.roughness=.42;child.material.metalness=.92;child.material.flatShading=false;if(child.material.map)child.material.map.anisotropy=16}}});if(gltf.animations.length){mixer=new THREE.AnimationMixer(model);gltf.animations.forEach((clip)=>mixer.clipAction(clip).play())}const size=new THREE.Box3().setFromObject(model).getSize(new THREE.Vector3());model.scale.setScalar(3.5/Math.max(size.x,size.y,size.z,.0001));model.updateMatrixWorld(true);model.position.sub(new THREE.Box3().setFromObject(model).getCenter(new THREE.Vector3()));modelPivot.position.y=-.4})
    let currentScroll=0,mouseX=0,mouseY=0,targetMouseX=0,targetMouseY=0,cursorX=innerWidth/2,cursorY=innerHeight/2,outerX=cursorX,outerY=cursorY,frame
    const onMouse=(e)=>{cursorX=e.clientX;cursorY=e.clientY;const inner=document.querySelector('.cursor-inner');inner.style.left=`${cursorX}px`;inner.style.top=`${cursorY}px`;targetMouseX=e.clientX/innerWidth*2-1;targetMouseY=e.clientY/innerHeight*2-1}
    const resize=()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,2));uniforms.uResolution.value.set(innerWidth,innerHeight)}
    const updateUI=(scroll)=>{document.querySelectorAll('.grid-dot').forEach((dot,i)=>{let speed=90+(i*55)%180;if(i%2===0)speed=-speed;let y=(i*17)%80+10+scroll*speed;dot.style.top=`${((y%100)+100)%100}%`});for(let i=1;i<=4;i++){let p=Math.max(0,Math.min(1,(scroll-(i-1)*.25)/.25));document.getElementById(`dash-fill-${i}`).style.height=`${p*100}%`}const active=(v,s,e)=>v>=s&&v<=e;document.getElementById('slide-1').classList.toggle('active',active(scroll,-.1,.12));const a2=active(scroll,.28,.4);document.getElementById('slide-2').classList.toggle('active',a2);document.getElementById('slide-2-img').classList.toggle('active',a2);document.getElementById('slide-3').classList.toggle('active',active(scroll,.56,.68));document.getElementById('slide-4').classList.toggle('active',active(scroll,.84,1.05))}
    const animate=()=>{frame=requestAnimationFrame(animate);const dt=clock.getDelta();if(mixer)mixer.update(dt);const max=document.documentElement.scrollHeight-innerHeight,target=max?scrollY/max:0;currentScroll+=(target-currentScroll)*.025;mouseX+=(targetMouseX-mouseX)*.05;mouseY+=(targetMouseY-mouseY)*.05;outerX+=(cursorX-outerX)*.2;outerY+=(cursorY-outerY)*.2;const outer=document.querySelector('.cursor-outer');outer.style.left=`${outerX}px`;outer.style.top=`${outerY}px`;if(modelPivot){modelPivot.rotation.y=mouseX*.25;modelPivot.rotation.x=mouseY*.15}const p=sparks.geometry.attributes.position.array,time=clock.getElapsedTime(),velocity=Math.abs(target-currentScroll),multiplier=1+velocity*9,turbulence=velocity*.8;for(let i=0;i<sparkCount;i++){const k=i*3,d=sparkData[i];p[k]+=d.x*dt*multiplier;p[k+1]+=d.y*dt*multiplier;p[k+2]+=d.z*dt*multiplier;const sway=d.r*(1+turbulence*4);p[k]+=Math.sin(time*d.s+d.p)*sway*dt;p[k+2]+=Math.cos(time*d.s+d.p)*sway*dt;if(p[k+1]>3||Math.abs(p[k])>3.5||Math.abs(p[k+2])>3.5){p[k+1]=-2.5;p[k]=(Math.random()-.5)*3;p[k+2]=(Math.random()-.5)*3}}sparks.geometry.attributes.position.needsUpdate=true;const phi=currentScroll*Math.PI*2,y=.35+Math.sin(currentScroll*Math.PI)*.8,radius=4.2-Math.sin(currentScroll*Math.PI)*.6,transition=Math.min(1,currentScroll/.28),ease=(Math.cos(transition*Math.PI)+1)*.5;camera.position.lerp(new THREE.Vector3(radius*Math.sin(phi),y,radius*Math.cos(phi)),.025);camera.lookAt(new THREE.Vector3(-.9*ease,-.15,0));uniforms.uTime.value=time;uniforms.uMouse.value.set(mouseX,-mouseY);uniforms.uScroll.value=currentScroll;updateUI(currentScroll);renderer.render(scene,camera)}
    window.addEventListener('mousemove',onMouse);window.addEventListener('resize',resize);resize();animate()
    return()=>{cancelAnimationFrame(frame);window.removeEventListener('mousemove',onMouse);window.removeEventListener('resize',resize);renderer.dispose();geometry.dispose()}
  },[])
  return <canvas ref={canvasRef} id="webgl" />
}

export default function App(){return <><Overlay/><Experience/></>}
