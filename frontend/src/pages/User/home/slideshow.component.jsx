"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight, PlayIcon, PauseIcon, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import slideApi from "@/apis/modules/slideshow.api.ts"

export default function Slideshow() {
    const [slides, setSlides] = useState([])
    const [currentSlide, setCurrentSlide] = useState(0)
    const [isPlaying, setIsPlaying] = useState(true)
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        const fetchSlides = async () => {
            const filters = {
                field: "status",
                condition: "=",
                value: 1
            }

            const res = await slideApi.list({
                filters: filters
            })
            
            if (res.status_code === 200) {
                setSlides(res.data.data)
            }
            setIsLoading(false)
        }

        fetchSlides()
    }, [])

    // Chuyển đến slide tiếp theo
    const nextSlide = useCallback(() => {
        if (slides.length === 0) return;
        setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, [slides])

    // Chuyển đến slide trước
    const prevSlide = useCallback(() => {
        if (slides.length === 0) return;
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    }, [slides])

    // Chuyển đến slide cụ thể
    const goToSlide = useCallback((index) => {
        setCurrentSlide(index)
    }, [])

    // Auto-play slideshow
    useEffect(() => {
        if (!isPlaying) return

        const interval = setInterval(() => {
            nextSlide()
        }, 5000) // 5 giây

        return () => clearInterval(interval)
    }, [isPlaying, nextSlide])

    // Xử lý keyboard navigation
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "ArrowLeft") {
                prevSlide()
            } else if (event.key === "ArrowRight") {
                nextSlide()
            } else if (event.key === " ") {
                event.preventDefault()
                setIsPlaying((prev) => !prev)
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [nextSlide, prevSlide])

    const currentSlideData = slides[currentSlide]

    if (isLoading) {
        return <div className="w-full h-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin" />
        </div>
    }

    return (
        <section className="w-full relative">
            <div
                className="relative h-[400px] md:h-[50vh] lg:h-[50vh] w-full overflow-hidden group"
                onMouseEnter={() => setIsPlaying(false)}
                onMouseLeave={() => setIsPlaying(true)}
            >
                {/* Background Images */}
                <div className="relative w-full h-full">
                    {slides.map((slide, index) => (
                        <div
                            key={slide.id}
                            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100" : "opacity-0"
                                }`}
                        >
                            <img
                                key={index}
                                src={slide.image || "/placeholder.svg"}
                                alt={slide?.title}
                                className="object-cover w-full h-full"
                            />
                            <div className={`absolute inset-0 bg-gradient-to-r`} />
                        </div>
                    ))}
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col items-start justify-center p-6 md:p-12 top-[15vh]">
                    <div className="mx-auto w-full max-w-5xl">
                        <div key={currentSlide} className="animate-in slide-in-from-left-5 fade-in duration-700">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button className={`text-white font-medium`} size="lg" onClick={() => {
                                    window.open(`${currentSlideData?.link}`, "_blank")
                                }}>
                                    {currentSlideData?.text_button}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Arrows */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white border-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    onClick={prevSlide}
                >
                    <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white border-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    onClick={nextSlide}
                >
                    <ChevronRight className="h-6 w-6" />
                </Button>

                {/* Slide Indicators */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? "bg-white scale-110" : "bg-white/50 hover:bg-white/70"
                                }`}
                            onClick={() => goToSlide(index)}
                            aria-label={`Chuyển đến slide ${index + 1}`}
                        />
                    ))}
                </div>

                {/* Play/Pause Indicator */}
                <div className="absolute top-5 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-black/20 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm">
                        {isPlaying ? <PlayIcon className="h-4 w-4" /> : <PauseIcon className="h-4 w-4" />}
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-sky-500/20">
                    <div 
                        className="h-full bg-sky-500 transition-all duration-100 ease-linear"
                        style={{
                            width: isPlaying ? "100%" : "0%",
                            animation: isPlaying ? "progress 5s linear infinite" : "none",
                        }}
                    ></div>
                </div>
            </div>

            {/* Custom CSS for animations */}
            <style jsx>{`
            @keyframes progress {
                from {
                    width: 0%;
                }
                to {
                    width: 100%;
                }
            }
            `}</style>
        </section>
    )
}
