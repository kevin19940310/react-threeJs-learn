import { useEffect } from 'react';
import * as Three from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
// hdr加载器
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

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

    //纹理加载器
    const textureLoader = new Three.TextureLoader();
    // 加载纹理
    const texture = textureLoader.load('/src/pages/texture/watercover/CityNewYork002_COL_VAR1_1K.png');

    // 颜色空间
    texture.colorSpace = Three.SRGBColorSpace;
    //加载ao贴图
    const aoMap = textureLoader.load('/src/pages/texture/watercover/CityNewYork002_AO_1K.jpg');
    // 加载透明度贴图
    const alphnMap = textureLoader.load('/src/pages/texture/height.jpg');
    // 光照贴图
    const lightMap = textureLoader.load('/src/pages/texture/colors.png');
    // 高光贴图
    const specularMap = textureLoader.load('/src/pages/texture/watercover/CityNewYork002_GLOSS_1K.jpg');
    // rgbeLoader
    const rgbeLoader = new RGBELoader();

    // 环境贴图
    rgbeLoader.load('/src/pages/texture/ska.hdr', (envMap) => {

      // 设置球形映射
      envMap.mapping = Three.EquirectangularReflectionMapping;
      // 设置环境贴图
      Scene.background = envMap;
      // 设置场景环境贴图
      Scene.environment = envMap;
      // 设置平面环境贴图
      planeMaterial.envMap = envMap;
    })
    // 添加物体
    const planeGeometry = new Three.PlaneGeometry();
    const planeMaterial = new Three.MeshBasicMaterial({
      color: 0xffffff,
      map: texture,
      // 允许透明
      transparent: true,
      // 设置ao贴图
      aoMap: aoMap,
      // 透明度贴图
      // alphaMap: alphnMap,
      // 光照贴图
      lightMap: lightMap,
      // 反射强度
      // reflectivity: 0.7
      // 高光贴图
      specularMap: specularMap
    });
    const plane = new Three.Mesh(planeGeometry, planeMaterial);
    Scene.add(plane);

    // 初始化渲染器
    const render = new Three.WebGL1Renderer();
    render.setSize(window.innerWidth - 100, window.innerHeight);
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

    function animate() {
      requestAnimationFrame(animate);
      controls.update();
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

    const gui = new GUI();

    gui.add(planeMaterial, "aoMapIntensity", 0, 1).name('ao强度')
    // gui.add(planeMaterial, "alphnMapIntensity", 0, 1).name('透明度强度')

  }, [])

  return (
    <>
      <div id='app'></div>
    </>
  )
}

export default App
