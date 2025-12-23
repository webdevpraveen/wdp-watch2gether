const params = new URLSearchParams(window.location.search);
const roomId = params.get("room");
document.getElementById("roomId").innerText = roomId;

socket.emit("join-room", { roomId });

let player;
let syncing = false;

function onYouTubeIframeAPIReady() {
  player = new YT.Player("player", {
    height: "360",
    width: "640",
    events: {
      onStateChange: onPlayerStateChange
    }
  });
}

document.getElementById("loadVideoBtn").onclick = () => {
  const url = document.getElementById("videoUrl").value;
  const videoId = new URL(url).searchParams.get("v");

  player.loadVideoById(videoId);

  socket.emit("video-event", {
    roomId,
    type: "load",
    data: { videoId }
  });
};

function onPlayerStateChange(event) {
  if (syncing) return;

  if (event.data === YT.PlayerState.PLAYING) {
    socket.emit("video-event", {
      roomId,
      type: "play",
      data: { time: player.getCurrentTime() }
    });
  }

  if (event.data === YT.PlayerState.PAUSED) {
    socket.emit("video-event", {
      roomId,
      type: "pause",
      data: { time: player.getCurrentTime() }
    });
  }
}

socket.on("video-event", ({ type, data }) => {
  syncing = true;

  if (type === "load") player.loadVideoById(data.videoId);
  if (type === "play") {
    player.seekTo(data.time, true);
    player.playVideo();
  }
  if (type === "pause") {
    player.seekTo(data.time, true);
    player.pauseVideo();
  }

  setTimeout(() => syncing = false, 300);
});

socket.on("sync-state", (state) => {
  if (state.videoId) {
    player.loadVideoById(state.videoId);
  }
});

let localStream;
let peerConnection;

const localVideo = document.getElementById("localCam");
const remoteVideo = document.getElementById("remoteCam");

const rtcConfig = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
};

async function initCamera() {
  localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false
  });

  localVideo.srcObject = localStream;
}

async function createPeerConnection() {
  peerConnection = new RTCPeerConnection(rtcConfig);

  localStream.getTracks().forEach(track => {
    peerConnection.addTrack(track, localStream);
  });

  peerConnection.ontrack = (event) => {
    remoteVideo.srcObject = event.streams[0];
  };

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("webrtc-ice-candidate", {
        roomId,
        candidate: event.candidate
      });
    }
  };
}

// USER A – create offer
socket.on("create-offer", async () => {
  await createPeerConnection();

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);

  socket.emit("webrtc-offer", { roomId, offer });
});

// USER B – receive offer
socket.on("webrtc-offer", async ({ offer }) => {
  await createPeerConnection();

  await peerConnection.setRemoteDescription(offer);
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);

  socket.emit("webrtc-answer", { roomId, answer });
});

// USER A – receive answer
socket.on("webrtc-answer", async ({ answer }) => {
  await peerConnection.setRemoteDescription(answer);
});

socket.on("webrtc-ice-candidate", async ({ candidate }) => {
  if (peerConnection) {
    await peerConnection.addIceCandidate(candidate);
  }
});

// INIT CAMERA & START
(async () => {
  await initCamera();
  socket.emit("join-room", { roomId });
  socket.emit("create-offer");
})();
