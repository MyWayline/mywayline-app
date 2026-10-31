import { createContext, type Snippet } from 'svelte';

type MultiScreenInputContext = {
    defaultValue: string;
    setSelectedValue: (newValue: string) => void;
    register(value: string, getContent: () => Snippet<[]> | undefined): () => void;
};

export const [getMultiScreenInputContext, setMultiScreenInputContext] =
    createContext<MultiScreenInputContext>();
