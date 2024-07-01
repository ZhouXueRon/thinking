(async function () {
  /**
   * 从网络获取歌词数据
   * @returns Promise
   */
  async function getLrc() {
    return await fetch('https://study.duyiedu.com/api/lyrics')
      .then((resp) => resp.json())
      .then((resp) => resp.data);
  }

  const doms = {
    container: document.querySelector('.container'),
    ul: document.querySelector('.lrc'),
    audio: document.querySelector('audio')
  };

  let lrcData;
  // 1. 初始化
  async function init() {
    // 拿到歌词，生成 li，放入到 ul 中
    const lrc = await getLrc();
    // 将 lrc -> [{time: 86.09, words: ''}]
    lrcData = lrc
      .split('\n') // 将字符串按换行切割成数组
      .filter(it => it) // 过滤掉空串
      .map(it => {
        const [timeStr, words] = it.split(']'); // 按']'进行分割
        const [m, s] = timeStr
          .replace('[', '') // 移除'['
          .split(':');  // 按':'分割得到分钟和秒数
        const time = +m * 60 + +s; // 将分钟转换成秒
        return { time, words }
      });
    // 生成 li 加入到 ul 中
    doms.ul.innerHTML = lrcData.map(lrc => `<li>${lrc.words}</li>`).join('');
  }

  await init();

  // 2. 交互
  const size = {
    liHeight: doms.ul.querySelector('li').clientHeight,
    containerHeight: doms.container.clientHeight
  };
  doms.audio.addEventListener('timeupdate', function () {
    setStatus(this.currentTime)
  });

  /**
   * 根据播放时间，设置好歌词的状态
   * @param {*} time 
   */
  function setStatus(time) {
    // 设置对应时间的歌词高亮
    // 消除之前的 active
    const activeLi = document.querySelector('.active');
    activeLi && activeLi.classList.remove('active');
    const index = lrcData.findIndex(lrc => lrc.time > time) - 1;
    if (index < 0) return;
    doms.ul.children[index].classList.add('active');
    // 设置 ul 的滚动位置
    let top = size.liHeight * index + size.liHeight / 2 - size.containerHeight / 2;
    top = -top;
    if (top > 0) top = 0;
    doms.ul.style.transform = `translateY(${top}px)`;
  }


})();