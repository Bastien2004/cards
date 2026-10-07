<?php

namespace App\Http\Controllers;

use App\Models\Word;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WordController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('words/index', [
            'words' => $request->user()->words()->latest()->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'french'  => ['required', 'string', 'max:255'],
            'english' => ['required', 'string', 'max:255'],
        ]);

        $request->user()->words()->create($validated);

        return back();
    }

    public function destroy(Request $request, Word $word)
    {
        abort_unless($word->user_id === $request->user()->id, 403);

        $word->delete();

        return back();
    }

    public function study(Request $request)
    {
        $word = $request->user()->words()
            ->where(function ($q) {
                $q->whereNull('next_review_at')
                    ->orWhere('next_review_at', '<=', now());
            })
            ->inRandomOrder()
            ->first();

        return Inertia::render('words/study', [
            'word' => $word,
        ]);
    }

    public function review(Request $request, Word $word)
    {
        abort_unless($word->user_id === $request->user()->id, 403);

        $known = $request->boolean('known');
        $intervals = [10, 60, 1440, 4320, 10080];

        if ($known) {
            $word->correct_count++;
            $index = min($word->correct_count - 1, count($intervals) - 1);
            $word->next_review_at = now()->addMinutes($intervals[$index]);
        } else {
            $word->wrong_count++;
            $word->correct_count = 0;
            $word->next_review_at = now()->addMinute();
        }

        $word->save();

        return back();
    }
}
