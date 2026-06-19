(function() {

  // 視覺化模式狀態
  var sizeMode = 'uniform';   // 'uniform' = 統一大小（預設）, 'capacity' = 依容量縮放
  var sortMode = 'default';   // 'default' = 原始（地區）順序, 'capacity' = 依容量大小排序

  // 依容量縮放參數（方案 A，採 0.5/40：面積等比容量、最小直徑下限）
  var MAX_D = 230;  // 最大水圈直徑（px），需小於卡片寬度 250
  var MIN_D = 40;   // 最小水圈直徑（px）
  var EXP = 0.5;    // 壓縮指數：0.5＝圓面積正比於容量
  var SLOT_H = 250; // 固定 svg 高度，讓水圈垂直置中、文字基線一致

  var reservoirs = [];     // [{ id, percentage, capacity, config, card }]
  var originalOrder = [];  // 原始 DOM 順序的 .reservoir 節點
  var capMax = 0;

  d3.json('data/data.json', function(error, data) {
    if (error) { return; }
    prepare(data);
    bindControls();
    render();
  });

  // 讀資料、填入文字、建立每座水庫的 gauge 設定（只做一次）
  function prepare(data) {
    var wrap = document.querySelector('.reservoir-wrap');
    originalOrder = Array.prototype.slice.call(wrap.querySelectorAll('.reservoir'));

    for (var reservoirName in data) {
      var percentage = parseFloat(data[reservoirName].percentage).toFixed(1);
      var updateAt = data[reservoirName].updateAt;
      var volumn = data[reservoirName].volumn;
      var baseAvailable = data[reservoirName].baseAvailable;
      var id = data[reservoirName].id;
      var netFlow = -parseFloat(data[reservoirName].daliyNetflow).toFixed(1);
      var netPercentageVar;

      if (isNaN(percentage)) {
        $('#'+id).parent().remove();
        continue;
      }

      if (isNaN(netFlow)) {
        $('#'+id).siblings('.state').children('h5').text('昨日水量狀態：待更新');
        $('#'+id).siblings('.state').removeClass();
      }
      else if (netFlow < 0) {
        netPercentageVar = ((-netFlow) / parseFloat(baseAvailable)*100).toFixed(2);
        $('#'+id).siblings('.state').children('h5').text('昨日水量下降：'+ netPercentageVar + '%');
        $('#'+id).siblings('.state').addClass('red');
      }
      else {
        netPercentageVar = ((netFlow) / parseFloat(baseAvailable)*100).toFixed(2);
        $('#'+id).siblings('.state').children('h5').text('昨日水量上升：'+ netPercentageVar + '%');
        $('#'+id).siblings('.state').addClass('blue');
      }

      var config = liquidFillGaugeDefaultSettings();
      config.waveAnimate = true;
      config.waveAnimateTime = setAnimateTime(percentage);
      config.waveOffset = 0.3;
      config.waveHeight = 0.05;
      config.waveCount = setWavaCount(percentage);
      setColor(config, percentage);

      $('#'+id).siblings('.updateAt').html('<h5>更新時間：'+updateAt+'</h5>');
      $('#'+id).siblings('.volumn').html('<h5>有效蓄水量：'+volumn+'萬立方公尺</h5><h5>有效庫容量：'+baseAvailable+'萬立方公尺</h5>');

      reservoirs.push({
        id: id,
        percentage: percentage,
        capacity: parseFloat(baseAvailable),
        config: config,
        card: document.getElementById(id).parentNode
      });
    }

    capMax = d3.max(reservoirs, function(r) { return r.capacity; });
  }

  // 依目前模式調整卡片順序與每座 gauge 的尺寸，重新繪製
  function render() {
    var wrap = document.querySelector('.reservoir-wrap');

    // 排序：重排 DOM 順序
    var ordered;
    if (sortMode === 'capacity') {
      ordered = reservoirs.slice()
        .sort(function(a, b) { return b.capacity - a.capacity; })
        .map(function(r) { return r.card; });
    } else {
      ordered = originalOrder.filter(function(c) { return c.parentNode === wrap; });
    }
    ordered.forEach(function(c) { wrap.appendChild(c); });

    // 尺寸 + 重畫 gauge
    reservoirs.forEach(function(r) {
      var svg = document.getElementById(r.id);
      var dia = SLOT_H;

      if (sizeMode === 'capacity') {
        dia = diameterFor(r.capacity);
        svg.setAttribute('width', dia);
        svg.setAttribute('height', SLOT_H);
        svg.style.display = 'block';
        svg.style.margin = '10px auto';
        r.config.textSize = dia < 90 ? 0.8 : 1;
      } else {
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', SLOT_H);
        svg.style.display = '';
        svg.style.margin = '';
        r.config.textSize = 1;
      }

      d3.select('#'+r.id).selectAll('*').remove();
      loadLiquidFillGauge(r.id, r.percentage, r.config);
    });
  }

  // 直徑 ∝ √容量（面積正比容量），並設最小下限
  function diameterFor(cap) {
    var d = MAX_D * Math.pow(cap / capMax, EXP);
    return Math.max(MIN_D, Math.round(d));
  }

  // 切換鈕事件
  function bindControls() {
    var controls = document.querySelector('.view-controls');
    if (!controls) { return; }

    controls.addEventListener('click', function(e) {
      var btn = e.target.closest('button');
      if (!btn) { return; }

      if (btn.dataset.size) {
        sizeMode = btn.dataset.size;
        setActive(controls, 'size', sizeMode);
      } else if (btn.dataset.sort) {
        sortMode = btn.dataset.sort;
        setActive(controls, 'sort', sortMode);
      } else {
        return;
      }
      render();
    });
  }

  function setActive(controls, group, value) {
    var buttons = controls.querySelectorAll('button[data-'+group+']');
    Array.prototype.forEach.call(buttons, function(b) {
      b.classList.toggle('active', b.dataset[group] === value);
    });
  }

  function setColor(config, percentage) {
    if (percentage < 25) {
      config.circleColor = "#FF7777";
      config.textColor = "#FF4444";
      config.waveTextColor = "#FFAAAA";
      config.waveColor = "#FFDDDD";
    }
    else if (percentage < 50) {
      config.circleColor = "rgb(255, 160, 119)";
      config.textColor = "rgb(255, 160, 119)";
      config.waveTextColor = "rgb(255, 160, 119)";
      config.waveColor = "rgba(245, 151, 111, 0.48)";
    }
  }

  function setWavaCount(percentage) {
    if (percentage > 75) {
      return 3;
    }
    else if (percentage > 50) {
      return 2;
    }
    return 1;
  }

  function setAnimateTime(percentage) {
    if (percentage > 75) {
      return 2000;
    }
    else if (percentage > 50) {
      return 3000;
    }
    else if (percentage > 25) {
      return 4000;
    }
    return 5000;
  }

})();
