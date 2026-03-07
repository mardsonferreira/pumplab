"""Mock responses for OpenAI endpoints when USE_MOCK_LLM is enabled."""

import json

MOCK_NARRATIVES = json.dumps(
    [
        {
            "id": "mock-1",
            "theme": "Consistencia supera motivacao",
            "central_thesis": "Disciplina diaria cria resultados duradouros.",
            "main_argument": (
                "Voce nao precisa esperar vontade para agir. Quando o treino vira compromisso, "
                "seu progresso deixa de depender do humor e passa a depender do seu sistema."
            ),
            "narrative_sequence": [
                {
                    "step": 1,
                    "title": "A armadilha da motivacao",
                    "description": "Mostre que esperar motivacao antes de agir trava a evolucao.",
                },
                {
                    "step": 2,
                    "title": "O custo da inconstancia",
                    "description": "Explique como pular treinos quebra o ritmo e reduz resultados.",
                },
                {
                    "step": 3,
                    "title": "Mudanca de perspectiva",
                    "description": "Reforce que disciplina e um acordo com seu objetivo futuro.",
                },
                {
                    "step": 4,
                    "title": "Acao pratica",
                    "description": "Sugira horarios fixos e metas pequenas para manter frequencia.",
                },
                {
                    "step": 5,
                    "title": "Fechamento",
                    "description": "Convide a pessoa a salvar o post e aplicar hoje mesmo.",
                },
            ],
        },
        {
            "id": "mock-2",
            "theme": "Treino inteligente no dia a dia",
            "central_thesis": "Treinar melhor vale mais do que treinar mais.",
            "main_argument": (
                "Quantidade sem estrategia gera cansaco e frustracao. Com planejamento simples, "
                "voce ganha eficiencia, evita excesso e mantem constancia por mais tempo."
            ),
            "narrative_sequence": [
                {
                    "step": 1,
                    "title": "Mais nem sempre e melhor",
                    "description": "Quebre a ideia de que volume alto sempre acelera resultados.",
                },
                {
                    "step": 2,
                    "title": "Erro comum",
                    "description": "Mostre como treinar no limite diario aumenta risco de abandono.",
                },
                {
                    "step": 3,
                    "title": "Nova leitura",
                    "description": "Apresente intensidade + recuperacao como dupla essencial.",
                },
                {
                    "step": 4,
                    "title": "Aplicacao imediata",
                    "description": "Oriente alternar dias fortes com dias moderados.",
                },
                {
                    "step": 5,
                    "title": "CTA",
                    "description": "Incentive a revisar a semana e ajustar o proximo treino.",
                },
            ],
        },
        {
            "id": "mock-3",
            "theme": "Habitos para energia e foco",
            "central_thesis": "Sono e alimentacao consistentes potencializam seu treino.",
            "main_argument": (
                "Nao existe performance sustentavel sem base de recuperacao. Dormir bem e comer com "
                "regularidade melhora energia, foco e capacidade de manter bons habitos."
            ),
            "narrative_sequence": [
                {
                    "step": 1,
                    "title": "Dor recorrente",
                    "description": "Traga o cenario de cansaco constante mesmo com esforco.",
                },
                {
                    "step": 2,
                    "title": "Mito comum",
                    "description": "Desmonte a ideia de que so treino resolve tudo.",
                },
                {
                    "step": 3,
                    "title": "Reenquadramento",
                    "description": "Mostre recuperacao como parte do plano, nao como opcional.",
                },
                {
                    "step": 4,
                    "title": "Passo pratico",
                    "description": "Sugira rotina de sono e preparacao simples de refeicoes.",
                },
                {
                    "step": 5,
                    "title": "Conclusao",
                    "description": "Peca para compartilhar com quem vive sem energia.",
                },
            ],
        },
        {
            "id": "mock-4",
            "theme": "Mindset de longo prazo",
            "central_thesis": "Resultados reais aparecem para quem pensa em anos, nao em dias.",
            "main_argument": (
                "Comparacao e pressa sabotam sua jornada. Foco em processo cria estabilidade, "
                "reduz ansiedade e transforma pequenos avancos em grandes conquistas."
            ),
            "narrative_sequence": [
                {
                    "step": 1,
                    "title": "Choque inicial",
                    "description": "Mostre a frustacao de quem quer mudanca imediata.",
                },
                {
                    "step": 2,
                    "title": "Por que trava",
                    "description": "Explique como expectativa irreal gera desistencia precoce.",
                },
                {
                    "step": 3,
                    "title": "Nova lente",
                    "description": "Apresente progresso semanal como indicador mais honesto.",
                },
                {
                    "step": 4,
                    "title": "Pratica simples",
                    "description": "Oriente registrar tres vitorias pequenas por semana.",
                },
                {
                    "step": 5,
                    "title": "Encerramento",
                    "description": "Convide a pessoa a comentar qual habito vai manter.",
                },
            ],
        },
        {
            "id": "mock-5",
            "theme": "Constancia mesmo com rotina corrida",
            "central_thesis": "Treinos curtos e frequentes vencem planos perfeitos que nao saem do papel.",
            "main_argument": (
                "A falta de tempo costuma esconder falta de estrategia. Sessoes objetivas de 20 a 30 "
                "minutos podem manter seu corpo ativo e sua identidade de pessoa disciplinada."
            ),
            "narrative_sequence": [
                {
                    "step": 1,
                    "title": "Realidade do dia a dia",
                    "description": "Reconheca a correria e a dificuldade de encaixar treinos longos.",
                },
                {
                    "step": 2,
                    "title": "Erro frequente",
                    "description": "Mostre que esperar tempo ideal leva a semanas sem treinar.",
                },
                {
                    "step": 3,
                    "title": "Virada de chave",
                    "description": "Reforce que consistencia importa mais que duracao perfeita.",
                },
                {
                    "step": 4,
                    "title": "Guia pratico",
                    "description": "Sugira blocos curtos com horario fixo e meta minima.",
                },
                {
                    "step": 5,
                    "title": "Chamada final",
                    "description": "Incentive salvar este roteiro para aplicar na proxima semana.",
                },
            ],
        },
    ]
)

MOCK_CAROUSEL_MASTER_PROMPT = (
    "Create a visually compelling carousel about fitness innovation. "
    "Use bold typography, high-contrast colors, and motivational language. "
    "Each slide should deliver one key insight with a supporting visual metaphor."
)


def mock_carousel_images(slides: list[dict]) -> list[str]:
    """Return one placeholder URL per slide when USE_MOCK_LLM is enabled."""
    return ["https://placehold.co/1024x1024" if slide else "" for slide in slides]
