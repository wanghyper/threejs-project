import {useEffect} from 'react';
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import ViewShadPass from './ViewShadPass';
import earthPng from './Earth.png';
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
        var point = new THREE.PointLight(0xff00ff);
        point.position.set(400, -100, 300); //点光源位置
        scene.add(point); //点光源添加到场景中
        var pointLightHelper = new THREE.PointLightHelper(point);
        scene.add(pointLightHelper);
        //环境光
        var ambient = new THREE.AmbientLight(0x888888);
        scene.add(ambient);
        /**
         * 相机设置
         */
        var width = windowWidth; //窗口宽度
        var height = windowHeight; //窗口高度
        var k = width / height; //窗口宽高比
        var s = 150; //三维场景显示范围控制系数，系数越大，显示的范围越大
        //创建相机对象
        // var camera = new THREE.PerspectiveCamera(-s * k, s * k, s, -s, 1, 2000);
        var camera = new THREE.PerspectiveCamera();
        camera.position.set(500, 500, 900); //设置相机位置
        var fov = 50;
        var aspectRatio = windowWidth / windowHeight;
        var near = 0.01;
        var far = 500;
        var camera1 = new THREE.PerspectiveCamera(fov, aspectRatio, near, far);
        camera1.position.set(240, 300, 200); //设置相机位置
        scene.add(camera1);
        camera1.lookAt(new THREE.Vector3(200, 0, 200));

        /**
         * 创建一个球体，位置为相机顶点
         */
        var point1 = new THREE.SphereGeometry(10, 25, 25); //球体
        var pointmesh = new THREE.Mesh(point1, new THREE.MeshBasicMaterial({color: 0xffff00})); //网格模型对象Mesh
        pointmesh.position.set(...camera1.position); //网格模型对象的位置
        scene.add(pointmesh); //网格模型添加到场景中

        // scene.add(new THREE.CameraHelper(camera));
        var helper = new THREE.CameraHelper(camera1);
        scene.add(helper);
        camera.lookAt(scene.position); //设置相机方向(指向的场景对象)
        const cameraHelper = new THREE.CameraHelper(camera1);
        scene.add(cameraHelper);

        camera1.updateMatrix();
        camera1.updateMatrixWorld();
        // var frustum = new THREE.Frustum();
        // frustum.setFromProjectionMatrix(
        //     new THREE.Matrix4().multiplyMatrices(camera1.projectionMatrix, camera1.matrixWorldInverse)
        // );
        var top = near * Math.tan(((Math.PI / 180.0) * fov) / 2);
        var bottom = -top;
        var right = aspectRatio * top;
        var left = -right;
        // const line = createFrustum(right, left, top, bottom, near, far);

        // scene.add(line);

        /**
         * 创建网格模型
         */
        var geometry = new THREE.BoxGeometry(20, 20, 20); //立方体
        // var geometry = new THREE.PlaneGeometry(400, 400); //矩形平面
        // var geometry = new THREE.SphereGeometry(100, 25, 25); //球体
        // // TextureLoader创建一个纹理加载器对象，可以加载图片作为几何体纹理
        // var textureLoader = new THREE.TextureLoader();
        // // 加载纹理贴图
        // var texture = textureLoader.load(earthPng);
        // var material = new THREE.MeshPhongMaterial({
        //     map: texture, // 普通颜色纹理贴图
        // });
        // //材质对象Material
        // var mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
        // mesh.position.set(0, -100, 0);
        // scene.add(mesh); //网格模型添加到场景中
        const colors = [0xff0000, 0x00ff00, 0x0000ff];
        for (let i = 0; i < 300; i++) {
            const layer = i % 3;
            console.log;
            const object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({color: colors[layer]}));

            object.position.x = Math.random() * 800 - 400;
            object.position.y = Math.random() * 800 - 400;
            object.position.z = Math.random() * 800 - 400;

            object.rotation.x = Math.random() * 2 * Math.PI;
            object.rotation.y = Math.random() * 2 * Math.PI;
            object.rotation.z = Math.random() * 2 * Math.PI;

            object.scale.x = Math.random() + 0.5;
            object.scale.y = Math.random() + 0.5;
            object.scale.z = Math.random() + 0.5;

            scene.add(object);
        }

        /**
         * 创建渲染器对象
         */
        var renderer = new THREE.WebGLRenderer();
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
        controls2.addEventListener('change', e => {
            pointmesh.position.set(...camera1.position);
        });
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
