import { useEffect } from 'react';
import * as Three from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';

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

    // 加载贴图
    const uvTexture = new Three.TextureLoader().load("/src/pages/uv/uv_grid_opengl.jpg");

    // 添加物体
    const planeGeometry = new Three.PlaneGeometry(1, 1);
    const PlanMaterial = new Three.MeshBasicMaterial({
      map: uvTexture
    });
    const plane = new Three.Mesh(planeGeometry, PlanMaterial);
    plane.position.set(0.5, 0.5, 0);
    Scene.add(plane);

    // 设置uv坐标
    // const uv = new Float32Array([
    //   0, 0, 1, 0, 1, 1, 0, 1
    // ])
    // planeGeometry.setAttribute('uv', new Three.BufferAttribute(uv, 2));

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



  }, [])

  return (
    <>
      <div id='app'></div>
    </>
  )
}

export default App
