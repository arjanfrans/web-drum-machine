export class ArrayHelper {
    public static indexes(length: number): Array<number> {
        const result = []

        for (let i = 0; i < length; i++) {
            result.push(i)
        }

        return result
    }
}
