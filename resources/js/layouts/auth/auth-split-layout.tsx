import { Link, usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { dashboard } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { name } = usePage().props;

    return (
        <div className="relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r overflow-hidden">
                <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] hover:scale-105"
                    style={{ backgroundImage: 'url(/images/login-hero.png)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 via-purple-900/60 to-black/80" />
                
                <Link
                    href={dashboard()}
                    className="relative z-20 flex items-center text-2xl font-bold tracking-tight"
                >
                    <AppLogoIcon className="mr-3 size-10 fill-current text-white drop-shadow-lg" />
                    {name}
                </Link>

                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-2">
                        <p className="text-3xl font-medium leading-tight tracking-tight text-white drop-shadow-md">
                            "Excellence in every detail, precision in every audit."
                        </p>
                        <footer className="text-sm font-light text-white/80">
                            The future of Audit Management Systems.
                        </footer>
                    </blockquote>
                </div>
            </div>
            <div className="w-full lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <Link
                        href={dashboard()}
                        className="relative z-20 flex items-center justify-center lg:hidden"
                    >
                        <AppLogoIcon className="h-10 fill-current text-black sm:h-12" />
                    </Link>
                    <div className="flex flex-col items-start gap-2 text-left sm:items-center sm:text-center">
                        <h1 className="text-xl font-medium">{title}</h1>
                        <p className="text-sm text-balance text-muted-foreground">
                            {description}
                        </p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
