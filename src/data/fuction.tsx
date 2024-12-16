import { words } from "./word"
export const translateCategory = (word: string) => {
    let exportWord: string = word
    words.forEach(w => {
        if (w.english === word) {
            exportWord = w.vietnamese
        }
    });
    return exportWord
}