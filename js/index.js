(function() {

  d3.json("../data/data.json", function(error, data) {
    configs = {};
    for (reservoirName in data) {
       var percentage = data[reservoirName]['percentage'];
       var number = parseFloat(data[reservoirName]['percentage']);
       var updateAt = data[reservoirName]['updateAt'];
       var volumn = data[reservoirName]['volumn'];
       var id = data[reservoirName]['id'];
       var netFlow = -parseFloat(data[reservoirName]['daliyNetflow']).toFixed(1);
       if (isNaN(number)) {
         $('#'+id).parent().remove();
         continue;
       }
      
       if (netFlow < 0) {
         //volumn = parseFloat(volumn.replace(',',''));
         //var exp_days = round(volumn/netFlow).toString();
         $('#'+id).siblings('.state')
                  .children('h6')
                  .text('昨日水量下降：'+ netFlow + '萬立方公尺');
         $('#'+id).siblings('.state').addClass('red');
       }
       else if (netFlow >= 0) {
         $('#'+id).siblings('.state')
                  .children('h6')
                  .text('昨日水量上升：'+ netFlow + '萬立方公尺');
         $('#'+id).siblings('.state').addClass('blue');
       }

       configs[reservoirName] = liquidFillGaugeDefaultSettings();
       configs[reservoirName].waveAnimate = true;
       configs[reservoirName].waveAnimateTime = setAnimateTime(number);
       configs[reservoirName].waveOffset = 0.3;
       configs[reservoirName].waveHeight = 0.05;
       configs[reservoirName].waveCount = setWavaCount(number);
       setColor(configs[reservoirName], number);
       $('#'+id).siblings('.updateAt').html('更新時間：'+updateAt);
       $('#'+id).siblings('.volumn').children('h6').text(volumn+'萬立方公尺');
       loadLiquidFillGauge(id, percentage, configs[reservoirName]);
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
  });


})()
