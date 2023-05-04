let digimonDatabase: DigimonStats[] = [];
let stageDatabase: Stage[] = [];
let allSpritesId: number[] = [];
let allFirstAttackSprite: number[] = [];
let allSecondtAttackSprite: number[] = [];
let fileContent: Uint8Array;
let versionOffset: number;
let stagesOffset: number;

window.onload = () => {
    const formFile: HTMLFormElement = document.forms[0];
    const buttonSave: HTMLButtonElement = document.querySelector("#saveButton") as HTMLButtonElement;

    formFile.addEventListener("submit", (ev: SubmitEvent) => {
        ev.preventDefault();

        const fileElement: HTMLInputElement = document.getElementById("rom") as HTMLInputElement;
        const [rawVersionOffset, rawStageOffset] = (formFile.elements.namedItem("version") as RadioNodeList).value.split(";");

        const fileReader: FileReader = new FileReader();
        fileReader.onload = (ev) => {
            if (ev.target == null)
                return;

            fileContent = convertBase64ToBinary(ev.target.result as string);
            versionOffset = parseInt(rawVersionOffset);
            stagesOffset = parseInt(rawStageOffset);

            stageDatabase = getAllStages(fileContent.subarray(stagesOffset));
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
            buttonSave.disabled = false;
            console.log(digimonDatabase);
        };

        if (fileElement.files)
            fileReader.readAsDataURL(fileElement.files[0]);
    });

    buttonSave.addEventListener("click", (ev) => {
        ev.preventDefault();

        digimonDatabase.forEach((digimon, index) => {
            const currentOffset = versionOffset + SIZE_BYTES_DIGIMON * index;
            const digimonBytes = convertDigimonToBinary(digimon);

            for (let i = 0; i < digimonBytes.length; i++)
                fileContent[currentOffset + i] = digimonBytes[i];
        });

        stageDatabase.forEach((stage, index) => {
            const currentOffset = stagesOffset + MAX_SIZE_STAGE * index;
            const stageBytes = convertStageToBinary(stage);

            for (let i = 0; i < stageBytes.length; i++)
                fileContent[currentOffset + i] = stageBytes[i];
        });

        const resultFile = new File([fileContent], "MODDED.bin", undefined);

        // @ts-ignore
        saveAs(resultFile);
    });
};