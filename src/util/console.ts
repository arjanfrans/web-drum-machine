/**
 * Import this file before everything to disable all "log" and "debug" console logs in the production build.
 */
if (process.env.NODE_ENV === "production") {
    const noop = () => undefined

    console.log = noop
    console.debug = noop
}

export const log = console.log
