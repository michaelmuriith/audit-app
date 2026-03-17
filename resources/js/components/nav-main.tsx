import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';

function NavItem({ item, level = 0 }: { item: NavItem; level?: number }) {
    const { isCurrentUrl } = useCurrentUrl();
    const hasSubItems = item.items && item.items.length > 0;
    const isParentActive = hasSubItems && item.items?.some((subItem) => isCurrentUrl(subItem.href) || (subItem.items && subItem.items.length > 0 && subItem.items.some(child => isCurrentUrl(child.href))));

    const content = (
        <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isCurrentUrl(item.href) || isParentActive} tooltip={{ children: item.title }}>
                <Link href={item.href} prefetch>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                </Link>
            </SidebarMenuButton>
            {hasSubItems && (
                <>
                    <CollapsibleTrigger asChild>
                        <SidebarMenuAction className="transition-transform duration-200 data-[state=open]:rotate-90">
                            <ChevronRight className="size-4" />
                            <span className="sr-only">Toggle</span>
                        </SidebarMenuAction>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <SidebarMenuSub>
                            {item.items?.map((subItem) => (
                                <NavItem key={subItem.title} item={subItem} level={level + 1} />
                            ))}
                        </SidebarMenuSub>
                    </CollapsibleContent>
                </>
            )}
        </SidebarMenuItem>
    );

    if (hasSubItems) {
        return (
            <Collapsible key={item.title} asChild defaultOpen={isParentActive}>
                {content}
            </Collapsible>
        );
    }

    if (level > 0) {
        return (
            <SidebarMenuSubItem key={item.title}>
                <SidebarMenuSubButton asChild isActive={isCurrentUrl(item.href)}>
                    <Link href={item.href} prefetch>
                        <span>{item.title}</span>
                    </Link>
                </SidebarMenuSubButton>
            </SidebarMenuSubItem>
        );
    }

    return content;
}

export function NavMain({ items = [], label = 'Platform' }: { items: NavItem[]; label?: string }) {
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>{label}</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <NavItem key={item.title} item={item} />
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
