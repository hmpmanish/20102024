const camera = document.getElementById('camera');
const startCamera = document.getElementById('startCamera');
const stopCamera = document.getElementById('stopCamera');
const startRecording = document.getElementById('startRecording');
const stopRecording = document.getElementById('stopRecording');
const downloadLink = document.getElementById('downloadLink');

let stream;
let mediaRecorder;
let recordedChunks = [];

// Start the camera
startCamera.addEventListener('click', async () => {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        camera.srcObject = stream;
    } catch (err) {
        alert('Error accessing camera: ' + err.message);
    }
});

// Stop the camera
stopCamera.addEventListener('click', () => {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        camera.srcObject = null;
    }
});

// Start recording
startRecording.addEventListener('click', () => {
    if (stream) {
        recordedChunks = [];
        mediaRecorder = new MediaRecorder(stream);

        // Store the recorded data chunks
        mediaRecorder.ondataavailable = event => {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };

        // Handle when recording stops
        mediaRecorder.onstop = () => {
            const blob = new Blob(recordedChunks, { type: 'video/mp4' });
            const url = URL.createObjectURL(blob);
            downloadLink.href = url;
            downloadLink.style.display = 'inline';
        };

        mediaRecorder.start();
        console.log('Recording started...');
    } else {
        alert('Please start the camera first.');
    }
});

// Stop recording
stopRecording.addEventListener('click', () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        console.log('Recording stopped...');
    }
});
