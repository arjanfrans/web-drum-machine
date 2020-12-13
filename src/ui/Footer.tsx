import React from "react";

const name = process.env.REACT_APP_NAME
const version = process.env.REACT_APP_VERSION

export const Footer = () => {
    const copyrightYear = () => {
        const firstYear = 2020;
        const currentYear = (new Date()).getFullYear()

        return currentYear !== firstYear ? `${firstYear}-${currentYear}` : `${currentYear}`;
    }

    return (
        <>
            <hr/>
            &copy; {`Arjan Frans ${copyrightYear()} | `}
            <a target="_blank" rel="noopener noreferrer" href="https://github.com/arjanfrans/web-drum-machine">
                Source Code
            </a> | {name} v{version}
        </>
    )
}
