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
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
            Conteúdo com IA para Personal Trainers que Querem Crescer no Instagram
          </h1>

          <p className="text-lg sm:text-xl text-neutral-400 mb-8 max-w-2xl mx-auto">
            Gere Reels e posts em Carrossel para o Instagram em segundos com criação de conteúdo impulsionada por IA,
            feita sob medida para profissionais de fitness que querem manter consistência, engajar mais e crescer sua presença online.
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="primary" className="text-base px-8 py-4">
              Gerar Conteúdo
            </Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-foreground">
            Tudo o que Você Precisa para Dominar o Instagram
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
                Reels Gerados pela IA
              </h3>
              <p className="text-neutral-400">
                Crie Reels envolventes para o Instagram com scripts,
                hooks e conteúdo focado em fitness que convertem.
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
                Posts em Carrossel
              </h3>
              <p className="text-neutral-400">
                Gere posts em Carrossel com dicas de fitness,
                rotinas de treino e conteúdo educativo que seu público ama.
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
                Focado em Fitness
              </h3>
              <p className="text-neutral-400">
                Cada peça de conteúdo é feita sob medida para profissionais de fitness
                com linguagem específica para o setor e estratégias comprovadas de engajamento.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 bg-neutral-900/30">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-foreground">
            Porque Personal Trainers Escolhem o PumpLab
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
                  Economize Horas Criando Conteúdo
                </h3>
                <p className="text-neutral-400">
                  Pare de gastar horas brainstorming e escrevendo. Gere
                  semanas de conteúdo em minutos, para que você possa se concentrar no que você faz melhor—treinando clientes.
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
                  Mantenha Consistência nas Redes Sociais
                </h3>
                <p className="text-neutral-400">
                  Consistência é chave para o crescimento. Com o PumpLab, você nunca vai ficar sem ideias de conteúdo. Poste diariamente sem o estresse.
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
                  Feito para Profissionais de Fitness
                </h3>
                <p className="text-neutral-400">
                  Construído especificamente para personal trainers, coaches e influencers de fitness.
                  Cada funcionalidade é feita sob medida para as necessidades do seu setor.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-foreground">
            Pronto para Transformar o Seu Instagram?
          </h2>
          <p className="text-lg text-neutral-400 mb-8">
            Junte-se a milhares de profissionais de fitness que estão crescendo sua presença online
            com conteúdo impulsionado por IA. Comece a gerar conteúdo hoje.
          </p>
          <Button variant="primary" className="text-base px-8 py-4">
            Gerar Conteúdo
          </Button>
        </div>
      </section>
    </div>
  )
}

