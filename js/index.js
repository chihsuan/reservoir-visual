(function() {

  var today = new Date();
  var MM = addZero(today.getMonth()+1);
  var dd = addZero(today.getDate());
  var yyyy = today.getFullYear();
  var hh = today.getHours();
  var mm = today.getMinutes();
  if (hh == 0) {
    hh = '0';
  }
  if (hh < 7) {
    hh = '1';
  }
  else if (hh < 9) {
    hh = '6';
  }
  else if (hh < 15) {
    hh = '8';
  }
  else if (hh < 20){
    hh = '14';
  }
  else {
    hh = '19';
  }

  d3.json('https://cdn.rawgit.com/chihsuan/reservoir-visual/data/data/data'+
    yyyy + MM + dd + hh + '.json', function(error, data) {
    configs = {};
    for (reservoirName in data) {
       var percentage = data[reservoirName]['percentage'].toFixed(1);
       var updateAt = data[reservoirName]['updateAt'];
       var volumn = data[reservoirName]['volumn'];
       var id = data[reservoirName]['id'];
       var netFlow = -parseFloat(data[reservoirName]['daliyNetflow']).toFixed(1);
       var netPercentageVar;
       
       if (isNaN(percentage)) {
         $('#'+id).parent().remove();
         continue;
       }
      
       if (isNaN(netFlow)) {
          $('#'+id).siblings('.state')
                  .children('h5')
                  .text('昨日水量狀態：待更新');
          $('#'+id).siblings('.state').removeClass();
       }
       else if (netFlow < 0) {
         netPercentageVar = ((-netFlow) / 
             parseFloat(data[reservoirName]['baseAvailable'])*100).toFixed(2)
         
         $('#'+id).siblings('.state')
                  .children('h5')
                  .text('昨日水量下降：'+ netPercentageVar + '% / '
                      + '剩餘：' + Math.round(percentage/netPercentageVar) + '天');
         $('#'+id).siblings('.state').addClass('red');
       }
       else {
         netPercentageVar = ((netFlow) / 
             parseFloat(data[reservoirName]['baseAvailable'])*100).toFixed(2)
         
         $('#'+id).siblings('.state')
                  .children('h5')
                  .text('昨日水量上升：'+ netPercentageVar + '%');
         $('#'+id).siblings('.state').addClass('blue');
       }
       
       configs[reservoirName] = liquidFillGaugeDefaultSettings();
       configs[reservoirName].waveAnimate = true;
       configs[reservoirName].waveAnimateTime = setAnimateTime(percentage);
       configs[reservoirName].waveOffset = 0.3;
       configs[reservoirName].waveHeight = 0.05;
       configs[reservoirName].waveCount = setWavaCount(percentage);
       setColor(configs[reservoirName], percentage);

       $('#'+id).siblings('.updateAt').html('更新時間：'+updateAt);
       $('#'+id).siblings('.volumn').children('h5').text('有效蓄水量：'+volumn+'萬立方公尺');
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
  
  function addZero(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }

})()
