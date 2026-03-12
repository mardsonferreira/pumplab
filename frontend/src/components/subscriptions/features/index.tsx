import { BsCheckCircle } from "react-icons/bs";


export function Features({ monthlyNarratives }: { monthlyNarratives: number }) {
    return (
        <div className="flex flex-col bg-slate-900 rounded-lg p-6 gap-4">
            <span className="text-lg font-bold">Recursos</span>
            <div className="flex flex-col gap-2">
                <div className="flex items-start gap-3">
                    <BsCheckCircle size={20} className="text-yellow-400 mt-1" />
                    <div className="flex flex-col justify-start">
                        <span className="text-md font-bold">{monthlyNarratives} posts mensais</span>
                        <span className="text-sm text-slate-400">Crie até {monthlyNarratives} posts por mês sem custo adicional</span>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <BsCheckCircle size={20} className="text-yellow-400 mt-1" />
                    <div className="flex flex-col justify-start">
                        <span className="text-md font-bold">Suporte ao cliente</span>
                        <span className="text-sm text-slate-400">Receba suporte rápido e eficiente para qualquer problema ou dúvida</span>
                    </div>
                </div>
            </div>
        </div>
    );
}