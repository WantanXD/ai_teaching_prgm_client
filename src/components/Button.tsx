import React from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
    variant: keyof typeof buttonStyle;
};
  
const buttonStyle = {
    "green-fill": "bg-green-400 text-white",
    "red-gradation": "bg-gradient-to-r from-red-300 to-red-600 text-white, hover:from-red-600 hover:to-red-300"
} as const;
  
export const Button = ({ children, variant, className, ...props }: Props) => {
    return (
        <button
            className={`rounded-md ${buttonStyle[variant]} ${className}`}
            {...props}>
            {children}
        </button>
    );
};

export default Button;