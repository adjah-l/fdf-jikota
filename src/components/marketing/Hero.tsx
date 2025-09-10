import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";

export function MarketingHero() {
  return (
    <section className="relative py-20 px-4 text-center bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Match. Gather. Care.
        </h1>
        
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          One platform for members to gather and care for one another, and for leaders to form groups rooted in mutual care.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" className="text-lg px-8">
            Get Started
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          
          <Button size="lg" variant="outline" className="text-lg px-8">
            <Play className="mr-2 w-5 h-5" />
            See How It Works
          </Button>
        </div>
        
        <div className="mt-8">
          <Button variant="link" className="text-muted-foreground">
            For Organizations →
          </Button>
        </div>
      </div>
    </section>
  );
}