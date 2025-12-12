// Handles profile picture selection, camera capture (getUserMedia) fallback to file picker,
// preview, and local persistence
(function () {
    const input = document.getElementById('profilePicInput');
    const img = document.getElementById('profilePic');
    const cameraBtn = document.getElementById('cameraBtn');
    const STORAGE_KEY = 'profilePicDataUrl';

    if (!img || !input) return;

    img.style.cursor = 'pointer';
    img.title = img.title || 'Click to change profile picture';

    function loadFromStorage() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            if (data) img.src = data;
        } catch (err) {
            console.warn('Could not load profile picture from localStorage', err);
        }
    }

    function saveDataUrl(dataUrl) {
        try {
            localStorage.setItem(STORAGE_KEY, dataUrl);
        } catch (err) {
            console.warn('Saving profile picture failed (storage limits?):', err);
        }
    }

    // File picker flow (works on desktop and mobile; mobile may offer camera)
    img.addEventListener('click', function () {
        input.value = null;
        input.click();
    });

    input.addEventListener('change', function (evt) {
        const file = evt.target.files && evt.target.files[0];
        if (!file) return;
        if (!file.type || !file.type.startsWith('image/')) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            const dataUrl = e.target.result;
            img.src = dataUrl;
            saveDataUrl(dataUrl);
        };
        reader.readAsDataURL(file);
    });

    // Camera button: try getUserMedia first, otherwise fallback to file picker with capture hint
    if (cameraBtn) {
        cameraBtn.addEventListener('click', function () {
            // Prefer direct camera capture via MediaDevices
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                openCameraOverlay();
            } else {
                // On some mobile browsers, forcing the file input's capture attribute will open the camera
                input.setAttribute('capture', 'environment');
                input.value = null;
                input.click();
            }
        });
    }

    // Create a small overlay UI to show camera stream and capture a frame
    function openCameraOverlay() {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.left = '0';
        overlay.style.top = '0';
        overlay.style.right = '0';
        overlay.style.bottom = '0';
        overlay.style.background = 'rgba(0,0,0,0.75)';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.zIndex = '10000';

        const container = document.createElement('div');
        container.style.position = 'relative';
        container.style.width = '320px';
        container.style.maxWidth = '90%';
        container.style.background = '#111';
        container.style.padding = '8px';
        container.style.borderRadius = '8px';

        const video = document.createElement('video');
        video.style.width = '100%';
        video.style.height = 'auto';
        video.autoplay = true;

        const btnRow = document.createElement('div');
        btnRow.style.display = 'flex';
        btnRow.style.justifyContent = 'space-between';
        btnRow.style.marginTop = '8px';

        const takeBtn = document.createElement('button');
        takeBtn.textContent = 'Take Photo';
        takeBtn.style.flex = '1';
        takeBtn.style.marginRight = '6px';

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.style.flex = '1';

        btnRow.appendChild(takeBtn);
        btnRow.appendChild(cancelBtn);

        container.appendChild(video);
        container.appendChild(btnRow);
        overlay.appendChild(container);
        document.body.appendChild(overlay);

        let stream;
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
            .then(s => {
                stream = s;
                video.srcObject = stream;
                return video.play();
            })
            .catch(err => {
                console.warn('Camera access failed, falling back to file picker', err);
                // fallback: open file picker (may open camera on mobile)
                input.setAttribute('capture', 'environment');
                input.value = null;
                input.click();
                overlay.remove();
            });

        function cleanup() {
            if (stream) {
                stream.getTracks().forEach(t => t.stop());
            }
            overlay.remove();
        }

        cancelBtn.addEventListener('click', function () {
            cleanup();
        });

        takeBtn.addEventListener('click', function () {
            // capture current video frame
            try {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth || 320;
                canvas.height = video.videoHeight || 240;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL('image/png');
                img.src = dataUrl;
                saveDataUrl(dataUrl);
            } catch (err) {
                console.warn('Could not capture photo from video', err);
            }
            cleanup();
        });
    }

    // Load existing image immediately
    loadFromStorage();

    document.addEventListener('DOMContentLoaded', loadFromStorage);
})();
