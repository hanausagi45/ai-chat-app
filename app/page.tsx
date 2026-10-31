'use client';

import { useState } from 'react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();
      if (data.result) {
        setMessages([...newMessages, { role: 'assistant', content: data.result }]);
      } else {
        alert('エラーが発生しました');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col h-screen max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4 text-center">AI チャット</h1>

      <div className="flex-1 overflow-y-auto border rounded-lg p-4 space-y-4 mb-4 bg-gray-50">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg text-sm max-w-[80%] ${
              m.role === 'user'
                ? 'ml-auto bg-blue-600 text-white'
                : 'mr-auto bg-white border text-gray-800'
            }`}
          >
            {m.content}
          </div>
        ))}
        {loading && <div className="text-gray-400 text-sm">AIが回答を考え中...</div>}
      </div>

      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="メッセージを入力..."
          className="flex-1 border p-2 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          送信
        </button>
      </form>
    </main>
  );
}