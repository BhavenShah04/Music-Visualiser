const audioFileInput = document.getElementById('audio-file');
const audioElement = document.getElementById('audio');
const canvas = document.getElementById('visualizer');
const canvasContext = canvas.getContext('2d');
let audioContext;
let analyser;
let source;

document.getElementById('start-button').addEventListener('click', function() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    audioFileInput.disabled = false; 
    this.disabled = true;
});

audioFileInput.addEventListener('change', function() {
    const file = this.files[0];
    const fileURL = URL.createObjectURL(file);
    audioElement.src = fileURL;

    if (source) {
        source.disconnect();
    }
    source = audioContext.createMediaElementSource(audioElement);
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 256;

    audioElement.play();

    draw();
});

function draw() {
    requestAnimationFrame(draw);
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    canvasContext.fillStyle = 'rgba(51, 51, 51, 0.8)';
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 2.5;
    let barHeight;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        
        const r = Math.min(255, barHeight + 100);
        const g = Math.max(50, 150 - (barHeight / 2));
        const b = Math.max(50, 255 - barHeight);
        canvasContext.fillStyle = `rgb(${r}, ${g}, ${b})`;

        const scaleFactor = 1 + (barHeight / 100);
        canvasContext.save();
        canvasContext.translate(x + barWidth / 2, canvas.height - barHeight);
        canvasContext.scale(1, scaleFactor);
        canvasContext.fillRect(-barWidth / 2, 0, barWidth, barHeight);
        canvasContext.restore();

        x += barWidth + 1; 
    }
}
