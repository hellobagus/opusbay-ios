export default function numPersen(angka) {
    const data = Math.floor(angka)
    if(angka==null){
        return '-';
    }
    return parseFloat(angka).toFixed(2)+" %";
}