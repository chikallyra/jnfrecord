tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: '#f6edd7', 
                secondary: '#f18da2', 
                accent: '#85bb5e',   
                burahay: '#ba2027',
                strawberry: '#ef2271',
                darkGrey: '#313742',
                biruGaruda: '#004b93'
            },
            fontFamily: {
                brand: ['"Yeseva One"', 'serif'],
                body: ['Helvetica', 'sans-serif'],
                cursive: ['Pacifico', 'cursive'],
                nutrition: ['League Gothic', 'sans-serif'],
                pop: ['"Modak"'],
                os: ['Inter', 'sans-serif']
            },
            animation: {
                'moving-diagonal': 'diagonal 15s linear infinite',
            },
            keyframes: {
                diagonal: {
                    '0%': { 'background-position': '0 0' },
                    '100%': { 'background-position': '600px 600px' },
                }
            }
        }
    }
}


document.addEventListener('DOMContentLoaded', function() {
    const $ = (id) => document.getElementById(id);

    const logoToggle = $('logo-toggle');
    const mobileDropdown = $('mobile-dropdown');
    const heartButton = $('heartButton');
    const popSection = $('popSection');

    // 1. Navbar Toggle dengan Stop Propagation
    if (logoToggle && mobileDropdown) {
        logoToggle.addEventListener('click', (e) => {
            e.stopPropagation(); 
            mobileDropdown.classList.toggle('hidden');
        });

        window.addEventListener('click', (e) => {
            if (!logoToggle.contains(e.target) && !mobileDropdown.contains(e.target)) {
                mobileDropdown.classList.add('hidden');
            }
        });
    }

    // 2. Heart Button Scroll
    if (heartButton && popSection) {
        heartButton.addEventListener('click', function() {
            popSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
            
            // Animasi membal
            this.classList.add('scale-125');
            setTimeout(() => this.classList.remove('scale-125'), 200);
        });
    }

    // 3. View Management
    const views = {
        landing: $('view-landing'),
        gallery: $('view-gallery'),
        nav: $('main-nav'),
        scallop: $('main-scallop'),
        title: $('gallery-title'),
        grid: $('photo-grid'),
        upload: $('photo-upload'),
        back: $('backBtn')
    };

    const folderData = {};

    function showLanding() {
    // 1. Munculkan Landing & elemen pendukung
    views.landing?.classList.remove('hidden', 'hidden-view');
    views.nav?.classList.remove('hidden', 'hidden-view');
    views.scallop?.classList.remove('hidden', 'hidden-view');

    // 2. Sembunyikan Gallery
    views.gallery?.classList.add('hidden', 'hidden-view');

    // 3. Scroll ke area album
    const albumSection = document.getElementById('album');
    if (albumSection) {
        albumSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }
    }

    function showGallery(folderName) {
        // 1. Sembunyikan Landing & elemen pendukung
        views.landing?.classList.add('hidden', 'hidden-view');
        views.nav?.classList.add('hidden', 'hidden-view');
        views.scallop?.classList.add('hidden-view', 'hidden');
        
        // 2. Munculkan Gallery
        views.gallery?.classList.remove('hidden', 'hidden-view');
        
        if (views.title) views.title.innerText = folderName;
        renderPhotos(folderName);
    }

    // 4. Render Photos dengan Class Tailwind yang Benar
    function renderPhotos(folderName) {
        if (!views.grid) return;
        views.grid.innerHTML = '';
        const photos = folderData[folderName] || [];

        if (photos.length === 0) {
            views.grid.innerHTML = `<p class="text-white opacity-50 col-span-full text-center py-10">Belum ada foto di folder ini...</p>`;
        } else {
            photos.forEach((src, index) => {
                const imgContainer = document.createElement('div');
                const rotateClass = index % 2 === 0 ? 'rotate-2' : '-rotate-2';
                imgContainer.className = `relative aspect-square bg-white p-2 shadow-xl transform ${rotateClass} hover:rotate-0 transition-all cursor-zoom-in`;
                imgContainer.innerHTML = `<img src="${src}" class="w-full h-full object-cover">`;
                views.grid.appendChild(imgContainer);
            });
        }
    }

    // 5. Event Listeners
    document.querySelectorAll('.folder-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            showGallery(btn.getAttribute('data-name'));
        });
    });

    views.back?.addEventListener('click', showLanding);

    views.upload?.addEventListener('change', (e) => {
        const folderName = views.title?.innerText;
        if (!folderName) return;
        
        const files = Array.from(e.target.files);
        if (!folderData[folderName]) folderData[folderName] = [];

        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (event) => {
                folderData[folderName].push(event.target.result);
                renderPhotos(folderName);
            };
            reader.readAsDataURL(file);
        });
    });
    
    // Tampil Foto
    function renderPhotos(folderName) {
        if (!views.grid) return;
        views.grid.innerHTML = ''; 
        
        const folderPath = folderName.toLowerCase();
        const modal = document.getElementById('photo-modal');
        const modalImg = document.getElementById('modal-img');

        for (let i = 1; i <= 15; i++) { 
            const src = `img/${folderPath}/${i}.jpg`; 
            const img = new Image();
            img.src = src;

            // Kuncinya ada di sini: Container baru dibuat kalau gambar BERHASIL diload
            img.onload = () => {
                const imgContainer = document.createElement('div');
                imgContainer.className = "aspect-square bg-white p-2 shadow-md transform rotate-1 hover:rotate-0 hover:scale-105 transition-all cursor-zoom-in";
                
                img.className = "w-full h-full object-cover rounded-sm";
                
                // Efek Zoom
                imgContainer.onclick = () => {
                    modalImg.src = src;
                    modal.classList.remove('hidden');
                    setTimeout(() => modalImg.classList.remove('scale-95'), 10);
                };

                imgContainer.appendChild(img);
                views.grid.appendChild(imgContainer);
            };
            
            // Opsional: Cek juga file .png kalau .jpg gak ada
            img.onerror = () => {
                const imgPng = new Image();
                imgPng.src = `img/${folderPath}/${i}.png`;
                imgPng.onload = () => {
                    const imgContainer = document.createElement('div');
                    imgContainer.className = "aspect-square bg-white p-2 shadow-md transform rotate-1 hover:rotate-0 hover:scale-105 transition-all cursor-zoom-in";
                    imgPng.className = "w-full h-full object-cover rounded-sm";
                    imgContainer.onclick = () => {
                        modalImg.src = imgPng.src;
                        modal.classList.remove('hidden');
                        setTimeout(() => modalImg.classList.remove('scale-95'), 10);
                    };
                    imgContainer.appendChild(imgPng);
                    views.grid.appendChild(imgContainer);
                }
            };
        }

        // Modal click handler (cukup sekali aja di luar loop)
        if (modal) {
            modal.onclick = () => {
                modalImg.classList.add('scale-95');
                setTimeout(() => modal.classList.add('hidden'), 200);
            };
        }
    }

    //!SECTION SUPRISEEE
    let scene, camera, renderer, box;
    let clickCount = 0;
    const targetClicks = 15;
    const VIDEO_URL = "https://www.youtube.com/embed/xqX1x-kHwNw";

    window.onload = function() {
        init3D();
        animate();
    }

    function init3D() {
        const container = document.getElementById('canvas-container');
        scene = new THREE.Scene();
        
        camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.z = 4;

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        // Lighting
        const ambient = new THREE.AmbientLight(0xffffff, 0.7);
        scene.add(ambient);
        const pointLight = new THREE.PointLight(0xffffff, 0.8);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        // Box Geometry (Kado Merah)
        const boxGeom = new THREE.BoxGeometry(1.8, 1.8, 1.8);
        const boxMat = new THREE.MeshPhongMaterial({ color: 0xe11d48 }); // Rose 600
        box = new THREE.Mesh(boxGeom, boxMat);
        scene.add(box);

        // Ribbon (Pita Kuning)
        const ribbonMat = new THREE.MeshPhongMaterial({ color: 0xfde047 }); // Yellow 300
        const vRibbon = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.82, 1.82), ribbonMat);
        const hRibbon = new THREE.Mesh(new THREE.BoxGeometry(1.82, 0.35, 1.82), ribbonMat);
        box.add(vRibbon, hRibbon);

        // Event listener klik pada container
        container.addEventListener('mousedown', onBoxClick);
        window.addEventListener('resize', onWindowResize);
    }

    function onBoxClick() {
        if (clickCount >= targetClicks) return;

        clickCount++;
        
        // Update Progress Bar
        const progressEl = document.getElementById('progress');
        progressEl.style.width = (clickCount / targetClicks * 100) + '%';

        // Animasi Guncang UI
        const section = document.getElementById('surprise');
        section.classList.add('shake-anim');
        setTimeout(() => section.classList.remove('shake-anim'), 200);

        // Animasi Box 3D
        box.scale.set(1.15, 1.15, 1.15);
        box.rotation.y += 0.4;
        setTimeout(() => box.scale.set(1, 1, 1), 100);

        if (clickCount >= targetClicks) {
            triggerExplosion();
        }
    }

    function triggerExplosion() {
        let scale = 1;
        const timer = setInterval(() => {
            scale *= 1.25;
            box.scale.set(scale, scale, scale);
            box.rotation.z += 0.5;
            if (scale > 40) {
                clearInterval(timer);
                showVideo();
            }
        }, 20);
    }

    function showVideo() {
        const modal = document.getElementById('videoModal');
        const iframe = document.getElementById('surpriseVideo');
        const header = document.getElementById('header-text');
        
        header.style.opacity = '0';
        iframe.src = VIDEO_URL;
        modal.classList.remove('scale-0');
        modal.classList.add('scale-100');
    }

    function onWindowResize() {
        const container = document.getElementById('canvas-container');
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }

    function animate() {
        requestAnimationFrame(animate);
        if (box && clickCount < targetClicks) {
            box.rotation.y += 0.005;
            box.rotation.x += 0.003;
        }
        renderer.render(scene, camera);
    }
});
