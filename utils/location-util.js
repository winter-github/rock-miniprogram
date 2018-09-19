//获取应用实例
const app = getApp();

var checkDistance = function (successCallBack, errorMsg) {
  if (!app.globalData.enableCheckDistance){
    successCallBack();
    return;
  }

  wx.getLocation({
    type: 'wgs84',
    success: function (res) {
      var latitude = res.latitude
      var longitude = res.longitude
      console.log("current latitude==" + latitude + ", longitude==" + longitude);
      var distance = getDistance(latitude, longitude, app.globalData.homeLat, app.globalData.homeLng);
      console.log("and home distance==" + distance);

      if (distance <= 500) {
        successCallBack();
      } else {
        wx.showToast({
          title: errorMsg,
          icon: 'none',
          duration: 2000
        });
      }
    }
  });
};

var getDistance = function(lat1, lng1, lat2, lng2){

  lat1 = lat1 || 0;

  lng1 = lng1 || 0;

  lat2 = lat2 || 0;

  lng2 = lng2 || 0;

  var rad1 = lat1 * Math.PI / 180.0;

  var rad2 = lat2 * Math.PI / 180.0;

  var a = rad1 - rad2;

  var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;

  var r = 6378137;

  return (r * 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(rad1)   * Math.cos(rad2) * Math.pow(Math.sin(b / 2), 2)))).toFixed(0)

}

module.exports = {
  checkDistance: checkDistance,
  getDistance: getDistance
}