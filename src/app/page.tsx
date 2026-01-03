import { Button } from "@/components/ui/Button"
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
            AI Content for Personal Trainers Who Want to Grow on Instagram
          </h1>

          <p className="text-lg sm:text-xl text-neutral-400 mb-8 max-w-2xl mx-auto">
            Generate engaging Instagram Reels and Carousel posts in seconds.
            AI-powered content creation designed specifically for fitness professionals
            who want to stay consistent and grow their online presence.
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="primary" className="text-base px-8 py-4">
              Generate Content
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-foreground">
            Everything You Need to Dominate Instagram
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg border border-neutral-800 bg-neutral-900/50">
              <div className="w-12 h-12 rounded-md bg-primary/20 flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">
                AI-Generated Reels
              </h3>
              <p className="text-neutral-400">
                Create engaging Instagram Reels with AI-powered scripts,
                hooks, and fitness-focused content that converts.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-neutral-800 bg-neutral-900/50">
              <div className="w-12 h-12 rounded-md bg-primary/20 flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">
                Carousel Posts
              </h3>
              <p className="text-neutral-400">
                Generate multi-slide carousel posts with fitness tips,
                workout routines, and educational content your audience loves.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-neutral-800 bg-neutral-900/50">
              <div className="w-12 h-12 rounded-md bg-primary/20 flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">
                Fitness-Focused
              </h3>
              <p className="text-neutral-400">
                Every piece of content is tailored for fitness professionals
                with industry-specific language and proven engagement strategies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 bg-neutral-900/30">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-foreground">
            Why Personal Trainers Choose PumpLab
          </h2>
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">
                  Save Hours Creating Content
                </h3>
                <p className="text-neutral-400">
                  Stop spending hours brainstorming and writing. Generate
                  weeks of content in minutes, so you can focus on what you do best—training clients.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">
                  Stay Consistent on Social Media
                </h3>
                <p className="text-neutral-400">
                  Consistency is key to growth. With PumpLab, you'll never run out
                  of content ideas. Post daily without the stress.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">
                  Designed for Fitness Professionals
                </h3>
                <p className="text-neutral-400">
                  Built specifically for personal trainers, coaches, and fitness
                  influencers. Every feature is tailored to your industry needs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-foreground">
            Ready to Transform Your Instagram?
          </h2>
          <p className="text-lg text-neutral-400 mb-8">
            Join thousands of personal trainers who are growing their online presence
            with AI-powered content. Start generating today.
          </p>
          <Button variant="primary" className="text-base px-8 py-4">
            Generate Content
          </Button>
        </div>
      </section>
    </div>
  )
}

