interface ButtonProps {
    type: "submit" | "button"| "reset",
    text: string,
    disabled: boolean
}

export const Button = ({type, text, disabled}: ButtonProps) => {
    return (
        <button className="btn" type={type} disabled={disabled}>{text}</button>
    )
}