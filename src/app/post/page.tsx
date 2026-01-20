import { FiDownload, FiHeart } from "react-icons/fi";
import { FaRegComment } from "react-icons/fa";

import { Carousel } from "@/components/common/carousel";
import { Button } from "@/components/ui/Button";

export default function Post() {
    return (
        <div className="min-h-screen bg-background px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
            <div className="container mx-auto max-w-2xl">
                <div className="mb-4 text-center">
                    <h3 className="text-xl font-bold text-foreground sm:text-2xl">
                        Preview do seu conteúdo no Instagram
                    </h3>
                </div>

                <div className="bg-foreground/5 border-foreground/10 overflow-hidden rounded-md border shadow-2xl backdrop-blur-sm">
                    <div className="bg-background">
                        <Carousel />
                    </div>

                    <div className="space-y-6 px-4 py-6 sm:px-6">
                        <div className="space-y-3">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1 text-sm font-semibold uppercase text-primary">
                                    <FiHeart className="h-4 w-4" />
                                    <span>8.5k</span>
                                </div>

                                <div className="flex items-center gap-1 text-sm font-semibold uppercase text-primary">
                                    <FaRegComment className="h-4 w-4" />
                                    <span>256</span>
                                </div>
                            </div>
                            <p className="text-foreground/90 text-base leading-relaxed">
                                Muitos acreditam que a motivação é o motor da transformação, mas ela é volátil e
                                passageira. O verdadeiro progresso vem de uma prática constante, que independe do humor
                                ou do ânimo do dia. Construir hábitos sólidos e agir mesmo quando não se sente vontade é
                                o que realmente promove mudanças reais e permanentes.
                            </p>
                        </div>

                        <div className="border-foreground/10 border-t"></div>

                        <div className="flex justify-center pt-2">
                            <Button
                                variant="primary"
                                className="w-full px-8 py-4 text-base shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl sm:w-auto">
                                <FiDownload className="mr-2 h-5 w-5" />
                                Baixar Post
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="mt-6 text-center">
                    <p className="text-foreground/50 text-xs">O conteúdo será baixado em alta qualidade</p>
                </div>
            </div>
        </div>
    );
}
