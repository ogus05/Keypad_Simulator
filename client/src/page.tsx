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
    const [specialCurrent, setSpecialCurrent] = useState([false, false]);
    const padIdx = {'2': 1, '4': 2, '6': 3, '8': 4, '5': 5}
    let timer;
    useEffect(() => {
        window.onresize = padResizing;
        padResizing();
    }, []);

    const padResizing=() => {
        const newPadCoordinate = document.querySelector('.padBox')!.getBoundingClientRect();
        setPadBoxSize(document.querySelector('body')!.clientHeight / 100 * 35)
        setCoorindate(newPadCoordinate);
    }
    const setInput = (n: number) => {
        let strN = n.toString();
        if(n === specialInput.error){
            strN = 'err';
            setInputCurrent(strN);
        }
        else if(n === specialInput.backspace){
            strN = '<';
            setInputStatus(inputStatus.slice(0, -1));
            setSpecialCurrent([false, true]);
        }
        else if(n === specialInput.space){
            strN = '_';
            setInputStatus(inputStatus + " ");
            setInputCurrent(strN);
        }
        else if(n === specialInput.enter){
            strN = 'etr';
            console.log(inputRecords);
            if(inputStatus !== '') {
                if(inputRecords.length === 3){
                    inputRecords.shift();
                }
                setInputRecords([...inputRecords, inputStatus]);
            }
            setInputStatus('');
            setSpecialCurrent([true, false]);
        }
        else{
            setInputStatus(inputStatus + strN);
            setInputCurrent(strN);
        }
        if(timer){
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            setInputCurrent('');
            setSpecialCurrent([false, false]);
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
            <div className="pageLink">
                <div className={`togSwitch${mode}`} onClick={e => switchMode(e)}>
                    <div className='togButton'>
                        {mode === 1 ? 'M' : 'T'}
                    </div>
                </div>
            </div>
            <div className="inputCurrent">
                <img src="/images/inputCurrent.png" alt="" />
                <div className="textBox">
                    <div className="text">
                        {inputCurrent ? inputCurrent : specialCurrent[0] ? <img src="/images/enter.png"/> : specialCurrent[1] ? <img src="/images/backspace.png"/> : null}
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
                <div className="padBackground">

                <div className="padBox">
                    <div className="box1" style={{
                        position: 'absolute',
                        left: `50%`,
                        top: 0,
                        transform: `translate(-50%, 0)`,
                        width: `${padBoxSize * config.centerPadRatio + 'px'}`,
                        borderTop: `${padBoxSize * ((1 - config.centerPadRatio) / 2 - config.padGapRatio) + 'px'} solid #dfdfdf`,
                        borderLeft: `${padBoxSize * ((1 - config.centerPadRatio) / 2 - config.padGapRatio) + 'px'} solid transparent`,
                        borderRight: `${padBoxSize * ((1 - config.centerPadRatio) / 2 - config.padGapRatio) + 'px'} solid transparent`,
                    }}></div>
                    <div className="box2" style={{
                        position: 'absolute',
                        left: 0,
                        top: `50%`,
                        transform: `translate(0, -50%)`,
                        height: `${padBoxSize * config.centerPadRatio + 'px'}`,
                        borderLeft: `${padBoxSize * ((1 - config.centerPadRatio) / 2 - config.padGapRatio) + 'px'} solid #dfdfdf`,
                        borderTop: `${padBoxSize * ((1 - config.centerPadRatio) / 2 - config.padGapRatio) + 'px'} solid transparent`,
                        borderBottom: `${padBoxSize * ((1 - config.centerPadRatio) / 2 - config.padGapRatio) + 'px'} solid transparent`,
                    }}></div>
                    <div className="box3" style={{
                        position: 'absolute',
                        right: 0,
                        top: `50%`,
                        transform: `translate(0, -50%)`,
                        height: `${padBoxSize * config.centerPadRatio + 'px'}`,
                        borderRight: `${padBoxSize * ((1 - config.centerPadRatio) / 2 - config.padGapRatio) + 'px'} solid #dfdfdf`,
                        borderTop: `${padBoxSize * ((1 - config.centerPadRatio) / 2 - config.padGapRatio) + 'px'} solid transparent`,
                        borderBottom: `${padBoxSize * ((1 - config.centerPadRatio) / 2 - config.padGapRatio) + 'px'} solid transparent`,
                    }}></div>
                    <div className="box4" style={{
                        position: 'absolute',
                        left: `50%`,
                        bottom: 0,
                        transform: `translate(-50%, 0)`,
                        width: `${padBoxSize * config.centerPadRatio + 'px'}`,
                        borderBottom: `${padBoxSize * ((1 - config.centerPadRatio) / 2 - config.padGapRatio) + 'px'} solid #dfdfdf`,
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
                        backgroundColor: `#C6C5C5`,
                    }}></div>
                </div>
                {
                    mode !== 1 ? <Func1 padIdx={padIdx} coordinate={coordinate as DOMRect} setInput={setInput}/>
                    : <Func2 padIdx={padIdx} coordinate={coordinate as DOMRect} setInput={setInput}/>
                }
                </div>
                
            </div>
            <div className="inputRecord">
                <div className="recordList">
                    <div className="recordBox">
                    {new Array(3).fill(0).map((v, i) => {
                        return <div className="record" key={i}>
                                {inputRecords[i] ? inputRecords[i] : <>&nbsp;</>}
                        </div>
                    })}
                    </div>
                </div>
                <div className="clearButton" onClick={e => setInputRecords([])}>
                    Clear
                </div>
            </div>
        </div>
    </>
}
createRoot(document.querySelector('body') as Element | DocumentFragment).render(
    <Page/>
);
