export default function MessageBubble({ mensagem, isUser }) {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[70%] p-4 rounded-2xl ${
        isUser 
          ? 'bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white' 
          : 'bg-[#1e293b] text-gray-200'
      }`}>
        <p className="text-sm">{mensagem.conteudo}</p>
        <span className="text-[10px] opacity-70">{mensagem.dataEnvio}</span>
      </div>
    </div>
  );
}