import {config, specialInput} from './interface';


//동시 입력을 받습니다. 이는 아주 짧은 시간동안 2개를 눌렀는지의 여부를 통해 판단합니다.
export const TwoFinger = (props: {padIdx, coordinate: DOMRect, setInput : (n: number) => void}) => {
    //click 여부를 판단합니다. 동시에 2개가 true가 되면 두개가 touch된 것입니다.
    let tog = [false, false, false, false, false, false];

    //clickPad를 눌렀을 때 실행됩니다.
    const onClickPad  = (e, idx: number) => {
        //만약 padIdx의 key에 포함된 값을 눌렀다면, 해당 value를 toggle합니다.
        if(props.padIdx[idx]){
            togIdx(props.padIdx[idx]);
            return;
        }else{
            //matrix의 각 edge들은 사선을 통해 구분되기 때문에, 이를 좌표로 판단하여, 적절한 값이 tog되도록 하였습니다.
            switch(idx){
                case 7:{
                    if(e.changedTouches[0].clientX - props.coordinate.x > props.coordinate.y + props.coordinate.height - e.changedTouches[0].clientY){
                        togIdx(4);
                    }
                    else{
                        togIdx(2);
                    }
                    return;
                }
                case 3:{
                    if(e.changedTouches[0].clientX - props.coordinate.x > props.coordinate.y + props.coordinate.height - e.changedTouches[0].clientY){
                        togIdx(3);
                    }
                    else{
                        togIdx(1);
                    }
                    return;
                }
                case 1: {
                    if(e.changedTouches[0].clientX - props.coordinate.x > e.changedTouches[0].clientY - props.coordinate.y){
                        togIdx(1);
                    }
                    else{
                        togIdx(2);
                    }
                    return;
                }
                case 9:{
                    if(e.changedTouches[0].clientX - props.coordinate.x > e.changedTouches[0].clientY - props.coordinate.y){
                        togIdx(3);
                    }
                    else{
                        togIdx(4);
                    }
                    return;
                }
        }
        }
    }

    //idx를 tog할 때 실행됩니다. 만약 한개의 tog 이후 config.TFTimeOutMS사이에 다른 하나가 tog된다면,
    //두개가 입력된 것이기 때문에 touchConcurrently함수를 실행하고,
    //그렇지 않다면 처음 tog된 값 하나만 입력된 것이기 때문에, 바로 setInput을 실행합니다. 
    const togIdx = (n: number) => {
        const idx = tog.findIndex(v => v);
        if(idx === -1){
            tog[n] = true;
            setTimeout(() => {
                if(tog[n] === true){
                    props.setInput(n);
                }
                tog[n] = false;
            }, config.TFTimeOutMS);
        }else{
            touchConcurrently(n, idx);
        }
    }

    //동시에 입력되었을 때, 적절한 input값을 찾아 이를 parameter로 하는 setInput을 실행합니다.
    const touchConcurrently = (b1, b2) => {
        if(b1 === 5 || b2 === 5){
            props.setInput(b1 + b2);
        }else{
            if(b1 > b2){
                const temp = b1;
                b1 = b2;
                b2 = temp;
            }
            if(b1 === 1){
                if(b2 === 2) props.setInput(0);
                else if(b2 === 3) props.setInput(specialInput.enter);
                else{
                    props.setInput(specialInput.error);
                }
            }
            else if(b2 === 4){
                if(b1 === 2){
                    props.setInput(specialInput.space);
                }
                else if(b1 === 3){
                    props.setInput(specialInput.backspace);
                }
                else{
                    props.setInput(specialInput.error);
                }
            }
            else{
                props.setInput(specialInput.error);
            }
        }
        tog[b1] = false;
        tog[b2] = false;
    }


    return <div className="clickBox" style={{
        gridTemplateColumns: `${35 * (1 - config.centerPadRatio) / 2}vh ${35 * config.centerPadRatio}vh ${35 * (1 - config.centerPadRatio) / 2}vh`,
        gridTemplateRows: `${35 * (1 - config.centerPadRatio) / 2}vh ${35 * config.centerPadRatio}vh ${35 * (1 - config.centerPadRatio) / 2}vh`
    }}>
        <>
        {new Array(9).fill(0).map((v, i) => {
            return <div className={`clickBox${i}`} onTouchStart={e => onClickPad(e, i + 1)} key={i}>
                {props.padIdx[i + 1] ? props.padIdx[i + 1] : ''}
            </div>
        })}
        </>
    </div>
}




