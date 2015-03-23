(function() {

  d3.json("https://cdn.rawgit.com/chihsuan/reservoir-visual/data/data/data.json", function(error, data) {
    configs = {};

    for (id in data) {
       var percentage = data[id]['percentage'];
       var number = parseFloat(data[id]['percentage']);
       var updateAt = data[id]['updateAt'];
       var volumn = data[id]['volumn'];
       configs[id] = liquidFillGaugeDefaultSettings();
       configs[id].waveAnimate = true;
       configs[id].waveAnimateTime = setAnimateTime(number);
       configs[id].waveOffset = 0.3;
       configs[id].waveHeight = 0.05;
       configs[id].waveCount = setWavaCount(number);
       setColor(configs[id], number);
       $('#'+id).siblings('.updateAt').html('更新時間：'+updateAt);
       $('#'+id).siblings('.volumn').children('h6').text(volumn+'萬立方公尺');
       loadLiquidFillGauge(id, percentage, configs[id]);
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
      console.log(percentage);
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
  });


})()
