import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { AnalyticsChart } from "@/components/dashboard/AnalyticsChart";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { MotionDiv, MotionSection } from "@/components/dashboard/motion";
import { BriefcaseBusiness, Inbox, Layers, Rocket, ArrowUpRight, LucideIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard",
};

function formatMonth(date: Date) {
  return format(date, "MMM");
}

function computeMonthlySeries<T extends { createdAt: Date }>(items: T[], months: Date[]) {
  const map = new Map<string, number>();
  for (const month of months) {
    map.set(formatMonth(month), 0);
  }

  for (const item of items) {
    const label = formatMonth(item.createdAt);
    if (map.has(label)) {
      map.set(label, (map.get(label) ?? 0) + 1);
    }
  }

  return months.map((month) => ({ label: formatMonth(month), value: map.get(formatMonth(month)) ?? 0 }));
}

export default async function DashboardPage() {
  const [projectsCount, servicesCount, postsCount, messagesCount, teamCount] = await Promise.all([
    prisma.project.count(),
    prisma.service.count(),
    prisma.blogPost.count({ where: { status: "PUBLISHED" } }),
    prisma.contactMessage.count(),
    prisma.teamMember.count(),
  ]);

  const [projects, posts, messages] = await Promise.all([
    prisma.project.findMany({
      select: { id: true, title: true, status: true, category: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.blogPost.findMany({
      select: { id: true, title: true, status: true, publishedAt: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.contactMessage.findMany({
      select: { id: true, name: true, email: true, createdAt: true, isRead: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const months = Array.from({ length: 6 }).map((_, index) => {
    const base = new Date();
    base.setMonth(base.getMonth() - (5 - index));
    return base;
  });

  const [projectSeries, postSeries, leadSeries] = await Promise.all([
    prisma.project
      .findMany({ where: { createdAt: { gte: months[0] } }, select: { createdAt: true } })
      .then((items) => computeMonthlySeries(items, months)),
    prisma.blogPost
      .findMany({ where: { createdAt: { gte: months[0] } }, select: { createdAt: true } })
      .then((items) => computeMonthlySeries(items, months)),
    prisma.contactMessage
      .findMany({ where: { createdAt: { gte: months[0] } }, select: { createdAt: true } })
      .then((items) => computeMonthlySeries(items, months)),
  ]);

  const chartData = months.map((month, index) => ({
    month: formatMonth(month),
    projects: projectSeries[index]?.value ?? 0,
    posts: postSeries[index]?.value ?? 0,
    leads: leadSeries[index]?.value ?? 0,
  }));

  const recentActivity = [
    ...projects.map((project) => ({
      id: `project-${project.id}`,
      title: `Project • ${project.title}`,
      description: `Status ${project.status.toLowerCase().replace("_", " ")}`,
      date: project.createdAt,
    })),
    ...posts.map((post) => ({
      id: `post-${post.id}`,
      title: `Post • ${post.title}`,
      description: post.status === "PUBLISHED" ? "Published" : "Draft saved",
      date: post.publishedAt ?? post.createdAt,
    })),
    ...messages.map((message) => ({
      id: `message-${message.id}`,
      title: `Message from ${message.name}`,
      description: message.email,
      date: message.createdAt,
    })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 6)
    .map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      timestamp: format(item.date, "MMM d, p"),
    }));

  const stats = [
    {
      title: "Projects",
      value: projectsCount,
      icon: Rocket,
      description: "Active initiatives across the studio",
    },
    {
      title: "Services",
      value: servicesCount,
      icon: BriefcaseBusiness,
      description: "Offerings packaged for clients",
    },
    {
      title: "Published Posts",
      value: postsCount,
      icon: Layers,
      description: "Stories live across the portfolio",
    },
    {
      title: "Messages",
      value: messagesCount,
      icon: Inbox,
      description: "Inbound leads awaiting response",
    },
  ];

  return (
    <div className="space-y-8 pb-6">
      <MotionSection initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <StatsCards
          items={stats.map((item) => ({
            ...item,
            icon: renderStatIcon(item.icon),
          }))}
        />
      </MotionSection>

      <div className="grid gap-6 xl:grid-cols-[2fr,1.1fr]">
        <AnalyticsChart data={chartData} />
        <RecentActivity items={recentActivity} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <MotionDiv
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="glass-panel overflow-hidden rounded-3xl border border-white/10 bg-white/60 p-6 shadow-glass backdrop-blur-xl dark:bg-neutral-900/70"
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">Latest Projects</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-300/80">Quick view of recent launches</p>
            </div>
            <Button variant="subtle" size="pill" asChild>
              <Link href="/admin/projects">
                View all <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="space-y-4">
            {projects.map((project) => (
              <MotionDiv
                key={project.id}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/60 p-4 shadow-inner transition duration-300 hover:border-primary/40 hover:bg-white/80 dark:bg-neutral-900/60"
                whileHover={{ translateY: -3 }}
              >
                <div className="card-sheen absolute inset-0 opacity-0 transition duration-700 group-hover:opacity-100" />
                <div className="relative flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-100">{project.title}</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-300/70">{project.category}</p>
                  </div>
                  <Badge
                    variant={
                      project.status === "ACTIVE"
                        ? "default"
                        : project.status === "IN_PROGRESS"
                        ? "secondary"
                        : "muted"
                    }
                    className="rounded-full px-3 py-1 text-[11px]"
                  >
                    {project.status.replace("_", " ")}
                  </Badge>
                </div>
                <p className="relative mt-3 text-xs text-neutral-400 dark:text-neutral-300/70">
                  Scheduled {format(project.createdAt, "MMM d")}
                </p>
              </MotionDiv>
            ))}
          </div>
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="glass-panel overflow-hidden rounded-3xl border border-white/10 bg-white/60 p-6 shadow-glass backdrop-blur-xl dark:bg-neutral-900/70"
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">Inbox Snapshot</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-300/80">Newest interactions and leads</p>
            </div>
            <Button variant="subtle" size="pill" asChild>
              <Link href="/admin/messages">
                Inbox <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="space-y-4">
            {messages.length === 0 && <p className="text-sm text-neutral-500 dark:text-neutral-300/70">Inbox is clear.</p>}
            {messages.map((message) => (
              <MotionDiv
                key={message.id}
                className="group flex items-start justify-between gap-3 rounded-3xl border border-white/10 bg-white/60 p-4 shadow-inner transition duration-300 hover:border-primary/40 hover:bg-white/80 dark:bg-neutral-900/60"
                whileHover={{ translateY: -3 }}
              >
                <div>
                  <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-100">{message.name}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-300/70">{message.email}</p>
                </div>
                <Badge
                  variant={message.isRead ? "secondary" : "default"}
                  className="rounded-full px-3 py-1 text-[11px]"
                >
                  {message.isRead ? "Read" : "New"}
                </Badge>
              </MotionDiv>
            ))}
          </div>
        </MotionDiv>
      </div>

      <MotionDiv
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.1 }}
        className="glass-panel rounded-3xl border border-white/10 bg-white/70 p-6 text-sm text-neutral-600 shadow-glass backdrop-blur-xl dark:bg-neutral-900/70 dark:text-neutral-300"
      >
        The team currently has <span className="font-semibold text-primary">{teamCount} members</span> contributing to
        active engagements. Keep scaling talent to match the velocity of new work.
      </MotionDiv>
    </div>
  );
}

function renderStatIcon(Icon: LucideIcon) {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 text-primary">
      <Icon className="h-5 w-5" />
    </div>
  );
}

