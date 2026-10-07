import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

type Word = {
    id: number;
    french: string;
    english: string;
};

function FlashCard({ word }: { word: Word }) {
    const [revealed, setRevealed] = useState(false);

    function answer(known: boolean) {
        router.post(`/words/${word.id}/review`, { known });
    }

    return (
        <div className="text-center">
            <div
                onClick={() => setRevealed(true)}
                className="flex h-56 cursor-pointer items-center justify-center rounded-xl border text-4xl font-bold shadow"
            >
                {revealed ? word.french : word.english}
            </div>

            {!revealed ? (
                <p className="mt-4 text-gray-500">Clique sur la carte pour révéler</p>
            ) : (
                <div className="mt-4 flex justify-center gap-4">
                    <button
                        onClick={() => answer(true)}
                        className="rounded bg-green-600 px-4 py-2 text-white"
                    >
                        ✓ Je savais
                    </button>
                    <button
                        onClick={() => answer(false)}
                        className="rounded bg-red-600 px-4 py-2 text-white"
                    >
                        ✗ Je ne savais pas
                    </button>
                </div>
            )}
        </div>
    );
}

export default function Study({ word }: { word: Word | null }) {
    return (
        <div className="mx-auto max-w-xl p-6">
            <Head title="Réviser" />

            <h1 className="mb-4 text-2xl font-bold">Réviser</h1>

            {word ? (
                <FlashCard key={word.id} word={word} />
            ) : (
                <p>Plus rien à réviser pour le moment !</p>
            )}

            <a href="/words" className="mt-6 inline-block text-blue-600 underline">
                ← Mes mots
            </a>
        </div>
    );
}
