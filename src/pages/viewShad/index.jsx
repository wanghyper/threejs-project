import {useEffect} from 'react';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js';
import ViewShadPass from './ViewShadPass';
import {GUI} from 'three/addons/libs/lil-gui.module.min.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
export default function ViewShad() {
    useEffect(() => {
        /**
         * 创建场景对象Scene
         */
        var scene = new THREE.Scene();
        var windowWidth = window.innerWidth / 2;
        var windowHeight = window.innerHeight;
        /**
         * 光源设置
         */
        //点光源
        // var point = new THREE.PointLight(0xffffff);
        // point.position.set(400, -100, 300); //点光源位置
        // scene.add(point); //点光源添加到场景中
        // var pointLightHelper = new THREE.PointLightHelper(point);
        // scene.add(pointLightHelper);
        //环境光
        var ambient = new THREE.AmbientLight(0xdddddd);
        scene.add(ambient);
        /**
         * 相机设置
         */
        var width = windowWidth; //窗口宽度
        var height = windowHeight; //窗口高度
        //创建相机对象
        var camera = new THREE.PerspectiveCamera();
        // camera.position.set(500, 500, 900); //设置相机位置
        camera.position.set(-10, 10, 1.25);
        var fov = 50;
        var aspectRatio = windowWidth / windowHeight;
        var near = 0.01;
        var far = 30;
        var camera1 = new THREE.PerspectiveCamera(fov, aspectRatio, near, far);
        // camera1.position.set(240, 300, 200); //设置相机位置
        camera1.position.set(-10, 10, 1.25);
        scene.add(camera1);
        camera1.lookAt(new THREE.Vector3(200, 0, 200));

        /**
         * 创建一个球体，位置为相机顶点
         */
        // var point1 = new THREE.SphereGeometry(10, 25, 25); //球体
        // var pointmesh = new THREE.Mesh(point1, new THREE.MeshBasicMaterial({color: 0xffff00})); //网格模型对象Mesh
        // pointmesh.position.set(...camera1.position); //网格模型对象的位置
        // scene.add(pointmesh); //网格模型添加到场景中

        camera.lookAt(scene.position); //设置相机方向(指向的场景对象)
        const cameraHelper = new THREE.CameraHelper(camera1);
        scene.add(cameraHelper);

        /**
         * 创建网格模型
         */
        // var geometry = new THREE.BoxGeometry(30, 30, 30); //立方体
        // // var geometry = new THREE.PlaneGeometry(400, 400); //矩形平面
        // // var geometry = new THREE.SphereGeometry(10, 25, 25); //球体
        // const colors = [0xff0000, 0x00ff00, 0x0000ff];
        // for (let i = 0; i < 30; i++) {
        //     const layer = i % 3;
        //     const object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({color: colors[layer]}));

        //     object.position.x = layer * 50  - 400;
        //     object.position.y = layer * 50  - 400;
        //     object.position.z = layer * 50  - 400;

        //     // object.rotation.x = i * 10 + 2 * Math.PI;
        //     // object.rotation.y = i * 10 + 2 * Math.PI;
        //     // object.rotation.z = i * 10 + 2 * Math.PI;
        //     scene.add(object);
        // }
        new GLTFLoader().load('https://threejs.org/examples/models/gltf/SheenChair.glb', function (gltf) {
            scene.add(gltf.scene);
            gltf.scene.scale.set(10, 10, 10);
        });
        /**
         * 创建渲染器对象
         */
        var renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(width, height); //设置渲染区域尺寸
        renderer.setClearColor(0xb9d3ff, 1); //设置背景颜色
        document.getElementById('container1').appendChild(renderer.domElement); //body元素中插入canvas对象
        var renderer2 = new THREE.WebGLRenderer();
        renderer2.setPixelRatio(window.devicePixelRatio);
        renderer2.setSize(width, height); //设置渲染区域尺寸
        renderer2.setClearColor(0xb9d3ff, 1); //设置背景颜色
        document.getElementById('container2').appendChild(renderer2.domElement); //body元素中插入canvas对象

        // 后期处理
        const composer = new EffectComposer(renderer);
        const renderPass = new RenderPass(scene, camera);
        composer.addPass(renderPass);
        const dpr = renderer.getPixelRatio();
        const viewShadPass = new ViewShadPass(
            scene,
            camera,
            camera1,
            new THREE.Vector2(windowWidth * dpr, windowHeight * dpr)
        );
        composer.addPass(viewShadPass);
        // 渲染函数
        function render() {
            composer.render(); //执行渲染操作
            renderer2.render(scene, camera1); //执行渲染操作
            requestAnimationFrame(render); //请求再次执行渲染函数render，渲染下一帧
        }
        render();
        //创建控件对象  相机对象camera作为参数   控件可以监听鼠标的变化，改变相机对象的属性
        var controls = new OrbitControls(camera, renderer.domElement);
        var controls2 = new OrbitControls(camera1, renderer2.domElement);

        // UI控件
        const parameters = {
            set camera_near(value) {
                camera1.near = value;
                camera1.updateProjectionMatrix();
                cameraHelper.update();
            },
            get camera_near() {
                return camera1.near;
            },
            set camera_far(value) {
                camera1.far = value;
                camera1.updateProjectionMatrix();
                cameraHelper.update();
            },
            get camera_far() {
                return camera1.far;
            },
            set camera_fov(value) {
                camera1.fov = value;
                camera1.updateProjectionMatrix();
                cameraHelper.update();
            },
            get camera_fov() {
                return camera1.fov;
            },
            set u_distance(value) {
                viewShadPass.material.uniforms.u_distance.value = value;
            },
            get u_distance() {
                return viewShadPass.material.uniforms.u_distance.value;
            },
        };

        const gui = new GUI();
        gui.add(parameters, 'camera_near', 1, 100, 1);
        gui.add(parameters, 'camera_far', 100, 5000, 1);
        gui.add(parameters, 'camera_fov', 1, 100, 1);
        gui.add(parameters, 'u_distance', 1, 1000, 1);
    }, []);

    return (
        <div className="container" style={{display: 'flex'}}>
            <div id="container1" style={{height: '100%', width: '50%'}}></div>
            <div id="container2" style={{height: '100%', width: '50%'}}></div>
        </div>
    );
}
function createFrustum(left, right, top, bottom, near, far) {
    /* returns a THREE.Line object representing a frustum, like a
     * camera. Position is at the origin, and args are just like in
     * OpenGL's glFrustum(). The near plane is drawn with red lines, and
     * the far with green, and blue lines connecting. */
    // I loosely modeled this code on the CameraHelper
    var geometry = new THREE.BufferGeometry();
    var material = new THREE.LineBasicMaterial({color: 0xffffff, linewidth: 10, vertexColors: true});

    // ratio by which far coordinates are larger than near
    var r = far / near;
    // three letter abbrevs: l/r for left/right, t/b for top/bottom, n/f for near/far
    var pointMap = {
        ltn: new THREE.Vector3(left, top, near),
        lbn: new THREE.Vector3(left, bottom, near),
        rbn: new THREE.Vector3(right, bottom, near),
        rtn: new THREE.Vector3(right, top, near),
        ltf: new THREE.Vector3(r * left, r * top, far),
        lbf: new THREE.Vector3(r * left, r * bottom, far),
        rbf: new THREE.Vector3(r * right, r * bottom, far),
        rtf: new THREE.Vector3(r * right, r * top, far),
    };
    var colors = [];
    var positons = [];
    function addLine(a, b, color) {
        // adds a line from a to b in given color
        addPoint(a, color);
        addPoint(b, color);
    }

    function addPoint(id, color) {
        var v = new THREE.Vector3();
        v.copy(pointMap[id]);
        positons.push(v);
        var _color = new THREE.Color(color);
        colors.push(_color.r, _color.g, _color.b);
    }

    addLine('ltn', 'lbn', 0xff0000);
    addLine('lbn', 'rbn', 0xff0000);
    addLine('rbn', 'rtn', 0xff0000);
    addLine('rtn', 'ltn', 0xff0000);

    addLine('ltf', 'lbf', 0x00ff00);
    addLine('lbf', 'rbf', 0x00ff00);
    addLine('rbf', 'rtf', 0x00ff00);
    addLine('rtf', 'ltf', 0x00ff00);

    addLine('ltf', 'ltn', 0x0000ff);
    addLine('lbf', 'lbn', 0x0000ff);
    addLine('rbf', 'rbn', 0x0000ff);
    addLine('rtf', 'rtn', 0x0000ff);

    geometry.setFromPoints(positons);
    // geometry.setAttribute('position', new THREE.Float32BufferAttribute(positons, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.computeBoundingSphere();
    // var line = new THREE.Line( geometry, material, THREE.LinePieces );
    var line = new THREE.Line(geometry, material);
    return line;
}
