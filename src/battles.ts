const PATTERN_EOF = [0xff, 0xff, 0x00, 0x00];
const SIZE_PATTERN_EOF = PATTERN_EOF.length;

const SIZE_BATTLE = 4
const COUNT_BATTLES_PER_STAGE = 5;
const MAX_SIZE_STAGE = SIZE_BATTLE * COUNT_BATTLES_PER_STAGE;

interface Battle {
    digimon: number,
    power: number
}

interface Stage {
    battles: Battle[]
}

function getStage(buffer: Uint8Array): Stage {
    let result: Stage = { battles: [] };

    if (buffer.length % 2 != 0)
        buffer = buffer.subarray(0, buffer.length - 1);

    for (let i = 0; i < buffer.length; i += 4) {
        const indexDigimon = convertToNumber(buffer.subarray(i, i + 2));
        const powerDigimon = convertToNumber(buffer.subarray(i + 2, i + 4));

        result.battles.push({
            digimon: indexDigimon,
            power: powerDigimon
        });
    }

    return result;
}

function getAllStages(buffer: Uint8Array): Stage[] {
    let result: Stage[] = [];

    let i = 0, countCorrectEof = 0;
    while (result.length < 8) {
        let currentBuffer: number[] = [];

        countCorrectEof = 0;
        for (; i < buffer.length; i++) {
            const currentByte = buffer[i];

            if (PATTERN_EOF[countCorrectEof % SIZE_PATTERN_EOF] === currentByte)
                countCorrectEof++;
            else
                countCorrectEof = 0;

            currentBuffer.push(currentByte);
            if (countCorrectEof === SIZE_PATTERN_EOF || MAX_SIZE_STAGE === currentBuffer.length) {
                i++
                break;
            }
        }

        if (i === buffer.length)
            throw "The rom is not full of stages";

        if (currentBuffer.length !== MAX_SIZE_STAGE || (currentBuffer.length === MAX_SIZE_STAGE && countCorrectEof === SIZE_PATTERN_EOF))
            currentBuffer = currentBuffer.slice(0, currentBuffer.length - SIZE_PATTERN_EOF);
        if (currentBuffer.length > 1)
            result.push(getStage(new Uint8Array(currentBuffer)));
    }


    return result;
}

function getStageBinarySize(size: number): number {
    if (size <= 5)
        return 5 * 4;
    else
        return size * 4 + SIZE_PATTERN_EOF;
}

function convertStageToBinary(stage: Stage): Uint8Array {
    let retData = new Uint8Array(getStageBinarySize(stage.battles.length));

    let offset = 0;
    for (let it of stage.battles) {
        iterateFields(it, (currentField) => {
            retData[offset] = (currentField & 0b011111111);
            retData[offset + 1] = (currentField & 0b01111111100000000) >> 8;

            offset += 2;
            return undefined;
        });
    }

    for (; offset < retData.length; offset++)
        retData[offset] = PATTERN_EOF[offset % SIZE_PATTERN_EOF];

    return retData;
}
