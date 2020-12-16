export class ArrayHelper {
    public static indexes(length: number): Array<number> {
        const result = []

        for (let i = 0; i < length; i++) {
            result.push(i)
        }

        return result
    }

    public static stretch(array: Array<any>, length: number): Array<any> {
        const blankArray: Array<any> = new Array(...new Array(length))
        let originIndex = 0

        return blankArray.map(() => {
            if (originIndex > array.length - 1) {
                originIndex = 0
            }

            const result = array[originIndex]

            originIndex++

            return result
        })
    }
}
