var rp = require('request-promise');
var fs = require('fs');

var TIMEOUT = 4;
var threads = 1000;
var logger = fs.createWriteStream('urls.txt', {
  flags: 'a', // 'a' means appending (old data will be preserved)
});

function process(id) {
  var thread = 0;

  function onFinish() {
    thread++;

    if (thread === threads) {
      setTimeout(function() {
        process(id + threads);
      }, TIMEOUT);
    }
  }

  function onSuccess(i, resp) {
    if (resp.indexOf('https://vimeo.com/user42162526') > -1) {
      console.log('||-->>>>>>>>>>>>> Found for ' + (id + i));
      logger.write('https://player.vimeo.com/video/' + (id + i) + '\n');
    } else {
      console.log('NOT FOUND for ' + (id + i));
    }

    onFinish();
  }

  function onError(i, errr) {
    // console.log(errr);
    console.log('Error for ' + (id + i));
    onFinish();
  }

  for (var i = 0; i < threads; i++) {
    console.log('Processsing' + (id + i));

    var options = {
      method: 'GET',
      uri: 'https://player.vimeo.com/video/' + (id + i),
      headers: {
        Host: 'player.vimeo.com',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
        Referer: 'https://fashionelement.ru/university/couture_secrets2/mesyats-1/vvedenie-secrets/',
        // Cookie:
        //   'vuid=pl1898251453.1972878917; _ga=GA1.2.545397994.1536775289; player=""; _gcl_au=1.1.1114790147.1538650666; _gid=GA1.2.681290832.1538650666; __gads=ID=b763b12be65ac929:T=1538650666:S=ALNI_MYZjT_eNjbIiULUy4eNRg6llq2_sA; _ceg.s=pg2mjo; _ceg.u=pg2mjo',
      },
      json: false,
    };

    var sucess = onSuccess.bind(null, i);
    var error = onError.bind(null, i);

    rp(options)
      .then(sucess)
      .catch(error);
  }
}

//         168635469
// process(164532685);
//      239474815
process(164530000);
