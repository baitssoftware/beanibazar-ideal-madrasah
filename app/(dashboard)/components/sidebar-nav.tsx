'use client';

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import {
  Book,
  BookOpen,
  Building2,
  FileText,
  GraduationCap,
  Home,
  Image,
  LayoutDashboard,
  Mail,
  ScrollText,
  Settings,
  Users,
  type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MenuItem {
  title: string;
  href: string;
  icon: LucideIcon;
  items?: { title: string; href: string }[];
}

const menuItems: MenuItem[] = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { title: 'Home ', href: '/dashboard/home', icon: Home },
  {
    title: 'About',
    href: '/dashboard/about',
    icon: Building2,
    items: [
      { title: 'At a Glance', href: '/dashboard/about/at-a-glance' },
      { title: 'History ', href: '/dashboard/about/history' },
      { title: 'Achievement ', href: '/dashboard/about/achievement' },
      { title: 'News Event', href: '/dashboard/about/news-events' },
      { title: 'Why Study', href: '/dashboard/about/why-study' },
      { title: 'Mission & Vision', href: '/dashboard/about/mission-vision' },
    ],
  },
  {
    title: 'Administration',
    href: '/dashboard/administration',
    icon: Users,
    items: [
      {
        title: "Chairman's Message",
        href: '/dashboard/administration/message-of-chairman',
      },
      {
        title: "Principal's Message",
        href: '/dashboard/administration/message-of-principal',
      },
      { title: 'Teachers', href: '/dashboard/administration/teachers' },
    ],
  },
  {
    title: 'Academic',
    href: '/dashboard/academic',
    icon: BookOpen,
    items: [
      { title: 'Student List', href: '/dashboard/academic/student-list' },
      { title: 'Class Routine', href: '/dashboard/academic/class-routine' },
      { title: 'Exam Routine', href: '/dashboard/academic/exam-routine' },
      { title: 'Syllabus', href: '/dashboard/academic/syllabus' },
    ],
  },
  {
    title: 'Results',
    href: '/dashboard/result',
    icon: ScrollText,
    items: [
      { title: 'Individual Result', href: '/dashboard/result/individual' },
      { title: 'Section Wise Result', href: '/dashboard/result/section-wise' },
    ],
  },
  { title: 'Notice', href: '/dashboard/notice', icon: FileText },
  {
    title: 'Admission',
    href: '/dashboard/admission',
    icon: GraduationCap,
    items: [
      { title: 'Circular', href: '/dashboard/admission/circular' },
      { title: 'Admission Result', href: '/dashboard/admission/admission-result' },
    ],
  },
  {
    title: 'Facilities',
    href: '/dashboard/facilities',
    icon: Book,
    items: [
      { title: 'Classrooms', href: '/dashboard/facilities/classroom' },
      { title: 'Library', href: '/dashboard/facilities/library' },
      { title: 'Laboratory', href: '/dashboard/facilities/laboratory' },
    ],
  },
  {
    title: 'Gallery',
    href: '/dashboard/gallery',
    icon: Image,
    items: [
      { title: 'Photo Gallery', href: '/dashboard/gallery/photo' },
      { title: 'Video Gallery', href: '/dashboard/gallery/video' },
    ],
  },
  { title: 'Contact', href: '/dashboard/contact', icon: Mail },
  { title: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu className="pb-10 pt-4 px-2 ">
      {menuItems.map((item, index) => {
        const isActive =
          pathname === item.href || item.items?.some((subItem) => pathname === subItem.href);

        return (
          <SidebarMenuItem key={index}>
            {item.items ? (
              <>
                <SidebarMenuButton isActive={isActive}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </SidebarMenuButton>
                <SidebarMenuSub>
                  {item.items.map((subItem, subIndex) => {
                    const isSubActive = pathname === subItem.href;
                    return (
                      <SidebarMenuSubItem key={subIndex} className="relative">
                        {isSubActive && (
                          <p className="h-[1px] w-3 bg-[#E5E7EB] absolute -left-[10px] top-3"></p>
                        )}
                        <SidebarMenuSubButton asChild isActive={isSubActive}>
                          <Link href={subItem.href}>{subItem.title}</Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    );
                  })}
                </SidebarMenuSub>
              </>
            ) : (
              <SidebarMenuButton asChild isActive={isActive}>
                <Link href={item.href}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
