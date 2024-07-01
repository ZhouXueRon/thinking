(async function () {
  /**
   * 远程获取省市区数据，当获取完成后，得到一个数组
   * @returns Promise
   */
  async function getDatas() {
    return fetch('https://study.duyiedu.com/api/citylist')
      .then((resp) => resp.json())
      .then((resp) => resp.data);
  }

  const doms = {
    selProvince: document.querySelector('#selProvince'),
    selCity: document.querySelector('#selCity'),
    selArea: document.querySelector('#selArea')
  }

  let datas;
  let cityDatas = [];
  let areaDatas = [];
  /**
   * 1. 初始化
   * 生成 li，加入到对应的列表
   */
  async function init() {
    // 拿到省市区数据，生成 li，放入到 ul 中
    datas = await getDatas();
    fillSelect(doms.selProvince, datas);
    fillSelect(doms.selCity, cityDatas); // 一开始未选择不填充城市
    fillSelect(doms.selArea, areaDatas); // 一开始未选择不填充区域
  }

  /**
   * 填充某个下拉列表
   * @param {*} select 当前填充的下拉列表 
   * @param {*} list 当前要填充的数据，如果数组为空，则表示不填充，禁用
   */
  function fillSelect(select, list) {
    list.length ? select.classList.remove('disabled') : select.classList.add('disabled');
    const ul = select.querySelector('.options');
    const span = select.querySelector('span');
    span.innerText = `请选择${select.dataset.name}`;
    select.datas = list;
    ul.innerHTML = list.map(it => `<li>${it.label}</li>`).join('');
  }

  await init();

  /**
   * 2. 交互
   */
  regCommonEvent(doms.selProvince);
  regCommonEvent(doms.selCity);
  regCommonEvent(doms.selArea);
  /**
   * 注册公共的事件处理
   */
  function regCommonEvent(select) {
    // title 点击
    const title = select.querySelector('.title');
    const dataName = select.dataset.name;
    title.addEventListener('click', () => {
      // 如果禁用状态下不做任何处理
      if (select.classList.contains('disabled')) return;
      const expends = document.querySelectorAll('.expend');
      for (const sel of expends) {
        sel !== select && sel.classList.remove('expend');
      }
      select.classList.toggle('expend');
    });
    // ul 点击
    const ul = select.querySelector('.options');
    ul.addEventListener('click', (e) => {
      if (e.target.tagName === 'LI') {
        // 清除原来选中
        const active = select.querySelector('li.active');
        active && active.classList.remove('active');
        e.target.classList.toggle('active');
        // 改变 title 的文本
        const span = select.querySelector('span');
        span.innerText = e.target.innerText;
        // 关闭下拉列表
        select.classList.remove('expend');
        // 将数据
        // 填充下一个元素下拉列表
        const nextDatas = select.datas.find(it => it.label === span.innerText).children;
        if (dataName === '省份') {
          fillSelect(doms.selCity, nextDatas);
          fillSelect(doms.selArea, [])
        }
        if (dataName === '城市') {
          fillSelect(doms.selArea, nextDatas);
        }
      }
    })
  }

})();
