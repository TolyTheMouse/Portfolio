function createBabylonLargeInstance(fileName, canvasId) {
    const canvas = document.getElementById(canvasId);
    
    
    function setCanvasSize() {
        canvas.style.width = '100%'
    }

    function loadBabylonScript() {
        var babylonScript = document.createElement('script');
        babylonScript.src = 'https://cdn.babylonjs.com/babylon.js';
        babylonScript.onload = function () {
            // Babylon.js is now loaded, load loaders
            var loadersScript = document.createElement('script');
            loadersScript.src = 'https://cdn.babylonjs.com/loaders/babylonjs.loaders.min.js';
            loadersScript.onload = function () {
                // Babylon.js and loaders are loaded, continue with your script
                startBabylonScript();
            };
            document.head.appendChild(loadersScript);
        };
        document.head.appendChild(babylonScript);
    }

    function startBabylonScript() {
        const engine = new BABYLON.Engine(canvas, true);

        const createScene = function () {
            const scene = new BABYLON.Scene(engine);

            const targetPoint = new BABYLON.Vector3(0, 0.8, 0);

            const camera = new BABYLON.ArcRotateCamera("camera1", Math.PI / 2, Math.PI / 3, 20, targetPoint, scene);
            camera.attachControl(canvas, true);

            camera.wheelPrecision = 50; // Adjust this value if needed
            camera.radius = 10;

            const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 5, 0), scene);
            light.intensity = 0.7;

            const mesh = BABYLON.SceneLoader.ImportMesh("", "https://kryeit.com/images/", `${fileName}`, scene, function (meshes) {
                const importedMesh = meshes[0];
            });

            return scene;
        };

        const scene = createScene();
        
        engine.runRenderLoop(function () {
            scene.render();
        });

        window.addEventListener("resize", function () {
            
            engine.resize();
            setCanvasSize();
        });
        let isDragging = false;
        let previousMouseX = 0;
        
        canvas.addEventListener('mousedown', function (event) {
            isDragging = true;
            previousMouseX = event.clientX;
        });
        
        canvas.addEventListener('mousemove', function (event) {
            if (isDragging) {
                const mouseX = event.clientX;
                const canvasWidth = canvas.width || canvas.clientWidth;
        
                const deltaX = mouseX - previousMouseX;
                rotateMeshes(deltaX, canvasWidth);
        
                previousMouseX = mouseX;
            }
        });
        
        canvas.addEventListener('mouseup', function () {
            isDragging = false;
        });
        
        canvas.addEventListener('touchstart', function (event) {
            event.preventDefault();
            isHovering = true;
            previousMouseX = event.touches[0].clientX;
        });
        
        canvas.addEventListener('touchmove', function (event) {
            event.preventDefault();
            if (isHovering) {
                const mouseX = event.touches[0].clientX;
                const canvasWidth = canvas.width || canvas.clientWidth;
        
                if (previousMouseX !== 0) {
                    const deltaX = mouseX - previousMouseX;
                    rotateMeshes(deltaX, canvasWidth);
                }
        
                previousMouseX = mouseX;
            }
        });
        
        canvas.addEventListener('touchend', function () {
            isDragging = false;
        });
        
        canvas.addEventListener('wheel', function (event) {
            // Prevent scrolling when the mouse is over the canvas
            event.preventDefault();
        
            const deltaX = event.deltaX;
            const canvasWidth = canvas.width || canvas.clientWidth;
        
            rotateMeshes(deltaX, canvasWidth);
        });
        
        function rotateMeshes(deltaX, canvasWidth) {
            scene.meshes.forEach(function (mesh) {
                mesh.rotation.y += (deltaX / canvasWidth) * Math.PI * 2;
            });
        }
        
    }

    // Load Babylon.js script and start the application
    loadBabylonScript();
}
