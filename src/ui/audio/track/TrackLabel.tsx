import React from "react";
import styles from "./TrackLabel.module.css"

type TrackLabelProps = {
    name: string
}

export const TrackLabel = ({name}: TrackLabelProps) => {
    return (
        <div className={styles.container}>
            {name}
        </div>
    );
}
