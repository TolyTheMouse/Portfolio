function createBabylonInstance(fileName, canvasId) {
    const canvas = document.getElementById(canvasId);

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

            const camera = new BABYLON.ArcRotateCamera("camera1", Math.PI / 2, Math.PI / 3, 4, new BABYLON.Vector3(0, 1, 0), scene);

            const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 5, 0), scene);
            light.intensity = 0.7;

            const mesh = BABYLON.SceneLoader.ImportMesh("", "https://kryeit.com/images/", `${fileName}.stl`, scene, function (meshes) {
                const cube = meshes[0];
            });

            const circlePlane = BABYLON.MeshBuilder.CreateGround("circlePlane", { width: 3, height: 3 }, scene);

            // Define RGB values for green and orange
            const greenColor = new BABYLON.Color3(0, 1, 0); // RGB for green
            const orangeColor = new BABYLON.Color3(1, 0.6, 0); // RGB for orange
            
            // Interpolate between green and orange for a smooth transition
            const interpolationFactor = 0.5; // Adjust as needed
            const finalColor = BABYLON.Color3.Lerp(greenColor, orangeColor, interpolationFactor);
            
            // Apply the color to the material
            const material = new BABYLON.StandardMaterial("circleMaterial", scene);
            material.diffuseColor = finalColor;
            
            circlePlane.material = material;
            
            return scene;
        };

        const scene = createScene();

        engine.runRenderLoop(function () {
            scene.render();
        });

        window.addEventListener("resize", function () {
            engine.resize();
        });

        var isHovering = false;
        var previousMouseX = 0;

        canvas.addEventListener('mouseenter', function () {
            isHovering = true;
        });

        canvas.addEventListener('mouseleave', function () {
            isHovering = false;
            previousMouseX = 0; // Reset initial position when leaving the canvas
        });

        canvas.addEventListener('mousemove', function (event) {
            if (isHovering) {
                const mouseX = event.clientX;
                const canvasWidth = canvas.width || canvas.clientWidth;

                if (previousMouseX !== 0) {
                    const deltaX = mouseX - previousMouseX;
                    rotateMeshes(deltaX, canvasWidth);
                }

                previousMouseX = mouseX;
            }
        });

        canvas.addEventListener('touchstart', function (event) {
            isHovering = true;
            previousMouseX = event.touches[0].clientX;
        });

        canvas.addEventListener('touchmove', function (event) {
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
            isHovering = false;
            previousMouseX = 0;
        });

        window.addEventListener('mouseup', function () {
            isHovering = false;
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
