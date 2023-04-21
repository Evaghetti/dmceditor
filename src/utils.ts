function convertBase64ToBinary(base64Content: string): Uint8Array {
    base64Content = base64Content.split(",")[1];

    const stringContent = atob(base64Content);
    const fileBinary = new Uint8Array(
        stringContent
            .split('')
            .map((v) => v.charCodeAt(0))
    );

    return fileBinary;
}

function convertToNumber(data: Uint8Array): number {
    return (data[1] << 8) | (data[0]);
}