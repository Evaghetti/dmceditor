interface SelectOption {
    value: number,
    display: string
}

interface BidingOption {
    defaultValue: number,
    selectOptions?: SelectOption[],
    listener: (newValue: number) => void
}

function createInputDigimon(biding: BidingOption, minValue: number = 0, maxValue: number = 65535): HTMLInputElement {
    const resultInput: HTMLInputElement = document.createElement("input");
    resultInput.value = biding.defaultValue.toString();
    resultInput.addEventListener("input", (event: Event) => biding.listener(parseInt(resultInput.value)));
    resultInput.type = "number";
    resultInput.min = minValue.toString();
    resultInput.max = maxValue.toString();
    return resultInput;
}

function createInputTextDigimon(content: string, biding: BidingOption | null): HTMLElement {
    const result: HTMLParagraphElement = document.createElement("p");
    result.innerText = content;

    if (biding)
        result.appendChild(createInputDigimon(biding));

    return result;
}

function createSelectDigimon(label: string, biding: BidingOption): HTMLElement {
    if (biding.selectOptions === undefined)
        throw "Needs multiples valus to create select";

    const result = createInputTextDigimon(label, null);

    const resultSelect: HTMLSelectElement = document.createElement("select");
    resultSelect.addEventListener("change", (ev) => biding.listener(parseInt(resultSelect.value)));
    for (let currentOptionConfig of biding.selectOptions) {
        const option: HTMLOptionElement = document.createElement("option");
        option.value = currentOptionConfig.value.toString();
        option.innerText = currentOptionConfig.display;
        if (currentOptionConfig.value === biding.defaultValue)
            option.selected = true;

        resultSelect.options.add(option);
    }

    result.appendChild(resultSelect);
    return result;
}

function createHourInputDigimon(content: string, bidingHour: BidingOption, bidingMinute: BidingOption): HTMLElement {
    const result: HTMLParagraphElement = document.createElement("p");
    result.innerText = content;

    let span: HTMLSpanElement = document.createElement("span") as HTMLSpanElement;
    span.innerText = "Hora ";
    span.appendChild(createInputDigimon(bidingHour, 0, 23));
    result.appendChild(span);

    span = document.createElement("span") as HTMLSpanElement;
    span.innerText = " Minuto ";
    span.appendChild(createInputDigimon(bidingMinute, 0, 59));
    result.appendChild(span);

    return result;
}

function createDigimonElement(name: string, digimon: DigimonStats): HTMLElement {
    const result: HTMLDivElement = document.createElement("div");
    result.classList.add("digimon")

    result.appendChild(createInputTextDigimon(name, null));
    // TODO: ID Sprite Select
    result.appendChild(createSelectDigimon("Estagio ", {
        defaultValue: digimon.stage,
        selectOptions: [{
            display: "Bebê 1",
            value: 0
        }, {
            display: "Bebê 2",
            value: 1
        }, {
            display: "Criança",
            value: 2,
        }, {
            display: "Adulto",
            value: 3
        }, {
            display: "Perfeito",
            value: 4
        }, {
            display: "Definitivo",
            value: 5
        }],
        listener: (v) => digimon.stage = v
    }));
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
    result.appendChild(createSelectDigimon("Atributo ", {
        defaultValue: digimon.attribute,
        selectOptions: [{
            display: "Free",
            value: 0
        }, {
            display: "Virus",
            value: 1
        }, {
            display: "Data",
            value: 2,
        }, {
            display: "Vacina",
            value: 3
        }],
        listener: (v) => digimon.attribute = v
    }));
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