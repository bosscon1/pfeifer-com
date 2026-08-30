import { createFileRoute, notFound } from "@tanstack/react-router";
import { BlogShell } from "@/components/blog-listing";
import { articlesByMonth, monthLabel } from "@/data/taxonomy";

export const Route = createFileRoute("/$year/$month/")({
  beforeLoad: ({ params }) => {
    if (!/^\d{4}$/.test(params.year) || !/^\d{1,2}$/.test(params.month)) {
      throw notFound();
    }
    const list = articlesByMonth(params.year, params.month);
    if (list.length === 0) throw notFound();
  },
  head: ({ params }) => {
    const label = monthLabel(params.year, params.month.padStart(2, "0"));
    return {
      meta: [
        { title: `${label} | Pfeifer Building Company` },
        {
          name: "description",
          content: `Articles published in ${label} by Pfeifer Building Company.`,
        },
      ],
      links: [
        {
          rel: "canonical",
          href: `https://pfeiferbuild.com/${params.year}/${params.month.padStart(2, "0")}/`,
        },
      ],
    };
  },
  component: MonthArchive,
});

function MonthArchive() {
  const { year, month } = Route.useParams();
  const mm = month.padStart(2, "0");
  const list = articlesByMonth(year, mm);
  const label = monthLabel(year, mm);
  return (
    <BlogShell
      title={label}
      lede={`${list.length} article${list.length === 1 ? "" : "s"} from ${label}.`}
      articles={list}
      activeMonth={`${year}-${mm}`}
    />
  );
}
