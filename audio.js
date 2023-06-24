function handleChange() {
  let musicFile = document.getElementById("musicFile").files[0];
  let musicPlayer = document.getElementById("musicAudio");
  musicPlayer.src = URL.createObjectURL(musicFile);
//   let volumeRange=document.getElementById('volume-control')
//   volumeRange.style.visibility='visible'
  musicPlayer.crossOrigin = "anonymous";
  const container = document.getElementById("container");
  const canvas = document.getElementById("canvas");
  canvas.width = 500;
  canvas.height = 500;

  const ctx = canvas.getContext("2d");
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  let audioSource = null;
  let analyser = null;
  musicPlayer.play();
  audioSource = audioCtx.createMediaElementSource(musicPlayer);
  analyser = audioCtx.createAnalyser();
  audioSource.connect(analyser);
  analyser.connect(audioCtx.destination);
  analyser.fftSize = 128; 
  const bufferLength = analyser.frequencyBinCount; 
  const dataArray = new Uint8Array(bufferLength);
  const barWidth = canvas.width / 2 / bufferLength;
  let x = 0; 

  function animate() {
    x=0
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    analyser.getByteFrequencyData(dataArray);
    drawVisualizer({ bufferLength, dataArray, barWidth });
    requestAnimationFrame(animate);
  }
  const drawVisualizer = ({ bufferLength, dataArray, barWidth=100 }) => {
    let barHeight;
    for (let i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i]; 
      const red = (i * barHeight) / 10;
      const green = i * 4;
      const blue = barHeight / 4 - 12;
      ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
      ctx.fillRect(
        canvas.width / 2 - x,
        canvas.height - barHeight,
        barWidth,
        barHeight
      ); 
      x += barWidth;
    }

    for (let i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i]; 
      const red = (i * barHeight) / 10;
      const green = i * 4;
      const blue = barHeight / 4 - 12;
      ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight); 
      x += barWidth; 
    }
  };

  animate();
}

// const handleVolume =()=>{
//     let musicPlayer = document.getElementById("musicAudio");
//     if(musicPlayer.src){
//         let volume = document.getElementById("volume-control");
//         musicPlayer.volume=volume.value/100
//     }
// }
