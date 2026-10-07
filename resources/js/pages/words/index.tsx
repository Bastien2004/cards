import { Head, router, useForm } from '@inertiajs/react';

type Word = {
    id: number;
    french: string;
    english: string;
};

export default function WordsIndex({ words }: { words: Word[] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        french: '',
        english: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/words', { onSuccess: () => reset() });
    }

    return (
        <div className="mx-auto max-w-xl p-6">
            <Head title="Mes mots" />

            <h1 className="mb-4 text-2xl font-bold">Mes mots</h1>

            <form onSubmit={submit} className="mb-6 flex gap-2">
                <input
                    className="flex-1 rounded border p-2"
                    placeholder="Français"
                    value={data.french}
                    onChange={(e) => setData('french', e.target.value)}
                />
                <input
                    className="flex-1 rounded border p-2"
                    placeholder="Anglais"
                    value={data.english}
                    onChange={(e) => setData('english', e.target.value)}
                />
                <button
                    disabled={processing}
                    className="rounded bg-blue-600 px-4 py-2 text-white"
                >
                    Ajouter
                </button>
            </form>

            {(errors.french || errors.english) && (
                <p className="mb-4 text-red-600">Remplis les deux champs.</p>
            )}

            <ul className="space-y-2">
                {words.map((word) => (
                    <li
                        key={word.id}
                        className="flex items-center justify-between rounded border p-2"
                    >
                        <span>
                            {word.french} → {word.english}
                        </span>
                        <button
                            onClick={() => router.delete(`/words/${word.id}`)}
                            className="text-red-600"
                        >
                            Supprimer
                        </button>
                    </li>
                ))}
            </ul>

            <a href="/study" className="mt-6 inline-block text-blue-600 underline">
                Aller réviser →
            </a>
        </div>
    );
}
