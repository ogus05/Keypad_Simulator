import { useEffect, useState } from "react";
import {createRoot} from 'react-dom/client';
import './page.scss';
import {config, specialInput} from './interface';
import { TwoFinger } from "./TwoFinger";
import { MiddlePoint } from "./MiddlePoint";



//DOM에 그려지는 main component입니다.
//이 Component는 페이지의 얼개를 잡고, 하위 Component로 TwoFinger, MiddlePoint(ClickPad)를 갖습니다.
//ClickPad들은 keypad 위에 그려져 사용자의 입력을 감지합니다.
//대부분의 constant value들은 interface.tsx의 config object로 조정이 가능합니다.
const Page = () => {
    //입력 확인.
    const [inputCurrent, setInputCurrent] = useState('');
    //입력 상태.
    const [inputStatus, setInputStatus] = useState('');
    //입력 기록.
    const [inputRecords, setInputRecords] = useState<string[]>([]);
    //pad의 좌표를 나타냅니다.
    const [coordinate, setCoorindate] = useState<DOMRect>();
    //TwoFinger, Middle Point 중 현재 mode를 나타냅니다.
    const [mode, setMode] = useState(1);
    //padBox의 Size를 나타냅니다. viewablePad와 Click Pad를 동기화 하기 위해서 만들었습니다.
    const [padBoxSize, setPadBoxSize] = useState(0);
    //inputCurrent에 숫자가 아닌 icon이 입력되어야 할 때를 나타냅니다.
    // idx 0이 true가 되면, enter가 보여지며, 1이 되면 backspace가 보여집니다.
    const [specialCurrent, setSpecialCurrent] = useState([false, false]);
    //clickPad는 1-start row-major 3x3 matrix로 구성됩니다. key는 matrix idx이며, value는 입력되는 input입니다.
    //나머지 matrix idx의 처리는 각 clickPad별로 달라, 해당 Component를 참조해주세요.
    const padIdx = {'2': 1, '4': 2, '6': 3, '8': 4, '5': 5}
    //inputCurrent의 중복 입력을 처리하기 위해 setTimeOut의 return value를 받는 variable입니다.
    let timer;

    //pad resizing을 device의 height가 resizing될 때마다 실행합니다.
    useEffect(() => {
        window.onresize = padResizing;
        padResizing();
    }, []);
    //device의 height를 받아 padbox를 resizing하고, pad의 좌표를 다시 설정합니다.
    const padResizing=() => {
        const newPadCoordinate = document.querySelector('.padBox')!.getBoundingClientRect();
        setPadBoxSize(document.querySelector('body')!.clientHeight / 100 * 35)
        setCoorindate(newPadCoordinate);
    }

    //입력을 처리합니다. n에는 사용자가 원하는 input값이 들어가 있습니다.
    //specialInput이 들어오면, 이를 처리하기 위해 else if 문을 사용했습니다.
    const setInput = (n: number) => {
        let strN = n.toString();
        if(n === specialInput.error){
            strN = 'err';
            setInputCurrent(strN);
        }
        else if(n === specialInput.backspace){
            setInputStatus(inputStatus.slice(0, -1));
            setSpecialCurrent([false, true]);
        }
        else if(n === specialInput.space){
            strN = '_';
            setInputStatus(inputStatus + " ");
            setInputCurrent(strN);
        }
        else if(n === specialInput.enter){
            //record는 3-size queue순으로 기록됩니다. 
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

    //mode를 변경합니다.
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
                <img src="./images/inputCurrent.png" alt="" />
                <div className="textBox">
                    <div className="text">
                        {inputCurrent ? inputCurrent : specialCurrent[0] ? <img src="./images/enter.png"/> : specialCurrent[1] ? <img src="./images/backspace.png"/> : null}
                    </div>
                </div>
            </div>
            <div className="inputStatus">
                <div className="textBox">
                    <div className="text">
                        {inputStatus.length <= config.maxTextCount ? inputStatus : "..." + inputStatus.slice(-config.maxTextCount)}
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
                    mode !== 1 ? <TwoFinger padIdx={padIdx} coordinate={coordinate as DOMRect} setInput={setInput}/>
                    : <MiddlePoint padIdx={padIdx} coordinate={coordinate as DOMRect} setInput={setInput}/>
                }
                </div>
                
            </div>
            <div className="inputRecord">
                <div className="recordList">
                    <div className="recordBox">
                    {new Array(3).fill(0).map((v, i) => {
                        return <div className="record" key={i}>
                                {inputRecords[i] ? inputRecords[i].length <= config.maxTextCount ? inputRecords[i] : '...' + inputRecords[i].slice(-config.maxTextCount)  : <>&nbsp;</>}
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
