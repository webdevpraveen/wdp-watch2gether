document.getElementById("createRoomBtn").addEventListener("click", () => {
  const roomId = Math.random().toString(36).substring(2, 8);
  window.location.href = `/room.html?room=${roomId}`;
});
