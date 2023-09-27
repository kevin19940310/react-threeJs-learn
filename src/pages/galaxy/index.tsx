import * as THREE from 'three';
import { useEffect } from 'react';


import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const Galaxy = () => {
  const count = 1000;
  const params = {
    count: 10000,
    size: 0.1,
    radius: 5,
    branch: 12,
    color: '#ff6030',
    endColor: '#1b3984'
  }

  useEffect(() => {
    const scene = new THREE.Scene();

    // 创建相机
    const camera = new THREE.PerspectiveCamera(45, (window.innerWidth - 100) / window.innerHeight, 1, 1000)
    camera.position.set(10, 10, 0);
    camera.lookAt(0, 0, 0);
    scene.add(camera);

    // 添加世界坐标辅助器
    const AxesHelper = new THREE.AxesHelper(10);
    scene.add(AxesHelper);

    // 创建环境灯光
    const light = new THREE.AmbientLight(0x404040); // 柔和的白光
    scene.add(light);

    const generateGalaxy = (params) => {
      // 纹理加载器
      const loader = new THREE.TextureLoader();
      const map = loader.load('/public/img/1.png');
      // 创建点
      const pointGeometry = new THREE.BufferGeometry();
      const pointsMaterial = new THREE.PointsMaterial({
        // color: params.color,  // 颜色
        size: params.size,  // 点大小
        sizeAttenuation: true,  // 指定点的大小是否因相机深度而衰减
        depthWrite: false,  //渲染此材质是否对深度缓冲区有任何影响
        blending: THREE.AdditiveBlending, // 叠加
        map: map,  // 纹理贴图
        alphaMap: map,  // 透明贴图
        transparent: true,  // 是否允许透明
        vertexColors: true,  // 是否使用顶点着色
      });

      const vertices = new Float32Array(params.count * 3)
      const color = new Float32Array(params.count * 3);

      for (let index = 0; index < params.count * 3; index++) {

        // 当前点的角度
        const branchAngel = (index % params.branch) * ((2 * Math.PI) / params.branch);
        // 当前点距离圆心的距离
        const distance = Math.random() * params.radius * Math.pow(Math.random(), 3);

        // 随机散开
        const randomX = (Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance)) / 5;
        const randomY = (Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance)) / 5;
        const randomZ = (Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance)) / 5;

        const current = index * 3;

        vertices[current] = Math.cos(branchAngel + (distance * 0.2)) * distance + randomX;
        vertices[current + 1] = 0 + randomY
        vertices[current + 2] = Math.sin(branchAngel + (distance * 0.2)) * distance + randomZ;

        const centerColor = new THREE.Color(params.color);
        const endColor = new THREE.Color(params.endColor);
        const minColor = centerColor.clone();

        minColor.lerp(endColor, distance / params.radius);
        color[current] = minColor.r;
        color[current + 1] = minColor.g;
        color[current + 2] = minColor.b;

      }
      pointGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      pointGeometry.setAttribute('color', new THREE.Float32BufferAttribute(color, 3));
      const points = new THREE.Points(pointGeometry, pointsMaterial);
      scene.add(points);
      return points
    }

    const points = generateGalaxy(params);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth - 100, window.innerHeight);
    const dom = document.getElementById('app');
    if (dom) {
      dom.innerHTML = '';
      dom.appendChild(renderer.domElement);
    }

    // 轨道控制器
    const controls = new OrbitControls(camera, renderer.domElement);

    const clock = new THREE.Clock();
    function animate() {
      let time = clock.getElapsedTime();
      requestAnimationFrame(animate);
      points.rotation.y = time * 0.5;
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

export default Galaxy;