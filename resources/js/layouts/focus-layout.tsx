import { Link, router, usePage } from '@inertiajs/react';
import { Layers, LogOut, Settings } from 'lucide-react';
import type { ReactNode } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const INK = '#0b1f14';

type SharedProps = {
    auth?: { user?: { name?: string; email?: string } };
};

function initials(name?: string) {
    if (!name) return '?';
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('');
}

export default function FocusLayout({ children }: { children: ReactNode }) {
    const { auth } = usePage<SharedProps>().props;
    const user = auth?.user;

    return (
        <div className="min-h-svh bg-background text-foreground">
            <header className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 md:px-8">
                <Link
                    href="/study"
                    className="flex items-center gap-2 text-lg font-extrabold tracking-tight"
                >
                    <span
                        className="flex size-8 items-center justify-center rounded-lg"
                        style={{ background: '#fde047', color: INK }}
                    >
                        <Layers className="size-4" />
                    </span>
                    Cards
                </Link>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            type="button"
                            aria-label="Ouvrir le menu du compte"
                            className="flex size-10 items-center justify-center rounded-full text-sm font-bold transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-yellow-400/40"
                            style={{ background: '#fde047', color: INK }}
                        >
                            {initials(user?.name)}
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-56">
                        {user && (
                            <>
                                <DropdownMenuLabel className="font-normal">
                                    <p className="truncate font-semibold">
                                        {user.name}
                                    </p>
                                    <p className="truncate text-xs text-muted-foreground">
                                        {user.email}
                                    </p>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                            </>
                        )}
                        <DropdownMenuItem asChild>
                            <Link href="/settings/profile" className="cursor-pointer">
                                <Settings className="size-4" />
                                Réglages
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onSelect={() => router.post('/logout')}
                        >
                            <LogOut className="size-4" />
                            Se déconnecter
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </header>

            <main>{children}</main>
        </div>
    );
}
