import { Link } from "react-router-dom";
import { useState } from "react";

import { solicitarRecuperacaoSenha } from "../../services/authService";
import toast from "react-hot-toast";

export default function RecuperarSenha() {
  const [email, setEmail] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  function validarEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async function handleSubmit( e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setErro("");

    if (!email.trim()) {
      setErro("Informe seu e-mail.");
      return;
    }

    if (!validarEmail(email)) {
      setErro("Informe um e-mail válido.");
      return;
    }

    try {
      setCarregando(true);

      await solicitarRecuperacaoSenha(email);

      toast.success("Se o e-mail existir, enviaremos as instruções de recuperação.");
    } catch (error) {
      console.error(error);
      setErro("Erro ao solicitar recuperação de senha.");
    } finally {
      setCarregando(false);
    }
  }
  return (
    <main className="min-h-screen bg-[#050B16] flex items-center justify-center px-4 py-8">
      <section className="w-full max-w-[1100px] min-h-[520px] rounded-[36px] border border-[#33405F] bg-[#101827] flex items-center justify-center px-6 sm:px-10">
        <div className="w-full max-w-[410px]">
          <h1 className="text-white text-2xl sm:text-3xl font-semibold mb-3">
            Recuperar senha
          </h1>

          <p className="text-[#8D94A6] text-sm mb-5">
            Digite o seu email para receber instruções de recuperação.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErro("");
                }}
                placeholder="Email"
                className={`w-full h-12 rounded-lg bg-transparent border px-4 text-white placeholder:text-[#7C8498] outline-none transition-colors ${
                  erro
                    ? "border-red-500 focus:border-red-500"
                    : "border-[#2D3854] focus:border-[#7C3AED]"
                }`}
              />

              {erro && (
                <p className="text-red-400 text-sm mt-2">
                  {erro}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={carregando}
              className="w-full h-12 rounded-lg bg-[#7C3AED] text-white font-semibold hover:bg-[#8B5CF6] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {carregando ? "Enviando..." : "Enviar instruções"}
            </button>
          </form>

          <p className="text-center text-[#7C8498] text-sm mt-6">
            Lembrou sua senha?{" "}
            <Link
              to="/"
              className="text-[#A78BFA] hover:text-[#C4B5FD] transition-colors"
            >
              Entre.
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
