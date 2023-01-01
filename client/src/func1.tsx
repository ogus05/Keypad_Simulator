import {config, specialInput} from './interface';

export const Func1 = (props: {padIdx, coordinate: DOMRect, setInput : (n: number) => void}) => {
    let tog = [false, false, false, false, false, false];

    const onClickPad  = (e, idx: number) => {
        if(props.padIdx[idx]){
            togIdx(props.padIdx[idx]);
            return;
        }else{
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

    const togIdx = (n: number) => {
        const idx = tog.findIndex(v => v);
        if(idx === -1){
            tog[n] = true;
            setTimeout(() => {
                if(tog[n] === true){
                    props.setInput(n);
                }
                tog[n] = false;
            }, config.func1TimeOutMS);
        }else{
            touchConcurrently(n, idx);
        }
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




