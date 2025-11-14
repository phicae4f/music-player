interface IconProps {
    className?: string;
    name: string;
    width: number,
    height: number
    
}

export const Icon = ({className="", name, width, height}: IconProps) => {
    return (
        <svg className={className} width={width} height={height} aria-hidden={true}>
            <use xlinkHref={`/sprite.svg#${name}`}/>
        </svg>
    )
}