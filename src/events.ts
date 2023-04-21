let digimonDatabase: DigimonStats[] = [];
let allSpritesId: number[] = [];
let allFirstAttackSprite: number[] = [];
let allSecondtAttackSprite: number[] = [];

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

            const names: string[] = getDigimonNames(versionOffset);
            allSpritesId = digimonDatabase.map(d => d.spriteID);
            allFirstAttackSprite = digimonDatabase.map(d => d.attackSprite1);
            allSecondtAttackSprite = digimonDatabase.map(d => d.attackSprite2);

            for (let i = 0; i < names.length; i++) {
                document.getElementById("digimon-list")?.appendChild(
                    createDigimonElement(
                        names[i],
                        digimonDatabase[i],
                        allSpritesId,
                        allFirstAttackSprite,
                        allSecondtAttackSprite
                    )
                );
            }

            console.log(digimonDatabase);
        };

        if (fileElement.files)
            fileReader.readAsDataURL(fileElement.files[0]);
    });
};