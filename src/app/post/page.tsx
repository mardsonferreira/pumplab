import { FiDownload, FiHeart } from "react-icons/fi";
import { FaRegComment } from "react-icons/fa";

import { Carousel } from "@/components/common/carousel";
import { Button } from "@/components/ui/Button";

export default function Post() {
    return (
        <div className="min-h-screen bg-background py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto max-w-2xl">
                <div className="mb-4 text-center">
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                        Preview do seu conteúdo no Instagram
                    </h3>
                </div>

                <div className="bg-foreground/5 border border-foreground/10 rounded-md  overflow-hidden shadow-2xl backdrop-blur-sm">
                    <div className="bg-background">
                        <Carousel />
                    </div>

                    <div className="px-4 sm:px-6 py-6 space-y-6">
                        <div className="space-y-3">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1 text-primary text-sm font-semibold uppercase">
                                    <FiHeart className="w-4 h-4" />
                                    <span>8.5k</span>
                                </div>

                                <div className="flex items-center gap-1 text-primary text-sm font-semibold uppercase">
                                    <FaRegComment className="w-4 h-4" />
                                    <span>256</span>
                                </div>
                            </div>
                            <p className="text-foreground/90 text-base leading-relaxed">
                                Muitos acreditam que a motivação é o motor da transformação, mas ela é volátil e passageira. O verdadeiro progresso vem de uma prática constante, que independe do humor ou do ânimo do dia. Construir hábitos sólidos e agir mesmo quando não se sente vontade é o que realmente promove mudanças reais e permanentes.
                            </p>
                        </div>

                        <div className="border-t border-foreground/10"></div>

                        <div className="flex justify-center pt-2">
                            <Button
                                variant="primary"
                                className="w-full sm:w-auto text-base px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                            >
                                <FiDownload className="w-5 h-5 mr-2" />
                                Baixar Post
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-foreground/50">
                        O conteúdo será baixado em alta qualidade
                    </p>
                </div>
            </div>
        </div>
    )
}