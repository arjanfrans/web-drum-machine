import React from "react";
import styles from "./inputs.module.css"

export const BpmInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <div className={styles.container}>
        BPM:
        <input title="BPM" min={1} max={1600} type="number"
               {...props}
        />
    </div>
)
