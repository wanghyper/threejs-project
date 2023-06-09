import {useEffect, useState} from 'react';
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';

export default function Light() {
    useEffect(() => {
        let stats = new Stats(); // 性能监控器，用来查看Three.js渲染帧率

        // 创建div
        let container = document.createElement('div');
        document.body.appendChild(container);

        // 创建场景
        let scene = new THREE.Scene();

        // 创建相机
        let camera = new THREE.PerspectiveCamera( // 透视投影相机
            40, // 视场，表示能够看到的角度范围
            window.innerWidth / window.innerHeight, // 渲染窗口的长宽比，设置为浏览器窗口的长宽比
            0.1, // 从距离相机多远的位置开始渲染
            2000 // 距离相机多远的位置截止渲染
        );
        camera.position.set(-10, 10, 40); // 设置相机位置

        // 创建渲染器
        let renderer = new THREE.WebGLRenderer({
            antialias: true, // 是否执行抗锯齿
        });
        renderer.setPixelRatio(window.devicePixelRatio); // 设置设备像素比率。通常用于HiDPI设备，以防止输出画布模糊。
        renderer.setSize(window.innerWidth, window.innerHeight); // 设置渲染器大小
        renderer.shadowMap.enabled = true;
        container.appendChild(renderer.domElement);

        // 创建控制器
        let controls = new OrbitControls(camera, renderer.domElement);

        // 创建物体
        const geometry = new THREE.BoxGeometry(4, 4, 4); // 生成几何体
        const material = new THREE.MeshLambertMaterial({
            // 生成材质
            color: 0x00ff00,
        });
        const mesh = new THREE.Mesh(geometry, material); // 生成网格
        mesh.castShadow = true; // 对象是否渲染到阴影贴图中，默认值为false
        mesh.position.set(0, 3, 0); // 设置物体位置
        scene.add(mesh); // 添加到场景中

        // 创建平面
        const planeGeometry = new THREE.PlaneGeometry(300, 300); // 生成平面几何
        const planeMaterial = new THREE.MeshLambertMaterial({
            // 生成材质
            color: 0xcccc3c,
        });
        const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial); // 生成平面网格
        planeMesh.receiveShadow = true; // 设置平面网格为接受阴影的投影面
        planeMesh.rotation.x = -Math.PI / 2; //绕X轴旋转90度
        scene.add(planeMesh); // 添加到场景中
        let [x,y,z] = [-40, 40, 20]
        // 创建平行光源
        const light = new THREE.DirectionalLight(0xffffff, 1); // 平行光，颜色为白色，强度为1
        light.position.set(x, y, z); // 设置灯源位置
        light.castShadow = true; // 允许生成阴影
        light.target = mesh;
        scene.add(light); // 添加到场景中

        animate();

        function animate() {
            requestAnimationFrame(animate);
            stats.begin();
            // light.position.set(x, y++, z++); 
            renderer.render(scene, camera);
            stats.end();
        }
    }, []);

    return <div id="container"></div>;
}
