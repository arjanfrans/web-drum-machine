import React from "react";
import styles from "./ToggleButton.module.css"
import {Color, colorStyle} from "../Color";

export const ToggleButton = ({isActive, onClick, label, activeColor}: { isActive: boolean, onClick: () => void, label: string, activeColor: Color }) => (
    <button
        className={`${(!isActive ? colorStyle[activeColor] : '')} ${styles.container}`}
        onClick={onClick}
    >
        {label}
    </button>
)
