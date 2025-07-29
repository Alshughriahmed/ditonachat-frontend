'use client';

import React, { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const VideoChat = () => {
  const localVideo = useRef<HTMLVideoElement>(null);
  const remoteVideo = useRef<HTMLVideoElement>(null);
  const pc = useRef<RTCPeerConnection>();
  const socket = useRef<Socket>();
  const roomId = 'default-room';
  const [status, setStatus] = useState('Connecting...');
  const [muted, setMuted] = useState(false);
  const [usingFrontCam, setUsingFrontCam] = useState(true);

  const initCamera = async () => {
    try {
      const constraints = {
        video: { facingMode: usingFrontCam ? 'user' : 'environment' },
        audio: true,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (localVideo.current) localVideo.current.srcObject = stream;
      stream.getTracks().forEach(track => pc.current?.addTrack(track, stream));
    } catch (err) {
      console.error('Failed to get media:', err);
    }
  };

  useEffect(() => {
socket.current = io('https://kkh7ikcl85ln.manus.space', {
  path: '/ws',
  transports: ['websocket'],
});

    socket.current.on('connect', () => {
      setStatus('Connected to server');
      socket.current?.emit('join-room', roomId);
    });

    pc.current = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    initCamera();

    pc.current.ontrack = (event) => {
      if (remoteVideo.current) remoteVideo.current.srcObject = event.streams[0];
    };

    pc.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.current?.emit('ice-candidate', {
          to: 'all',
          candidate: event.candidate,
        });
      }
    };

    socket.current.on('peer-joined', async (peerId: string) => {
      setStatus('Peer joined. Calling...');
      const offer = await pc.current!.createOffer();
      await pc.current!.setLocalDescription(offer);
      socket.current?.emit('offer', { to: peerId, offer });
    });

    socket.current.on('offer', async ({ from, offer }) => {
      await pc.current!.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.current!.createAnswer();
      await pc.current!.setLocalDescription(answer);
      socket.current?.emit('answer', { to: from, answer });
    });

    socket.current.on('answer', async ({ from, answer }) => {
      await pc.current!.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.current.on('ice-candidate', async ({ from, candidate }) => {
      try {
        await pc.current!.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.error('Error adding ICE candidate', err);
      }
    });

    return () => {
      socket.current?.disconnect();
      pc.current?.close();
    };
  }, [usingFrontCam]);

  const toggleMute = () => {
    const stream = localVideo.current?.srcObject as MediaStream;
    stream?.getAudioTracks().forEach(track => (track.enabled = !muted));
    setMuted(!muted);
  };

  const switchCamera = () => {
    setUsingFrontCam(prev => !prev);
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <video
        ref={remoteVideo}
        autoPlay
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      />
      <video
        ref={localVideo}
        autoPlay
        muted
        playsInline
        className="absolute bottom-4 right-4 w-32 h-24 rounded-lg border-2 border-white shadow-md"
      />
      <div className="absolute top-4 left-4 text-white text-sm bg-black/60 px-3 py-1 rounded">
        {status}
      </div>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
        <button onClick={toggleMute} className="px-4 py-2 bg-white/80 text-black rounded">
          {muted ? '🔇 Unmute' : '🎙 Mute'}
        </button>
        <button onClick={switchCamera} className="px-4 py-2 bg-white/80 text-black rounded">
          🔁 Switch Camera
        </button>
        <button className="px-4 py-2 bg-red-600 text-white rounded">❌ End</button>
        <button className="px-4 py-2 bg-green-600 text-white rounded">⏭ Next</button>
      </div>
    </div>
  );
};

export default VideoChat;
