export type Narrative = {
    id: string;
    theme: string;
    central_thesis: string;
    main_argument: string;
    narrative_sequence: {
        step: number;
        title: string;
        description: string;
    }[];
}