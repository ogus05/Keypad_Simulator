import { useEffect, useState } from 'react';
import {specialInput, config} from './interface';

//중간 입력을 받습니다. 중간 click은 좌표를 통해 판단합니다.
export const MiddlePoint = (props: {padIdx, coordinate: DOMRect, setInput : (n: number) => void}) => {
    //pad의 center를 나타냅니다. 이는 5와 다른 key 사이를 눌렀을 때를 판단하기 위해 사용됩니다.
    const [center, setCenter] = useState({x: 0, y: 0});
    //middle click의 간격을 나타냅니다. 이는 config.MPInterval를 통해 계산됩니다.
    const [interval, setInterval] = useState({
        centerPadBorder: 0,
        centerPadBorderHigh: 0,
        centerPadBorderLow: 0,
        edgePadBorder: 0
    });
    useEffect(() => {
        if(props.coordinate){
            setCenter({
                x: props.coordinate.x + props.coordinate.height / 2,
                y:  props.coordinate.y + props.coordinate.height / 2,
            });
            setInterval({
                centerPadBorder :props.coordinate.height * (config.centerPadRatio / 2),
                centerPadBorderHigh:  props.coordinate.height * (config.centerPadRatio / 2 + config.MPInterval),
                centerPadBorderLow: props.coordinate.height * (config.centerPadRatio / 2 - config.MPInterval),
                edgePadBorder: props.coordinate.height * config.MPInterval,
            })
        }
    }, [props.coordinate]);

    const onClickPad = (e, idx: number) => {
        e.preventDefault();
        //click한 위치와 center와의 offset을 구해, 5와, 다른 key의 사이를 눌렀는지 판단하여,
        //적절한 input으로 setInput을 실행합니다.
        const offsetX = center.x - e.clientX;
        const offsetY = center.y - e.clientY;
        if(offsetX < (interval.centerPadBorderHigh) && offsetX > (interval.centerPadBorderLow) && Math.abs(offsetY) < interval.centerPadBorder ){
            props.setInput(7);
        }
        else if(-offsetX < (interval.centerPadBorderHigh) && -offsetX > (interval.centerPadBorderLow) && Math.abs(offsetY) < interval.centerPadBorder){
            props.setInput(8);
        }
        else if(offsetY < (interval.centerPadBorderHigh) && offsetY > (interval.centerPadBorderLow) && Math.abs(offsetX) < interval.centerPadBorder){
            props.setInput(6);
        }
        else if(-offsetY < (interval.centerPadBorderHigh) && -offsetY > (interval.centerPadBorderLow) && Math.abs(offsetX) < interval.centerPadBorder){
            props.setInput(9);
        }
        else if(props.padIdx[idx]){
            props.setInput(props.padIdx[idx]);
        }
        else{
            //coordinateEX, coordinateEY는 pad의 왼쪽 위부터 click한 위치의 좌표입니다.
            //해당 좌표와 interval를 통해, edge idx에서의 middle point를 판단합니다.
            const coordinateEX = e.clientX - props.coordinate.x;
            const coordinateEY = e.clientY - props.coordinate.y;
            switch(idx){
                case 7:{
                    if(Math.abs(coordinateEX - (props.coordinate.height - coordinateEY)) < interval.edgePadBorder){
                        props.setInput(specialInput.space);
                    }
                    else if(coordinateEX > props.coordinate.height - coordinateEY){
                        props.setInput(4);
                    }
                    else{
                        props.setInput(2);
                    }
                    return;
                }
                case 3:{
                    if(Math.abs(coordinateEX - (props.coordinate.height - coordinateEY)) < interval.edgePadBorder){
                        props.setInput(specialInput.enter);
                    }
                    else if(coordinateEX > props.coordinate.height - coordinateEY){
                        props.setInput(3);
                    }
                    else{
                        props.setInput(1);
                    }
                    return;
                }
                case 1: {
                    if(Math.abs(coordinateEX - coordinateEY) < interval.edgePadBorder){
                        props.setInput(0);
                    }
                    else if(coordinateEX > coordinateEY){
                        props.setInput(1);
                    }
                    else{
                        props.setInput(2);
                    }
                    return;
                }
                case 9:{
                    if(Math.abs(coordinateEX - coordinateEY) < interval.edgePadBorder){
                        props.setInput(specialInput.backspace);
                    }
                    else if(coordinateEX > coordinateEY){
                        props.setInput(3);
                    }
                    else{
                        props.setInput(4);
                    }
                    return;
                }
        }
        }
    }
    return <div className="clickBox" style={{
        gridTemplateColumns: `${35 * (1 - config.centerPadRatio) / 2}vh ${35 * config.centerPadRatio}vh ${35 * (1 - config.centerPadRatio) / 2}vh`,
        gridTemplateRows: `${35 * (1 - config.centerPadRatio) / 2}vh ${35 * config.centerPadRatio}vh ${35 * (1 - config.centerPadRatio) / 2}vh`
    }}>
        <>
        {new Array(9).fill(0).map((v, i) => {
            return <div className={`clickBox${i}`} onClick={e => onClickPad(e, i + 1)} key={i}>
                {props.padIdx[i + 1] ? props.padIdx[i + 1] : ''}
            </div>
        })}
        </>
    </div>
}




