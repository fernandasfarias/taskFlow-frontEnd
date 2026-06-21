import { FormEvent, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import { redefinirSenha } from "../../services/authService";

export default function RedefinirSenha() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();

    setErro("");
    setSucesso("");

    if (!token) {
      setErro("Token de recuperação não encontrado.");
      return;
    }

    if (!novaSenha.trim()) {
      setErro("Informe a nova senha.");
      return;
    }

    if (novaSenha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setErro("As senhas não conferem.");
      return;
    }

    try {
      setCarregando(true);

      await redefinirSenha(token, novaSenha);

      setSucesso("Senha redefinida com sucesso.");

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      console.error(error);
      setErro("Link inválido, expirado ou erro ao redefinir senha.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050B16] flex items-center justify-center px-4 py-8">
      <section className="w-full max-w-[1100px] min-h-[520px] rounded-[36px] border border-[#33405F] bg-[#101827] flex items-center justify-center px-6 sm:px-10">
        <div className="w-full max-w-[410px]">
          <h1 className="text-white text-2xl sm:text-3xl font-semibold mb-3">
            Redefinir senha
          </h1>

          <p className="text-[#8D94A6] text-sm mb-5">
            Informe sua nova senha para acessar sua conta.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <input
                type={mostrarNovaSenha ? "text" : "password"}
                value={novaSenha}
                onChange={(e) => {
                  setNovaSenha(e.target.value);
                  setErro("");
                }}
                placeholder="Nova senha"
                className={`w-full h-12 rounded-lg bg-transparent border px-4 pr-12 text-white placeholder:text-[#7C8498] outline-none transition-colors ${
                  erro
                    ? "border-red-500 focus:border-red-500"
                    : "border-[#2D3854] focus:border-[#7C3AED]"
                }`}
              />

              <button
                type="button"
                onClick={() => setMostrarNovaSenha(!mostrarNovaSenha)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7C8498] hover:text-white transition-colors"
              >
                {mostrarNovaSenha ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="relative">
              <input
                type={mostrarConfirmarSenha ? "text" : "password"}
                value={confirmarSenha}
                onChange={(e) => {
                  setConfirmarSenha(e.target.value);
                  setErro("");
                }}
                placeholder="Confirmar nova senha"
                className={`w-full h-12 rounded-lg bg-transparent border px-4 pr-12 text-white placeholder:text-[#7C8498] outline-none transition-colors ${
                  erro
                    ? "border-red-500 focus:border-red-500"
                    : "border-[#2D3854] focus:border-[#7C3AED]"
                }`}
              />

              <button
                type="button"
                onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7C8498] hover:text-white transition-colors"
              >
                {mostrarConfirmarSenha ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>

            {erro && <p className="text-red-400 text-sm">{erro}</p>}

            {sucesso && <p className="text-green-400 text-sm">{sucesso}</p>}

            <button
              type="submit"
              disabled={carregando}
              className="w-full h-12 rounded-lg bg-[#7C3AED] text-white font-semibold hover:bg-[#8B5CF6] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {carregando ? "Salvando..." : "Redefinir senha"}
            </button>
          </form>

          <p className="text-center text-[#7C8498] text-sm mt-6">
            Lembrou sua senha?{" "}
            <Link
              to="/"
              className="text-[#A78BFA] hover:text-[#C4B5FD] transition-colors"
            >
              Entrar.
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
