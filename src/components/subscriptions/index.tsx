import { Button } from "@/components/ui/Button";

import { General } from "./general";
import { Features } from "./features";
import { Payments } from "./payments";
import { Help } from "./help";
import { Cancelation } from "./cancelation";

export function Subscriptions() {
    return (
        <div className="container mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
            <header className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                    <span className="text-slate-100 text-lg font-bold">Detalhes da assinatura</span>
                    <span className="text-slate-400 text-sm">Gerencie sua assinatura atual, recursos e detalhes de pagamento</span>
                </div>
                <div>
                    <Button>Alterar plano</Button>
                </div>
            </header>

            <div className="grid grid-cols-[2fr_1fr] gap-4 mt-8">
                <div className="flex flex-col gap-4">
                    <General />
                    <Features />
                    <Cancelation />
                </div>

                <div className="flex flex-col gap-4">
                    <Payments />
                    <Help />
                </div>
            </div>
        </div>
    );
}