import * as THREE from 'three';
import { useEffect } from 'react';


import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const Shader = () => {
  const params = {
  }

  useEffect(() => {
    const scene = new THREE.Scene();

    // 创建相机
    const camera = new THREE.PerspectiveCamera(45, (window.innerWidth - 100) / window.innerHeight, 1, 1000)
    camera.position.set(5, 0, 5);
    camera.lookAt(0, 0, 0);
    scene.add(camera);

    // 添加世界坐标辅助器
    const AxesHelper = new THREE.AxesHelper(10);
    scene.add(AxesHelper);

    // 创建环境灯光
    const light = new THREE.AmbientLight(0x404040); // 柔和的白光
    scene.add(light);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth - 100, window.innerHeight);
    const dom = document.getElementById('app');
    if (dom) {
      dom.innerHTML = '';
      dom.appendChild(renderer.domElement);
    }

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('/src/pages/shader/ca.jpeg');
    console.log(Math.min(new THREE.Color('#5588AA'), 1));


    const planeGeometry = new THREE.PlaneGeometry(1, 1, 64, 64);
    const shaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: {
          value: 0
        },
        uTexture: {
          value: texture
        }
      },
      vertexShader: `
        precision lowp float;
        varying vec2 vUv;
        varying float vElevation;
        uniform float uTime;
        void main() {
            vUv = uv;
            vec4 modelPosition = modelMatrix * vec4( position, 1.0 );
            modelPosition.z = sin((modelPosition.x+uTime) * 10.0)*0.05 ;
            modelPosition.z += sin((modelPosition.y+uTime)  * 10.0)*0.05 ;
            vElevation = modelPosition.z;
            gl_Position = projectionMatrix * viewMatrix * modelPosition;
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        varying float vElevation;
        uniform sampler2D uTexture;
        void main(){
            float height = vElevation + 0.05 * 20.0;
            vec4 textureColor = texture2D(uTexture, vUv);
            textureColor.rgb *= height;
            gl_FragColor = textureColor;
        }
      `,
      side: THREE.DoubleSide,
    });
    const plane = new THREE.Mesh(planeGeometry, shaderMaterial);
    scene.add(plane);


    // 轨道控制器
    const controls = new OrbitControls(camera, renderer.domElement);

    const clock = new THREE.Clock();
    function animate() {
      let time = clock.getElapsedTime();
      shaderMaterial.uniforms.uTime.value = time;
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
      // 重制相机宽高比
      camera.aspect = (window.innerWidth - 100) / window.innerHeight;
      // 更新相机投影矩阵
      camera.updateProjectionMatrix();
      // 重制渲染器宽高比
      renderer.setSize(window.innerWidth - 100, window.innerHeight);
      // 设置
      renderer.setPixelRatio(window.devicePixelRatio);
    })

  }, [])

  return <div id="app"></div>
}

export default Shader;