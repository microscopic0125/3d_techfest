/* =========================================
   TECHFEST IIT BOMBAY 2026
   MAIN SCRIPT
========================================= */


/* =========================================
   PAGE LOADER
========================================= */

window.addEventListener("load", function () {

    const pageLoader = document.querySelector("#loader");
    const loaderBar = document.querySelector(".loader-line span");

    if (loaderBar) {
        gsap.to(loaderBar, {
            width: "100%",
            duration: 1.5,
            ease: "power2.inOut"
        });
    }

    if (pageLoader) {
        gsap.to(pageLoader, {
            opacity: 0,
            duration: 0.8,
            delay: 1.7,
            onComplete: function () {
                pageLoader.style.display = "none";
            }
        });
    }

});


/* =========================================
   THREE.JS
========================================= */

const canvas = document.querySelector("#three-canvas");

if (!canvas) {
    console.error("ERROR: #three-canvas not found in index.html");
}


/* =========================================
   SCENE
========================================= */

const scene = new THREE.Scene();


/* =========================================
   CAMERA
========================================= */

const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(
    0,
    0,
    8
);


/* =========================================
   RENDERER
========================================= */

const renderer = new THREE.WebGLRenderer({

    canvas: canvas,

    alpha: true,

    antialias: true

});

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.outputEncoding =
    THREE.sRGBEncoding;
renderer.toneMapping =
    THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure =
    0.9;


/* =========================================
   LIGHTS
========================================= */

const ambientLight =
    new THREE.AmbientLight(
        0xaaa6ff,
        0.75
    );

scene.add(ambientLight);


const pointLight =
    new THREE.PointLight(
        0x5648ff,
        8,
        40
    );

pointLight.position.set(
    3,
    4,
    6
);

scene.add(pointLight);


const secondLight =
    new THREE.PointLight(
        0xa18bff,
        6,
        30
    );

secondLight.position.set(
    -4,
    2,
    4
);

scene.add(secondLight);

const neonRimLight =
    new THREE.PointLight(
        0x3c98ff,
        4.5,
        24
    );

neonRimLight.position.set(
    5,
    -1,
    3
);

scene.add(neonRimLight);


/* =====================================================
   TECHFEST 3D CUBE - GLB MODEL
   =====================================================

   YOUR FILE MUST BE HERE:

   model/
       techfest-cube.glb

   ===================================================== */

let techfestModel = null;

const gltfLoader =
    new THREE.GLTFLoader();


console.log(
    "Loading Techfest 3D cube..."
);


gltfLoader.load(

    "./model/techfest-cube.glb",


    /* =========================================
       SUCCESS
    ========================================= */

    function (gltf) {

        console.log(
            "✓ TECHFEST CUBE LOADED SUCCESSFULLY"
        );


        /*
         * Store the model
         */

        techfestModel =
            gltf.scene;


        /*
         * Make every mesh visible
         */

        techfestModel.traverse(
            function (object) {

                if (object.isMesh) {

                    object.visible = true;

                    object.frustumCulled = false;

                    const bodyPalette = [
                        0x3932a8,
                        0x244b9f,
                        0x5144b8
                    ];
                    const emissivePalette = [
                        0x241d79,
                        0x142c59,
                        0x302078
                    ];
                    const isMaterialArray = Array.isArray(object.material);
                    const materials = isMaterialArray
                        ? object.material
                        : [object.material];
                    const colorizedMaterials = materials.map(function (material) {
                        const bodyColor = bodyPalette[object.id % bodyPalette.length];
                        const emissiveColor = emissivePalette[object.id % emissivePalette.length];
                        const futuristicMaterial = material.clone();
                        futuristicMaterial.color.set(bodyColor);
                        futuristicMaterial.emissive.set(emissiveColor);
                        futuristicMaterial.emissiveIntensity = 0.24;
                        futuristicMaterial.metalness = 0.55;
                        futuristicMaterial.roughness = 0.28;
                        return futuristicMaterial;
                    });
                    object.material = isMaterialArray
                        ? colorizedMaterials
                        : colorizedMaterials[0];

                }

            }
        );


        /*
         * Find model dimensions
         */

        const box =
            new THREE.Box3()
                .setFromObject(
                    techfestModel
                );


        const size =
            box.getSize(
                new THREE.Vector3()
            );


        const center =
            box.getCenter(
                new THREE.Vector3()
            );


        console.log(
            "Cube dimensions:",
            size
        );


        /*
         * SCALE THE MODEL
         *
         * This automatically adjusts
         * the cube regardless of its
         * original Blender size.
         */

        const largestDimension =
            Math.max(
                size.x,
                size.y,
                size.z
            );


        const desiredSize = 3.2;


        const modelScale =
            desiredSize /
            largestDimension;


        techfestModel.scale.set(
            modelScale,
            modelScale,
            modelScale
        );


        /*
         * POSITION THE CUBE
         *
         * Positive X = right side
         */

        techfestModel.position.set(
            (window.innerWidth < 700 ? 1.9 : 3) - center.x * modelScale,
            -center.y * modelScale,
            -center.z * modelScale
        );


        /*
         * ADD CUBE TO SCENE
         */

        scene.add(
            techfestModel
        );


        console.log(
            "✓ Cube added to scene"
        );

        console.log(
            "Cube position:",
            techfestModel.position
        );


        /*
         * MODEL SCROLL ANIMATION
         *
         * This is created AFTER
         * the GLB loads.
         */

        gsap.to(
            techfestModel.position,
            {

                scrollTrigger: {

                    trigger: ".hero",

                    start: "top top",

                    end: "bottom top",

                    scrub: 1

                },

                x: 0.5,

                y: -1.5,

                z: -1.5,

                ease: "none"

            }
        );


        /*
         * MODEL SCALE ON SCROLL
         */

        gsap.to(
            techfestModel.scale,
            {

                scrollTrigger: {

                    trigger: ".hero",

                    start: "top top",

                    end: "bottom top",

                    scrub: 1

                },

                x: modelScale * 1.2,

                y: modelScale * 1.2,

                z: modelScale * 1.2,

                ease: "none"

            }
        );

    },


    /* =========================================
       LOADING PROGRESS
    ========================================= */

    function (xhr) {

        if (xhr.total > 0) {

            const progress =
                (xhr.loaded / xhr.total) * 100;

            console.log(
                "Cube loading: " +
                progress.toFixed(0) +
                "%"
            );

        }

    },


    /* =========================================
       ERROR
    ========================================= */

    function (error) {

        console.error(
            "================================"
        );

        console.error(
            "✗ TECHFEST CUBE FAILED TO LOAD"
        );

        console.error(
            error
        );

        console.error(
            "Check this path:"
        );

        console.error(
            "./model/techfest-cube.glb"
        );

        console.error(
            "================================"
        );

    }

);


/* =========================================
   FLOATING RING
========================================= */

const ringGeometry =
    new THREE.TorusGeometry(
        2.0,
        0.015,
        16,
        100
    );


const ringMaterial =
    new THREE.MeshBasicMaterial({

        color: 0x26dfff,

        transparent: true,

        opacity: 0.65

    });


const ring =
    new THREE.Mesh(
        ringGeometry,
        ringMaterial
    );


ring.rotation.x =
    Math.PI / 2;


ring.position.set(
    2.3,
    0,
    -0.5
);


scene.add(ring);


/* =========================================
   SECOND RING
========================================= */

const ring2Geometry =
    new THREE.TorusGeometry(
        2.5,
        0.01,
        16,
        100
    );


const ring2Material =
    new THREE.MeshBasicMaterial({

        color: 0xa176ff,

        transparent: true,

        opacity: 0.35

    });


const ring2 =
    new THREE.Mesh(
        ring2Geometry,
        ring2Material
    );


ring2.rotation.x =
    Math.PI / 3;


ring2.position.set(
    2.3,
    0,
    -0.8
);


scene.add(ring2);


/* =========================================
   PARTICLES
========================================= */

const particleCount = 1500;


const particleGeometry =
    new THREE.BufferGeometry();


const positions =
    new Float32Array(
        particleCount * 3
    );


for (
    let i = 0;
    i < particleCount * 3;
    i++
) {

    positions[i] =
        (Math.random() - 0.5) * 30;

}


particleGeometry.setAttribute(

    "position",

    new THREE.BufferAttribute(
        positions,
        3
    )

);


const particleMaterial =
    new THREE.PointsMaterial({

        color: 0xa7a0ff,

        size: 0.025,

        transparent: true,

        opacity: 0.8

    });


const particles =
    new THREE.Points(

        particleGeometry,

        particleMaterial

    );


scene.add(
    particles
);


/* =========================================
   MOUSE INTERACTION
========================================= */

let mouseX = 0;

let mouseY = 0;


window.addEventListener(
    "mousemove",
    function (event) {

        mouseX =
            (event.clientX /
                window.innerWidth) *
            2 - 1;


        mouseY =
            (event.clientY /
                window.innerHeight) *
            2 - 1;

    }
);


/* =========================================
   ANIMATION LOOP
========================================= */

const clock =
    new THREE.Clock();


function animate() {

    requestAnimationFrame(
        animate
    );


    const time =
        clock.getElapsedTime();


    /* =====================================
       TECHFEST CUBE ANIMATION
    ===================================== */

    if (techfestModel) {

        /*
         * Continuous rotation
         */

        techfestModel.rotation.y +=
            0.006;


        techfestModel.rotation.x +=
            0.001;


        /*
         * Floating movement
         */

        const floatingY =
            Math.sin(
                time * 1.2
            ) * 0.12;


        /*
         * Only apply floating
         * when the user isn't
         * scrolling the model away.
         */

        if (
            window.scrollY <
            window.innerHeight * 0.8
        ) {

            techfestModel.position.y =
                floatingY;

        }


        /*
         * Small mouse response
         */

        techfestModel.rotation.z =
            mouseX * -0.03;

    }


    /* =====================================
       RINGS
    ===================================== */

    ring.rotation.z +=
        0.003;


    ring2.rotation.z -=
        0.002;


    /* =====================================
       PARTICLES
    ===================================== */

    particles.rotation.y +=
        0.0003;


    /* =====================================
       CAMERA MOUSE MOVEMENT
    ===================================== */

    camera.position.x +=
        (
            mouseX * 0.2 -
            camera.position.x
        ) * 0.02;


    camera.position.y +=
        (
            -mouseY * 0.12 -
            camera.position.y
        ) * 0.02;


    camera.lookAt(
        0,
        0,
        0
    );


    /* =====================================
       RENDER
    ===================================== */

    renderer.render(
        scene,
        camera
    );

}


animate();


/* =========================================
   WINDOW RESIZE
========================================= */

window.addEventListener(
    "resize",
    function () {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;


        camera.updateProjectionMatrix();


        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );


        renderer.setPixelRatio(
            Math.min(
                window.devicePixelRatio,
                2
            )
        );

    }
);


/* =========================================
   GSAP SCROLLTRIGGER
========================================= */

gsap.registerPlugin(
    ScrollTrigger
);


/* =========================================
   ABOUT ANIMATION
========================================= */

gsap.from(
    ".about-text",
    {

        scrollTrigger: {

            trigger: ".about",

            start: "top 70%"

        },

        x: -100,

        opacity: 0,

        duration: 1.2

    }
);


/* =========================================
   FLOATING CARD
========================================= */

gsap.from(
    ".floating-card",
    {

        scrollTrigger: {

            trigger: ".about",

            start: "top 70%"

        },

        x: 100,

        opacity: 0,

        duration: 1,

        delay: 0.2

    }
);


/* =========================================
   EVENT CARDS
========================================= */

gsap.from(
    ".event-card",
    {

        scrollTrigger: {

            trigger: ".events",

            start: "top 70%"

        },

        y: 100,

        opacity: 0,

        stagger: 0.15,

        duration: 1

    }
);


/* =========================================
   HERO PARALLAX
========================================= */

gsap.to(
    "#three-canvas",
    {

        scrollTrigger: {

            trigger: ".hero",

            start: "top top",

            end: "bottom top",

            scrub: true

        },

        y: 200,

        scale: 1.1,

        ease: "none"

    }
);


/* =========================================
   EXPLORE EVENTS BUTTON
========================================= */

const exploreButton =
    document.querySelector(
        "#exploreBtn"
    );


if (exploreButton) {

    exploreButton.addEventListener(
        "click",
        function () {

            const eventsSection =
                document.querySelector(
                    "#events"
                );


            if (eventsSection) {

                eventsSection.scrollIntoView({
                    behavior: "smooth"
                });

            }
        }
    );

}

const watchButton = document.querySelector("#watchBtn");
const videoDialog = document.querySelector("#videoDialog");
const techfestVideo = document.querySelector("#techfestVideo");
const closeVideoButton = document.querySelector("#closeVideo");

if (watchButton && videoDialog && techfestVideo && closeVideoButton) {
    watchButton.addEventListener("click", function () {
        techfestVideo.src = "https://www.youtube-nocookie.com/embed/Pj7hYdDZHO4?autoplay=1&rel=0";
        videoDialog.showModal();
    });

    closeVideoButton.addEventListener("click", function () {
        videoDialog.close();
    });

    videoDialog.addEventListener("close", function () {
        techfestVideo.src = "";
    });

    videoDialog.addEventListener("click", function (event) {
        if (event.target === videoDialog) {
            videoDialog.close();
        }
    });
}
