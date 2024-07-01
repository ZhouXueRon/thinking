(async function () {
    /**
     * 从网络获取当前的英雄数据
     * @returns Promise
     */
    async function getHeroes() {
        return fetch('https://study.duyiedu.com/api/herolist')
            .then((resp) => resp.json())
            .then((resp) => resp.data.reverse());
    }

    const doms = {
        ul: document.querySelector('.list'),
        radios: document.querySelectorAll('.radio'),
        input: document.querySelector('.input input')
    }
    let allHeroes;
    // 1. 初始化：加载所有的英雄数据，生成 li，加到 ul 中
    async function init() {
        allHeroes = await getHeroes();
        setHeroeHTML(allHeroes);
    }


    /**
     * 根据指定的英雄数组，生成对应的 html，放到 ul 中
     * @param {*} heros 
     */
    function setHeroeHTML(heros) {
        doms.ul.innerHTML = heros.map(it => (
            `<li>
                <a href="https://pvp.qq.com/web201605/herodetail/${it.ename}.shtml">
                    <img src="https://game.gtimg.cn/images/yxzj/img201606/heroimg/${it.ename}/${it.ename}.jpg" alt="" />
                    <span>${it.cname}</span>
                </a>
            </li>`
        )).join('');
    }

    await init();

    // 2. 交互事件
    // 监听 radio 元素的点击事件
    for (const radio of doms.radios) {
        radio.addEventListener('click', function () {
            // 1. 更改 radio 样式
            setChoose(this);
            // 2. 更改 ul 中的数据
            searchHeros(this)
        });
    }
    // 监听输入框输入事件
    doms.input.addEventListener('input', function () {
        const value = this.value.trim();
        if (!value) {
            setHeroeHTML(allHeroes);
            return;
        }
        const heros = allHeroes.filter(it => it.cname.includes(value));
        setHeroeHTML(heros);
        // 设置全部选中
        setChoose(documnet.querySelector(".radio[data-type='all']"));
    });

    /**
     * 根据 radio 提供的自定义属性，查询英雄数据，然后设置 html
     * @param {*} radio 
     */
    function searchHeros(radio) {
        let heros;
        const type = radio.dataset.type;
        const value = radio.dataset.value;
        if (type === 'all') {
            heros = allHeroes;
        } else if (type === 'pay_type') {
            heros = allHeroes.filter(it => it.pay_type === +value)
        } else {
            heros = allHeroes.filter(it => it.hero_type === +value || it.hero_type2 === +value);
        }
        setHeroeHTML(heros);
    }

    // 设置某个被选中的radio
    function setChoose(radio) {
        // 清空 input 中的 value 值
        doms.input.value = '';
        // 找到之前被选中的 radio
        const checkedRadio = document.querySelector('.radio.checked');
        checkedRadio && checkedRadio.classList.remove('checked');
        radio.classList.add('checked');
    }
})();