/* eslint-disable react-refresh/only-export-components */
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center rounded-xl font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                primary: "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/20",
                secondary: "bg-white/5 border border-white/10 text-white hover:bg-white/10",
                outline: "border-2 border-blue-500 text-blue-400 hover:bg-blue-500/10",
                ghost: "text-white/70 hover:text-white hover:bg-white/5",
                gradient: "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white hover:shadow-xl hover:shadow-purple-500/30",
            },
            size: {
                sm: "text-sm px-4 py-2",
                md: "text-base px-6 py-3",
                lg: "text-lg px-8 py-4",
                xl: "text-xl px-10 py-5",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "md",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
