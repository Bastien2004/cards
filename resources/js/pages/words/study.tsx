import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Check,
    CheckCircle2,
    Eye,
    RotateCcw,
    Volume2,
    X,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

type Word = {
    id: number;
    french: string;
    english: string;
};

function speak(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
}

function FlashCard({ word }: { word: Word }) {
    const [revealed, setRevealed] = useState(false);

    function answer(known: boolean) {
        setRevealed(false);
        router.post(`/words/${word.id}/review`, { known });
    }

    return (
        <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
            {/* Carte */}
            <div
                role="button"
                tabIndex={0}
                onClick={() => !revealed && setRevealed(true)}
                onKeyDown={(e) => {
                    if (!revealed && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault();
                        setRevealed(true);
                    }
                }}
                className={`flex min-h-[340px] w-full cursor-pointer flex-col justify-between rounded-3xl border-2 bg-card p-8 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-yellow-400/40 ${
                    revealed
                        ? 'border-green-500'
                        : 'border-yellow-400 hover:border-yellow-300'
                }`}
            >
                {/* En-tête de carte */}
                <div className="flex items-center justify-between">
                    <span
                        className={`rounded-full px-3 py-1 text-sm font-bold text-black ${
                            revealed ? 'bg-green-400' : 'bg-yellow-300'
                        }`}
                    >
                        {revealed ? 'Français' : 'Anglais'}
                    </span>
                    <span className="text-sm font-medium text-muted-foreground">
                        {revealed ? 'Solution' : 'Mot à deviner'}
                    </span>
                </div>

                {/* Mot */}
                <div className="flex flex-col items-center gap-4 py-8 text-center">
                    <p className="text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl">
                        {revealed ? word.french : word.english}
                    </p>

                    {!revealed && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                speak(word.english);
                            }}
                            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-yellow-400 hover:text-yellow-500"
                            aria-label={`Écouter la prononciation de ${word.english}`}
                        >
                            <Volume2 className="h-4 w-4" />
                            Écouter
                        </button>
                    )}
                </div>

                {/* Bas de carte */}
                <div className="flex justify-center">
                    {revealed ? (
                        <span className="text-sm font-semibold text-green-500">
                            Avez-vous trouvé la bonne réponse ?
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-2 rounded-full bg-yellow-300 px-5 py-2.5 text-sm font-bold text-black">
                            <Eye className="h-4 w-4" />
                            Révéler la traduction
                        </span>
                    )}
                </div>
            </div>

            {/* Réponses */}
            <div className="min-h-14">
                {revealed ? (
                    <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
                        <Button
                            onClick={() => answer(false)}
                            size="lg"
                            className="h-14 rounded-xl bg-yellow-300 text-base font-bold text-black hover:bg-yellow-200"
                        >
                            <X className="mr-2 h-5 w-5" />
                            À revoir
                        </Button>
                        <Button
                            onClick={() => answer(true)}
                            size="lg"
                            className="h-14 rounded-xl bg-green-500 text-base font-bold text-black hover:bg-green-400"
                        >
                            <Check className="mr-2 h-5 w-5" />
                            Je savais
                        </Button>
                    </div>
                ) : (
                    <p className="text-center text-sm text-muted-foreground">
                        Astuce : prenez le temps de prononcer le mot avant de
                        vérifier.
                    </p>
                )}
            </div>
        </div>
    );
}

export default function Study({ word }: { word: Word | null }) {
    return (
        <div className="min-h-[calc(100vh-4rem)] p-4 md:p-8">
            <Head title="Réviser" />

            <div className="mx-auto max-w-2xl space-y-8">
                {/* En-tête */}
                <div className="flex items-center justify-between border-b-2 border-yellow-400 pb-4">
                    <div>
                        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                            Session de révision
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Entraînez votre mémoire de vocabulaire
                        </p>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                        <Link
                            href="/words"
                            className="gap-2 font-medium text-foreground hover:text-green-500"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Mes mots
                        </Link>
                    </Button>
                </div>

                {/* Carte ou écran de fin */}
                {word ? (
                    <FlashCard key={word.id} word={word} />
                ) : (
                    <div className="mx-auto flex max-w-xl flex-col items-center rounded-3xl border-2 border-green-500 bg-card p-10 text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-400 text-black">
                            <CheckCircle2 className="h-8 w-8" />
                        </div>
                        <h2 className="text-2xl font-extrabold text-foreground">
                            Félicitations !
                        </h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Vous avez révisé tous vos mots pour le moment.
                            Revenez plus tard pour renforcer votre mémoire.
                        </p>
                        <div className="mt-6 flex gap-3">
                            <Button
                                asChild
                                className="bg-green-500 font-bold text-black hover:bg-green-400"
                            >
                                <Link href="/words">Gérer mes mots</Link>
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => router.reload()}
                            >
                                <RotateCcw className="mr-2 h-4 w-4" />
                                Actualiser
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
