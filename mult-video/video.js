(function () {
  //视频进度条部分
  const proBarOut = document.getElementById("video-out_bar");
  const proBarInner = document.getElementById("video-inner_bar");
  const proBarPreload = document.getElementById("video-preload_bar");
  const pointer = document.getElementById("video-pointer");

  // 音量进度条部分
  const voiceProBarBg = document.getElementById("voice-progress_bg");
  const voiceProBarOut = document.getElementById("video-voice_outbar");
  const voiceProBarInner = document.getElementById("video-voice-innerbar");
  const voicePointer = document.getElementById("video-voice_pointer");
  const voiceNum = document.getElementById("video-voice_num");

  const videoMask = document.getElementById("video-mask");
  const voiceMask = document.getElementById("voice-mask");
  const video = document.getElementById("video");
  const play = document.getElementById("play");
  const pause = document.getElementById("pause");
  const currentTimeDom = document.getElementById("time");
  const durationDom = document.getElementById("duration");
  const speedBox = document.getElementById("speed-box");
  const speedTxt = document.getElementById("speed-txt");
  const fullscrreen = document.getElementById("fullscrreen");
  const videoContainer = document.getElementById("video_container");

  //视频总时长
  let duration = 0;
  //视频当前播放时间
  let currentTime = 0;
  //视频时长总进度条长度
  let progressBarW = proBarOut.clientWidth;
  //视频时长总进度条的最左边到浏览器左端的距离
  let leftInit = getOffset(proBarOut).left;
  let speedTimer = null;
  //音量大小
  let volume = 0;
  //音量条长度
  let voiceProgressBarH = voiceProBarOut.clientHeight;
  //音量条的最顶端到浏览器内容区上边的距离
  let topInit = getOffset(voiceProBarOut).top;
  let downY = 0;
  let isFullScreen = false;

  video.addEventListener("waiting", function() {
    console.log("waiting");
  });

  fullscrreen.addEventListener("click",function() {
    if(!isFullScreen) {
      fullScreen();
      isFullScreen = true;
    } else {
      exitFullscreen();
      isFullScreen = false;
    }
  });

  voiceProBarBg.addEventListener("mousedown", function (e) {
    downY = voiceProgressBarH - (e.clientY - topInit);
    if (downY < 0) downY = 0;
    if (downY > 60) downY = voiceProgressBarH;
    voiceProBarInner.style.height = downY + "px";
    voicePointer.style.bottom = (downY-5) + "px";

    const volumeTxt = parseInt((downY / voiceProgressBarH) * 100);
    voiceNum.innerHTML = volumeTxt;
    video.volume = volumeTxt / 100;

    voiceMask.style.display = "block";
  });

  voiceMask.addEventListener("mousemove", function(e) {
    downY = voiceProgressBarH - (e.clientY - topInit);
    if (downY < 0) downY = 0;
    if (downY > 60) downY = voiceProgressBarH;
    voiceProBarInner.style.height = downY + "px";
    voicePointer.style.bottom = (downY-5) + "px";

    const volumeTxt = parseInt((downY / voiceProgressBarH) * 100);
    voiceNum.innerHTML = volumeTxt;
    video.volume = volumeTxt / 100;

    // console.log(video.volume);
  });

  voiceMask.addEventListener("mouseup", function() {
    voiceMask.style.display = "none";
  })
  voiceMask.addEventListener("mouseout", function() {
    voiceMask.style.display = "none";
  })

  speedBox.addEventListener("click", function (e) {
    const target = e.target;
    if (!target.nodeName === "LI") return;
    speedTxt.innerHTML = target.innerHTML === "1.0x" ? "倍速" : target.innerHTML;
    const speed = parseFloat(target.innerHTML);
    video.playbackRate = speed;

    speedBox.style.display = "none";
  });
  speedBox.addEventListener("mouseout", function () {
    speedBox.style.display = "none";
  });
  speedBox.addEventListener("mouseover", function () {
    speedBox.style.display = "block";
    clearTimeout(speedTimer);
  });

  speedTxt.addEventListener("mouseout", function () {
    speedTimer = setTimeout(function () {
      speedBox.style.display = "none";
      clearTimeout(speedTimer);
    }, 250);
  });
  speedTxt.addEventListener("mouseover", function () {
    speedBox.style.display = "block";
  });

  proBarOut.addEventListener("mousedown", function (e) {
    console.log("proBarOut-mousedown");

    let downX = e.clientX - leftInit;
    proBarInner.style.width = downX + "px";
    pointer.style.left = downX + "px";

    video.currentTime = (downX / progressBarW) * duration;

    videoMask.style.display = "block";
  });

  videoMask.addEventListener("mousemove", function (e) {
    console.log("videoMask-mousemove");
    let moveX = e.clientX - leftInit;
    proBarInner.style.width = moveX + "px";
    pointer.style.left = moveX + "px";

    video.currentTime = (moveX / progressBarW) * duration;
  });

  videoMask.addEventListener("mouseup", function () {
    console.log("videoMask-mouseup");
    videoMask.style.display = "none";
  });

  videoMask.addEventListener("mouseout", function () {
    console.log("videoMask-mouseout");
    videoMask.style.display = "none";
  });

  video.addEventListener("timeupdate", function () {
    currentTime = video.currentTime;
    currentTimeDom.innerHTML = timeTranslate(currentTime);

    let growW = (currentTime / duration) * progressBarW;
    proBarInner.style.width = growW + "px";
    pointer.style.left = growW + "px";
  });

  play.addEventListener("click", function () {
    play.style.display = "none";
    pause.style.display = "inline-block";
    video.play();
  });

  pause.addEventListener("click", function () {
    play.style.display = "inline-block";
    pause.style.display = "none";
    video.pause();
  });

  
  // video.addEventListener("progress", function() {
  //   console.log("progress: ");
  //   console.log("buffered: ",(video.buffered.end(0) / video.duration) * 100);
  //   proBarPreload.style.width = (video.buffered.end(0) / video.duration) * 100 + "%";
  // });

  init();

  function init() {
    video.addEventListener("canplay", function () {
      console.log("canplay");
      duration = video.duration;
      durationDom.innerHTML = timeTranslate(duration);
    });
    video.volume = 1;
    // voiceNum.innerHTML = 100;
    voiceProBarInner.style.height = 55 + "px";
    voicePointer.style.bottom = 55 + "px";
  }

  function fullScreen() {
    let ele = document.documentElement;
    if (ele.requestFullscreen) {
      ele.requestFullscreen();
    } else if (ele.mozRequestFullScreen) {
      ele.mozRequestFullScreen();
    } else if (ele.webkitRequestFullScreen) {
      ele.webkitRequestFullScreen();
    }
    // 对应的video标签大小100%
    videoContainer.style.width = "100%";
    videoContainer.style.height = "100%";
  }

  function exitFullscreen() {
    let de = document;
    if (de.exitFullscreen) {
      de.exitFullscreen();
    } else if (de.mozCancelFullScreen) {
      de.mozCancelFullScreen();
    } else if (de.webkitCancelFullScreen) {
      de.webkitCancelFullScreen();
    }
    // 返回初始化值
    videoContainer.style.width = "600px";
    videoContainer.style.height = "400px";
  }

  // 获取进度条的最左端距浏览器左侧的偏移量和上偏移量
  function getOffset(node, offset) {
    if (!offset) {
      offset = {};
      offset.left = 0;
      offset.top = 0;
    }
    if (node === document.body || node === null) {
      return offset;
    }
    offset.top += node.offsetTop;
    offset.left += node.offsetLeft;
    return getOffset(node.offsetParent, offset);
  }

  // 时间转化
  function timeTranslate(t) {
    const h = t / (60 * 60);
    let hh = Math.floor(h);

    const m = (t - hh * 60 * 60) / 60;
    let mm = Math.floor(m);

    let ss = Math.floor(t - hh * 60 * 60 - mm * 60);

    hh < 10 && (hh = "0" + hh);
    mm < 10 && (mm = "0" + mm);
    ss < 10 && (ss = "0" + ss);

    // console.log('hms: ', `${hh}:${mm}:${ss}`)

    return `${hh}:${mm}:${ss}`;
  }
})();
