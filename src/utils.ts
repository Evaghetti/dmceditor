interface BidingOption {
    defaultValue: number,
    listener: (newValue: number) => void
}

function createInputDigimon(biding: BidingOption, minValue: number = 0, maxValue: number = 65535): HTMLInputElement {
    const resultInput = document.createElement("input") as HTMLInputElement;
    resultInput.value = biding.defaultValue.toString();
    resultInput.addEventListener("input", (event: Event) => {
        if (event.target) {
            const realTarget = event.target as HTMLInputElement;
            biding.listener(parseInt(realTarget.value));
        }
    });
    resultInput.type = "number";
    resultInput.min = minValue.toString();
    resultInput.max = maxValue.toString();
    return resultInput;
}

function createInputTextDigimon(content: string, biding: BidingOption | null): HTMLElement {
    const result = document.createElement("p");
    result.innerHTML = content;

    if (biding)
        result.appendChild(createInputDigimon(biding));

    return result;
}

function createHourInputDigimon(content: string, bidingHour: BidingOption, bidingMinute: BidingOption): HTMLElement {
    const result = document.createElement("p");
    result.innerHTML = content;

    let span = document.createElement("span") as HTMLSpanElement;
    span.innerHTML = "Hora ";
    span.appendChild(createInputDigimon(bidingHour, 0, 23));
    result.appendChild(span);

    span = document.createElement("span") as HTMLSpanElement;
    span.innerHTML = " Minuto ";
    span.appendChild(createInputDigimon(bidingMinute, 0, 59));
    result.appendChild(span);

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
    result.appendChild(createHourInputDigimon("Quando dormir, ", {
        defaultValue: digimon.sleepHour,
        listener: (v) => digimon.sleepHour = v
    }, {
        defaultValue: digimon.sleepMin,
        listener: (v) => digimon.sleepMin = v
    }));
    result.appendChild(createHourInputDigimon("Quando acordar, ", {
        defaultValue: digimon.wakeHour,
        listener: (v) => digimon.wakeHour = v
    }, {
        defaultValue: digimon.wakeMin,
        listener: (v) => digimon.wakeMin = v
    }));
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