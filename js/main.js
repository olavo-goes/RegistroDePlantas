window.addEventListener('DOMContentLoaded', () => {
  const cameraTrigger = document.getElementById('camera-trigger');
  const fotoPreview = document.getElementById('foto-preview');

  let stream = null;
  let video = null;
  let usandoFrontal = true;

  async function iniciarCamera() {
    try {
      const modo = usandoFrontal ? 'user' : 'environment';

      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: modo }
      });

      video = document.createElement('video');
      video.srcObject = stream;
      video.autoplay = true;
      video.playsInline = true;
      video.style.width = '100%';
      video.style.borderRadius = '8px';

      fotoPreview.innerHTML = '';
      fotoPreview.appendChild(video);

      await video.play();
    } catch (error) {
      console.error('Erro ao acessar a câmera:', error);
    }
  }

  function capturarFoto() {
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);

    const img = document.createElement('img');
    img.src = canvas.toDataURL('image/png');
    img.style.width = '100%';
    img.style.borderRadius = '8px';

    fotoPreview.innerHTML = '';
    fotoPreview.appendChild(img);

    stream.getTracks().forEach(track => track.stop());
    stream = null;
    video = null;

    usandoFrontal = !usandoFrontal;
  }

  cameraTrigger.addEventListener('click', () => {
    if (!stream) {
      iniciarCamera();
    } else {
      capturarFoto();
    }
  });
});
