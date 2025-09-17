import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    quote: "For the first time, I don't just attend events—I belong.",
    author: "Sarah M.",
    role: "Community Member",
    location: "Downtown Neighborhood",
    rating: 5
  },
  {
    id: 2,
    quote: "My group has become my extended family.",
    author: "Marcus J.",
    role: "Group Participant", 
    location: "Riverside Community",
    rating: 5
  },
  {
    id: 3,
    quote: "mbio made it simple to find real friends, not just contacts.",
    author: "Elena R.",
    role: "Working Professional",
    location: "Midtown Area",
    rating: 5
  }
];

export function Testimonials() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-space text-4xl md:text-5xl font-bold mb-6 text-foreground">
            What Our Members Say
          </h2>
          <p className="text-premium-body text-muted-foreground max-w-2xl mx-auto">
            Real stories from people who found their community through mbio.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial) => (
            <Card 
              key={testimonial.id}
              className="hover-lift border-0 shadow-soft hover:shadow-lift bg-gradient-to-br from-card to-card/80"
            >
              <CardContent className="p-8">
                {/* Rating Stars */}
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>
                
                {/* Quote */}
                <blockquote className="text-premium-body text-foreground leading-relaxed mb-6 font-medium">
                  "{testimonial.quote}"
                </blockquote>
                
                {/* Author */}
                <div className="border-t border-border pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold">
                      {testimonial.author.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">
                        {testimonial.author}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </div>
                      <div className="text-xs text-muted-foreground/80">
                        {testimonial.location}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Indicator */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 bg-card rounded-full px-6 py-3 shadow-soft">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-primary"></div>
              <div className="w-8 h-8 rounded-full bg-secondary"></div>
              <div className="w-8 h-8 rounded-full bg-accent"></div>
            </div>
            <span className="text-sm text-muted-foreground">
              Join 2,500+ neighbors who found their community
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}