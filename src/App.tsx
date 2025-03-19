// src/App.tsx
import Chat from './components/Chat'; // Add missing import

function App() {
  return (
    <div className="App">
      <h1>Secure Chat</h1>
      <Chat /> {/* Now properly imported */}
    </div>
  );
}

export default App; // Ensure default export exists
