import Sidebar from "../../features/dashboard/components/Sidebar";
import fotoPerfil from "../../assets/fotoPerfil.svg";

// service dos dados genéricos de cada tipo de perfil (nome, email e senha)
import {getPerfil, putEditandoDados} from "../../services/perfilService";

import {useEffect, useState} from "react";

import { MdOutlineMailOutline } from "react-icons/md";
import { LuPencil } from "react-icons/lu";
import { TbLockPassword } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";
import { SlLogout } from "react-icons/sl";

export default function Profile(){

    const [perfil, setPerfil] = useState({nome: "", email: "", senha: ""});

    // edição do nome
    const [editandoNome, setEditandoNome] = useState(false);
    const [novoNome, setNovoNome] = useState("");

    // edição do email
    const [editandoEmail, setEditandoEmail] = useState(false);
    const [novoEmail, setNovoEmail] = useState("");

    // navegar para a tela de alterar senha
    const navigate = useNavigate();

    useEffect(()=>{
        async function carregarPerfil(){
            try {
                const data = await getPerfil();
                console.log(data);
                setPerfil(data);
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
            console.log("Erro ao carregar o perfil", error);
        }
    };

    const salvarEmail = async () => {
        try{
            await putEditandoDados({email: novoEmail});
            setPerfil(prev => ({...prev, email: novoEmail}));
            setEditandoEmail(false);
        }catch (error){
            console.log("Erro ao carregar o perfil", error);
        }
    }

    const deletarConta = async () => {
        const confirmarExclusao = window.confirm("Tem certeza que deseja excluir sua conta? Essa ação não poderá ser desfeita.");

        if(!confirmarExclusao) return;

        try {
            await excluirConta();
            localStorage.removeItem("token");
            navigate("/login");
        } catch (error){
            console.error(error);
            alert("Erro ao excluir a conta");
        }
    }

    return(
        <div className="flex min-h-screen bg-[#0d121f] text-[#94a3b8]">
            <Sidebar />

            <main className="flex-1 p-3 md:p-8">
                <div className="w-full">
                    {/*card que envolve o perfil*/}
                    <div className="relative overflow-hidden rounded-2xl bg-[#0d121f]"></div>
                    {/*header do perfil*/}
                    <div className="relative h-44 bg-gradient-to-r from-[#4C1D95] via-[#9B5CFF] to-[#C084FC] animate-pulse rounded-2xl"></div>
                    {/*foto de perfil*/}
                    <div className="flex justify-center -mt-12 relative z-10">
                        <img src={fotoPerfil} alt="Foto Perfil" className="rounded-full w-24 h-24 md:w-32 md:h-32 border-4 border-[#0d121f]" />
                    </div>
                    {/*dados genérico do perfil*/}
                    <div className="text-center p-6">

                        {/*nome*/}
                        {
                            editandoNome?(
                                <>
                                    <div className="flex items-center justify-center gap-2 mt-2 mb-5">
                                        <input value={novoNome} onChange={(e)=>setNovoNome(e.target.value)}
                                               className="bg-[#0d121f] border border-slate-600 rounded px-3 py-2 hover:border-white transition duration-500"/>
                                        <button onClick={salvarNome} className="text-[#94a3b8] hover:text-green-400 cursor-pointer">Salvar</button>
                                    </div>
                                </>
                            ):(
                                <>
                                    <div className="flex items-center justify-center gap-2 mt-2 mb-5">
                                        <h1 className="text-2xl font-semibold text-white">{perfil.nome}</h1>
                                        <LuPencil
                                            onClick={() => {setNovoNome(perfil.nome); setEditandoNome(true)}}
                                            className="text-xl text-slate-500 opacity-60 cursor-pointer duration-200 hover:text-green-400 transition-colors" />
                                    </div>
                                </>
                            )
                        }

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/*email*/}
                        <div className="mb-5 group bg-gradient-to-r from-[#4C1D95] via-[#9B5CFF] to-[#C084FC] p-[1px] rounded-xl opacity-40 hover:opacity-100 transition-all duration-300">
                            <div className="rounded-xl bg-[#0d121f] p-4 text-center">
                                <span className="text-xs uppercase tracking-wide text-slate-400 font-bold">E-mail</span>

                                {editandoEmail?(
                                    <div className="flex items-center justify-center gap-3 mt-2">
                                    <input value={novoEmail} onChange={(e) => setNovoEmail(e.target.value)} className="bg-[#0d121f] border border-slate-600 rounded px-3 py-2 text-white"></input>
                                    <button onClick={salvarEmail} className="text-[#94a3b8] hover:text-green-400 transition">Salvar</button>
                                    </div>
                                ):(
                                    <div className="flex items-center justify-center gap-2 mt-2">
                                        <MdOutlineMailOutline className="text-slate-400"/>
                                        <span className="text-sm md:text-base text-slate-300">{perfil.email}</span>
                                        <LuPencil onClick={() => {
                                            setNovoEmail(perfil.email);
                                            setEditandoEmail(true)
                                        }}
                                        className="text-lg text-slate-500 cursor-pointer transition-colors duration-200 hover:text-green-400"
                                        ></LuPencil>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/*senha*/}
                        <div className="mb-5 group bg-gradient-to-r from-[#4C1D95] via-[#9B5CFF] to-[#C084FC] p-[1px] rounded-xl opacity-40 hover:opacity-100 transition-all duration-300">
                            <div className="rounded-xl bg-[#0d121f] p-4 text-center">
                                <span className="text-xs uppercase tracking-wide text-slate-400 font-bold">SENHA</span>
                                <div className="flex items-center justify-center gap-2 mt-2">
                                    <TbLockPassword className="text-slate-400" />
                                    <span className="text-base text-slate-300">{perfil.senha}</span>
                                    <LuPencil onClick={() => navigate("/recuperar-senha")} className="text-lg text-slate-500 cursor-pointer transition-colors duration-200 hover:text-green-400"/>
                                </div>
                            </div>
                        </div>

                        {/* deslogar */}
                        <div className="mb-5 group bg-gradient-to-r from-[#4C1D95] via-[#9B5CFF] to-[#C084FC] p-[1px] rounded-xl opacity-40 hover:opacity-100 transition-all duration-300">
                            <div className="rounded-xl bg-[#0d121f] p-4 text-center cursor-pointer">
                                <span className="text-xs uppercase tracking-wide text-slate-400 font-bold">SAIR DA CONTA</span>
                                <div className="flex items-center justify-center gap-2 mt-2">
                                    <span className="text-base text-slate-300">LOGOUT</span>
                                    <SlLogout oclassName="text-lg text-slate-500 cursor-pointer transition-colors duration-200 hover:text-green-400"/>
                                </div>
                            </div>
                        </div>

                        {/* excluir a  conta */}
                        <div className="mb-5 group border border-red-400 p-[15px] rounded-xl opacity-40 hover:opacity-100">
                                <span className="text-xs uppercase tracking-wide text-slate-400 font-bold">ZONA DE PERIGO</span>
                                <div onClick={deletarConta} className="flex items-center justify-center gap-2 mt-2 cursor-pointer">
                                    <span className="text-base text-slate-300">EXCLUIR SUA CONTA?</span>
                                    <FaTrashAlt className="text-slate-400 transition-colors duration-200 hover:text-red-400"></FaTrashAlt>
                                </div>
                        </div>
                    </div>
                    </div>
                </div>
            </main>
        </div>
    )
}