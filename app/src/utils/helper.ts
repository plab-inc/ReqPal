export const shuffleArray = (array: any) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
};

export function convertStringToNumber(value: string) {
    const numValue = Number(value);
    if (!isNaN(numValue)) {
        return numValue;
    }
}