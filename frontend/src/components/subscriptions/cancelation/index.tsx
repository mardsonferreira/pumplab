import { HiOutlineExclamationCircle } from "react-icons/hi";

export function Cancelation({ loading, onCancelSubscription }: { loading: boolean, onCancelSubscription: () => void }) {
    return (
        <div className="flex bg-[#7F1D1D33] rounded-lg p-6 gap-4 items-center justify-between">
            <div className="flex items-center gap-2">
                <HiOutlineExclamationCircle size={20} className="text-red-500" />
                <span className="text-sm text-red-500">Pensando em desistir?</span>
            </div>
            <button onClick={onCancelSubscription} disabled={loading}>
                <span className="text-sm text-red-500 cursor-pointer">{loading ? "Cancelando..." : "Cancelar Assinatura"}</span>
            </button>
        </div>
    );
}