import React, { useState, useRef } from "react";
import { Button } from "react-bootstrap";
import { Mic, StopCircle, Trash } from "react-bootstrap-icons";

interface VoiceRecorderProps {
    onRecorded: (blob: Blob) => void;
    onSend: () => void;
    
  }

export const VoiceRecorder :React.FC<VoiceRecorderProps> = ({ onRecorded,onSend }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);

  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      // Reset previous data
      chunksRef.current = [];
      setRecordedBlob(null);
      setRecordingTime(0);

      // Collect audio data as it becomes available
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      // When recording stops, create a Blob from the audio data
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        setRecordedBlob(audioBlob);
        onRecorded(audioBlob)
      };

      mediaRecorder.start();
      setRecorder(mediaRecorder);
      setIsRecording(true);

      // Start a timer to show recording length
      timerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (recorder && recorder.state === "recording") {
      recorder.stop();
      setIsRecording(false);

      // Stop the timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  // Cancel recording (discard)
  const cancelRecording = () => {
    stopRecording();
    setRecordedBlob(null);
    chunksRef.current = [];
    setRecordingTime(0);
  };

  // Send the audio (e.g., to your chat server or local state)
  const sendAudio = () => {
    if (recordedBlob) {
      // For example, upload the blob or convert to Base64
      console.log("Sending audio blob:", recordedBlob);
      onSend()
      // Reset
      setRecordedBlob(null);
      setRecordingTime(0);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      {/* If not recording and no recorded audio, show mic button */}
      {!isRecording && !recordedBlob && (
        <Button variant="light" style={{ borderRadius: "50%" }} onClick={startRecording}>
          <Mic size={20} />
        </Button>
      )}

      {/* If recording, show timer and stop button */}
      {isRecording && (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div>Recording: {formatTime(recordingTime)}</div>
          <Button variant="danger" onClick={stopRecording}>
            <StopCircle size={20} />
          </Button>
          <Button variant="outline-secondary" onClick={cancelRecording}>
            <Trash size={20} />
          </Button>
        </div>
      )}

      {/* If we have a recorded blob, show playback and send option */}
      {!isRecording && recordedBlob && (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <audio controls src={URL.createObjectURL(recordedBlob)} />
          <Button variant="success" onClick={sendAudio}>
            Send
          </Button>
          <Button variant="outline-secondary" onClick={cancelRecording}>
            Discard
          </Button>
        </div>
      )}
    </div>
  );
};

// Utility function to format time in mm:ss
function formatTime(secondsTotal: number) {
  const minutes = Math.floor(secondsTotal / 60);
  const seconds = secondsTotal % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
