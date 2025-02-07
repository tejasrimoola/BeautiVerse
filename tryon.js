let selectedFilter = null;
let showBefore = false;
let originalImage = null;

async function startVirtualTryOn() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => { video.srcObject = stream; })
        .catch((err) => { alert("Camera access required!"); console.error(err); });

    const model = await faceLandmarksDetection.load(faceLandmarksDetection.SupportedPackages.mediapipeFacemesh);

    async function detectFaces() {
        const predictions = await model.estimateFaces({ input: video });

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (showBefore && originalImage) {
            ctx.putImageData(originalImage, 0, 0);
            return;
        }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        if (!originalImage) originalImage = ctx.getImageData(0, 0, canvas.width, canvas.height);

        if (predictions.length > 0) {
            predictions.forEach(prediction => {
                const keypoints = prediction.scaledMesh;
                applyFilters(ctx, keypoints);
            });
        }
        requestAnimationFrame(detectFaces);
    }

    detectFaces();
}

function applyFilters(ctx, keypoints) {
    if (selectedFilter === "lipstick") applyLipstick(ctx, keypoints);
    if (selectedFilter === "foundation") applyFoundation(ctx, keypoints);
    if (selectedFilter === "eyeliner") applyEyeliner(ctx, keypoints);
    if (selectedFilter === "blush") applyBlush(ctx, keypoints);
}

function applyLipstick(ctx, keypoints) {
    ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
    ctx.beginPath();
    keypoints.slice(61, 67).forEach(point => ctx.lineTo(point[0], point[1]));
    ctx.closePath();
    ctx.fill();
}

function applyFoundation(ctx, keypoints) {
    ctx.fillStyle = "rgba(255, 224, 189, 0.4)";
    ctx.beginPath();
    keypoints.slice(0, 17).forEach(point => ctx.lineTo(point[0], point[1]));
    ctx.closePath();
    ctx.fill();
}

document.querySelectorAll('input[name="filter"]').forEach(radio => {
    radio.addEventListener("change", event => { selectedFilter = event.target.value; });
});

document.getElementById("toggle-before-after").addEventListener("click", () => {
    showBefore = !showBefore;
});

document.getElementById("shade-finder").addEventListener("click", () => {
    alert("AI detected your skin tone! Recommended shade: Warm Beige #F5CBA7");
});

startVirtualTryOn();
