
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export default function ChatPage() {
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const [status, setStatus] = useState('🟡 Connecting...');
  const [micEnabled, setMicEnabled] = useState(true);
  const [camEnabled, setCamEnabled] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const signalingServerUrl = process.env.NEXT_PUBLIC_SIGNALING_URL || 'https://ditonachat-backend.onrender.com';

  useEffect(() => {
    // Initialize Socket.IO
    socketRef.current = io(signalingServerUrl, {
      path: '/ws',
      transports: ['websocket'],
      reconnection: true,
    });

    socketRef.current.on('connect', () => {
      setStatus('🟢 Connected. Waiting for partner...');
      setError(null);
    });

    socketRef.current.on('disconnect', (reason) => {
      setStatus('🔴 Disconnected: ' + reason);
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
    });

    socketRef.current.on('connect_error', (err) => {
      setStatus('❌ Connection Error');
      setError(`Failed to connect to signaling server: ${err.message}`);
      console.error('Socket.IO connection error:', err);
    });

    socketRef.current.on('partner', async ({ partnerId, isInitiator }: { partnerId: string, isInitiator: boolean }) => {
      setStatus(`Partner found: ${partnerId}. ${isInitiator ? 'Initiating call...' : 'Receiving call...'}`);
      setError(null);

      // Create RTCPeerConnection
      peerConnectionRef.current = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
        ],
      });

      // Add local tracks to peer connection
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        (localVideoRef.current.srcObject as MediaStream).getTracks().forEach(track => {
          peerConnectionRef.current?.addTrack(track, localVideoRef.current?.srcObject as MediaStream);
        });
      }

      // Handle remote tracks
      peerConnectionRef.current.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
          setStatus('🟢 Connected with partner.');
        }
      };

      // Handle ICE candidates
      peerConnectionRef.current.onicecandidate = (event) => {
        if (event.candidate) {
          socketRef.current?.emit('ice-candidate', { target: partnerId, candidate: event.candidate });
        }
      };

      if (isInitiator) {
        const offer = await peerConnectionRef.current.createOffer();
        await peerConnectionRef.current.setLocalDescription(offer);
        socketRef.current?.emit('offer', { target: partnerId, offer });
      }

      socketRef.current.on('offer', async ({ offer }) => {
        if (peerConnectionRef.current) {
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await peerConnectionRef.current.createAnswer();
          await peerConnectionRef.current.setLocalDescription(answer);
          socketRef.current?.emit('answer', { target: partnerId, answer });
        }
      });

      socketRef.current.on('answer', async ({ answer }) => {
        if (peerConnectionRef.current) {
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
        }
      });

      socketRef.current.on('ice-candidate', async ({ candidate }) => {
        if (peerConnectionRef.current) {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        }
      });

      socketRef.current.on('chat-message', (message: string) => {
        setMessages((prevMessages) => [...prevMessages, `Partner: ${message}`]);
      });

      socketRef.current.on('partner-disconnected', () => {
        setStatus('Partner disconnected. Waiting for new partner...');
        if (peerConnectionRef.current) {
          peerConnectionRef.current.close();
          peerConnectionRef.current = null;
        }
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = null;
        }
      });
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [signalingServerUrl]);

  useEffect(() => {
    // Get local media stream
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      })
      .catch(err => {
        console.error('Error accessing media devices:', err);
        setError('Failed to access camera/microphone. Please ensure permissions are granted.');
      });
  }, []);

  const toggleMic = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      (localVideoRef.current.srcObject as MediaStream).getAudioTracks().forEach(track => {
        track.enabled = !micEnabled;
      });
      setMicEnabled(!micEnabled);
    }
  };

  const toggleCam = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      (localVideoRef.current.srcObject as MediaStream).getVideoTracks().forEach(track => {
        track.enabled = !camEnabled;
      });
      setCamEnabled(!camEnabled);
    }
  };

  const sendMessage = () => {
    if (messageInput.trim() && socketRef.current && peerConnectionRef.current) {
      socketRef.current.emit('chat-message', { target: socketRef.current.id === peerConnectionRef.current.localDescription?.sdp?.split('a=msid:')[1]?.split(' ')[0] ? peerConnectionRef.current.remoteDescription?.sdp?.split('a=msid:')[1]?.split(' ')[0] : peerConnectionRef.current.localDescription?.sdp?.split('a=msid:')[1]?.split(' ')[0], message: messageInput });
      setMessages((prevMessages) => [...prevMessages, `You: ${messageInput}`]);
      setMessageInput('');
    }
  };

  const endCall = () => {
    if (socketRef.current) {
      socketRef.current.emit('end-call');
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      (localVideoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    setStatus('Call ended. Waiting for new partner...');
  };

  const retryConnection = () => {
    setError(null);
    setStatus('🟡 Reconnecting...');
    socketRef.current?.disconnect();
    socketRef.current?.connect();
  };

  return (
    <div className="relative flex flex-col h-screen bg-gray-900 text-white">
      {/* Status Bar */}
      <div className="flex items-center justify-between p-4 bg-gray-800 shadow-md">
        <div className="flex items-center space-x-2">
          <span className={`w-3 h-3 rounded-full ${status.startsWith('🟢') ? 'bg-green-500' : status.startsWith('🟡') ? 'bg-yellow-500' : 'bg-red-500'}`}></span>
          <span>{status}</span>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={toggleMic} className="p-2 rounded-full bg-gray-700 hover:bg-gray-600">
            {micEnabled ? '🎤' : '🔇'}
          </button>
          <button onClick={toggleCam} className="p-2 rounded-full bg-gray-700 hover:bg-gray-600">
            {camEnabled ? '📹' : '📷'}
          </button>
          <button onClick={() => setChatOpen(!chatOpen)} className="p-2 rounded-full bg-gray-700 hover:bg-gray-600">
            💬
          </button>
          <button onClick={endCall} className="p-2 rounded-full bg-red-600 hover:bg-red-700">
            📞 End Call
          </button>
        </div>
      </div>

      {/* Main Video Area */}
      <div className="flex-grow relative bg-black flex items-center justify-center">
        {remoteVideoRef.current?.srcObject ? (
          <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
        ) : (
          <div className="text-gray-500 text-2xl">Waiting for partner...</div>
        )}

        {/* Local Video (Picture-in-Picture) */}
        <video ref={localVideoRef} autoPlay muted playsInline className="absolute bottom-4 right-4 w-40 h-30 border-2 border-gray-600 rounded-lg"></video>
      </div>

      {/* Chat Panel */}
      <div className={`absolute bottom-0 left-0 w-full bg-gray-800 transition-transform duration-300 ease-in-out transform ${chatOpen ? 'translate-y-0' : 'translate-y-full'} h-1/3 flex flex-col`}>
        <div className="flex-grow p-4 overflow-y-auto">
          {messages.map((msg, index) => (
            <p key={index} className="mb-1 text-sm">{msg}</p>
          ))}
        </div>
        <div className="flex p-4 border-t border-gray-700">
          <input
            type="text"
            className="flex-grow p-2 rounded-l-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-blue-500"
            placeholder="Type your message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                sendMessage();
              }
            }}
          />
          <button onClick={sendMessage} className="p-2 rounded-r-lg bg-blue-600 hover:bg-blue-700">
            Send
          </button>
        </div>
      </div>

      {/* Error Overlay */}
      {error && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center z-50">
          <p className="text-red-500 text-xl mb-4">Error: {error}</p>
          <button onClick={retryConnection} className="p-3 bg-blue-600 hover:bg-blue-700 rounded-lg">
            Retry Connection
          </button>
        </div>
      )}
    </div>
  );
}



