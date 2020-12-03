import React from "react";
import styles from "./ToggleButton.module.css"

interface ToggleButtonProps {
    isActive: boolean,
    onClick: () => void,
    label: string,
    activeColor: string
}

export const ToggleButton = ({isActive, onClick, label, activeColor, ...props}: ToggleButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button
        className={styles.container}
        style={{
            backgroundColor: !isActive ? activeColor : ''
        }}
        onClick={onClick}
        {...props}
    >
        {label}
    </button>
)
