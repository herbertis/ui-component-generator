import { useState } from "react";

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;


export default function App() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function generateComponent() {
    if (!prompt.trim()) return;
    setLoading(true);
    setResult("");

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1024,
          messages: [
            {
              role: "user",
              content: `Você é um especialista em React e Tailwind CSS.
Gere APENAS o código de um componente React funcional com TypeScript para: "${prompt}".
- Use Tailwind CSS para estilização
- Inclua props com TypeScript
- Seja limpo e production-ready
- Retorne APENAS o código, sem explicações`,
            },
          ],
        }),
      });

      const data = await response.json();
      const text = data.content?.[0]?.text ?? "Erro ao gerar componente.";
      setResult(text);
    } catch (err) {
      setResult("Erro ao conectar com a API.");
    } finally {
      setLoading(false);
    }
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center justify-start p-8">
      <div className="w-full max-w-2xl">

        <h1 className="text-3xl font-bold mb-2">
          UI Component Generator
        </h1>
        <p className="text-gray-400 mb-8 text-sm">
          Descreva um componente em português ou inglês — a IA gera o código React + TypeScript.
        </p>

        <textarea
          className="w-full bg-gray-900 border border-gray-700 rounded-lg p-4 text-sm resize-none focus:outline-none focus:border-blue-500 transition"
          rows={4}
          placeholder="Ex: botão de like animado com contador, card de produto com imagem e preço, modal de confirmação..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <button
          onClick={generateComponent}
          disabled={loading || !prompt.trim()}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition"
        >
          {loading ? "Gerando..." : "Gerar Componente"}
        </button>

        {result && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-400 uppercase tracking-widest">
                Código gerado
              </span>
              <button
                onClick={copyToClipboard}
                className="text-xs text-blue-400 hover:text-blue-300 transition"
              >
                {copied ? "Copiado ✓" : "Copiar"}
              </button>
            </div>
            <pre className="bg-gray-900 border border-gray-800 rounded-lg p-4 text-sm overflow-x-auto whitespace-pre-wrap text-green-300">
              {result}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}