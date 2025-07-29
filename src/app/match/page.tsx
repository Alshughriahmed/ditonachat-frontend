'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { io, Socket } from 'socket.io-client';

interface PartnerInfo {
  id: string;
  country: string;
  gender: string;
  likes: number;
  isVIP: boolean;
  age?: number;
  interests?: string[];
}

export default function MatchPage() {
  const router = useRouter();
  
  // Video refs
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  
  // WebRTC and Socket refs
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const socketRef = useRef<Socket | null>(null);
  
  // State management
  const [connectionStatus, setConnectionStatus] = useState('🔍 جاري البحث عن شريك...');
  const [isConnected, setIsConnected] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [currentCamera, setCurrentCamera] = useState<'user' | 'environment'>('user');
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{id: string, message: string, sender: 'me' | 'partner', timestamp: Date}>>([]);
  
  // Partner information
  const [partnerInfo, setPartnerInfo] = useState<PartnerInfo | null>(null);
  
  // User preferences
  const [selectedGender, setSelectedGender] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');
  
  // Video controls
  const [videoPosition, setVideoPosition] = useState({ x: 20, y: 20 });
  const [isVideoMinimized, setIsVideoMinimized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Countries list
  const countries = [
    { code: 'all', name: '🌍 جميع الدول', flag: '🌍' },
    { code: 'sa', name: '🇸🇦 السعودية', flag: '🇸🇦' },
    { code: 'ae', name: '🇦🇪 الإمارات', flag: '🇦🇪' },
    { code: 'eg', name: '🇪🇬 مصر', flag: '🇪🇬' },
    { code: 'jo', name: '🇯🇴 الأردن', flag: '🇯🇴' },
    { code: 'lb', name: '🇱🇧 لبنان', flag: '🇱🇧' },
    { code: 'sy', name: '🇸🇾 سوريا', flag: '🇸🇾' },
    { code: 'iq', name: '🇮🇶 العراق', flag: '🇮🇶' },
    { code: 'kw', name: '🇰🇼 الكويت', flag: '🇰🇼' },
    { code: 'qa', name: '🇶🇦 قطر', flag: '🇶🇦' },
    { code: 'bh', name: '🇧🇭 البحرين', flag: '🇧🇭' },
    { code: 'om', name: '🇴🇲 عُمان', flag: '🇴🇲' },
    { code: 'ye', name: '🇾🇪 اليمن', flag: '🇾🇪' },
    { code: 'ma', name: '🇲🇦 المغرب', flag: '🇲🇦' },
    { code: 'dz', name: '🇩🇿 الجزائر', flag: '🇩🇿' },
    { code: 'tn', name: '🇹🇳 تونس', flag: '🇹🇳' },
    { code: 'ly', name: '🇱🇾 ليبيا', flag: '🇱🇾' },
    { code: 'sd', name: '🇸🇩 السودان', flag: '🇸🇩' },
    { code: 'us', name: '🇺🇸 الولايات المتحدة', flag: '🇺🇸' },
    { code: 'gb', name: '🇬🇧 المملكة المتحدة', flag: '🇬🇧' }
  ];

  // Initialize everything on component mount
  useEffect(() => {
    // Load user preferences
    const savedPrefs = localStorage.getItem('userPreferences');
    if (savedPrefs) {
      const prefs = JSON.parse(savedPrefs);
      setSelectedGender(prefs.gender || 'all');
      setSelectedCountry(prefs.country || 'all');
    }

    initializeCamera();
    initializeSocket();
    getCameraDevices();

    // Cleanup function
    const cleanup = () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };

    return cleanup;
  }, []);

  const initializeSocket = () => {
    socketRef.current = io('https://kkh7ikcl85ln.manus.space', {
      path: '/ws',
      transports: ['websocket'],
      reconnection: true,
    });

    // Make socket available globally for debugging
    (window as any).socket = socketRef.current;

    socketRef.current.on('connect', () => {
      setConnectionStatus('🔍 جاري البحث عن شريك...');
      setIsConnected(true);
      // Auto-start matching when connected
      socketRef.current?.emit('find-partner', { gender: selectedGender, country: selectedCountry });
    });

    socketRef.current.on('disconnect', () => {
      setConnectionStatus('❌ انقطع الاتصال');
      setIsConnected(false);
      setRoomId(null);
      setPartnerInfo(null);
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setConnectionStatus('❌ خطأ في الاتصال');
      setIsConnected(false);
    });

    socketRef.current.on('matched', (data: { roomId: string, partnerId: string, partnerInfo?: PartnerInfo }) => {
      console.log('Matched with partner:', data);
      setRoomId(data.roomId);
      setConnectionStatus(`✅ متصل بالغرفة: ${data.roomId.substring(0, 8)}...`);
      
      // Set partner info (mock data for now)
      setPartnerInfo({
        id: data.partnerId,
        country: 'eg', // Mock data
        gender: 'male',
        likes: Math.floor(Math.random() * 1000) + 50,
        isVIP: Math.random() > 0.7,
        age: Math.floor(Math.random() * 20) + 18,
        interests: ['الموسيقى', 'السفر', 'الرياضة']
      });
      
      initializePeerConnection();
    });

    socketRef.current.on('waiting', () => {
      setConnectionStatus('⏳ في قائمة الانتظار...');
    });

    socketRef.current.on('offer', async (offer: RTCSessionDescriptionInit) => {
      console.log('Received offer:', offer);
      if (peerConnectionRef.current) {
        try {
          await peerConnectionRef.current.setRemoteDescription(offer);
          const answer = await peerConnectionRef.current.createAnswer();
          await peerConnectionRef.current.setLocalDescription(answer);
          socketRef.current?.emit('answer', answer);
        } catch (error) {
          console.error('Error handling offer:', error);
        }
      }
    });

    socketRef.current.on('answer', async (answer: RTCSessionDescriptionInit) => {
      console.log('Received answer:', answer);
      if (peerConnectionRef.current) {
        try {
          await peerConnectionRef.current.setRemoteDescription(answer);
        } catch (error) {
          console.error('Error handling answer:', error);
        }
      }
    });

    socketRef.current.on('ice-candidate', async (candidate: RTCIceCandidateInit) => {
      console.log('Received ICE candidate:', candidate);
      if (peerConnectionRef.current) {
        try {
          await peerConnectionRef.current.addIceCandidate(candidate);
        } catch (error) {
          console.error('Error adding ICE candidate:', error);
        }
      }
    });

    socketRef.current.on('partner-disconnected', () => {
      console.log('Partner disconnected');
      setConnectionStatus('💔 انقطع الاتصال مع الشريك');
      setRoomId(null);
      setPartnerInfo(null);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
      // Auto-search for new partner after 2 seconds
      setTimeout(() => {
        if (socketRef.current?.connected) {
          findNextPartner();
        }
      }, 2000);
    });

    socketRef.current.on('room-full', () => {
      setConnectionStatus('🚫 الغرفة ممتلئة');
    });

    socketRef.current.on('error', (error: any) => {
      console.error('Socket error:', error);
      setConnectionStatus('❌ خطأ في الخادم');
    });

    // Chat message handling
    socketRef.current.on('chat-message', (data: { message: string, senderId: string }) => {
      const newMessage = {
        id: Date.now().toString(),
        message: data.message,
        sender: data.senderId === socketRef.current?.id ? 'me' : 'partner' as 'me' | 'partner',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, newMessage]);
    });
  };

  const initializePeerConnection = async () => {
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun3.l.google.com:19302' },
        { urls: 'stun:stun4.l.google.com:19302' }
      ],
      iceCandidatePoolSize: 10
    };

    // Close existing connection if any
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }

    peerConnectionRef.current = new RTCPeerConnection(configuration);

    // Add local stream to peer connection
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        peerConnectionRef.current?.addTrack(track, localStreamRef.current!);
      });
    }

    // Handle remote stream
    peerConnectionRef.current.ontrack = (event) => {
      console.log('Received remote track:', event);
      if (remoteVideoRef.current && event.streams[0]) {
        remoteVideoRef.current.srcObject = event.streams[0];
        setConnectionStatus('🎥 متصل - جاري عرض الفيديو');
      }
    };

    // Handle ICE candidates
    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('Sending ICE candidate:', event.candidate);
        socketRef.current?.emit('ice-candidate', event.candidate);
      }
    };

    // Handle connection state changes
    peerConnectionRef.current.onconnectionstatechange = () => {
      const state = peerConnectionRef.current?.connectionState;
      console.log('Connection state changed:', state);
      
      switch (state) {
        case 'connected':
          setConnectionStatus('🎥 متصل بنجاح');
          break;
        case 'disconnected':
          setConnectionStatus('💔 انقطع الاتصال');
          break;
        case 'failed':
          setConnectionStatus('❌ فشل الاتصال');
          // Try to reconnect
          setTimeout(() => {
            if (roomId) {
              initializePeerConnection();
            }
          }, 2000);
          break;
        case 'connecting':
          setConnectionStatus('🔄 جاري الاتصال...');
          break;
      }
    };

    // Handle ICE connection state changes
    peerConnectionRef.current.oniceconnectionstatechange = () => {
      const state = peerConnectionRef.current?.iceConnectionState;
      console.log('ICE connection state:', state);
      
      if (state === 'failed' || state === 'disconnected') {
        // Try to restart ICE
        peerConnectionRef.current?.restartIce();
      }
    };

    // Create and send offer if we're the initiator
    try {
      const offer = await peerConnectionRef.current.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });
      await peerConnectionRef.current.setLocalDescription(offer);
      socketRef.current?.emit('offer', offer);
      console.log('Sent offer:', offer);
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  };

  const initializeCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: currentCamera,
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
          frameRate: { ideal: 30, min: 15 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Log camera info
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        console.log('Camera initialized:', videoTrack.label);
        console.log('Video settings:', videoTrack.getSettings());
      }

      setConnectionStatus('📷 الكاميرا جاهزة - جاري الاتصال...');
    } catch (error) {
      console.error('Error accessing camera:', error);
      setConnectionStatus('❌ خطأ في الوصول للكاميرا');
      
      // Try with basic constraints as fallback
      try {
        const basicStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        localStreamRef.current = basicStream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = basicStream;
        }
        setConnectionStatus('📷 الكاميرا جاهزة (وضع أساسي)');
      } catch (basicError) {
        console.error('Basic camera access failed:', basicError);
        setConnectionStatus('❌ فشل في الوصول للكاميرا');
      }
    }
  };

  const getCameraDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter(device => device.kind === 'videoinput');
      setAvailableCameras(cameras);
    } catch (error) {
      console.error('Error getting camera devices:', error);
    }
  };

  const switchCamera = async () => {
    const newCamera = currentCamera === 'user' ? 'environment' : 'user';
    setCurrentCamera(newCamera);
    
    try {
      // Stop current stream
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      
      // Get new stream with better constraints
      const constraints = {
        video: {
          facingMode: newCamera,
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      // Update peer connection with new stream
      if (peerConnectionRef.current) {
        const videoTrack = stream.getVideoTracks()[0];
        const audioTrack = stream.getAudioTracks()[0];
        
        const videoSender = peerConnectionRef.current.getSenders().find(s => 
          s.track && s.track.kind === 'video'
        );
        const audioSender = peerConnectionRef.current.getSenders().find(s => 
          s.track && s.track.kind === 'audio'
        );
        
        if (videoSender && videoTrack) {
          await videoSender.replaceTrack(videoTrack);
        }
        if (audioSender && audioTrack) {
          await audioSender.replaceTrack(audioTrack);
        }
      }
    } catch (error) {
      console.error('Error switching camera:', error);
      setConnectionStatus('❌ خطأ في تبديل الكاميرا');
    }
  };

  const switchToSpecificCamera = async (deviceId: string) => {
    try {
      // Stop current stream
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      
      // Get new stream with specific device
      const constraints = {
        video: {
          deviceId: { exact: deviceId },
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      // Update peer connection
      if (peerConnectionRef.current) {
        const videoTrack = stream.getVideoTracks()[0];
        const audioTrack = stream.getAudioTracks()[0];
        
        const videoSender = peerConnectionRef.current.getSenders().find(s => 
          s.track && s.track.kind === 'video'
        );
        const audioSender = peerConnectionRef.current.getSenders().find(s => 
          s.track && s.track.kind === 'audio'
        );
        
        if (videoSender && videoTrack) {
          await videoSender.replaceTrack(videoTrack);
        }
        if (audioSender && audioTrack) {
          await audioSender.replaceTrack(audioTrack);
        }
      }
    } catch (error) {
      console.error('Error switching to specific camera:', error);
      setConnectionStatus('❌ خطأ في تبديل الكاميرا');
    }
  };

  const findNextPartner = () => {
    setConnectionStatus('🔍 جاري البحث عن شريك جديد...');
    setPartnerInfo(null);
    setChatMessages([]);
    
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    
    socketRef.current?.emit('find-partner', { gender: selectedGender, country: selectedCountry });
  };

  const stopChat = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    router.push('/');
  };

  const sendLike = () => {
    if (partnerInfo && socketRef.current) {
      socketRef.current.emit('send-like', { partnerId: partnerInfo.id });
      // Show visual feedback
      setConnectionStatus('❤️ تم إرسال الإعجاب!');
      setTimeout(() => {
        setConnectionStatus('🎥 متصل بنجاح');
      }, 2000);
    }
  };

  const sendChatMessage = () => {
    if (chatMessage.trim() && socketRef.current) {
      const newMessage = {
        id: Date.now().toString(),
        message: chatMessage.trim(),
        sender: 'me' as 'me' | 'partner',
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, newMessage]);
      socketRef.current.emit('chat-message', { message: chatMessage.trim() });
      setChatMessage('');
    }
  };

  const reportUser = () => {
    if (partnerInfo && socketRef.current) {
      socketRef.current.emit('report-user', { partnerId: partnerInfo.id, reason: 'inappropriate_behavior' });
      setConnectionStatus('⚠️ تم الإبلاغ عن المستخدم');
      setTimeout(() => {
        findNextPartner();
      }, 2000);
    }
  };

  const handleVideoMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    const startX = e.clientX - videoPosition.x;
    const startY = e.clientY - videoPosition.y;

    const handleMouseMove = (e: MouseEvent) => {
      setVideoPosition({
        x: e.clientX - startX,
        y: e.clientY - startY
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const getCountryFlag = (countryCode: string) => {
    const country = countries.find(c => c.code === countryCode);
    return country ? country.flag : '🌍';
  };

  const getCountryName = (countryCode: string) => {
    const country = countries.find(c => c.code === countryCode);
    return country ? country.name.split(' ')[1] : 'غير محدد';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Remote video (main screen) */}
      <div className="absolute inset-0 bg-black">
        {partnerInfo ? (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900">
            <div className="text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-2xl font-bold mb-2">جاري البحث عن شريك...</h2>
              <p className="text-gray-300">يرجى الانتظار بينما نجد لك شخصًا مناسبًا</p>
            </div>
          </div>
        )}
      </div>

      {/* Header with connection status and partner info */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-black bg-opacity-50 p-4 header">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className={`text-lg font-semibold status-indicator ${
              connectionStatus.includes('متصل') ? 'status-connected' : 
              connectionStatus.includes('جاري') ? 'status-connecting' : 'status-disconnected'
            } connection-status`}>
              {connectionStatus}
            </div>
            
            {/* Partner Info */}
            {partnerInfo && (
              <div className="flex items-center space-x-3 rtl:space-x-reverse bg-black bg-opacity-30 rounded-lg px-3 py-2">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="text-lg">{getCountryFlag(partnerInfo.country)}</span>
                  <span className="text-sm">{getCountryName(partnerInfo.country)}</span>
                </div>
                
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="text-lg">{partnerInfo.gender === 'male' ? '👨' : '👩'}</span>
                  {partnerInfo.age && <span className="text-sm">{partnerInfo.age}</span>}
                </div>
                
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="text-lg">❤️</span>
                  <span className="text-sm">{partnerInfo.likes}</span>
                </div>
                
                {partnerInfo.isVIP && (
                  <div className="flex items-center">
                    <span className="text-lg">👑</span>
                    <span className="text-xs bg-yellow-500 text-black px-2 py-1 rounded-full ml-1">VIP</span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            {/* Report button */}
            {partnerInfo && (
              <button
                onClick={reportUser}
                className="p-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                title="الإبلاغ عن المستخدم"
                aria-label="الإبلاغ عن المستخدم"
              >
                ⚑
              </button>
            )}
            
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors settings-button"
              aria-label="الإعدادات"
            >
              ⚙️
            </button>
          </div>
        </div>
      </div>

      {/* Settings Sidebar */}
      {showSettings && (
        <div className="absolute top-0 right-0 h-full w-80 bg-gray-800 z-30 p-6 overflow-y-auto settings-sidebar">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">الإعدادات</h2>
            <button
              onClick={() => setShowSettings(false)}
              className="text-2xl hover:text-gray-400 transition-colors"
              aria-label="إغلاق الإعدادات"
            >
              ✕
            </button>
          </div>

          {/* Gender Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">من تريد التحدث معه؟</label>
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">🌐 الجميع</option>
              <option value="male">👨 ذكر</option>
              <option value="female">👩 أنثى</option>
              <option value="lgbtq" disabled>🏳️‍🌈 مثليي الجنس 🔒 (VIP)</option>
            </select>
          </div>

          {/* Country Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">اختر البلد</label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
            >
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          {/* Camera Settings */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">إعدادات الكاميرا</label>
            <div className="space-y-2">
              <button
                onClick={switchCamera}
                className="w-full p-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                📷 تبديل الكاميرا ({currentCamera === 'user' ? 'أمامية' : 'خلفية'})
              </button>
              
              {/* Available cameras list */}
              {availableCameras.length > 1 && (
                <div className="mt-3">
                  <label className="block text-xs text-gray-400 mb-1">الكاميرات المتوفرة:</label>
                  <div className="space-y-1">
                    {availableCameras.map((camera, index) => (
                      <button
                        key={camera.deviceId}
                        onClick={() => switchToSpecificCamera(camera.deviceId)}
                        className="w-full p-2 text-sm bg-gray-700 rounded hover:bg-gray-600 transition-colors text-left"
                      >
                        📹 {camera.label || `كاميرا ${index + 1}`}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Premium Features */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">ميزات مدفوعة 🔒</label>
            <div className="space-y-2">
              <button
                disabled
                className="w-full p-3 bg-gray-600 rounded-lg opacity-50 cursor-not-allowed"
              >
                🔙 العودة للمستخدم السابق
              </button>
              <button
                disabled
                className="w-full p-3 bg-gray-600 rounded-lg opacity-50 cursor-not-allowed"
              >
                🎭 إخفاء الهوية
              </button>
              <button
                disabled
                className="w-full p-3 bg-gray-600 rounded-lg opacity-50 cursor-not-allowed"
              >
                🌍 ترجمة فورية
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            <button
              onClick={() => router.push('/chat-settings')}
              className="w-full p-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
            >
              ⚙️ إعدادات الدردشة
            </button>
            <button
              onClick={() => router.push('/vip')}
              className="w-full p-3 bg-yellow-600 rounded-lg hover:bg-yellow-700 transition-colors"
            >
              👑 ترقية إلى VIP
            </button>
          </div>
        </div>
      )}

      {/* Chat Sidebar */}
      {showChat && (
        <div className="absolute top-0 left-0 h-full w-80 bg-gray-800 z-30 flex flex-col">
          <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <h2 className="text-xl font-bold">💬 الدردشة</h2>
            <button
              onClick={() => setShowChat(false)}
              className="text-2xl hover:text-gray-400 transition-colors"
            >
              ✕
            </button>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`p-3 rounded-lg max-w-xs ${
                  msg.sender === 'me'
                    ? 'bg-blue-600 ml-auto text-right'
                    : 'bg-gray-700 mr-auto text-left'
                }`}
              >
                <p className="text-sm">{msg.message}</p>
                <p className="text-xs text-gray-300 mt-1">
                  {msg.timestamp.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            ))}
          </div>
          
          {/* Message Input */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex space-x-2 rtl:space-x-reverse">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                placeholder="اكتب رسالة..."
                className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={sendChatMessage}
                disabled={!chatMessage.trim()}
                className="p-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                📤
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Local video (draggable) */}
      <div
        className={`absolute z-10 cursor-move draggable-video video-container ${
          isVideoMinimized ? 'w-32 h-24 local-video' : 'w-48 h-36 local-video'
        }`}
        style={{
          right: `${videoPosition.x}px`,
          bottom: `${videoPosition.y}px`,
        }}
        onMouseDown={handleVideoMouseDown}
        onTouchStart={(e) => {
          const touch = e.touches[0];
          const startX = touch.clientX - videoPosition.x;
          const startY = touch.clientY - videoPosition.y;

          const handleTouchMove = (e: TouchEvent) => {
            e.preventDefault();
            const touch = e.touches[0];
            setVideoPosition({
              x: touch.clientX - startX,
              y: touch.clientY - startY
            });
          };

          const handleTouchEnd = () => {
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
          };

          document.addEventListener('touchmove', handleTouchMove, { passive: false });
          document.addEventListener('touchend', handleTouchEnd);
        }}
      >
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover rounded-lg border-2 border-green-500 shadow-lg"
          style={{ transform: 'scaleX(-1)' }}
        />
        <button
          onClick={() => setIsVideoMinimized(!isVideoMinimized)}
          className="absolute top-1 right-1 w-6 h-6 bg-black bg-opacity-50 rounded-full text-xs hover:bg-opacity-70 transition-all"
          aria-label={isVideoMinimized ? 'تكبير الفيديو' : 'تصغير الفيديو'}
        >
          {isVideoMinimized ? '🔍' : '📐'}
        </button>
      </div>

      {/* Control buttons */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-black bg-opacity-50 p-4">
        <div className="flex justify-center items-center space-x-4 rtl:space-x-reverse control-buttons">
          {/* Previous button (disabled/premium) */}
          <button
            disabled
            className="p-3 bg-gray-600 rounded-full opacity-50 cursor-not-allowed transition-all"
            title="ميزة مدفوعة"
            aria-label="المستخدم السابق (ميزة مدفوعة)"
          >
            <span className="text-sm">↩️ السابق 🔒</span>
          </button>

          {/* Next button */}
          <button
            onClick={findNextPartner}
            className="p-3 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors active:scale-95"
            title="التالي"
            aria-label="البحث عن شريك جديد"
          >
            <span className="text-sm">🔄 التالي</span>
          </button>

          {/* Like button */}
          {partnerInfo && (
            <button
              onClick={sendLike}
              className="p-3 bg-pink-600 rounded-full hover:bg-pink-700 transition-colors active:scale-95"
              title="إعجاب"
              aria-label="إرسال إعجاب"
            >
              <span className="text-sm">❤️ إعجاب</span>
            </button>
          )}

          {/* Chat button */}
          <button
            onClick={() => setShowChat(!showChat)}
            className="p-3 bg-purple-600 rounded-full hover:bg-purple-700 transition-colors active:scale-95"
            title="الدردشة"
            aria-label="فتح الدردشة"
          >
            <span className="text-sm">💬 دردشة</span>
          </button>

          {/* Camera switch button */}
          <button
            onClick={switchCamera}
            className="p-3 bg-green-600 rounded-full hover:bg-green-700 transition-colors active:scale-95"
            title="تبديل الكاميرا"
            aria-label="تبديل الكاميرا"
          >
            📷
          </button>

          {/* Stop button */}
          <button
            onClick={stopChat}
            className="p-3 bg-red-600 rounded-full hover:bg-red-700 transition-colors active:scale-95"
            title="إيقاف"
            aria-label="إيقاف المحادثة"
          >
            <span className="text-sm">🛑 إيقاف</span>
          </button>
        </div>
      </div>

      {/* Mobile responsive adjustments */}
      <style jsx>{`
        @media (max-width: 768px) {
          .settings-sidebar {
            width: 100% !important;
            height: 100% !important;
          }
          
          .control-buttons {
            flex-wrap: wrap;
            gap: 8px;
          }
          
          .control-buttons button {
            min-width: 60px;
            padding: 8px 12px;
            font-size: 14px;
          }
          
          .local-video {
            width: 120px !important;
            height: 90px !important;
          }
          
          .connection-status {
            font-size: 14px;
            padding: 8px 12px;
          }
        }
        
        @media (max-width: 480px) {
          .control-buttons {
            justify-content: center;
          }
          
          .control-buttons button {
            min-width: 50px;
            padding: 6px 8px;
            font-size: 12px;
          }
          
          .local-video {
            width: 100px !important;
            height: 75px !important;
          }
          
          .settings-sidebar {
            padding: 16px;
          }
          
          .connection-status {
            font-size: 12px;
            padding: 6px 8px;
          }
        }
        
        /* Touch-friendly interactions */
        @media (hover: none) and (pointer: coarse) {
          .control-buttons button {
            min-height: 44px;
            min-width: 44px;
          }
          
          .settings-button {
            min-height: 44px;
            min-width: 44px;
          }
        }
        
        /* Landscape orientation on mobile */
        @media (max-width: 768px) and (orientation: landscape) {
          .header {
            padding: 8px 16px;
          }
          
          .control-buttons {
            padding: 8px 16px;
          }
          
          .local-video {
            width: 160px !important;
            height: 120px !important;
          }
        }
        
        /* High DPI displays */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
          .local-video, .remote-video {
            image-rendering: -webkit-optimize-contrast;
            image-rendering: crisp-edges;
          }
        }
        
        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .bg-gray-900 {
            background-color: #0a0a0a;
          }
          
          .bg-gray-800 {
            background-color: #1a1a1a;
          }
          
          .bg-gray-700 {
            background-color: #2a2a2a;
          }
        }
        
        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
        
        /* Focus indicators for accessibility */
        button:focus-visible {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }
        
        select:focus-visible {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }
        
        /* Loading animation */
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        .loading {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        /* Video container improvements */
        .video-container {
          position: relative;
          overflow: hidden;
          border-radius: 8px;
        }
        
        .video-container video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        /* Draggable video improvements */
        .draggable-video {
          touch-action: none;
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
        }
        
        .draggable-video:active {
          cursor: grabbing;
        }
        
        /* Connection status indicator */
        .status-indicator {
          position: relative;
        }
        
        .status-indicator::before {
          content: '';
          position: absolute;
          left: -12px;
          top: 50%;
          transform: translateY(-50%);
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: currentColor;
        }
        
        .status-connected::before {
          background-color: #10b981;
          box-shadow: 0 0 8px #10b981;
        }
        
        .status-connecting::before {
          background-color: #f59e0b;
          animation: pulse 1s infinite;
        }
        
        .status-disconnected::before {
          background-color: #ef4444;
        }
      `}</style>
    </div>
  );
}

