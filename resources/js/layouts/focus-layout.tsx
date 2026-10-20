import type { ReactNode } from 'react';

export default function FocusLayout({ children }: { children: ReactNode }) {
    return (
        <main className="min-h-svh bg-background text-foreground">
            {children}
        </main>
    );
}
