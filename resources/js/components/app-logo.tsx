import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
            </div>
            <div className="ml-2 grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-bold bg-indigo-500 bg-linear-to-r from-indigo-500 to-emerald-500 bg-clip-text text-transparent">
                    ARCMS
                </span>
                <span className="truncate text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                    Audit Management System
                </span>
            </div>
        </>
    );
}
