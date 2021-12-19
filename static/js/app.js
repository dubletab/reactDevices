let count, setCount;
let myArr;


function Wrapp(props) {
    [count, setCount] = React.useState(myArr);
    return(
        <div className="wrapp">
            {
                count.map((entry, index) =>{
                    if(entry[4]) return;
                    return <Serverdiv
                            key={index}
                            name={entry[6]}
                            idserv={entry[0]}
                            array={count}
                            timer={entry[3]}
                            status={entry[2]}/>
                })
            }
        </div>
    )
}


function Serverdiv(props) {
    /* Считаем количество колонок ТВ и Киосков */
    let countTV = props.array.reduce((sum, current) => {
        if(current[4] === props.idserv & current[5] === 1) sum++;
        return sum;
    }, 0);
    let columTV = countTV > 0 ? Math.ceil(countTV/8) : 0;

    let countKIOSK = props.array.reduce((sum, current) => {
        if(current[4] === props.idserv & current[5] === 2) sum++;
        return sum;
    }, 0);
    let columKIOSK = countKIOSK > 0 ? Math.ceil(countKIOSK/8) : 0;

    let columStyleServ, columStyleLine;
    if(columTV + columKIOSK == 3) {columStyleServ = 'threeColumns'; columStyleLine = 'three-line';}
    else if(columTV + columKIOSK == 2) {columStyleServ = 'twoColumns';columStyleLine = 'two-line';}
    else if(columTV + columKIOSK == 1) {columStyleServ = 'oneColumns';columStyleLine = 'one-line';}


    /* Собираем Тайтл таблицы */
    const tblTitle = [];
    for (let i = 0; i < columTV; i++) {
        tblTitle.push(<div className="table-head-name" key={'TV'+ i}>TV</div>);
    }
    for (let i = 0; i < columKIOSK; i++) {
        tblTitle.push(<div className="table-head-name" key={'K'+ i}>K</div>);
    }

    /* Собираем Тело таблицы */
    
    const tblBody = [];
    const tblBodyLine = [];
    let blockCounterTV = 1;
    let columCounter = 0;
    let blockCounterK = 1;

                /* Тело таблицы: ТВ ПАНЕЛИ */
    for(let block of props.array){
        if(block[4] != props.idserv | block[5] != 1) continue;
        
        if(blockCounterTV === 1){
            tblBodyLine[columCounter] = [];
            tblBodyLine[columCounter].push(
                <Block 
                    status={block[2]}
                    date={block[3]}
                    descr={block[6]}
                    key={block[0]}/>
            );
            blockCounterTV++;
        }else if(blockCounterTV < 9){
            tblBodyLine[columCounter].push(
                <Block 
                    status={block[2]}
                    date={block[3]}
                    descr={block[6]}
                    key={block[0]}/>
            );
            blockCounterTV++;
        }else if(blockCounterTV === 9){
            columCounter++;
            tblBodyLine[columCounter] = [];
            tblBodyLine[columCounter].push(
                <Block 
                    status={block[2]}
                    date={block[3]}
                    descr={block[6]}
                    key={block[0]}/>
            );
            blockCounterTV = 2;
        }
    }
    if(tblBodyLine[columCounter]) columCounter++;

                /* Тело таблицы: КИОСКИ */
    for(let block of props.array){
        if(block[4] != props.idserv | block[5] != 2) continue;
        if(blockCounterK === 1){
            tblBodyLine[columCounter] = [];
            tblBodyLine[columCounter].push(
                <Block 
                    status={block[2]}
                    date={block[3]}
                    descr={block[6]}
                    key={block[0]}/>
            );
            blockCounterK++;
        }else if(blockCounterK < 9){
            tblBodyLine[columCounter].push(
                <Block 
                    status={block[2]}
                    date={block[3]}
                    descr={block[6]}
                    key={block[0]}/>
            );
            blockCounterK++;
        }else if(blockCounterK === 9){
            columCounter++;
            tblBodyLine[columCounter] = [];
            tblBodyLine[columCounter].push(
                <Block 
                    status={block[2]}
                    date={block[3]}
                    descr={block[6]}
                    key={block[0]}/>
            );
            blockCounterK = 2;
        }
    }

    /* Заполняем линии девайсов */
    let key = 0;
    for(let line of tblBodyLine){
        tblBody.push(<div className={`line ${columStyleLine}`} key={key++}>{line}</div>);
    }


    return(
        <div className={`wrappChild ${columStyleServ}`}>
            <div className="title">
                <h2>{props.name}</h2>
            </div>
            <div className="status">
                <div className={setServiceStatus(props.status)[0]}>{getCurrentTime(props.timer)}</div>
                <div className={setServiceStatus(props.status)[1]}></div>
            </div>
            <div className="bodys">
                <div className="table">
                    <div className="table-head">{tblTitle}</div>
                    <div className="table-body">{tblBody}</div>
                </div>
               
            </div>
        </div>
        
    )
}

function Block(props) {
    return(
    <div className={setDeviceStatus(props.status, props.date)}>
        <div className="block-timer">{getCurrentTime(props.date)}</div>
        <p>{props.descr}</p>
    </div>
    )
}


fetch('./static/json/message.json')
        .then(response => response.json())
        .then(json => {

            /*Демо выключенного устройста менее суток НАЧАЛО*/
            const demoTommorow = moment(new Date()).add(-1,'days');
            json[0][3] = `${demoTommorow.date()}:${demoTommorow.month()+1}:${demoTommorow.year()} 23:55:59`;
            /*Демо выключенного устройста менее суток КОНЕЦ*/
            myArr = json;
                    ReactDOM.render(
                        <Wrapp/>,
                        document.getElementById('root')
                    );
                    console.log('Данные загружены');
                    document.querySelector('.spin-wrapper').remove();
        });


// ajaxCall();

// setInterval(ajaxCallRenew, 30000);


function ajaxCall() {
    $.ajax({
        type: "POST",
        url: window.location,
        dataType: 'json',
        data: {type: 'getAlerts'},
        success: function(msg){
            
            
            if (msg['data'].length > 0) {
                console.log(msg.data);
                myArr = Array.from(msg['data']);

                ReactDOM.render(
                    <Wrapp/>,
                    document.getElementById('root')
                );
                console.log('Данные загружены');
            }
            document.querySelector('.spin-wrapper').remove();
        }
    });
    
}

function ajaxCallRenew() {
    $.ajax({
        type: "POST",
        url: window.location,
        dataType: 'json',
        data: {type: 'getAlerts'},
        success: function(msg){
            
            
            if (msg['data'].length > 0) {
                setCount(Array.from(msg['data']));
                console.log('Данные обновлены');
            
            }
        }
    });
    
}


function getDoubleCharacters(mean) {
    if(mean < 10) return '0' + mean;
    else return mean;
} 

function getCurrentTime(time) {
    let timer = moment(time, 'DD.MM.YYYY HH:mm:ss');
    let now = moment();
    let d = (now.diff(timer, 'days'));
    let h = (now.diff(timer, 'hours')%24);
    let m = (now.diff(timer, 'minutes')%60);
    return (getDoubleCharacters(d) + 'д ' + getDoubleCharacters(h) + 
    ":" + getDoubleCharacters(m));
}


function setServiceStatus(status) {
    if(status == 'DOWN') return ['timer-down timer', 'stImg-down stImg'];
    else if(status == 'UP') return ['timer-up timer', 'stImg-up stImg'];
}

function setDeviceStatus(status, date) {
    let timer = moment(date, 'DD.MM.YYYY HH:mm:ss');
    let now = moment();
    let day = now.diff(timer, 'days');
    if(status == 'DOWN' && day < 1) return 'block block-down-oneday';
    else if(status == 'DOWN') return 'block block-down';
    else if(status == 'UP') return 'block block-up';
}