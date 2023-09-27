import { useEffect } from 'react';
import * as Three from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// hdr加载器
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

// 导入lil.gui
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

function App() {

  useEffect(() => {
    // 初始化场景
    const Scene = new Three.Scene();

    // 添加世界坐标辅助器
    const AxesHelper = new Three.AxesHelper(10);
    Scene.add(AxesHelper);

    // 初始化相机(透视相机)
    const Camera = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    // 设置相机位置
    Camera.position.set(2, 2, 5);
    Camera.lookAt(0, 0, 0);
    // 添加相机到场景中
    Scene.add(Camera);

    // 添加物体
    // 创建球几何体
    const sphereGeometry = new Three.SphereGeometry(1, 32, 32);
    // 创建球材质
    const sphereMaterial = new Three.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.05,
      opacity: 1,
      transmission: 0.9,
      thickness: 0.1,
      // iridescence: 1,
      // reflectivity: 1,
      // iridescenceIOR: 1.3,
      // iridescenceThicknessRange: [100, 400],
    });
    // 创建球体
    const sphere = new Three.Mesh(sphereGeometry, sphereMaterial);
    Scene.add(sphere);

    // rgbeLoader
    const rgbeLoader = new RGBELoader();

    // 环境贴图
    rgbeLoader.load('/public/hdr/umhlanga_sunrise_4k.hdr', (envMap) => {

      // 设置球形映射
      envMap.mapping = Three.EquirectangularReflectionMapping;
      // 设置环境贴图
      Scene.background = envMap;
      // 设置场景环境贴图
      Scene.environment = envMap;
    })


    // 初始化渲染器
    const render = new Three.WebGLRenderer({
      antialias: true, // 开启抗锯齿
    });
    render.shadowMap.enabled = true;
    render.setSize(window.innerWidth - 100, window.innerHeight);
    // render.shadowMap.enabled = true;
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
    controls.autoRotate = true;

    function animate() {
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
    // 创建GUI
    const gui = new GUI();

    // gui 控制iridescence
    gui.add(sphereMaterial, "iridescence", 0, 1).name("彩虹色");
    // gui 控制reflectivity
    gui.add(sphereMaterial, "reflectivity", 0, 1).name("反射率");
    // gui 控制iridescenceIOR
    gui.add(sphereMaterial, "iridescenceIOR", 0, 3).name("彩虹色折射率");
    // gui 控制iridescenceThicknessRange

    let iridescenceThickness = {
      min: 100,
      max: 400,
    };
    gui
      .add(iridescenceThickness, "min", 0, 1000)
      .name("彩虹色最小厚度")
      .onChange(() => {
        sphereMaterial.iridescenceThicknessRange[0] = iridescenceThickness.min;
      });
    gui
      .add(iridescenceThickness, "max", 0, 1000)
      .name("彩虹色最大厚度")
      .onChange(() => {
        sphereMaterial.iridescenceThicknessRange[1] = iridescenceThickness.max;
      });


  }, [])

  return (
    <>
      <div id='app'></div>
    </>
  )
}

export default App
