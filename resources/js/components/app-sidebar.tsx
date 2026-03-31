import { Link } from '@inertiajs/react';
import {
    Activity,
    BarChart,
    Briefcase,
    Calendar,
    ClipboardList,
    Clock,
    Cog,
    FileCheck,
    FileText,
    Globe,
    LayoutGrid,
    ListChecks,
    Network,
    PieChart,
    Plus,
    RefreshCcw,
    Search,
    ShieldAlert,
    ShieldCheck,
    Target,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard, comingSoon } from '@/routes';
import auditPlanning, { strategicPlan, auditableEntities, riskAssessment, annualPlan } from '@/routes/audit-planning';
import { engagement, questionnaire, programme } from '@/routes/audit-execution';
import { findings, draftReport } from '@/routes/audit-reporting';
import { actionPlans, followUp } from '@/routes/issue-management';
import type { NavItem } from '@/types';
import meetings from '@/routes/audit-planning/meetings';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
        icon: LayoutGrid,
    },

    {
        title: 'Meetings',
        href: meetings.index().url,
        icon: Users,
        items: [
            { title: 'Meetings Management', href: meetings.index().url },
            { title: 'Minutes', href: meetings.minutes.index().url },
        ],
    },

    {
        title: 'Internal Audit',
        href: meetings.index().url,
        icon: Briefcase,
        items: [
            {
                title: 'Planning',
                href: strategicPlan().url,
                icon: Target,
                items: [
                    { title: 'Auditable Entities', href: auditableEntities().url },
                    { title: 'Risk Assessment', href: riskAssessment().url },
                    { title: 'Strategic Plan', href: strategicPlan().url },
                    { title: 'Annual Plan', href: annualPlan().url },
                ],
            },
            {
                title: 'Execution',
                href: engagement().url,
                icon: Briefcase,
                items: [
                    { title: 'Engagement Memo', href: comingSoon().url },
                    { title: 'Engagement Memorandum', href: comingSoon().url },
                    { title: 'Questionnaire', href: questionnaire().url },
                    { title: 'Programme', href: programme().url },
                    { title: 'Uploads', href: comingSoon().url },
                    { title: 'Draft Issues', href: comingSoon().url },
                ],
            },
            {
                title: 'Reports',
                href: draftReport().url,
                icon: BarChart,
            },
        ],
    },

    {
        title: 'Audit Follow-up',
        href: meetings.index().url,
        icon: Users,
        items: [
            {
                title: 'Issues',
                href: followUp().url,
                icon: ShieldAlert,
            },
            {
                title: 'Workplan',
                href: comingSoon().url,
                icon: Clock,
            },
        ],
    },

    {
        title: 'Data Analytics',
        href: comingSoon().url,
        icon: PieChart,
    },
    {
        title: 'Risk Management',
        href: comingSoon().url,
        icon: ShieldCheck,
    },
    {
        title: 'Third-Party Risk Management',
        href: comingSoon().url,
        icon: Globe,
    },
    {
        title: 'Internal Controls',
        href: comingSoon().url,
        icon: Activity,
    },
    {
        title: 'Policy Compliance Management',
        href: comingSoon().url,
        icon: Network,
    },



];




const footerNavItems: NavItem[] = [
    {
        title: 'Staff Directory',
        href: comingSoon().url,
        icon: Users,
    },

    {
        title: 'Settings',
        href: comingSoon().url,
        icon: Cog
    }

];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard().url} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} label="Platform" />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
