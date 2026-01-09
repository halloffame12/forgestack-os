import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const badgeVariants = cva(
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
    {
        variants: {
            variant: {
                default: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
                success: "bg-green-500/10 text-green-400 border border-green-500/20",
                warning: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
                error: "bg-red-500/10 text-red-400 border border-red-500/20",
                purple: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
                outline: "border border-white/20 text-white/70",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    )
}

export { Badge, badgeVariants }
