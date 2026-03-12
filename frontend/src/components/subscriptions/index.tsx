import { Button } from "@/components/ui/Button";

import { General } from "./general";
import { Features } from "./features";
import { Payments } from "./payments";
import { Help } from "./help";
import { Cancelation } from "./cancelation";

import { SubscriptionResponse } from "@/utils/api/subscriptions/fetch-subscriptions";

export function Subscriptions({ subscription }: { subscription: SubscriptionResponse }) {
    return (
        <div className="container mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
            <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col gap-2">
                    <span className="text-slate-100 text-lg font-bold">Detalhes da assinatura</span>
                    <span className="text-slate-400 text-sm">Gerencie sua assinatura atual, recursos e detalhes de pagamento</span>
                </div>
                <div className="w-full md:w-auto">
                    <Button className="w-full md:w-auto">Alterar plano</Button>
                </div>
            </header>

            <div className="flex flex-col gap-4 mt-8 md:hidden">
                <General subscription={subscription} />
                <Features monthlyNarratives={subscription.plan.monthlyNarratives} />
                <Payments subscription={subscription} />
                <Help />
                <Cancelation />
            </div>

            <div className="hidden mt-8 md:grid md:grid-cols-[2fr_1fr] md:gap-4 md:items-start">
                <div className="flex flex-col gap-4">
                    <General subscription={subscription} />
                    <Features monthlyNarratives={subscription.plan.monthlyNarratives} />
                    <Cancelation />
                </div>
                <div className="flex flex-col gap-4">
                    <Payments subscription={subscription} />
                    <Help />
                </div>
            </div>
        </div>
    );
}