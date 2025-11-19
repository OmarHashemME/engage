import React, { useState, useRef, useEffect } from 'react';
import LessonLayout, { LessonLayoutProps } from './LessonLayout';
import Quiz from './Quiz';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { StopIcon } from './icons/StopIcon';

// Web Worker code for MP3 encoding
const mp3WorkerCode = `
  importScripts('https://cdn.jsdelivr.net/npm/lamejs@1.2.1/lame.min.js');

  let encoder;
  let maxSamples = 1152; 
  let samplesMono;
  let config = { sampleRate: 44100, bitRate: 128 };
  let dataBuffer = [];

  self.onmessage = function(e) {
    switch (e.data.command) {
      case 'init':
        config = e.data.config || config;
        encoder = new lamejs.Mp3Encoder(1, config.sampleRate, config.bitRate);
        break;
      case 'encode':
        if (!encoder) return;
        let input = e.data.buffer;
        let len = input.length;
        let data = new Int16Array(len);
        for (let i = 0; i < len; i++) {
          let s = Math.max(-1, Math.min(1, input[i]));
          data[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }
        let mp3buf = encoder.encodeBuffer(data);
        if (mp3buf.length > 0) {
          dataBuffer.push(mp3buf);
        }
        break;
      case 'finish':
        if (!encoder) return;
        let mp3bufLast = encoder.flush();
        if (mp3bufLast.length > 0) {
          dataBuffer.push(mp3bufLast);
        }
        self.postMessage({ command: 'end', buffer: dataBuffer });
        dataBuffer = [];
        break;
    }
  };
`;

// Speaking Lesson Strategy: Used for Speaking type lessons.
// Displays Quiz AND Audio Recorder.
const SpeakingLesson: React.FC<Omit<LessonLayoutProps, 'children'>> = (props) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    return () => cleanupAudio();
  }, []);

  const cleanupAudio = () => {
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
  };

  const startRecording = async () => {
    try {
      const blob = new Blob([mp3WorkerCode], { type: "text/javascript" });
      workerRef.current = new Worker(window.URL.createObjectURL(blob));
      
      workerRef.current.onmessage = (e) => {
        if (e.data.command === 'end') {
          const blob = new Blob(e.data.buffer, { type: 'audio/mp3' });
          const url = window.URL.createObjectURL(blob);
          setAudioUrl(url);
          setIsProcessing(false);
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;
      
      workerRef.current.postMessage({ 
        command: 'init', 
        config: { sampleRate: audioContext.sampleRate, bitRate: 128 } 
      });

      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1); 
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        const channelData = e.inputBuffer.getChannelData(0);
        workerRef.current?.postMessage({ command: 'encode', buffer: channelData });
      };

      source.connect(processor);
      processor.connect(audioContext.destination);

      setIsRecording(true);
      setAudioUrl(null);
    } catch (err) {
      console.error("Error starting recording:", err);
      alert("Could not access microphone. Please ensure permissions are granted.");
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsProcessing(true);
    
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (processorRef.current && audioContextRef.current) {
      processorRef.current.disconnect();
    }
    workerRef.current?.postMessage({ command: 'finish' });
  };

  return (
    <LessonLayout {...props}>
      <div className="grid gap-8 mb-8 grid-cols-1 max-w-2xl">
          {/* Quiz Section */}
          <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Quiz</h3>
                <Quiz 
                  quizData={props.lesson.quiz} 
                  onCorrect={props.onComplete}
                  isLessonCompleted={props.isCompleted}
              />
          </div>

          {/* Recorder Section */}
          <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Speaking Practice</h3>
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 flex flex-col items-center text-center">
                  <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Record yourself summarizing the lesson.</p>
                      <p className="text-xs text-gray-500">Recording converts to MP3 instantly for compatibility.</p>
                  </div>

                  {!isRecording ? (
                      <button
                          onClick={startRecording}
                          className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300"
                          title="Start Recording"
                      >
                          <MicrophoneIcon className="w-8 h-8" />
                      </button>
                  ) : (
                      <div className="flex flex-col items-center">
                          <div className="animate-pulse text-red-500 font-bold mb-2">Recording...</div>
                          <button
                              onClick={stopRecording}
                              className="w-16 h-16 bg-gray-800 hover:bg-gray-900 rounded-md flex items-center justify-center text-white shadow-lg transition-colors focus:outline-none focus:ring-4 focus:ring-gray-300"
                              title="Stop Recording"
                          >
                              <StopIcon className="w-8 h-8" />
                          </button>
                      </div>
                  )}

                  {isProcessing && (
                      <div className="mt-4 flex items-center text-sm text-indigo-600">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Converting to MP3...
                      </div>
                  )}

                  {audioUrl && !isProcessing && !isRecording && (
                      <div className="mt-6 w-full animate-fade-in">
                          <p className="text-sm font-medium text-green-600 mb-2">Recording Ready</p>
                          <audio controls src={audioUrl} className="w-full" />
                          <a 
                            href={audioUrl} 
                            download={`recording-${props.lesson.id}.mp3`}
                            className="mt-2 text-xs text-indigo-600 hover:underline inline-block"
                          >
                            Download MP3
                          </a>
                      </div>
                  )}
                </div>
          </div>
      </div>
    </LessonLayout>
  );
};

export default SpeakingLesson;
