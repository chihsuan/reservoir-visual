(function() {

  var myFirebaseRef = new Firebase("https://realtaiwanstat.firebaseio.com");
  myFirebaseRef.child("water").limitToLast(1).on("child_added", function(snapshot) {
      var raw = snapshot.val();  
      var data = JSON.parse(raw);
      visualize(data);
  });

  function visualize (data) {
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
        
         var usageDay = Math.round(percentage/netPercentageVar);
         if (usageDay >= 60) {
            usageDay = '預測剩餘天數：60天以上';
         }
         else if (usageDay >= 30) {
            usageDay = '預測剩餘天數：30天-60天';
            $('#'+id).siblings('.dueDay').addClass('red');
         }
         else {
            usageDay = '預測剩餘天數：' + usageDay + '天';
            $('#'+id).siblings('.dueDay').addClass('red');
         }

         $('#'+id).siblings('.dueDay')
                  .children('h5')
                  .text(usageDay);

         $('#'+id).siblings('.state')
                  .children('h5')
                  .text('昨日水量下降：'+ netPercentageVar + '%');
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
  }
  //);
  
  function addZero(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }

})()
