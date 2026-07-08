// Profile.jsx
import Sidebar from "../../features/dashboard/components/Sidebar";
import fotoPerfil from "../../assets/fotoPerfil.svg";
import {getPerfil, putEditandoDados} from "../../services/perfilService";
import {useEffect, useState} from "react";
import { MdOutlineMailOutline } from "react-icons/md";
import { LuPencil } from "react-icons/lu";
import { TbLockPassword } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";
import { SlLogout } from "react-icons/sl";
import { excluirConta } from "../../services/perfilService";
import { listarMinhasCertificacoes, removerCertificacao as removerCertificacaoService } from "../../services/certificacaoService";
import { listarEmpresa } from "../../services/empresaService";
import { listarEspecialidade } from "../../services/especialidadeService";

export default function Profile(){
    const [perfil, setPerfil] = useState({nome: "", email: "", senha: "", tipo: ""});
    const [editandoNome, setEditandoNome] = useState(false);
    const [novoNome, setNovoNome] = useState("");
    const [editandoEmail, setEditandoEmail] = useState(false);
    const [novoEmail, setNovoEmail] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const [certificacoes, setCertificacoes] = useState([]);
    const [empresa, setEmpresa] = useState(null);
    const [especialidade, setEspecialidade] = useState([]);

    useEffect(() => {
        async function carregarPerfil(){
            try {
                const data = await getPerfil();
                console.log("Dados do perfil:", data);
                setPerfil(data);

                if(data.tipo === "PROJECT_MANAGER"){
                    const certs = await listarMinhasCertificacoes();
                    console.log("Certificações recebidas:", certs);
                    setCertificacoes(certs || []);
                }
                if (data.tipo === "CLIENTE"){
                    const empresa = await listarEmpresa();
                    setEmpresa(empresa);
                }
                if (data.tipo === "COLABORADOR"){
                    const especialidade = await listarEspecialidade();
                    setEspecialidade(especialidade || []);
                }
            } catch (error) {
                console.log("Erro ao carregar o perfil", error);
            }
        }
        carregarPerfil();
    }, []);

    const salvarNome = async () => {
        try{
            await putEditandoDados({nome: novoNome});
            setPerfil(prev => ({...prev, nome: novoNome}));
            setEditandoNome(false);
        }catch (error){
            console.log("Erro ao salvar nome", error);
        }
    };

    const salvarEmail = async () => {
        try{
            await putEditandoDados({email: novoEmail});
            setPerfil(prev => ({...prev, email: novoEmail}));
            setEditandoEmail(false);
        }catch (error){
            console.log("Erro ao salvar email", error);
        }
    }

    const deletarConta = async () => {
        const confirmarExclusao = window.confirm("Tem certeza que deseja excluir sua conta? Essa ação não poderá ser desfeita.");
        if(!confirmarExclusao) return;

        try {
            await excluirConta();
            localStorage.removeItem("token");
            navigate("/");
        } catch (error){
            console.error(error);
            alert("Erro ao excluir a conta");
        }
    }

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/");
    }

    const handleRemover = async(id) => {
        console.log(id);
        try{
            await removerCertificacaoService(id);
            setCertificacoes(prev => prev.filter(c => c.id !== id));
        } catch (err) {
            console.log("Erro ao remover certificação:", err);
        }
    }

    const irParaCertificacoes = () => {
        navigate("/onboarding/certificacoes", {
            state: {origem: "profile"}
        });
    }

    return(
        <div className="flex min-h-screen bg-[#0d121f] text-[#94a3b8]">
            <Sidebar user={{name: perfil.nome, role: perfil.tipo}}
            isOpen={isOpen} setIsOpen={setIsOpen}/>

            <main className="flex-1 p-3 md:p-8">
                <div className="w-full">
                    <div className="relative overflow-hidden rounded-2xl bg-[#0d121f]"></div>
                    <div className="relative h-44 bg-gradient-to-r from-[#4C1D95] via-[#9B5CFF] to-[#C084FC] animate-pulse rounded-2xl"></div>
                    <div className="flex justify-center -mt-12 relative z-10">
                        <img src={fotoPerfil} alt="Foto Perfil" className="rounded-full w-24 h-24 md:w-32 md:h-32 border-4 border-[#0d121f]" />
                    </div>
                    <div className="text-center p-6">
                        {editandoNome ? (
                            <div className="flex items-center justify-center gap-2 mt-2 mb-5">
                                <input value={novoNome} onChange={(e)=>setNovoNome(e.target.value)}
                                        className="bg-[#0d121f] border border-slate-600 rounded px-3 py-2 hover:border-white transition duration-500"/>
                                <button onClick={salvarNome} className="text-[#94a3b8] hover:text-green-400 cursor-pointer">Salvar</button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-2 mt-2 mb-3">
                                <h1 className="text-2xl font-semibold text-white">{perfil.nome}</h1>
                                <LuPencil
                                    onClick={() => {setNovoNome(perfil.nome); setEditandoNome(true)}}
                                    className="text-xl text-slate-500 opacity-60 cursor-pointer duration-200 hover:text-[#7C3AED] transition-colors" />
                            </div>
                        )}
                        <div className="flex items-center justify-center gap-2 mt-2 mb-10">
                            <h1 className="text-base text-white">{perfil?.tipo === "PROJECT_MANAGER"? "Project Manager": perfil?.tipo === "COLABORADOR"? "Colaborador": perfil?.tipo === "CLIENTE"? "Cliente": perfil?.tipo}</h1>
                        </div>

                        {/* SEGUNDA SEÇÃO */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* LADO ESQUERDO: EMAIL, SENHA, LOGOUT E EXCLUIR CONTA */}
                            <div className="flex flex-col gap-5">
                                {/* PRIMEIRA LINHA */}
                                {/*<div className="grid grid-cols-1 md:grid-cols-2 gap-5">/*}
                                    {/* EMAIL */}
                                    <span className="text-white text-lg font-semibold text-center">Dados Pessoais</span>
                                    <div className="rounded-xl border border-[#1F2937] bg-[#141B2D] p-2.5 transition hover:border-[#7C3AED]">
                                        <span className="text-xs uppercase tracking-wide text-slate-400 font-bold">E-mail</span>

                                        {editandoEmail ? (
                                            <div className="flex flex-col gap-3 mt-4">
                                                <input value={novoEmail} onChange={(e) => setNovoEmail(e.target.value)} 
                                                className="w-full bg-[#0d121f] border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-[#7C3AED] focus:outline-none"></input>

                                                <button onClick={salvarEmail} 
                                                className="self-end px-4 py-2 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white transitio">Salvar</button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center gap-3 mt-4">
                                                <MdOutlineMailOutline className="text-xl text-slate-400 flex-shrink-0"/>
                                                <span className="text-slate-200 break-all">{perfil.email}</span>
                                                <LuPencil onClick={() => { setNovoEmail(perfil.email); setEditandoEmail(true) }}
                                                className=" text-lg text-slate-500 cursor-pointer transition-colors duration-200 hover:text-[#7C3AED]"/>
                                            </div>
                                        )}
                                    </div>
                                    {/* SENHA */}
                                    <div className="rounded-xl border border-[#1F2937] bg-[#141B2D] p-2.5 transition hover:border-[#7C3AED]">
                                        <span className="text-xs uppercase tracking-wide text-slate-400 font-bold">SENHA</span>
                                        <div className="flex items-center justify-center gap-3 mt-4">
                                            <div className="flex items-center gap-3">
                                                <TbLockPassword className="text-slate-400" />
                                                <span className="text-base text-slate-300">{perfil.senha}</span>
                                            </div>
                                            <LuPencil onClick={() => navigate("/recuperar-senha")} className="text-lg text-slate-500 cursor-pointer transition-colors duration-200 hover:text-[#7C3AED]"/>
                                        </div>
                                    </div>
                                {/*</div>*/}
                                
                                {/* SEGUNDA LINHA */}
                                <div className="grid grid-cols-2 gap-5">
                                    {/* LOGOUT */}
                                    <button onClick={logout} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-medium transition">
                                        <SlLogout></SlLogout>
                                        Logout
                                    </button>
                                    {/* EXCLUIR CONTA */}
                                    <button onClick={deletarConta} className="flex justify-center items-center gap-2 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition">
                                        <FaTrashAlt></FaTrashAlt>
                                        Excluir Conta
                                    </button>
                                </div>
                            </div>
                            
                            {/* LADO DIREITO: CERTIFICAÇÕES DO PROJECT MANAGER */}
                            {perfil?.tipo === "PROJECT_MANAGER" && (
                                <div className="mt-0">
                                    <h2 className="text-white text-lg font-semibold mb-3 text-center">Certificações</h2>

                                    <button onClick={irParaCertificacoes} className="mb-6 px-5 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl transition">
                                        Adicionar Certificação
                                    </button>

                                    {certificacoes.length === 0 ? (
                                        <p className="text-slate-400 text-center">Nenhuma certificação cadastrada</p>
                                    ) : (
                                        <div className="flex flex-col gap-2 items-center">
                                            {certificacoes.map((cert) => (
                                                <div key={cert.id || cert.certificacao}
                                                    className="flex items-center justify-between w-[340px] bg-[#141B2D] px-5 py-3 rounded-xl border border-[#1F2937]">
                                                    <div className="flex flex-col">
                                                        <span className="text-white text-sm font-semibold">{cert.certificacao}</span>
                                                        <span className="text-slate-400 text-xs">{cert.instituicao}</span>
                                                    </div>
                                                    <button onClick={() => handleRemover(cert.id)} className="text-red-400 hover:text-red-500 text-sm">
                                                        Remover
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* LADO DIREITO: EMPRESA DO CLIENTE */}
                            {perfil?.tipo === "CLIENTE" && empresa && (
                                <div>
                                    <h2 className="text-white text-lg font-semibold mb-3 text-center">Empresa</h2>

                                    <div className="flex justify-center">
                                        <div className="flex items-center justify-center w-[340px] bg-[#141B2D] px-5 py-3 rounded-xl border border-[#1F2937]">
                                            <div className="flex flex-col justify-center">
                                                <p className="text-white text-sm font-semibold">{empresa.nome}</p>
                                                <p className="text-slate-400 text-xs">{empresa.cnpj}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* LADO DIREITO: EESPECIALIDADES DO COLABORADOR */}
                            {perfil?.tipo === "COLABORADOR" && (
                                <div>
                                    <h2 className="text-white text-lg font-semibold mb-3 text-center">Especialidades</h2>

                                    {especialidade.length === 0 ? (
                                        <p className="text-slate-400 text-center">Nenhuma especialidade cadastrada.</p>
                                    ) : (
                                        <div className="flex flex-col gap-2 items-center">
                                            {especialidade.map((esp) => (
                                                <div key={esp.id} className="w-[340px] bg-[#141B2D] px-5 py-3 rounded-xl border border-[#1F2937]">
                                                    <span className="text-white text-sm font-semibold">{esp.nomeEspecialidade}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}