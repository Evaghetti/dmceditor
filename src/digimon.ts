const SIZE_BYTES_DIGIMON: number = 34;
const MAX_COUNT_DIGIMONS: number = 18;

const VERSION_1_OFFSET = 71594;
const VERSION_2_OFFSET = 71056;

class DigimonStats {
    spriteID: number = 0;
    stage: number = 0;
    maxStamina: number = 0;
    minWheight: number = 0;
    evoTimer: number = 0;
    sleepHour: number = 0;
    sleepMin: number = 0;
    wakeHour: number = 0;
    wakeMin: number = 0;
    hungerTimer: number = 0;
    strenghtDecayTimer: number = 0;
    poopTimer: number = 0;
    healAmount: number = 0;
    attribute: number = 0;
    power: number = 0;
    attackSprite1: number = 0;
    attackSprite2: number = 0;
}

function getDigimonStats(loadData: Uint8Array): DigimonStats {
    const stats = new DigimonStats();

    let offset = 0;
    iterateFields(
        stats,
        (value: number): number => {
            const ret = convertToNumber(loadData.subarray(offset, offset + 2));
            offset += 2;
            return ret;
        }
    );

    return stats;
}

function convertDigimonToBinary(stats: DigimonStats): Uint8Array {
    const retData: Uint8Array = new Uint8Array(SIZE_BYTES_DIGIMON);

    let offset = 0;
    iterateFields(stats, (currentField: number) => {
        retData[offset] = (currentField & 0b011111111);
        retData[offset + 1] = (currentField & 0b01111111100000000);

        offset += 2;
        return undefined;
    });

    return retData;
}

function iterateFields<T extends DigimonStats>(target: T, callback: (value: number) => number | undefined): void {
    for (let key in target) {
        const ret = callback(target[key] as number);

        if (ret !== undefined) {
            target[key] = ret as any;
        }
    }
}

function getDigimonNames(input: number): string[] {
    switch (input) {
        case VERSION_1_OFFSET:
            return ["Botamon", "Koromon", "Agumon", "Betamon", "Greymon", "Tyranomon", "Devimon", "Meramon", "Airdramon", "Seadramon", "Numemon", "Metal Greymon", "Mamemon", "Monzaemon", "BlitzGreymon", "BanchoMamemon", "ShinMonzaemon", "Omegamon Alter-S"];
        case VERSION_2_OFFSET:
            return [];
    }
    return ["Should not get here"];
}