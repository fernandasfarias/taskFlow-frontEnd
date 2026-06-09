import Sidebar from "../../features/dashboard/components/Sidebar";
import fotoPerfil from "../../assets/fotoPerfil.svg";

export default function Profile(){
    return(
        <div className="flex min-h-screen bg-[#0d121f] text-[#94a3b8]">
            <Sidebar />

            <main className="flex-1 p-3">
                <div className="w-full">
                    {/*card que envolve o perfil*/}
                    <div className="relative overflow-hidden rounded-2xl bg-[#0d121f]"></div>
                    {/*header do perfil*/}
                    <div className="relative h-44 bg-gradient-to-r from-[#4C1D95] via-[#9B5CFF] to-[#C084FC] animate-pulse rounded-2xl"></div>
                    {/*foto de perfil*/}
                    <div className="flex justify-center -mt-12 relative z-10 w-50">
                        <img src={fotoPerfil} alt="Foto Perfil" className="rounded-full w-35 h-35 border-4 border-[#0d121f]" />
                    </div>
                    {/*dados do perfil*/}
                    <div className="text-center p-6">
                        <h1 className="text-left text-3xl font-bold">Nome do usuário</h1>
                        <p className="text-sm text-slate-400">email@exemplo.com</p>
                        <p className="mt-4 text-sm">bio ou descrição do usuario</p>
                    </div>
                </div>
            </main>
        </div>
    )
}