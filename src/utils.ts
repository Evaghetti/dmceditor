interface BidingOption {
    defaultValue: number,
    listener: (newValue: number) => void
}

function createInputTextDigimon(content: string, biding: BidingOption | null): HTMLElement {
    const result = document.createElement("p");
    result.innerHTML = content;

    if (biding) {
        const resultInput = document.createElement("input") as HTMLInputElement;
        resultInput.value = biding.defaultValue.toString();
        resultInput.addEventListener("input", (event: Event) => {
            if (event.target) {
                const realTarget = event.target as HTMLInputElement;
                biding.listener(parseInt(realTarget.value));
            }
        });
        resultInput.type = "number";
        resultInput.min = "0";
        resultInput.max = "65535";

        result.appendChild(resultInput);
    }

    return result;
}

function createDigimonElement(name: string, digimon: DigimonStats): HTMLElement {
    const result = document.createElement("div");
    result.classList.add("digimon")

    result.appendChild(createInputTextDigimon(name, null));
    // TODO: ID Sprite Select
    // TODO: Stage select
    result.appendChild(createInputTextDigimon("Stamina máxima", {
        defaultValue: digimon.maxStamina,
        listener: (v) => digimon.maxStamina = v
    }));
    result.appendChild(createInputTextDigimon("Peso minimo", {
        defaultValue: digimon.minWheight,
        listener: (v) => digimon.minWheight = v
    }));
    result.appendChild(createInputTextDigimon("Tempo p/ evoluir", {
        defaultValue: digimon.evoTimer,
        listener: (v) => digimon.evoTimer = v
    }));
    // TODO: Time sleep
    // TODO: Time wake
    result.appendChild(createInputTextDigimon("Tempo p/ sentir fome", {
        defaultValue: digimon.hungerTimer,
        listener: (v) => digimon.hungerTimer = v
    }));
    result.appendChild(createInputTextDigimon("Tempo p/ perder força", {
        defaultValue: digimon.strenghtDecayTimer,
        listener: (v) => digimon.strenghtDecayTimer = v
    }));
    result.appendChild(createInputTextDigimon("Tempo p/ cagar", {
        defaultValue: digimon.poopTimer,
        listener: (v) => digimon.poopTimer = v
    }));
    result.appendChild(createInputTextDigimon("Quantidade necessaria p/ curar", {
        defaultValue: digimon.healAmount,
        listener: (v) => digimon.healAmount = v
    }));
    // TODO: Attribute select
    result.appendChild(createInputTextDigimon("Poder", {
        defaultValue: digimon.power,
        listener: (v) => digimon.power = v
    }));
    // TODO: Select attack sprite 1
    // TODO: Select attack sprite 2
    return result;
}

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