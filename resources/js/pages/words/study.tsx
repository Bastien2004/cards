import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Check,
    CheckCircle2,
    RotateCcw,
    Volume2,
    X,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

type Word = {
    id: number;
    french: string;
    english: string;
};

const INK = '#0b1f14';

function speak(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
}

function wordSize(text: string) {
    if (text.length <= 8) return 'text-6xl sm:text-8xl';
    if (text.length <= 14) return 'text-5xl sm:text-6xl';
    return 'text-3xl sm:text-5xl';
}

const faceBase =
    'absolute inset-0 flex flex-col justify-between rounded-[2rem] border-2 p-7 sm:p-9';

const hidden = {
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
} as const;

function Kbd({ children, dark }: { children: string; dark?: boolean }) {
    return (
        <kbd
            className={`ml-2 hidden rounded-md border px-1.5 py-0.5 text-xs font-semibold sm:inline ${
                dark ? 'border-black/30 text-black/70' : 'border-foreground/25 text-foreground/70'
            }`}
        >
            {children}
        </kbd>
    );
}

function FlashCard({ word }: { word: Word }) {
    const [revealed, setRevealed] = useState(false);

    const answer = useCallback(
        (known: boolean) => {
            setRevealed(false);
            router.post(`/words/${word.id}/review`, { known });
        },
        [word.id],
    );

    useEffect(() => {
        function onKeyDown(e: KeyboardEvent) {
            if (e.metaKey || e.ctrlKey || e.altKey) return;
            const target = e.target as HTMLElement | null;
            if (target?.closest('button, a, input, textarea, select')) return;

            if (!revealed && (e.code === 'Space' || e.key === 'Enter')) {
                e.preventDefault();
                setRevealed(true);
            } else if (revealed && e.key === 'ArrowRight') {
                answer(true);
            } else if (revealed && e.key === 'ArrowLeft') {
                answer(false);
            }
        }

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [revealed, answer]);

    return (
        <div className="mx-auto w-full max-w-xl px-3">
            {/* Paquet de cartes + carte qui se retourne */}
            <div className="relative" style={{ perspective: '1800px' }}>
                <div
                    aria-hidden
                    className="absolute inset-0 -rotate-3 rounded-[2rem] border-2 border-border bg-card"
                />
                <div
                    aria-hidden
                    className="absolute inset-0 rotate-2 rounded-[2rem] border-2 border-border bg-card"
                />

                <div
                    onClick={() => !revealed && setRevealed(true)}
                    className={`relative h-[400px] select-none motion-reduce:!transition-none ${
                        revealed ? '' : 'cursor-pointer'
                    }`}
                    style={{
                        transformStyle: 'preserve-3d',
                        transform: revealed ? 'rotateY(180deg)' : 'rotateY(0deg)',
                        transition: 'transform 650ms cubic-bezier(0.2, 0.8, 0.2, 1)',
                    }}
                >
                    {/* Recto : anglais */}
                    <div
                        aria-hidden={revealed}
                        className={faceBase}
                        style={{
                            ...hidden,
                            background: '#fde047',
                            color: INK,
                            borderColor: INK,
                            boxShadow: '10px 10px 0 0 #22c55e',
                        }}
                    >
                        <div className="flex items-center justify-between">
                            <span
                                className="rounded-full px-3 py-1 text-sm font-bold"
                                style={{ background: INK, color: '#fde047' }}
                            >
                                Anglais
                            </span>
                            <span className="text-sm font-semibold opacity-70">
                                Mot à deviner
                            </span>
                        </div>

                        <div className="flex flex-col items-center gap-5 text-center">
                            <p
                                className={`break-words font-extrabold leading-none tracking-tighter ${wordSize(word.english)}`}
                            >
                                {word.english}
                            </p>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    speak(word.english);
                                    e.currentTarget.blur();
                                }}
                                className="flex size-12 items-center justify-center rounded-full transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/30"
                                style={{ background: INK, color: '#fde047' }}
                                aria-label={`Écouter la prononciation de ${word.english}`}
                            >
                                <Volume2 className="size-5" />
                            </button>
                        </div>

                        <p className="flex items-center justify-center gap-2 text-sm font-semibold opacity-70">
                            <RotateCcw className="size-4" />
                            Touchez la carte pour la retourner
                        </p>
                    </div>

                    {/* Verso : français */}
                    <div
                        aria-hidden={!revealed}
                        className={faceBase}
                        style={{
                            ...hidden,
                            transform: 'rotateY(180deg)',
                            background: '#4ade80',
                            color: INK,
                            borderColor: INK,
                            boxShadow: '10px 10px 0 0 #fde047',
                        }}
                    >
                        <div className="flex items-center justify-between">
                            <span
                                className="rounded-full px-3 py-1 text-sm font-bold"
                                style={{ background: INK, color: '#4ade80' }}
                            >
                                Français
                            </span>
                            <span className="text-sm font-semibold opacity-70">
                                Solution
                            </span>
                        </div>

                        <div className="flex flex-col items-center gap-3 text-center">
                            <p
                                className={`break-words font-extrabold leading-none tracking-tighter ${wordSize(word.french)}`}
                            >
                                {word.french}
                            </p>
                            <p className="text-lg font-semibold opacity-60">
                                {word.english}
                            </p>
                        </div>

                        <p className="text-center text-sm font-semibold opacity-70">
                            Avez-vous trouvé la bonne réponse ?
                        </p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="mt-12 min-h-16">
                {revealed ? (
                    <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <Button
                            onClick={() => answer(false)}
                            variant="outline"
                            className="h-16 rounded-2xl border-2 border-yellow-400 bg-transparent text-base font-bold text-foreground hover:bg-yellow-300 hover:text-[#0b1f14]"
                        >
                            <X className="size-5" />
                            À revoir
                            <Kbd>←</Kbd>
                        </Button>
                        <Button
                            onClick={() => answer(true)}
                            className="h-16 rounded-2xl bg-green-400 text-base font-bold text-[#0b1f14] hover:bg-green-300"
                        >
                            <Check className="size-5" />
                            Je savais
                            <Kbd dark>→</Kbd>
                        </Button>
                    </div>
                ) : (
                    <Button
                        onClick={() => setRevealed(true)}
                        className="h-16 w-full rounded-2xl bg-yellow-300 text-base font-bold text-[#0b1f14] hover:bg-yellow-200"
                    >
                        Retourner la carte
                        <Kbd dark>Espace</Kbd>
                    </Button>
                )}
            </div>

            <p className="mt-4 text-center text-sm text-muted-foreground">
                Astuce : prononcez le mot à voix haute avant de retourner la
                carte.
            </p>
        </div>
    );
}

export default function Study({ word }: { word: Word | null }) {
    return (
        <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden p-4 md:p-8">
            <Head title="Réviser" />

            {/* Trame de points, nette et discrète */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-60"
                style={{
                    backgroundImage:
                        'radial-gradient(var(--border) 1.5px, transparent 1.5px)',
                    backgroundSize: '28px 28px',
                    maskImage:
                        'radial-gradient(ellipse 70% 60% at 50% 35%, black 20%, transparent 75%)',
                    WebkitMaskImage:
                        'radial-gradient(ellipse 70% 60% at 50% 35%, black 20%, transparent 75%)',
                }}
            />

            <div className="relative mx-auto max-w-2xl space-y-12">
                <header className="flex items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                            Session de révision
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Entraînez votre mémoire de vocabulaire
                        </p>
                    </div>
                    <Button
                        asChild
                        variant="outline"
                        className="rounded-full border-2 font-semibold hover:border-green-500 hover:bg-transparent"
                    >
                        <Link href="/words">
                            <ArrowLeft className="size-4" />
                            Mes mots
                        </Link>
                    </Button>
                </header>

                {word ? (
                    <FlashCard key={word.id} word={word} />
                ) : (
                    <div className="mx-auto max-w-xl px-3">
                        <div
                            className="flex flex-col items-center rounded-[2rem] border-2 p-10 text-center"
                            style={{
                                background: '#4ade80',
                                color: INK,
                                borderColor: INK,
                                boxShadow: '10px 10px 0 0 #fde047',
                            }}
                        >
                            <div
                                className="mb-5 flex size-16 items-center justify-center rounded-full"
                                style={{ background: INK, color: '#4ade80' }}
                            >
                                <CheckCircle2 className="size-8" />
                            </div>
                            <h2 className="text-3xl font-extrabold tracking-tight">
                                Félicitations !
                            </h2>
                            <p className="mt-2 max-w-sm font-medium opacity-80">
                                Vous avez révisé tous vos mots pour le moment.
                                Revenez plus tard pour renforcer votre mémoire.
                            </p>
                            <div className="mt-8 flex flex-wrap justify-center gap-3">
                                <Button
                                    asChild
                                    className="h-12 rounded-xl px-6 font-bold hover:opacity-90"
                                    style={{ background: INK, color: '#4ade80' }}
                                >
                                    <Link href="/words">Gérer mes mots</Link>
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => router.reload()}
                                    className="h-12 rounded-xl border-2 border-[#0b1f14] bg-transparent px-6 font-bold text-[#0b1f14] hover:bg-[#0b1f14]/10"
                                >
                                    <RotateCcw className="size-4" />
                                    Actualiser
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
