import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowRight, Plus, Trash2 } from 'lucide-react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Word = {
    id: number;
    french: string;
    english: string;
};

const INK = '#0b1f14';

export default function WordsIndex({ words }: { words: Word[] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        french: '',
        english: '',
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        post('/words', { preserveScroll: true, onSuccess: () => reset() });
    }

    function remove(id: number) {
        router.delete(`/words/${id}`, { preserveScroll: true });
    }

    const count = words.length;

    return (
        <div className="mx-auto w-full max-w-2xl space-y-10 p-4 md:p-8">
            <Head title="Mes mots" />

            {/* En-tête */}
            <header className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                        Mes mots
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        {count === 0
                            ? 'Votre liste est vide pour le moment'
                            : `${count} ${count > 1 ? 'mots' : 'mot'} dans votre liste`}
                    </p>
                </div>

                {count > 0 && (
                    <Button
                        asChild
                        className="h-12 rounded-xl border-2 px-6 text-base font-bold hover:bg-yellow-200"
                        style={{
                            background: '#fde047',
                            color: INK,
                            borderColor: INK,
                            boxShadow: '5px 5px 0 0 #22c55e',
                        }}
                    >
                        <Link href="/study">
                            Lancer la révision
                            <ArrowRight className="size-5" />
                        </Link>
                    </Button>
                )}
            </header>

            {/* Ajout d'un mot */}
            <section>
                <form
                    onSubmit={submit}
                    className="grid gap-3 rounded-3xl border-2 border-border bg-card p-4 sm:grid-cols-[1fr_auto_1fr_auto] sm:items-center sm:p-5"
                >
                    <Input
                        aria-label="Mot en français"
                        placeholder="Français"
                        value={data.french}
                        onChange={(e) => setData('french', e.target.value)}
                        aria-invalid={!!errors.french}
                        className="h-12 rounded-xl border-2 text-base focus-visible:border-yellow-400 focus-visible:ring-yellow-400/30"
                    />
                    <ArrowRight
                        aria-hidden
                        className="hidden size-5 text-green-500 sm:block"
                    />
                    <Input
                        aria-label="Mot en anglais"
                        placeholder="Anglais"
                        value={data.english}
                        onChange={(e) => setData('english', e.target.value)}
                        aria-invalid={!!errors.english}
                        className="h-12 rounded-xl border-2 text-base focus-visible:border-yellow-400 focus-visible:ring-yellow-400/30"
                    />
                    <Button
                        type="submit"
                        disabled={processing}
                        className="h-12 rounded-xl bg-green-400 px-6 text-base font-bold text-[#0b1f14] hover:bg-green-300"
                    >
                        <Plus className="size-5" />
                        Ajouter
                    </Button>
                </form>

                {(errors.french || errors.english) && (
                    <p className="mt-3 px-2 text-sm font-medium text-destructive">
                        Renseignez les deux champs pour ajouter un mot.
                    </p>
                )}
            </section>

            {/* Liste */}
            {count === 0 ? (
                <div className="rounded-3xl border-2 border-dashed border-border p-10 text-center">
                    <p className="text-lg font-bold text-foreground">
                        Aucun mot pour l'instant
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Ajoutez votre premier mot ci-dessus pour pouvoir le
                        réviser.
                    </p>
                </div>
            ) : (
                <ul className="space-y-3">
                    {words.map((word) => (
                        <li
                            key={word.id}
                            className="flex items-center justify-between gap-4 rounded-2xl border-2 border-border bg-card px-5 py-4 transition-colors hover:border-green-500"
                        >
                            <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
                                <span className="truncate text-lg font-bold text-foreground">
                                    {word.french}
                                </span>
                                <ArrowRight
                                    aria-hidden
                                    className="size-4 shrink-0 text-green-500"
                                />
                                <span
                                    className="rounded-full px-3 py-0.5 text-base font-bold"
                                    style={{ background: '#fde047', color: INK }}
                                >
                                    {word.english}
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={() => remove(word.id)}
                                aria-label={`Supprimer ${word.french}`}
                                className="flex size-10 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-red-500/15 hover:text-red-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-500/30"
                            >
                                <Trash2 className="size-5" />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
