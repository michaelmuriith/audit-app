import { Link } from '@inertiajs/react';
import {
    Activity,
    BarChart,
    Briefcase,
    Calendar,
    ClipboardList,
    Clock,
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
import { strategicPlan, riskAssessment, meetings, annualPlan } from '@/routes/audit-planning';
import { engagement, questionnaire, programme } from '@/routes/audit-execution';
import { findings, draftReport } from '@/routes/audit-reporting';
import { actionPlans, followUp } from '@/routes/issue-management';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },

    {
        title: 'Meetings',
        href: meetings(),
        icon: Users,
        items: [
            { title: 'Create Meeting', href: comingSoon() },
            { title: 'Meeting Minutes', href: comingSoon() },
        ],
    },
];


const internalAuditItems: NavItem[] = [
    {
        title: 'Planning',
        href: strategicPlan(),
        icon: Target,
        items: [
            { title: 'Strategic Plan', href: strategicPlan() },
            { title: 'Annual Plan', href: annualPlan() },
            { title: 'Risk Assessment', href: riskAssessment() },
        ],
    },
    {
        title: 'Execution',
        href: engagement(),
        icon: Briefcase,
        items: [
            { title: 'Engagement Memo', href: comingSoon() },
            { title: 'Engagement Memorandum', href: comingSoon() },
            { title: 'Questionnaire', href: questionnaire() },
            { title: 'Programme', href: programme() },
            { title: 'Uploads', href: comingSoon() },
            { title: 'Draft Issues', href: comingSoon() },
        ],
    },
    {
        title: 'Reports',
        href: draftReport(),
        icon: BarChart,
    },
];

const auditFollowUpItems: NavItem[] = [
    {
        title: 'Issues',
        href: followUp(),
        icon: ShieldAlert,
    },
    {
        title: 'Workplan',
        href: comingSoon(),
        icon: Clock,
    },
];



const otherItems: NavItem[] = [
    {
        title: 'Data Analytics',
        href: comingSoon(),
        icon: PieChart,
    },
    {
        title: 'Risk Management',
        href: comingSoon(),
        icon: ShieldCheck,
    },
    {
        title: 'Third-Party Risk Management',
        href: comingSoon(),
        icon: Globe,
    },
    {
        title: 'Internal Controls',
        href: comingSoon(),
        icon: Activity,
    },
    {
        title: 'Policy Compliance Management',
        href: comingSoon(),
        icon: Network,
    },
    {
        title: 'Staff Directory',
        href: comingSoon(),
        icon: Users,
    },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} label="Platform" />
                <NavMain items={internalAuditItems} label="Internal Audit" />
                <NavMain items={auditFollowUpItems} label="Audit Follow-up" />
                <NavMain items={otherItems} label="Governance & Compliance" />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
