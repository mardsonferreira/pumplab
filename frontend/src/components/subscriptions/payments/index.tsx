import { HiOutlinePencil } from "react-icons/hi2";
import { RiArrowDropRightLine } from "react-icons/ri";

import { SubscriptionResponse } from "@/utils/api/subscriptions/fetch-subscriptions";

export function Payments({ subscription }: { subscription: SubscriptionResponse }) {
    return (
        <div className="flex flex-col bg-slate-900 rounded-lg p-6 gap-4">
            <span className="text-lg font-bold">Método de pagamento</span>

            <div className="flex bg-slate-900 rounded-lg gap-4 items-center bg-slate-800 p-4">
                <div className="min-w-16 h-10 bg-slate-100 rounded-lg flex items-center justify-center p-4">
                    <span className="text-md font-bold uppercase text-neutral-900">{subscription.cardBrand}</span>
                </div>

                <div className="flex flex-col">
                    <span>Terminando em</span>
                    <span>{subscription.cardLastDigits}</span>
                    <span className="text-sm text-slate-400">Expira em {subscription.cardExpiresAt}</span>
                </div>

                <HiOutlinePencil size={20} className="text-yellow-400" />
            </div>

            <div className="flex items-center gap-2 justify-between items-center">
                <span className="text-sm text-slate-400">Ver histórico de faturas</span>
                <span className="p-1 hover:bg-slate-800 rounded-lg">
                    <RiArrowDropRightLine size={20} className="text-slate-400 hover: cursor-pointer" />
                </span>
            </div>
        </div>
    );
}