import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Check,
    CheckCircle2,
    Eye,
    RotateCcw,
    Sparkles,
    X,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type Word = {
    id: number;
    french: string;
    english: string;
};

function FlashCard({ word }: { word: Word }) {
    const [revealed, setRevealed] = useState(false);

    function answer(known: boolean) {
        setRevealed(false);
        router.post(`/words/${word.id}/review`, { known });
    }

    return (
        <div className="mx-auto flex w-full max-w-lg flex-col items-center">
            {/* Carte Flashcard */}
            <Card
                onClick={() => !revealed && setRevealed(true)}
                className={`relative flex min-h-[280px] w-full cursor-pointer flex-col items-center justify-between overflow-hidden rounded-2xl border-2 p-8 text-center transition-all duration-300 ${
                    revealed
                        ? 'border-emerald-500/50 bg-gradient-to-b from-amber-500/5 via-emerald-500/5 to-transparent shadow-xl shadow-emerald-500/10 dark:from-amber-500/10 dark:via-emerald-500/10'
                        : 'border-amber-400/40 bg-gradient-to-b from-amber-400/10 via-background to-background shadow-lg hover:border-amber-400 hover:shadow-amber-500/10 dark:border-amber-500/30 dark:hover:border-amber-400'
                }`}
            >
                {/* Badge d'état (Recto/Verso) */}
                <div className="flex w-full items-center justify-between text-xs font-semibold uppercase tracking-wider">
                    <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 transition-colors ${
                            revealed
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                        }`}
                    >
                        <Sparkles className="h-3.5 w-3.5" />
                        {revealed ? 'Français' : 'Anglais'}
                    </span>
                    <span className="text-muted-foreground text-xs">
                        {revealed ? 'Solution' : 'Mot à deviner'}
                    </span>
                </div>

                {/* Contenu principal */}
                <div className="my-auto py-6">
                    <p className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                        {revealed ? word.french : word.english}
                    </p>
                </div>

                {/* Indication bas de carte */}
                <div className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
                    {!revealed ? (
                        <>
                            <Eye className="h-3.5 w-3.5 text-amber-500" />
                            <span>Cliquez pour révéler la traduction</span>
                        </>
                    ) : (
                        <span className="text-emerald-600 dark:text-emerald-400">
                            Évaluez votre réponse ci-dessous
                        </span>
                    )}
                </div>
            </Card>

            {/* Boutons de réponse */}
            <div className="mt-6 h-14 w-full">
                {revealed ? (
                    <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
                        <Button
                            onClick={() => answer(false)}
                            size="lg"
                            className="h-12 border-amber-300 bg-amber-500/10 text-amber-900 hover:bg-amber-500/20 dark:border-amber-600/40 dark:bg-amber-950/40 dark:text-amber-200 dark:hover:bg-amber-900/50"
                            variant="outline"
                        >
                            <X className="mr-2 h-5 w-5 text-amber-600 dark:text-amber-400" />
                            À revoir
                        </Button>
                        <Button
                            onClick={() => answer(true)}
                            size="lg"
                            className="h-12 bg-emerald-600 text-white shadow-md hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                        >
                            <Check className="mr-2 h-5 w-5" />
                            Je savais
                        </Button>
                    </div>
                ) : (
                    <p className="text-center text-xs text-muted-foreground">
                        Astuce : Prenez le temps de prononcer le mot avant de vérifier.
                    </p>
                )}
            </div>
        </div>
    );
}

export default function Study({ word }: { word: Word | null }) {
    return (
        <div className="relative min-h-[calc(100vh-4rem)] bg-gradient-to-b from-amber-50/40 via-background to-background p-4 md:p-8 dark:from-amber-950/10">
            {/* Halo lumineux d'arrière-plan */}
            <div className="pointer-events-none absolute left-1/2 top-10 -translate-x-1/2 blur-3xl opacity-25">
                <div className="h-64 w-96 rounded-full bg-gradient-to-r from-amber-400 to-emerald-400" />
            </div>

            <Head title="Réviser" />

            <div className="relative mx-auto max-w-2xl space-y-8">
                {/* En-tête */}
                <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                            Session de révision
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Entraînez votre mémoire de vocabulaire
                        </p>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/words" className="gap-2 text-muted-foreground hover:text-emerald-600">
                            <ArrowLeft className="h-4 w-4" />
                            Mes mots
                        </Link>
                    </Button>
                </div>

                {/* Zone de la carte ou écran de succès */}
                {word ? (
                    <FlashCard key={word.id} word={word} />
                ) : (
                    <Card className="flex flex-col items-center justify-center p-8 text-center border-2 border-emerald-500/30 bg-emerald-50/30 dark:bg-emerald-950/20">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400">
                            <CheckCircle2 className="h-8 w-8" />
                        </div>
                        <h2 className="text-xl font-bold text-foreground">
                            Félicitations !
                        </h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Vous avez révisé tous vos mots pour le moment. Revenez plus tard pour renforcer votre mémoire.
                        </p>
                        <div className="mt-6 flex gap-3">
                            <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                <Link href="/words">Gérer mes mots</Link>
                            </Button>
                            <Button variant="outline" onClick={() => router.reload()}>
                                <RotateCcw className="mr-2 h-4 w-4" />
                                Actualiser
                            </Button>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}
