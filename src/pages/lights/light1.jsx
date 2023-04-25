import {useEffect} from 'react';
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import vert from './light1_vert.glsl'
import frag from './light1_frag.glsl'
import earthPng from './Earth.png'
export default function Light() {
    useEffect(() => {
        /**
         * 创建场景对象Scene
         */
        var scene = new THREE.Scene();

        /**
         * 光源设置
         */
        //点光源
        var point = new THREE.PointLight(0xffffff);
        point.position.set(400, 200, 300); //点光源位置
        scene.add(point); //点光源添加到场景中
        //环境光
        var ambient = new THREE.AmbientLight(0x888888);
        scene.add(ambient);
        /**
         * 相机设置
         */
        var width = window.innerWidth; //窗口宽度
        var height = window.innerHeight; //窗口高度
        var k = width / height; //窗口宽高比
        var s = 150; //三维场景显示范围控制系数，系数越大，显示的范围越大
        //创建相机对象
        var camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
        camera.position.set(200, 300, 200); //设置相机位置
        // camera.position.set(0, 0, 200); //设置相机位置
        camera.lookAt(scene.position); //设置相机方向(指向的场景对象)

        /**
         * 创建网格模型
         */
        // var geometry = new THREE.BoxGeometry(100, 100, 100); //立方体
        // var geometry = new THREE.PlaneGeometry(400, 400); //矩形平面
        var geometry = new THREE.SphereGeometry(100, 25, 25); //球体
        // TextureLoader创建一个纹理加载器对象，可以加载图片作为几何体纹理
        var textureLoader = new THREE.TextureLoader();
        // 加载纹理贴图
        var texture = textureLoader.load(earthPng);
        var material = new THREE.MeshPhongMaterial({
            map: texture, // 普通颜色纹理贴图
        }); //材质对象Material
        var mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
        scene.add(mesh); //网格模型添加到场景中
        var uniforms;
        uniforms = {
            uSampler: {
                //采样的图片
                value: texture,
            },
            uTextureSample: {
                //采样选择 1为贴图 2为不带贴图
                value: 1,
            },
            uKd: {
                value: new THREE.Vector3(0.05, 0.05, 0.05), //控制满反射系数
            },
            uKs: {
                value: new THREE.Vector3(0.5, 0.5, 0.5), //控制高光系数
            },
            lightPosition: {
                //光源位置
                value: point.position,
            },
            uLightIntensity: {
                value: 1155.0, //光照强度
            },
        };
        var material_raw = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vert,
            fragmentShader: frag,
        });

        var mesh_raw = new THREE.Mesh(geometry, material_raw);
        mesh_raw.position.x = mesh.position.x + 100 * 2;
        mesh_raw.position.z = mesh.position.z + 100 * 2;
        scene.add(mesh_raw);

        /**
         * 创建渲染器对象
         */
        var renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height); //设置渲染区域尺寸
        renderer.setClearColor(0xb9d3ff, 1); //设置背景颜色
        document.body.appendChild(renderer.domElement); //body元素中插入canvas对象

        // 渲染函数
        function render() {
            renderer.render(scene, camera); //执行渲染操作
            requestAnimationFrame(render); //请求再次执行渲染函数render，渲染下一帧
        }
        render();
        //创建控件对象  相机对象camera作为参数   控件可以监听鼠标的变化，改变相机对象的属性
        var controls = new OrbitControls(camera, renderer.domElement);
        //监听鼠标事件，触发渲染函数，更新canvas画布渲染效果
        // controls.addEventListener('change', render);
    }, []);

    return <div id="container"></div>;
}
