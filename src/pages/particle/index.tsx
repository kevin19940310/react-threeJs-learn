import { useEffect } from 'react';
import * as Three from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

function App() {

  useEffect(() => {
    // 初始化场景
    const Scene = new Three.Scene();

    // 添加世界坐标辅助器
    // const AxesHelper = new Three.AxesHelper(10);
    // Scene.add(AxesHelper);

    // 初始化相机(透视相机)
    const Camera = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10);
    // 设置相机位置
    Camera.position.set(0, 0, 5);
    Camera.lookAt(0, 0, 0);
    // 添加相机到场景中
    Scene.add(Camera);

    // 环境光
    const light = new Three.AmbientLight(0xffffff, 0.5); // soft white light
    Scene.add(light);

    const particlesGeometry = new Three.BufferGeometry();
    const count = 50000;

    // 设置缓冲区数组
    const positions = new Float32Array(count * 3);
    // 设置粒子顶点颜色
    const colors = new Float32Array(count * 3);
    // 设置顶点
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 80;
      colors[i] = Math.random();
    }
    particlesGeometry.setAttribute(
      "position",
      new Three.BufferAttribute(positions, 3)
    );
    particlesGeometry.setAttribute("color", new Three.BufferAttribute(colors, 3));

    // 设置点材质
    const pointsMaterial = new Three.PointsMaterial();
    pointsMaterial.size = 0.5;
    pointsMaterial.color.set(0xfff000);

    const points = new Three.Points(particlesGeometry, pointsMaterial);
    // 相机深度而衰减
    pointsMaterial.sizeAttenuation = true;
    // 载入纹理
    const textureLoader = new Three.TextureLoader();
    const texture = textureLoader.load("/public/img/xh.png");
    // 设置点材质纹理
    pointsMaterial.map = texture;
    pointsMaterial.alphaMap = texture;
    pointsMaterial.transparent = true;
    pointsMaterial.depthWrite = false;
    pointsMaterial.blending = Three.AdditiveBlending;
    // 设置启动顶点颜色
    pointsMaterial.vertexColors = true;
    Scene.add(points)

    // 初始化渲染器
    const render = new Three.WebGLRenderer({
      antialias: true, // 开启抗锯齿
    });
    render.setSize(window.innerWidth - 100, window.innerHeight);
    // 开启场景中的阴影贴图
    render.shadowMap.enabled = true;
    const dom = document.getElementById('app')
    if (dom) {
      dom.innerHTML = "";
      dom.appendChild(render.domElement);
    }

    // 添加轨道控制器
    const controls = new OrbitControls(Camera, render.domElement);
    // 设置带阻尼的惯性
    controls.enableDamping = true;
    // 设置阻尼系数
    controls.dampingFactor = 0.05;
    // 设置自动旋转
    // controls.autoRotate = true;


    const clock = new Three.Clock();
    function animate() {
      let time = clock.getElapsedTime();
      // points.rotation.x = time * 0.3;
      requestAnimationFrame(animate);
      // 使用渲染器，通过相机将场景渲染出来
      render.render(Scene, Camera);
    }
    animate();
    window.addEventListener('resize', () => {
      // 重制相机宽高比
      Camera.aspect = window.innerWidth / window.innerHeight;
      // 更新相机投影矩阵
      Camera.updateProjectionMatrix();
      // 重制渲染器宽高比
      render.setSize(window.innerWidth, window.innerHeight);
      // 设置
      render.setPixelRatio(window.devicePixelRatio);
    })
  }, [])

  return (
    <>
      <div id='app'></div>
    </>
  )
}

export default App
