import { useEffect, useState } from "react";
import {createRoot} from 'react-dom/client';
import './page.scss';
import {config, specialInput} from './interface';
import { Func1 } from "./func1";
import { Func2 } from "./func2";


const Page = () => {
    const [inputCurrent, setInputCurrent] = useState('');
    const [inputStatus, setInputStatus] = useState('');
    const [inputRecords, setInputRecords] = useState<string[]>([]);
    const [coordinate, setCoorindate] = useState<DOMRect>();
    const [mode, setMode] = useState(1);
    const [padBoxSize, setPadBoxSize] = useState(0);
    const padIdx = {'2': 1, '4': 2, '6': 3, '8': 4, '5': 5}
    let timer;
    useEffect(() => {
        setTimeout(() => {
            const newPadCoordinate = document.querySelector('.padBox')!.getBoundingClientRect();
            setPadBoxSize(document.querySelector('body')!.clientHeight / 100 * 45)
            setCoorindate(newPadCoordinate);
        }, 10)
    }, [])

    const setInput = (n: number) => {
        let strN = n.toString();
        if(n === specialInput.error){
            strN = 'error';
        }
        else if(n === specialInput.backspace){
            strN = '←';
            setInputStatus(inputStatus.slice(0, -1));
        }
        else if(n === specialInput.space){
            console.log(inputStatus);
            strN = '_';
            setInputStatus(inputStatus + ' ');
        }
        else if(n === specialInput.enter){
            strN = 'enter';
            if(inputRecords.length === 3){
                inputRecords.shift();
            }
            setInputRecords([...inputRecords, inputStatus]);
            setInputStatus('');
        }
        else{
            setInputStatus(inputStatus + strN);
        }
        setInputCurrent(strN);
        if(timer){
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            setInputCurrent('');
            timer = null;
        }, config.displayInputMS);
    }

    const switchMode = e => {
        e.preventDefault();
        setInputRecords([]);
        setInputStatus('');
        setMode(mode % 2 + 1);
    }
    

        
    return <>
        <div className="article">
            <div className="pageLink" onClick={e => switchMode(e)}>
                {`go to page${(mode % 2) + 1}`}
            </div>
            <div className="inputCurrent">
                <div className="textBox">
                    <div className="text">
                        {inputCurrent}
                    </div>
                </div>
            </div>
            <div className="inputStatus">
                <div className="textBox">
                    <div className="text">
                        {inputStatus}
                    </div>
                </div>
            </div>
            <div className="inputPad">
                <div className="padBox">
                    <div className="box1" style={{
                        position: 'absolute',
                        left: `50%`,
                        top: 0,
                        transform: `translate(-50%, 0)`,
                        width: `${padBoxSize * config.centerPadRatio + 'px'}`,
                        borderTop: `${padBoxSize * ((1 - config.centerPadRatio) / 2 - config.padGapRatio) + 'px'} solid yellow`,
                        borderLeft: `${padBoxSize * ((1 - config.centerPadRatio) / 2 - config.padGapRatio) + 'px'} solid transparent`,
                        borderRight: `${padBoxSize * ((1 - config.centerPadRatio) / 2 - config.padGapRatio) + 'px'} solid transparent`,
                    }}></div>
                    <div className="box2" style={{
                        position: 'absolute',
                        left: 0,
                        top: `50%`,
                        transform: `translate(0, -50%)`,
                        height: `${padBoxSize * config.centerPadRatio + 'px'}`,
                        borderLeft: `${padBoxSize * ((1 - config.centerPadRatio) / 2 - config.padGapRatio) + 'px'} solid yellow`,
                        borderTop: `${padBoxSize * ((1 - config.centerPadRatio) / 2 - config.padGapRatio) + 'px'} solid transparent`,
                        borderBottom: `${padBoxSize * ((1 - config.centerPadRatio) / 2 - config.padGapRatio) + 'px'} solid transparent`,
                    }}></div>
                    <div className="box3" style={{
                        position: 'absolute',
                        right: 0,
                        top: `50%`,
                        transform: `translate(0, -50%)`,
                        height: `${padBoxSize * config.centerPadRatio + 'px'}`,
                        borderRight: `${padBoxSize * ((1 - config.centerPadRatio) / 2 - config.padGapRatio) + 'px'} solid yellow`,
                        borderTop: `${padBoxSize * ((1 - config.centerPadRatio) / 2 - config.padGapRatio) + 'px'} solid transparent`,
                        borderBottom: `${padBoxSize * ((1 - config.centerPadRatio) / 2 - config.padGapRatio) + 'px'} solid transparent`,
                    }}></div>
                    <div className="box4" style={{
                        position: 'absolute',
                        left: `50%`,
                        bottom: 0,
                        transform: `translate(-50%, 0)`,
                        width: `${padBoxSize * config.centerPadRatio + 'px'}`,
                        borderBottom: `${padBoxSize * ((1 - config.centerPadRatio) / 2 - config.padGapRatio) + 'px'} solid yellow`,
                        borderLeft: `${padBoxSize * ((1 - config.centerPadRatio) / 2 - config.padGapRatio) + 'px'} solid transparent`,
                        borderRight: `${padBoxSize * ((1 - config.centerPadRatio) / 2 - config.padGapRatio) + 'px'} solid transparent`,
                    }}></div>
                    <div className="box5" style={{
                        position: 'absolute',
                        left: `50%`,
                        top: `50%`,
                        transform: `translate(-50%, -50%)`,
                        height: `${padBoxSize * config.centerPadRatio + 'px'}`,
                        width: `${padBoxSize * config.centerPadRatio + 'px'}`,
                        backgroundColor: `red`,
                    }}></div>
                </div>
                {
                    mode === 1 ? <Func1 padIdx={padIdx} coordinate={coordinate as DOMRect} setInput={setInput}/>
                    : <Func2 padIdx={padIdx} coordinate={coordinate as DOMRect} setInput={setInput}/>
                }
                
            </div>
            <div className="inputRecord">
                <div className="recordList">
                    {new Array(3).fill(0).map((v, i) => {
                        return <div className="record" key={i}>
                                {inputRecords[i]}
                        </div>
                    })}
                </div>
                <div className="clearButton" onClick={e => setInputRecords([])}>
                    초기화
                </div>
            </div>
        </div>
    </>
}
createRoot(document.querySelector('body') as Element | DocumentFragment).render(
    <Page/>
);
