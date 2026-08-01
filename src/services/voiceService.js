/**
 * Web Speech API wrapper for speech recognition
 */

let recognition = null;
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "en-US";
}

export const voiceService = {
  isSupported() {
    return recognition !== null;
  },

  startListening(onResult, onError, onEnd) {
    if (!this.isSupported()) {
      onError(new Error("Speech recognition is not supported in this browser."));
      return;
    }

    recognition.onresult = (event) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      onResult({ final: finalTranscript, interim: interimTranscript });
    };

    recognition.onerror = (event) => {
      onError(event.error || "Voice recognition error occurred.");
    };

    recognition.onend = () => {
      onEnd();
    };

    try {
      recognition.start();
    } catch (e) {
      console.warn("Speech recognition already running or error: ", e);
    }
  },

  stopListening() {
    if (recognition) {
      try {
        recognition.stop();
      } catch (e) {
        console.warn("Speech recognition failed to stop: ", e);
      }
    }
  },

  /**
   * High-fidelity simulated recording typing stream for demonstration backup
   */
  simulateVoiceRecording(onResult, onEnd) {
    const demoPhrases = [
      "A wearable",
      " smart helmet system that",
      " detects rider fatigue using biometric sensors",
      " and sends an alert automatically",
      " via Bluetooth cellular connectivity."
    ];
    
    let currentIdx = 0;
    let accumulatedText = "";
    
    const interval = setInterval(() => {
      if (currentIdx >= demoPhrases.length) {
        clearInterval(interval);
        setTimeout(onEnd, 300);
      } else {
        accumulatedText += demoPhrases[currentIdx];
        onResult({ final: accumulatedText, interim: "...listening" });
        currentIdx++;
      }
    }, 800);
    
    return () => clearInterval(interval);
  }
};
