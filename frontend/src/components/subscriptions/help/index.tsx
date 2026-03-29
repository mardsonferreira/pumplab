import { Button } from "@/components/ui/Button";

export function Help() {
    return (
        <div className="flex flex-col bg-[#FACC1433] rounded-lg p-6 gap-4">
             <span className="text-lg font-bold">Precisa de ajuda?</span>

            <span className="text-sm text-slate-400">Nosso suporte está disponível 24/7 para lhe ajudar com sua assinatura</span>
            

             <Button variant="outline">Contactar Suporte</Button>
        </div>
    );
}