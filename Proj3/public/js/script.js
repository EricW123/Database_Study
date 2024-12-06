function __create(cls) {
    return document.createElement(cls);
}

function __toggleHid(e) {
    e.hidden = !e.hidden;
}

function __toggleButt(p) {
    let butt = p.querySelector('#title > button');
    butt.textContent = butt.textContent == 'v' ? '>' : 'v';
}

function __fetch(...args) {
    return { then: (func) => {
        fetch(args, {method: 'GET'})
        .then((res) => {
            if (res.ok)
                return res.json();
            else
                throw new Error('fetch failed');
        })
        .then(func)
        .catch((err) => {
            console.error("Error: ", err);
        })
    }};
}


function __show(e, typename, func) {
    let container = e.parentElement.parentElement;
    let itemList = container.querySelector('ul');

    __toggleButt(container);
    if (itemList.querySelector(typename)) {
        itemList.querySelectorAll('*').forEach(__toggleHid);
    } else {
        func(container, itemList);
    }
}


function showFac(e) {
    __show(e, 'factory-item', (container, itemList) => {
        __fetch('/get-factories') 
        .then((data) => {data.forEach((item) => {
            const li = new Factory(item['factory_id'], item['factory_name']);
            itemList.appendChild(li);
        })});
    });
}

function showPL(e) {
    __show(e, 'prodline-item', (container, itemList) => {
        __fetch(`/get-pls?fact_id=${container.f_id}`)
        .then((data) => {data.forEach((item) => {
            const li = new ProdLine(item['factory_id'],
                item['pl_id']);
            itemList.appendChild(li);
        })});
    });
}

function showMach(e) {
    __show(e, 'machine-item', (container, itemList) => {
        __fetch(`/get-machs?pl_id=${container.pl_id}`)
        .then((data) => {data.forEach((item) => {
            const li = new Machine(item['pl_id'], 
                item['machine_id'], item['status']);
            itemList.appendChild(li);
        })});
    });
}

function showTeam(e) {
    __show(e, 'team-item', (container, itemList) => {
        __fetch(`/get-teams`)
        .then((data) => {
            let teams = data.map((item) => new Team(item['team_id'], item['team_leader'], item['nrec']));
            teams.sort((a, b) => {
                if (a.nrec == null) return 1;
                if (b.nrec == null) return -1;
                return b.nrec - a.nrec;
            });
            teams.forEach((item) => {
                itemList.appendChild(item);
            });
        });
    });
}


class Factory extends HTMLElement {
    constructor(id, name) {
        super();

        this.f_id = id;
        this.f_name = name;
    }

    connectedCallback() {
        const div = __create('div');
        div.setAttribute('id', 'title');
        
        const txt = __create('txt');
        txt.textContent = `Factory(id=${this.f_id}): ${this.f_name}`;
        div.appendChild(txt);

        const butt = __create('button')
        butt.textContent = '>';
        butt.onclick = () => showPL(butt);
        div.appendChild(butt);

        this.appendChild(div);

        const ul = __create('ul');
        this.appendChild(ul);
    }
}

class ProdLine extends HTMLElement {
    constructor(f_id, pl_id) {
        super();

        this.f_id = f_id;
        this.pl_id = pl_id;
    }

    connectedCallback() {
        const div = __create('div');
        const txt = __create('txt');
        const butt = __create('button')
        txt.textContent = `ProdLine(id=${this.pl_id})`;
        div.appendChild(txt);

        butt.onclick = () => showMach(butt);
        butt.textContent = '>';
        div.appendChild(butt);

        div.setAttribute('id', 'title');
        this.appendChild(div);

        const ul = __create('ul');
        this.appendChild(ul);
    }
}

class Machine extends HTMLElement {
    constructor(pl_id, m_id, status) {
        super();

        this.pl_id = pl_id;
        this.m_id = m_id;
        this.status = status;
    }

    connectedCallback() {
        const txt = __create('txt');
        txt.textContent = `Machine(id=${this.m_id})`;
        this.appendChild(txt);

        // status display, if not null then ✅ or ❌
        const status = __create('div');
        if (this.status == 'ok') {
            status.textContent = this.status = '✅';
        } else if (this.status == 'not ok') {
            status.textContent = this.status = '❌';
        }
        status.style.display = 'inline-block';
        this.appendChild(status);

        // assertioons
        const assCont = __create('div');
        assCont.className = 'assertions';
        assCont.style.display = 'inline-block';
        allAss.push(assCont);

        const assButt = __create('button');
        assButt.textContent = 'Assertions >';
        assButt.onclick = (event) => {showAssertions(this); event.stopPropagation();};
        assCont.appendChild(assButt);

        const assDropdown = __create('div');
        assDropdown.className = 'dropdown';
        assCont.appendChild(assDropdown);
        this.appendChild(assCont);

        // anomaly records
        const recCont = __create('div');
        recCont.className = 'records';
        recCont.style.display = 'inline-block';
        allRec.push(recCont);

        const recButt = __create('button');
        recButt.textContent = 'Records >';
        recButt.onclick = (event) => {showRecords(this); event.stopPropagation();};
        recCont.appendChild(recButt);

        const recDropdown = __create('div');
        recDropdown.className = 'dropdown';
        recCont.appendChild(recDropdown);
        this.appendChild(recCont);
    }
}

class Team extends HTMLElement {
    constructor(id, leader, nrec) {
        super();

        this.id = id;
        this.leader = leader;
        this.nrec = nrec;
    }

    connectedCallback() {
        const txt = __create('txt');
        txt.textContent = `Team(id=${this.id}, lead by ${this.leader})`;
        this.append(txt);

        // number of rec solved, if not null then number
        const nrec = __create('div');
        if (this.nrec != null) {
            nrec.textContent = this.nrec + ' recs solved';
        }
        nrec.style.display = 'inline-block';
        nrec.style.color = 'green';
        this.appendChild(nrec);

        // anomaly records
        const recCont = __create('div');
        recCont.className = 'records';
        recCont.style.display = 'inline-block';
        allRec.push(recCont);

        const recButt = __create('button');
        recButt.textContent = 'Records >';
        recButt.onclick = (event) => {showTeamRecs(this); event.stopPropagation();};
        recCont.appendChild(recButt);

        const recDropdown = __create('div');
        recDropdown.className = 'dropdown';
        recCont.appendChild(recDropdown);
        this.appendChild(recCont);

        const editButt = __create('button');
        editButt.className = 'editor';
        editButt.onclick = () => {console.log('TeamEditButt')};
        editButt.textContent = '/';
        // this.appendChild(editButt);
    }
}

customElements.define('machine-item', Machine);
customElements.define('prodline-item', ProdLine);
customElements.define('factory-item', Factory);
customElements.define('team-item', Team);


allAss = [];
allRec = [];

function showAssertions(e) {
    let container = e.querySelector('.assertions');
    let butt = container.querySelector('button');
    let dropdown = container.querySelector('.dropdown');

    closeAllDropdowns(container);
    butt.textContent = butt.textContent == 'Assertions v' ? 'Assertions >' : 'Assertions v';
    if (dropdown.querySelector('.adder')) {
        dropdown.querySelectorAll('.item, .adder').forEach(__toggleHid);
    } else {
        __fetch(`/get-ass?m_id=${e.m_id}`)
        .then((data) => {
            data.forEach((item) => {
                const li = __create('div');
                li.className = 'item';

                const info = __create('div');
                info.className = 'info';
                info.textContent = item['cond_expr'];
                info.style.display = 'block';
                li.appendChild(info);

                const removeButt = __create('button');
                removeButt.textContent = '-';
                removeButt.onclick = (ev) => {removeAss(li, item['cond_id'], e.m_id); ev.stopPropagation()};
                removeButt.className = 'remover';
                li.appendChild(removeButt);
                dropdown.appendChild(li);
            });
            const li = __create('div');
            li.className = 'adder';

            const addButt = __create('button');
            addButt.textContent = '+';
            addButt.onclick = (ev) => {addAss(dropdown, li, e.m_id); ev.stopPropagation()};
            li.append(addButt);
            dropdown.appendChild(li);
        });
    }
}

function showRecords(e) {
    let container = e.querySelector('.records');
    let butt = container.querySelector('button');
    let dropdown = container.querySelector('.dropdown');

    closeAllDropdowns(container);
    butt.textContent = butt.textContent == 'Records v' ? 'Records >' : 'Records v';
    if (dropdown.querySelector('.adder')) {
        dropdown.querySelectorAll('.item, .adder').forEach(__toggleHid);
    } else {
        __fetch(`/get-rec?m_id=${e.m_id}`)
        .then((data) => {
            data.forEach((item) => {
                const li = __create('div');
                li.className = 'item';

                const div = __create('div');

                const info = __create('div');
                info.className = 'info';
                info.textContent = item['time'] + (item['team_leader'] == null ? ' unsolved' : ` solved by ${item['team_leader']}`);
                if (item['team_leader'] == null)
                    info.style.color = 'red';
                div.appendChild(info);

                const detail = __create('div');
                detail.className = 'detail';
                detail.textContent = 'Reason: ' + item['reason'];
                detail.hidden = true;
                div.appendChild(detail);
                li.appendChild(div);

                li.onmouseover = () => {detail.hidden = false;};
                li.onmouseout = () => {detail.hidden = true;};

                const removeButt = __create('button');
                removeButt.textContent = '-';
                removeButt.onclick = (ev) => {removeRec(li, item['record_id']); ev.stopPropagation()};
                removeButt.className = 'remover';
                li.appendChild(removeButt);

                dropdown.appendChild(li);
            });
            const li = __create('div');
            li.className = 'adder';

            const addButt = __create('button');
            addButt.textContent = '+';
            addButt.onclick = (ev) => {addMachRec(dropdown, li, e.m_id); ev.stopPropagation()};
            li.appendChild(addButt);
            dropdown.appendChild(li);
        });
    }
}

function showTeamRecs(e) {
    let container = e.querySelector('.records');
    let butt = container.querySelector('button');
    let dropdown = container.querySelector('.dropdown');


    closeAllDropdowns(container);
    butt.textContent = butt.textContent == 'Records v' ? 'Records >' : 'Records v';
    if (dropdown.querySelector('.adder')) {
        dropdown.querySelectorAll('.item, .adder').forEach(__toggleHid);
    } else {
        __fetch(`/get-trec?t_id=${e.id}`)
        .then((data) => {
            data.forEach((item) => {
                const li = __create('div');
                li.className = 'item';

                const div = __create('div');

                const info = __create('div');
                info.textContent = item['time'] + ` on Machine(id=${item['machine_id']})`;
                info.className = 'info';
                div.appendChild(info);

                const detail = __create('div');
                detail.className = 'detail';
                detail.textContent = 'Reason: ' + item['reason'];
                detail.hidden = true;
                div.appendChild(detail);
                li.appendChild(div);

                li.onmouseover = () => {detail.hidden = false;};
                li.onmouseout = () => {detail.hidden = true;};

                const removeButt = __create('button');
                removeButt.textContent = '-';
                removeButt.onclick = (e) => {removeRec(li, item['record_id']); e.stopPropagation()};
                removeButt.className = 'remover';
                li.appendChild(removeButt);

                dropdown.appendChild(li);
            });
            const li = __create('div');
            li.className = 'adder';
            
            const addButt = __create('button');
            addButt.textContent = '+';
            addButt.onclick = (ev) => {addTeamRec(dropdown, li, e.id); ev.stopPropagation()};
            li.appendChild(addButt);
            dropdown.appendChild(li);
        });
    }
}

dontClose = [];

function closeAllDropdowns(except) {
    allAss.forEach((ass) => {
        if (ass == except) return;
        ass.querySelector('button').textContent = 'Assertions >';
        ass.querySelectorAll('.item, .adder').forEach((t) => {
            t.hidden = true;
        });
    });

    allRec.forEach((rec) => {
        if (rec == except) return;
        rec.querySelector('button').textContent = 'Records >';
        rec.querySelectorAll('.item, .adder').forEach((t) => {
            t.hidden = true;
        })
    })
}

document.documentElement.addEventListener('click', closeAllDropdowns);


function removeAss(item, c_id, m_id) {
    __fetch(`/rm-ass?c_id=${c_id}&m_id=${m_id}`)
    .then((d) => {
        item.remove();
    })
}

function addAss(dropdown, addCont, machId) {
    function submitText(i) {
        const newText = i.value;
        i.remove();

        __fetch(`/add-ass?cond=${newText}&m_id=${machId}`)
        .then((data) => {
            // cond_id
            addCont.querySelector('button').onclick = (ev) => {addAss(dropdown, addCont, machId); ev.stopPropagation()};
            
            const li = __create('div');
            li.className = 'item';

            const info = __create('div');
            info.className = 'info';
            info.textContent = newText;

            li.appendChild(info);

            const removeButt = __create('button');
            removeButt.textContent = '-';
            removeButt.onclick = (ev) => {removeRec(li,
                data['cond_id'], machId); ev.stopPropagation()};
            
            li.appendChild(removeButt);
            dropdown.insertBefore(li, addCont);
        });
    }

    const input = __create('input');
    input.addEventListener('click', (ev) => {ev.stopPropagation()});
    input.addEventListener('keypress', (ev) => {
        if (ev.key == 'Enter')
            submitText(input);
    });

    addCont.prepend(input);
    input.focus();

    addCont.querySelector('button').onclick = (ev) => {submitText(input); ev.stopPropagation()};
}


function removeRec(item, id) {
    __fetch(`/rm-rec?r_id=${id}`)
    .then((d) => {
        item.remove();
    });
}


function addMachRec(dropdown, addCont, machId) {
    function submitText(i) {
        const newText = i.value;
        const nTs = newText.match(/team=(.*), time=([^,]+), reason=(.+)/);
        if (nTs[1] == '' || nTs[1] == 'null') {
            nTs[1] = null;
        } else {
            nTs[1] = parseInt(nTs[1]);
        }
        i.remove();

        __fetch(`/add-rec?t_id=${nTs[1]}&m_id=${machId}&t=${nTs[2]}&r=${nTs[3]}`)
        .then((data) => {
            addCont.querySelector('button').onclick = (ev) => {addMachRec(dropdown, addCont, machId); ev.stopPropagation()};
            
            const li = __create('div');
            li.className = 'item';

            const div = __create('div');

            const info = __create('div');
            info.className = 'info';
            let leader_name = data[1][0]['team_leader'];
            info.textContent = nTs[2] + (leader_name == null ? ' unsolved' : ` solved by ${leader_name}`);
            div.appendChild(info);

            const detail = __create('div');
            detail.className = 'detail';
            detail.textContent = 'Reason: ' + nTs[3];
            detail.hidden = true;
            div.appendChild(detail);

            li.onmouseover = () => {detail.hidden = false;};
            li.onmouseout = () => {detail.hidden = true;};
            li.appendChild(div);

            const removeButt = __create('button');
            removeButt.textContent = '-';
            removeButt.onclick = (ev) => {removeRec(li,
                data[0][0]['record_id']); ev.stopPropagation()};
            
            li.appendChild(removeButt);
            dropdown.insertBefore(li, addCont);
        });
    }

    const input = __create('input');
    input.value = 'team=1, time=Jan1/2025, reason=defdef';
    input.addEventListener('click', (ev) => {ev.stopPropagation()});
    input.addEventListener('keypress', (ev) => {
        if (ev.key == 'Enter')
            submitText(input);
    });

    addCont.prepend(input);
    input.focus();

    addCont.querySelector('button').onclick = (ev) => {submitText(input); ev.stopPropagation()};
}




function addTeamRec(dropdown, addCont, teamId) {
    function submitText(i) {
        const newText = i.value;
        const nTs = newText.match(/machine=(\d+), time=([^,]+), reason=(.+)/);
        i.remove();
        __fetch(`/add-rec?t_id=${teamId}&m_id=${nTs[1]}&t=${nTs[2]}&r=${nTs[3]}`)
        .then((data) => {
            addCont.querySelector('button').onclick = (ev) => {addTeamRec(dropdown, addCont, teamId); ev.stopPropagation()};

            const li = __create('div');
            li.className = 'item';

            const div = __create('div');
    
            const info = __create('div');
            info.className = 'info';
            info.textContent = nTs[2] + ` on Machine(id=${nTs[1]})`;
            div.appendChild(info);

            const detail = __create('div');
            detail.className = 'detail';
            detail.textContent = 'Reason: ' + nTs[3];
            detail.hidden = true;

            div.appendChild(detail);
            li.onmouseover = () => {detail.hidden = false;};
            li.onmouseout = () => {detail.hidden = true;};

            li.appendChild(div);
    
            const removeButt = __create('button');
            removeButt.textContent = '-';
            removeButt.onclick = (e) => {removeRec(li,
                data[0][0]['record_id']); e.stopPropagation()};

            li.appendChild(removeButt);
            dropdown.insertBefore(li, addCont);
        });
    }

    const input = __create('input');
    input.value = 'machine=1, time=Jan1/2025, reason=abcabc';
    input.addEventListener('click', (e) => {e.stopPropagation()});
    input.addEventListener('keypress', (e) => {
        if (e.key == 'Enter')
            submitText(input);
    });

    addCont.prepend(input);
    input.focus();

    addCont.querySelector('button').onclick = (e) => {submitText(input); e.stopPropagation()};
}
