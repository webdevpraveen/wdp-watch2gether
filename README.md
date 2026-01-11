# WDP Video Party 🎬

A peer-to-peer watch party web app (work in progress).

This project aims to let two users watch videos together in real time using a shared room code. The idea is to keep everything simple, anonymous, and real-time.

---

## 💡 Idea

- One user creates a room and gets a room code
- Another user joins using the same code
- Both users watch the same video together (YouTube)
- Live facecam for both users
- Emoji reactions at specific video timestamps

No login. No account. No storage.

---

## 🚧 Status

⚠️ **Work in Progress**

This project is currently in the idea & planning phase.  
Development will start soon.

More features and details will be added gradually.

---

## 🛠️ Tech (planned)

- JavaScript
- Node.js
- Socket.IO
- WebRTC
- YouTube Player API

---

---

❌ Why real-time P2P YouTube sync player is not feasible (current scope)
1. YouTube does not expose raw video streams

YouTube videos are served via encrypted, signed, time-limited URLs.

Browser ko jo video milta hai, wo:

user-specific hota hai

short-lived hota hai

direct file nahi hota (DASH/HLS chunks)

JavaScript ya WebRTC ko raw video bytes access hi nahi milte

➡️ Iska matlab:
You video data ko peer-to-peer forward hi nahi kar sakte, kyunki tumhare paas data hota hi nahi.

2. WebRTC P2P works only with media you control

WebRTC ka use-case hota hai:

webcam stream

microphone

screen share

custom media files

YouTube ka <iframe> player:

sandboxed hota hai

browser ke security layer ke andar locked hota hai

WebRTC ya JS ko uske frames ka access nahi deta

➡️ Tum WebRTC se YouTube video stream share nahi kar sakte, sirf apni media share kar sakte ho.

3. Perfect sync across devices is fundamentally hard

Even agar stream mil bhi jaaye (jo nahi milti):

Har user ka:

network latency different

buffering behavior different

playback speed drift hota hai

Millisecond-level sync ke liye:

clock synchronization

adaptive buffering

jitter compensation
chahiye

➡️ Yeh cheez Netflix, Zoom jaise companies large infra ke saath karti hain.
Beginner-level web stack ke liye unrealistic hai.

4. YouTube Terms of Service violation

YouTube explicitly disallow karta hai:

video stream ko intercept karna

redistribute karna

modify playback behavior outside official API

➡️ Even agar hack se possible ho:

account ban ho sakta hai

project legally unsafe ho jaata hai

5. Browser security model intentionally blocks this

Modern browsers intentionally prevent:

cross-origin media extraction

iframe content inspection

DRM-protected stream access

➡️ Yeh bug nahi hai, design decision hai.

---

>END
