"use client"
import { Check, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * StageIndicator Component
 *
 * @param {Object} props
 * @param {Array} props.stages - Array of stage objects
 * @param {number} props.currentStage - Index of current active stage (0-based)
 * @param {string} [props.variant="horizontal"] - Layout: "horizontal", "vertical", "timeline"
 * @param {string} [props.size="md"] - Size: "sm", "md", "lg"
 * @param {boolean} [props.showLabels=true] - Whether to show stage labels
 * @param {boolean} [props.showDescription=false] - Whether to show stage descriptions
 * @param {boolean} [props.clickable=false] - Whether stages are clickable
 * @param {function} [props.onStageClick] - Callback when stage is clicked
 * @param {string} [props.className] - Additional CSS classes
 */
const StageIndicator = ({
    stages = [],
    currentStage = 0,
    variant = "horizontal",
    size = "md",
    showLabels = true,
    showDescription = false,
    clickable = false,
    onStageClick,
    className = "",
    ...props
}) => {
    const sizes = {
        sm: {
            circle: "w-6 h-6",
            icon: "w-3 h-3",
            text: "text-xs",
            connector: "h-0.5",
        },
        md: {
            circle: "w-8 h-8",
            icon: "w-4 h-4",
            text: "text-sm",
            connector: "h-1",
        },
        lg: {
            circle: "w-12 h-12",
            icon: "w-6 h-6",
            text: "text-base",
            connector: "h-1.5",
        },
    }

    const getStageStatus = (index) => {
        if (index < currentStage) return "completed"
        if (index === currentStage) return "current"
        return "pending"
    }

    const getStageIcon = (stage, status, index) => {
        if (stage.icon) return stage.icon
        if (status === "completed") return <Check className={sizes[size].icon} />
        if (status === "current") return <Circle className={sizes[size].icon} fill="currentColor" />
        return <span className={cn("font-semibold", sizes[size].text)}>{index + 1}</span>
    }

    const getStageColors = (status) => {
        switch (status) {
            case "completed":
                return "bg-green-500 text-white border-green-500"
            case "current":
                return "bg-blue-500 text-white border-blue-500"
            case "pending":
                return "bg-gray-200 text-gray-500 border-gray-300"
            default:
                return "bg-gray-200 text-gray-500 border-gray-300"
        }
    }

    const handleStageClick = (index, stage) => {
        if (clickable && onStageClick) {
            onStageClick(index, stage)
        }
    }

    if (variant === "timeline") {
        return (
            <div className={cn("space-y-4", className)} {...props}>
                {stages.map((stage, index) => {
                    const status = getStageStatus(index)
                    return (
                        <div key={index} className="flex items-start space-x-3">
                            <div
                                className={cn(
                                    "flex items-center justify-center rounded-full border-2 flex-shrink-0",
                                    sizes[size].circle,
                                    getStageColors(status),
                                    clickable && "cursor-pointer hover:scale-105 transition-transform",
                                )}
                                onClick={() => handleStageClick(index, stage)}
                            >
                                {getStageIcon(stage, status, index)}
                            </div>
                            <div className="flex-1 min-w-0">
                                {showLabels && (
                                    <h3
                                        className={cn(
                                            "font-medium",
                                            sizes[size].text,
                                            status === "current" ? "text-blue-600" : "text-gray-900",
                                        )}
                                    >
                                        {stage.label}
                                    </h3>
                                )}
                                {showDescription && stage.description && (
                                    <p className={cn("text-gray-600 mt-1", sizes[size].text)}>{stage.description}</p>
                                )}
                                {stage.date && <p className="text-xs text-gray-500 mt-1">{stage.date}</p>}
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }

    if (variant === "vertical") {
        return (
            <div className={cn("flex flex-col items-center space-y-2", className)} {...props}>
                {stages.map((stage, index) => {
                    const status = getStageStatus(index)
                    const isLast = index === stages.length - 1
                    return (
                        <div key={index} className="flex flex-col items-center">
                            <div
                                className={cn(
                                    "flex items-center justify-center rounded-full border-2 flex-shrink-0",
                                    sizes[size].circle,
                                    getStageColors(status),
                                    clickable && "cursor-pointer hover:scale-105 transition-transform",
                                )}
                                onClick={() => handleStageClick(index, stage)}
                            >
                                {getStageIcon(stage, status, index)}
                            </div>
                            {showLabels && (
                                <span
                                    className={cn(
                                        "mt-2 text-center",
                                        sizes[size].text,
                                        status === "current" ? "text-blue-600 font-medium" : "text-gray-600",
                                    )}
                                >
                                    {stage.label}
                                </span>
                            )}
                            {!isLast && (
                                <div
                                    className={cn(
                                        "w-0.5 bg-gray-300 my-2",
                                        status === "completed" ? "bg-green-500" : "bg-gray-300",
                                        size === "sm" ? "h-8" : size === "md" ? "h-12" : "h-16",
                                    )}
                                />
                            )}
                        </div>
                    )
                })}
            </div>
        )
    }

    // Horizontal variant (default)
    return (
        <div className={cn("flex items-center w-full", className)} {...props}>
            {stages.map((stage, index) => {
                const status = getStageStatus(index)
                const isLast = index === stages.length - 1
                return (
                    <div key={index} className="flex items-center flex-1">
                        <div className="flex flex-col items-center">
                            <div
                                className={cn(
                                    "flex items-center justify-center rounded-full border-2 flex-shrink-0",
                                    sizes[size].circle,
                                    getStageColors(status),
                                    clickable && "cursor-pointer hover:scale-105 transition-transform",
                                )}
                                onClick={() => handleStageClick(index, stage)}
                            >
                                {getStageIcon(stage, status, index)}
                            </div>
                            {showLabels && (
                                <span
                                    className={cn(
                                        "mt-2 text-center",
                                        sizes[size].text,
                                        status === "current" ? "text-blue-600 font-medium" : "text-gray-600",
                                    )}
                                >
                                    {stage.label}
                                </span>
                            )}
                            {showDescription && stage.description && (
                                <p className={cn("text-gray-500 text-center mt-1", sizes[size].text)}>{stage.description}</p>
                            )}
                        </div>
                        {!isLast && (
                            <div
                                className={cn(
                                    "flex-1 mx-4",
                                    sizes[size].connector,
                                    status === "completed" ? "bg-green-500" : "bg-gray-300",
                                )}
                            />
                        )}
                    </div>
                )
            })}
        </div>
    )
}

export default StageIndicator
