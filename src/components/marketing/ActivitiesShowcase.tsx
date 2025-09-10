import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const items = [
  { key: "dinner", title: "Dinner", blurb: "Share a meal and build connection." },
  { key: "prayer_study", title: "Prayer / Bible Study", blurb: "Gather for scripture, prayer, and spiritual growth." },
  { key: "workout", title: "Working Out", blurb: "Move together and keep each other consistent." },
  { key: "sports", title: "Watch Sporting Events", blurb: "Cheer on your team and invite new friends." },
  { key: "flexible", title: "Flexible", blurb: "Start with interest, decide the rhythm together." },
];

export function ActivitiesShowcase() {
  return (
    <section className="w-full bg-muted/30">
      <div className="mx-auto max-w-screen-xl px-4 py-14">
        <h2 className="text-2xl font-semibold">Groups for how you gather</h2>
        <p className="mt-2 text-muted-foreground">
          Choose an activity that fits your community. Every group practices the 5C framework.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {items.map((it) => (
            <Card key={it.key} className="p-5 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-medium">{it.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{it.blurb}</p>
              </div>
              <div className="mt-4">
                <Button asChild variant="outline" aria-label={`Explore ${it.title} groups`}>
                  <Link to="/signup">Explore groups</Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}