import { useState } from 'react';

interface LiveChatProps {
  streamId: string;
}

export function LiveChat({ streamId }: LiveChatProps) {
  const [message, setMessage] = useState('');

  const sendMessage = () => {
    if (!message.trim()) return;

    // TODO: Send message via socket / Base44 realtime
    console.log(`Sending message in stream ${streamId}:`, message);
    setMessage('');
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 border border-zinc-800 rounded-lg">
      {/* Chat Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2 text-sm">
        {/* Messages will be mapped here */}
        <p className="text-zinc-400">Chat is connected...</p>
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-zinc-800 flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Say something..."
          className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-sm focus:outline-none"
        />
        <button 
          onClick={sendMessage}
          className="bg-red-600 hover:bg-red-700 px-4 rounded text-sm font-medium"
        >
          Send
        </button>
      </div>
    </div>
  );
}
