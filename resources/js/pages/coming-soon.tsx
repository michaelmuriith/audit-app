import { Head } from '@inertiajs/react';
import { Construction } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Coming Soon',
        href: '/coming-soon',
    },
];

export default function ComingSoon() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Coming Soon" />
            <div className="flex h-full flex-1 flex-col items-center justify-center p-4">
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="bg-muted flex h-20 w-20 items-center justify-center rounded-full">
                        <Construction className="text-muted-foreground h-10 w-10" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold tracking-tight">Not Activitaed</h1>
                        <p className="text-muted-foreground max-w-[420px]">
                            This feature is not activated yet. Please contact the administrator for more information.
                        </p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
