import "server-only";
import { prisma } from "@/lib/db";
import type { Project } from "@prisma/client";
import type { ProjectCategory } from "@/lib/projects";

/**
 * Featured first, then the rest in chronological-create order.
 * Mirrors the curated sort the home page used while data was hardcoded.
 */
export async function getAllProjects(): Promise<Project[]> {
  return prisma.project.findMany({
    orderBy: [{ featured: "desc" }, { createdAt: "asc" }],
  });
}

export async function getFeaturedProjects(): Promise<Project[]> {
  return prisma.project.findMany({
    where: { featured: true },
    orderBy: { createdAt: "asc" },
  });
}

export async function getProjectsByCategory(
  category: ProjectCategory,
): Promise<Project[]> {
  return prisma.project.findMany({
    where: { category },
    orderBy: [{ featured: "desc" }, { createdAt: "asc" }],
  });
}

export async function getProjectById(id: string): Promise<Project | null> {
  return prisma.project.findUnique({ where: { id } });
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  return prisma.project.findUnique({ where: { slug } });
}

export async function countProjectsByCategory(): Promise<
  Record<string, number>
> {
  const groups = await prisma.project.groupBy({
    by: ["category"],
    _count: { _all: true },
  });
  const out: Record<string, number> = {};
  for (const g of groups) out[g.category] = g._count._all;
  return out;
}
