"use client";

import { useNarrativeStore } from "@/utils/stores/dashboard/narrative";

export default function EditNarrative() {
    const { narrative } = useNarrativeStore();
    return (
        <div>
            <h1>{narrative?.central_thesis}</h1>
        </div>
    )
}