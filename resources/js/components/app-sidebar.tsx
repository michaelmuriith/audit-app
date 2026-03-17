import { Link } from '@inertiajs/react';
import {
    BookOpen,
    FolderGit2,
    LayoutGrid,
    Target,
    ShieldAlert,
    Users,
    Calendar,
    Briefcase,
    ClipboardList,
    ListChecks,
    Search,
    FileText,
    Wrench,
    RefreshCcw
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
import { dashboard } from '@/routes';
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
];

const auditPlanningItems: NavItem[] = [
    {
        title: 'Strategic Plan',
        href: strategicPlan(),
        icon: Target,
    },
    {
        title: 'Risk Assessment',
        href: riskAssessment(),
        icon: ShieldAlert,
    },
    {
        title: 'Meetings',
        href: meetings(),
        icon: Users,
    },
    {
        title: 'Annual Plan',
        href: annualPlan(),
        icon: Calendar,
    },
];

const auditExecutionItems: NavItem[] = [
    {
        title: 'Engagement',
        href: engagement(),
        icon: Briefcase,
    },
    {
        title: 'Questionnaire',
        href: questionnaire(),
        icon: ClipboardList,
    },
    {
        title: 'Programme',
        href: programme(),
        icon: ListChecks,
    },
];

const auditReportingItems: NavItem[] = [
    {
        title: 'Findings',
        href: findings(),
        icon: Search,
    },
    {
        title: 'Draft Report',
        href: draftReport(),
        icon: FileText,
    },
];

const issueManagementItems: NavItem[] = [
    {
        title: 'Action Plans',
        href: actionPlans(),
        icon: Wrench,
    },
    {
        title: 'Follow-up',
        href: followUp(),
        icon: RefreshCcw,
    },
];

const footerNavItems: NavItem[] = [

];

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
                <NavMain items={auditPlanningItems} label="Audit Planning" />
                <NavMain items={auditExecutionItems} label="Audit Execution" />
                <NavMain items={auditReportingItems} label="Audit Reporting" />
                <NavMain items={issueManagementItems} label="Issue Management" />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
