let digimonDatabase: DigimonStats[] = [];

window.onload = () => {
    const formFile: HTMLFormElement = document.forms[0];

    formFile.addEventListener("submit", (ev: SubmitEvent) => {
        ev.preventDefault();

        const fileElement: HTMLInputElement = document.getElementById("rom") as HTMLInputElement;

        const fileReader: FileReader = new FileReader();
        fileReader.onload = (ev) => {
            if (ev.target == null)
                return;

            const fileContent = convertBase64ToBinary(ev.target.result as string);
            const versionOffset = parseInt((formFile.elements.namedItem("version") as RadioNodeList).value);

            digimonDatabase = [];
            for (let i = versionOffset; i < versionOffset + (SIZE_BYTES_DIGIMON * MAX_COUNT_DIGIMONS); i += SIZE_BYTES_DIGIMON) {
                const currentData: Uint8Array = fileContent.subarray(i, i + SIZE_BYTES_DIGIMON);
                console.log(`Offset ${i.toString(16)}:${(i + SIZE_BYTES_DIGIMON).toString(16)} (${currentData.length})`)

                let digimon: DigimonStats = getDigimonStats(currentData);

                digimonDatabase.push(digimon);
            }
            console.log(digimonDatabase);
        };

        if (fileElement.files)
            fileReader.readAsDataURL(fileElement.files[0]);
    });
};