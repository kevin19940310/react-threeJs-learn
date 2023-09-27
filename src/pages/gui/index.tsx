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

    // 添加物体
    const cubeBox = new Three.BoxGeometry(1, 1, 1);
    const CubeMaterial = new Three.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
    const Cube = new Three.Mesh(cubeBox, CubeMaterial);
    Cube.position.set(0, 0, 0);
    Scene.add(Cube);

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

      // 旋转
      Cube.rotation.x += 0.01;
      Cube.rotation.y += 0.01;


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


    // 切换全屏显示
    let envObject = {
      FullScreen: function () {
        document.body.requestFullscreen();
      },
      ExitFullScreen: function () {
        document.exitFullscreen();
      }
    }

    gui.add(envObject, 'FullScreen').name('全屏');
    gui.add(envObject, 'ExitFullScreen').name('退出全屏');

    const folder = gui.addFolder('立方体位置')
    folder.add(Cube.position, 'x', -5, 5).name('x轴');
    folder.add(Cube.position, 'y', -5, 5).name('y轴');
    folder.add(Cube.position, 'z', -5, 5).name('z轴');

    const scale = gui.addFolder('立方体缩放');
    scale.add(Cube.scale, 'x', 0.1, 1).name('x轴');
    scale.add(Cube.scale, 'y', 0.1, 1).name('y轴');
    scale.add(Cube.scale, 'z', 0.1, 1).name('z轴');

    gui.add(CubeMaterial, 'wireframe').name('线框模式')


  }, [])

  return (
    <>
      <div id='app'></div>
    </>
  )
}

export default App
