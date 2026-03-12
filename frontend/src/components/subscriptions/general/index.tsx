import { BsPatchCheck } from "react-icons/bs";

import { Subscription } from "@/types";

export function General({ subscription }: { subscription: Subscription }) {
    const startedAt = new Date(subscription.startedAt);
    const formattedStartedAt = startedAt.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
    const convertedPrice = subscription.plan.price / 100;
    const price = convertedPrice.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    const nextCharge = subscription.nextChargeAt
    ? new Date(subscription.nextChargeAt).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
    : null;

    return (
        <div className="flex flex-col bg-slate-900 rounded-lg p-6">
                    <div className="flex items-center justify-between border-b w-full border-slate-800">
                        <div className="flex items-center pb-4 gap-2">
                            <div className="bg-[#FACC1433] w-10 h-10 flex items-center justify-center rounded-md">
                                <BsPatchCheck size={20} className="text-yellow-400"/>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-lg font-bold">{subscription.plan.name}</span>
                                <span className="text-sm text-slate-400">Ativo desde {formattedStartedAt}</span>
                            </div>
                        </div>
                        <span className="bg-green-900 text-green-500 px-4 rounded-xl text-sm uppercase">Ativo</span>
                    </div>

                    <div className="mt-3 flex w-full items-center justify-start">
                        <div className="flex flex-col items-start h-14 w-[50%]">
                            <span className="text-sm text-slate-400 uppercase">Preço</span>
                            <div>
                                <span className="text-lg font-bold">R$ {price}</span>
                                <span className="text-sm text-slate-400">/mês</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-start h-14 w-[50%]">
                            <span className="text-sm text-slate-400 uppercase">Próxima Cobrança</span>
                            <span className="text-base">{nextCharge}</span>
                        </div>
                    </div>
                </div>
    );
}