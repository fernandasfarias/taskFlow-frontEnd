const IMG_LOGO_ROXA = "/Frame2.png";

export default function CriarProjetos(){
    return(
        <div className="min-h-screen bg-[#0A0E17] flex items-center justify-center p-6">
            <div className="w-full max-w-3xl bg-[#161B22] border border-[#30363D] rounded-[40px] p-8 md:p-12 text-white">
                <div>
                    <img src={IMG_LOGO_ROXA} alt="Logo" className="w-12 mb-8"/>
                    <h1 className="text-4xl font-bold mb-3">Criar novo projeto</h1>
                </div>
            </div>
        </div>
    )
}