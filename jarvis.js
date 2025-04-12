document.addEventListener('DOMContentLoaded', () => {
    const status = document.getElementById("status");
    const activateBtn = document.getElementById("activateBtn");
  
    let jarvisActive = false;
  
    // WebSocket
    const socket = new WebSocket("ws://localhost:8080");
  
    socket.onopen = () => console.log("🧠 WebSocket connected");
  
    // Barba.js
    barba.init({
      transitions: [{
        leave({ current }) {
          return gsap.to(current.container, { opacity: 0, duration: 0.3 });
        },
        enter({ next }) {
          return gsap.from(next.container, { opacity: 0, duration: 0.3 });
        }
      }]
    });
  
    // Speech Recognition
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = true;
    recognition.lang = 'en-US';
  
    recognition.onresult = (event) => {
      const command = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
      console.log("🎙️ Heard:", command);
  
      if (!jarvisActive && command.includes("hello jarvis")) {
        jarvisActive = true;
        status.textContent = "Jarvis activated. Listening...";
        speak("Hello, I am Jarvis. How can I help?");
        return;
      }
  
      if (jarvisActive) {
        socket.send(JSON.stringify({ type: "command", text: command }));
  
        if (command.includes("what's the time")) {
          const time = new Date().toLocaleTimeString();
          speak("The current time is " + time);
        } else if (command.includes("open google")) {
          window.open("https://www.google.com", "_blank");
        } else if (command.includes("go to home")) {
          barba.go('/');
        } else {
          speak("Sorry, I didn’t understand that.");
        }
      }
    };
  
    recognition.onerror = (e) => console.error("❌ Speech error:", e);
  
    activateBtn.addEventListener('click', () => {
      if (!jarvisActive) {
        jarvisActive = true;
        status.textContent = "Jarvis activated by button. Listening...";
        speak("Hello, I am Jarvis. How can I assist you?");
      }
      recognition.start();
    });
  
    function speak(text) {
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    }
  
    recognition.start(); // start on load
  });
  