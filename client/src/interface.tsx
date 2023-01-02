//특별한 input이 입력되었을 때, 이를 분간하기 위해 만들었습니다.
export enum specialInput {
    error = 100,
    space = 101,
    backspace = 102,
    enter= 103,
}

//얼개를 제외한 모든 controllerable constant value들 입니다.
export const config = {
    displayInputMS: 500,    //inputCurrent를 나타내는 시간을 ms단위로 지정합니다.
    centerPadRatio: 0.45,   //viewable pad의 center key가 차지하는 ratio를 지정합니다. clickpad도 맞춰 변경됩니다.
    padGapRatio: 0.015,     //viewable pad의 interval ratio를 지정합니다.
    TFTimeOutMS: 50,        //twoFinger의 동시 입력 간격을 ms단위로 지정합니다.
    MPInterval: 0.08,       //middlePoint에서, middlePoint의 범위를 지정합니다. 이 값이 커지면, 동시 입력으로 감지하는 간격이 넓어집니다.
    maxTextCount: 15        //input status및 input records에서 화면에 표시할 최대 text의 개수를 지정합니다.
}