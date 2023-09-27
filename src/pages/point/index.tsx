import { useEffect } from 'react';
import * as Three from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// 灯光阴影
// 1、材质要满足能够对光照有反应
// 2、设置渲染器开启阴影的计算 renderer.shadowMap.enabled = true;
// 3、设置光照投射阴影 directionalLight.castShadow = true;
// 4、设置物体投射阴影 sphere.castShadow = true;
// 5、设置物体接收阴影 plane.receiveShadow = true;

function App() {

  useEffect(() => {
    // 初始化场景
    const Scene = new Three.Scene();

    // 添加世界坐标辅助器
    // const AxesHelper = new Three.AxesHelper(10);
    // Scene.add(AxesHelper);

    // 初始化相机(透视相机)
    const Camera = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    // 设置相机位置
    Camera.position.set(0, 0, 10);
    Camera.lookAt(0, 0, 0);
    // 添加相机到场景中
    Scene.add(Camera);

    // 环境光
    const light = new Three.AmbientLight(0xffffff, 0.5); // soft white light
    Scene.add(light);

    // 创建球
    const sphereGeometry = new Three.SphereGeometry(1, 20, 20);
    // 创建材质
    const sphereMaterial = new Three.MeshStandardMaterial();
    // 创建球体
    const sphere = new Three.Mesh(sphereGeometry, sphereMaterial);
    Scene.add(sphere);

    // 创建平面
    const planeGeometry = new Three.PlaneBufferGeometry(50, 50);
    const plane = new Three.Mesh(planeGeometry, sphereMaterial);
    plane.position.set(0, -1, 0);
    plane.rotation.x = -Math.PI / 2;
    // 接收阴影
    plane.receiveShadow = true;
    Scene.add(plane);

    const smallBall = new Three.Mesh(
      new Three.SphereBufferGeometry(0.1, 20, 20),
      new Three.MeshBasicMaterial({ color: 0xff0000 })
    );
    smallBall.position.set(1, 1, 1);
    //直线光源
    const pointLight = new Three.PointLight(0xff0000, 1);
    // pointLight.position.set(2, 2, 2);
    pointLight.castShadow = true;

    // 设置阴影贴图模糊度
    pointLight.shadow.radius = 20;
    // 设置阴影贴图的分辨率
    pointLight.shadow.mapSize.set(512, 512);
    pointLight.decay = 0;

    // 设置透视相机的属性
    smallBall.add(pointLight);
    Scene.add(smallBall);

    // 初始化渲染器
    const render = new Three.WebGLRenderer({
      antialias: true, // 开启抗锯齿
    });
    render.shadowMap.enabled = true;
    render.setSize(window.innerWidth - 100, window.innerHeight);
    // 开启场景中的阴影贴图
    render.shadowMap.enabled = true;
    render.physicallyCorrectLights = true;
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

    // 设置时钟
    const clock = new Three.Clock();
    function animate() {
      let time = clock.getElapsedTime();
      smallBall.position.x = Math.sin(time) * 3;
      smallBall.position.z = Math.cos(time) * 3;
      smallBall.position.y = 2 + Math.sin(time * 10) / 2;
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
