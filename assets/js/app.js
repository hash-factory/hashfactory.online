function timeSince(date) {

  if (!date) date = 0;
  var seconds = Math.floor((new Date()/ 1000) - date);

  var interval = Math.floor(seconds / 31536000);

  if (interval > 1) {
	if (interval > 10) { return "not yet"; }
    return interval + " years ago";
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 2) {
    return interval + " months ago";
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 2) {
    return interval + " days ago";
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return interval + " hours ago";
  }
  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return interval + " minutes ago";
  }
  return Math.floor(seconds) + " seconds ago";
}

function updateText(elementId, text, newColor){
    var el = document.getElementById(elementId);
    if (el.textContent !== text){
        el.textContent = text;
    }
	if (newColor) el.style.color = newColor; else el.style.color = "Black";
    return el;
}
function getReadableHashRateString(hashrate){
    var i = 0;
    var byteUnits = [' H', ' KH', ' MH', ' GH', ' TH', ' PH' ];
    while (hashrate > 1000){
        hashrate = hashrate / 1000;
        i++;
    }
    return hashrate.toFixed(2) + byteUnits[i];
}

function fetchLiveStats() {
 
//     $.ajax({
//        url: 'https://etn.semipool.com/api/pool/stats/pplns',
//        dataType: 'json',
//        cache: 'false'
//    }).done(function(data){
//        electroneumPoolStats = data;
//        updateText('moneroPoolHashrate', getReadableHashRateString(electroneumPoolStats.pool_statistics.hashRate) + '/S');
//        updateText('moneroPoolMiners', electroneumPoolStats.pool_statistics.miners);
//        updateText('moneroBlocksFound', electroneumPoolStats.pool_statistics.totalBlocksFound);
//        updateText('moneroPoolFee', electroneumPoolStats.pool_statistics.fee);
//    });
// NETWORK DATA
//	TUBE
    $.ajax({
        url: 'https://tube.semipool.com/api/network/stats',
        dataType: 'json',
        cache: 'false'
    }).done(function(data){
		if (!data) exit;
        tubeNetworkStats = data;
        updateText('tubeNetworkHashrate', getReadableHashRateString(tubeNetworkStats.difficulty / 120) + '/S');
		
		var newColor;
		if ((new Date()/ 1000) - data.ts > 30*60) newColor = "Red"; else newColor = false;
		updateText('tubeNetworkTS', timeSince(tubeNetworkStats.ts), newColor);
    });
    $.ajax({
        url: 'https://tube.semipool.com/api/pool/stats/pplns',
        dataType: 'json',
        cache: 'false'
    }).done(function(data){
		if (!data) exit;
        tubePool = data;
        tubePrice = data.pool_statistics.price.usd; 
        updateText('tubePrice',(tubePrice * 1).toFixed(3) + ' USD' + " (over 24h : "+data.pool_statistics.price.change24h+"%)");
        updateText('tubeProfit',((1000/tubeNetworkStats.difficulty)*86400*7*(tubeNetworkStats.value / 100000000)*tubePrice).toFixed(3) + ' USD');
        updateText('tubePoolHashrate', getReadableHashRateString(tubePool.pool_statistics.hashRate) + '/S');
		updateText('tubeMiners', tubePool.pool_statistics.miners);
		updateText('tubeBlockFound', timeSince(tubePool.pool_statistics.lastBlockFoundTime));
    });	
    $.ajax({
        url: 'https://tube.semipool.com/api/pool/payments',
        dataType: 'json',
        cache: 'false'
    }).done(function(data){
		if (!data) exit;
		var newColor;
		if (data[0] && data[0].ts/1000 < tubePool.pool_statistics.lastBlockFoundTime) newColor = "Red"; else newColor = null;
		if (data[0]) updateText('tubeLastPayment', timeSince(data[0].ts/1000), newColor);
    });	
//	XMR
    $.ajax({
        url: 'https://xmr.semipool.com/api/network/stats',
        dataType: 'json',
        cache: 'false'
    }).done(function(data){
		if (!data) exit;
        xmrNetworkStats = data;
        updateText('xmrNetworkHashrate', getReadableHashRateString(xmrNetworkStats.difficulty / 120) + '/S');
		
		var newColor;
		if ((new Date()/ 1000) - data.ts > 30*60) newColor = "Red"; else newColor = false;
		updateText('xmrNetworkTS', timeSince(xmrNetworkStats.ts), newColor);
    });
    $.ajax({
        url: 'https://xmr.semipool.com/api/pool/stats/pplns',
        dataType: 'json',
        cache: 'false'
    }).done(function(data){
		if (!data) exit;
        xmrPool = data;
		xmrPrice = data.pool_statistics.price.usd; 
		updateText('xmrPrice',(xmrPrice * 1).toFixed(3) + ' USD' + " (over 24h : "+data.pool_statistics.price.change24h+"%)");
        updateText('xmrProfit',((1000/xmrNetworkStats.difficulty)*86400*7*(xmrNetworkStats.value / 1000000000000)*xmrPrice).toFixed(3) + ' USD');
        updateText('xmrPoolHashrate', getReadableHashRateString(xmrPool.pool_statistics.hashRate) + '/S');
		updateText('xmrMiners', xmrPool.pool_statistics.miners);
		updateText('xmrBlockFound', timeSince(xmrPool.pool_statistics.lastBlockFoundTime));
    });
    $.ajax({
        url: 'https://xmr.semipool.com/api/pool/payments',
        dataType: 'json',
        cache: 'false'
    }).done(function(data){
		if (!data) exit;
		var newColor;
		if (data[0] && data[0].ts/1000 < xmrPool.pool_statistics.lastBlockFoundTime) newColor = "Red"; else newColor = null;
		if (data[0]) updateText('xmrLastPayment', timeSince(data[0].ts/1000),newColor);
    });	
// ETN	
    $.ajax({
        url: 'https://etn.semipool.com/api/network/stats',
        dataType: 'json',
        cache: 'false'
    }).done(function(data){
		if (!data) exit;
        etnNetworkStats = data;
        updateText('etnNetworkHashrate', getReadableHashRateString(etnNetworkStats.difficulty / 120) + '/S');
		
		var newColor;
		if ((new Date()/ 1000) - data.ts > 30*60) newColor = "Red"; else newColor = false;
		updateText('etnNetworkTS', timeSince(etnNetworkStats.ts), newColor);
    });
    $.ajax({
        url: 'https://etn.semipool.com/api/pool/stats/pplns',
        dataType: 'json',
        cache: 'false'
    }).done(function(data){
		if (!data) exit;
        etnPool = data;
		etnPrice = data.pool_statistics.price.usd;
        updateText('etnPrice',(etnPrice * 1).toFixed(3) + ' USD' + " (over 24h : "+data.pool_statistics.price.change24h+"%)");
        updateText('etnProfit',((1000/etnNetworkStats.difficulty)*86400*7*(etnNetworkStats.value / 100)*etnPrice).toFixed(3) + ' USD');
        updateText('etnPoolHashrate', getReadableHashRateString(etnPool.pool_statistics.hashRate) + '/S');
		updateText('etnMiners', etnPool.pool_statistics.miners);
		updateText('etnBlockFound', timeSince(etnPool.pool_statistics.lastBlockFoundTime));
    });
	$.ajax({
        url: 'https://etn.semipool.com/api/pool/payments',
        dataType: 'json',
        cache: 'false'
    }).done(function(data){
		if (!data) exit;
		var newColor;
		if (data[0] && data[0].ts/1000 < etnPool.pool_statistics.lastBlockFoundTime) newColor = "Red"; else newColor = null;
		if (data[0]) updateText('etnLastPayment', timeSince(data[0].ts/1000),newColor);
    });
// AEON
    $.ajax({
        url: 'https://aeon.semipool.com/api/network/stats',
        dataType: 'json',
        cache: 'false'
    }).done(function(data){
		if (!data) exit;
        aeonNetworkStats = data;
        updateText('aeonNetworkHashrate', getReadableHashRateString(aeonNetworkStats.difficulty / 240) + '/S');
		
		var newColor;
		if ((new Date()/ 1000) - data.ts > 30*60) newColor = "Red"; else newColor = false;
		updateText('aeonNetworkTS', timeSince(aeonNetworkStats.ts), newColor);
    });	
    $.ajax({
        url: 'https://aeon.semipool.com/api/pool/stats/pplns',
        dataType: 'json',
        cache: 'false'
    }).done(function(data){
		if (!data) exit;
        aeonPool = data;
		aeonPrice = data.pool_statistics.price.usd;
        updateText('aeonPrice',(aeonPrice).toFixed(3) + ' USD' + " (over 24h : "+data.pool_statistics.price.change24h+"%)");
        updateText('aeonProfit',((1000/aeonNetworkStats.difficulty)*86400*7*(aeonNetworkStats.value / 1000000000000)*aeonPrice).toFixed(3) + ' USD');	
        updateText('aeonPoolHashrate', getReadableHashRateString(aeonPool.pool_statistics.hashRate) + '/S');
		updateText('aeonMiners', aeonPool.pool_statistics.miners);
		updateText('aeonBlockFound', timeSince(aeonPool.pool_statistics.lastBlockFoundTime));
    });
    $.ajax({
        url: 'https://aeon.semipool.com/api/pool/payments',
        dataType: 'json',
        cache: 'false'
    }).done(function(data){
		if (!data) exit;
		var newColor;
		if (data[0] && data[0].ts/1000 < aeonPool.pool_statistics.lastBlockFoundTime) newColor = "Red"; else newColor = false;
		if (data[0]) updateText('aeonLastPayment', timeSince(data[0].ts/1000),newColor);
    });	
// SUMO
    $.ajax({
        url: 'https://sumo.semipool.com/api/network/stats',
        dataType: 'json',
        cache: 'false'
    }).done(function(data){
		if (!data) exit;
        sumoNetworkStats = data;
        updateText('sumoNetworkHashrate', getReadableHashRateString(sumoNetworkStats.difficulty / 240) + '/S');
		
		var newColor;
		if ((new Date()/ 1000) - data.ts > 30*60) newColor = "Red"; else newColor = false;
		updateText('sumoNetworkTS', timeSince(sumoNetworkStats.ts), newColor);
    });		
    $.ajax({
        url: 'https://sumo.semipool.com/api/pool/stats/pplns',
        dataType: 'json',
        cache: 'false'
    }).done(function(data){
		if (!data) exit;
        sumoPool = data;
		sumoPrice = data.pool_statistics.price.usd;
        updateText('sumoPrice',(sumoPrice * 1).toFixed(3) + ' USD' + " (over 24h : "+data.pool_statistics.price.change24h+"%)");
        updateText('sumoProfit',((1000/sumoNetworkStats.difficulty)*86400*7*(sumoNetworkStats.value / 1000000000)*sumoPrice).toFixed(3) + ' USD');
        updateText('sumoPoolHashrate', getReadableHashRateString(sumoPool.pool_statistics.hashRate) + '/S');
		updateText('sumoMiners', sumoPool.pool_statistics.miners);
		updateText('sumoBlockFound', timeSince(sumoPool.pool_statistics.lastBlockFoundTime));
    });
	$.ajax({
        url: 'https://sumo.semipool.com/api/pool/payments',
        dataType: 'json',
        cache: 'false'
    }).done(function(data){
		if (!data) exit;
		var newColor;
		if (data[0] && data[0].ts/1000 < sumoPool.pool_statistics.lastBlockFoundTime) newColor = "Red"; else newColor = false;
		if (data[0]) updateText('sumoLastPayment', timeSince(data[0].ts/1000),newColor);
    });
// ITNS
    $.ajax({
        url: 'https://lethean.blockharbor.net/api/network/stats',
        dataType: 'json',
        cache: 'false'
    }).done(function(data){
		if (!data) exit;
        itnsNetworkStats = data;
        updateText('itnsNetworkHashrate', getReadableHashRateString(itnsNetworkStats.difficulty / 120) + '/S');
		
		var newColor;
		if ((new Date()/ 1000) - data.ts > 30*60) newColor = "Red"; else newColor = false;
		updateText('itnsNetworkTS', timeSince(itnsNetworkStats.ts), newColor);
    });		
    $.ajax({
        url: 'https://lethean.blockharbor.net/api/pool/stats/pplns',
        dataType: 'json',
        cache: 'false'
    }).done(function(data){
		if (!data) exit;
        itnsPool = data;
        updateText('itnsPoolHashrate', getReadableHashRateString(itnsPool.pool_statistics.hashRate) + '/S');
		updateText('itnsMiners', itnsPool.pool_statistics.miners);
		updateText('itnsBlockFound', timeSince(itnsPool.pool_statistics.lastBlockFoundTime));
    });
	$.ajax({
        url: 'https://lethean.blockharbor.net/api/pool/payments',
        dataType: 'json',
        cache: 'false'
    }).done(function(data){
		if (!data) exit;
		if (data[0]) updateText('itnsLastPayment', timeSince(data[0].ts/1000));
    });
// GRFT
    $.ajax({
        url: 'https://grft.semipool.com/api/network/stats',
        dataType: 'json',
        cache: 'false'
    }).done(function(data){
		if (!data) exit;
        grftNetworkStats = data;
        updateText('grftNetworkHashrate', getReadableHashRateString(grftNetworkStats.difficulty / 120) + '/S');
		
		var newColor;
		if ((new Date()/ 1000) - data.ts > 30*60) newColor = "Red"; else newColor = false;
		updateText('grftNetworkTS', timeSince(grftNetworkStats.ts), newColor);
    });			
    $.ajax({
        url: 'https://grft.semipool.com/api/pool/stats/pplns',
        dataType: 'json',
        cache: 'false'
    }).done(function(data){
		if (!data) exit;
        grftPool = data;
        grftPrice = data.pool_statistics.price.usd; 
        updateText('grftPrice',(grftPrice * 1).toFixed(3) + ' USD' + " (over 24h : "+data.pool_statistics.price.change24h+"%)");
        updateText('grftProfit',((1000/grftNetworkStats.difficulty)*86400*7*(grftNetworkStats.value / 10000000000)*grftPrice).toFixed(3) + ' USD');
        updateText('grftPoolHashrate', getReadableHashRateString(grftPool.pool_statistics.hashRate) + '/S');
		updateText('grftMiners', grftPool.pool_statistics.miners);
		updateText('grftBlockFound', timeSince(grftPool.pool_statistics.lastBlockFoundTime));
    });
	$.ajax({
        url: 'https://grft.semipool.com/api/pool/payments',
        dataType: 'json',
        cache: 'false'
    }).done(function(data){
		if (!data) exit;
		var newColor;
		if (data[0] && data[0].ts/1000 < grftPool.pool_statistics.lastBlockFoundTime) newColor = "Red"; else newColor = false;
		if (data[0]) updateText('grftLastPayment', timeSince(data[0].ts/1000),newColor);
    });
// KRB
    $.ajax({
        url: 'https://krb.semipool.com/api/network/stats',
        dataType: 'json',
        cache: 'false'
    }).done(function(data){
		if (!data) exit;
        krbNetworkStats = data;
        updateText('krbNetworkHashrate', getReadableHashRateString(krbNetworkStats.difficulty / 240) + '/S');
		
		var newColor;
		if ((new Date()/ 1000) - data.ts > 30*60) newColor = "Red"; else newColor = false;
		updateText('krbNetworkTS', timeSince(krbNetworkStats.ts), newColor);
    });			
    $.ajax({
        url: 'https://krb.semipool.com/api/pool/stats/pplns',
        dataType: 'json',	
        cache: 'false'
    }).done(function(data){
		if (!data) exit;
        krbPool = data;
		krbPrice = data.pool_statistics.price.usd;
        updateText('krbPrice',(krbPrice * 1).toFixed(3) + ' USD' + " (over 24h : "+data.pool_statistics.price.change24h+"%)");
        updateText('krbProfit',((1000/krbNetworkStats.difficulty)*86400*7*(krbNetworkStats.value / 1000000000000)*krbPrice).toFixed(3) + ' USD');	
        updateText('krbPoolHashrate', getReadableHashRateString(krbPool.pool_statistics.hashRate) + '/S');
		updateText('krbMiners', krbPool.pool_statistics.miners);
		updateText('krbBlockFound', timeSince(krbPool.pool_statistics.lastBlockFoundTime));
    });
	$.ajax({
        url: 'https://krb.semipool.com/api/pool/payments',
        dataType: 'json',
        cache: 'false'
    }).done(function(data){
		if (!data) exit;
		var newColor;
		if (data[0] && data[0].ts/1000 < krbPool.pool_statistics.lastBlockFoundTime) newColor = "Red"; else newColor = null;
		if (data[0]) updateText('krbLastPayment', timeSince(data[0].ts/1000),newColor);
    });
// TRTL
    $.ajax({
        url: 'https://trtl.semipool.com/api/network/stats',
        dataType: 'json',
        cache: 'false'
    }).done(function(data){
		if (!data) exit;
        trtlNetworkStats = data;
        updateText('trtlNetworkHashrate', getReadableHashRateString(trtlNetworkStats.difficulty / 30) + '/S');
		
		var newColor;
		if ((new Date()/ 1000) - data.ts > 30*60) newColor = "Red"; else newColor = false;
		updateText('trtlNetworkTS', timeSince(trtlNetworkStats.ts), newColor);
    });			
    $.ajax({
        url: 'https://trtl.semipool.com/api/pool/stats/pplns',
        dataType: 'json',
        cache: 'false'
    }).done(function(data){
		if (!data) exit;
        trtlPool = data;
        trtlPrice = data.pool_statistics.price.usd; 
        updateText('trtlPrice',(trtlPrice * 1).toFixed(7) + ' USD' + " (over 24h : "+data.pool_statistics.price.change24h+"%)");
        updateText('trtlProfit',((1000/trtlNetworkStats.difficulty)*86400*7*(trtlNetworkStats.value / 100)*trtlPrice).toFixed(3) + ' USD');
        updateText('trtlPoolHashrate', getReadableHashRateString(trtlPool.pool_statistics.hashRate) + '/S');
		updateText('trtlMiners', trtlPool.pool_statistics.miners);
		updateText('trtlBlockFound', timeSince(trtlPool.pool_statistics.lastBlockFoundTime));
    });
	$.ajax({
        url: 'https://trtl.semipool.com/api/pool/payments',
        dataType: 'json',
        cache: 'false'
    }).done(function(data){
		if (!data) exit;
		var newColor;
		if (data[0] && data[0].ts/1000 < trtlPool.pool_statistics.lastBlockFoundTime) newColor = "Red"; else newColor = false;
		if (data[0]) updateText('trtlLastPayment', timeSince(data[0].ts/1000),newColor);
    });
//
//    $.ajax({
//        url: 'https://etc-api.semipool.com/api/stats',
//        dataType: 'json',
//        cache: 'false'
//    }).done(function(data){
//        etcNetworkStats = data.nodes;
//		updateText('etcPoolHashrate', getReadableHashRateString(data.hashrate) + '/S');
//    });		
// DERO
    $.ajax({
        url: 'https://dero.semipool.com/api/network/stats',
        dataType: 'json',
        cache: 'false'
    }).done(function(data){
		if (!data) exit;
        deroNetworkStats = data;
        updateText('deroNetworkHashrate', getReadableHashRateString(deroNetworkStats.difficulty / 12) + '/S');
		
		var newColor;
		if ((new Date()/ 1000) - data.ts > 30*60) newColor = "Red"; else newColor = false;
		updateText('deroNetworkTS', timeSince(deroNetworkStats.ts), newColor);
    });	
    $.ajax({
        url: 'https://dero.semipool.com/api/pool/stats/pplns',
        dataType: 'json',
        cache: 'false'
    }).done(function(data){
		if (!data) exit;
        deroPool = data;
        deroPrice = data.pool_statistics.price.usd; 
        updateText('deroPrice',(deroPrice * 1).toFixed(3) + ' USD' + " (over 24h : "+data.pool_statistics.price.change24h+"%)");
        updateText('deroProfit',((1000/deroNetworkStats.difficulty)*86400*7*(deroNetworkStats.value / 1000000000000)*deroPrice).toFixed(3) + ' USD');
        updateText('deroPoolHashrate', getReadableHashRateString(deroPool.pool_statistics.hashRate) + '/S');
		updateText('deroMiners', deroPool.pool_statistics.miners);
		updateText('deroBlockFound', timeSince(deroPool.pool_statistics.lastBlockFoundTime));
    });
	$.ajax({
        url: 'https://dero.semipool.com/api/pool/payments',
        dataType: 'json',
        cache: 'false'
    }).done(function(data){
		if (!data) exit;
		var newColor;
		if (data[0] && data[0].ts/1000 < deroPool.pool_statistics.lastBlockFoundTime) newColor = "Red"; else newColor = false;
		if (data[0]) updateText('deroLastPayment', timeSince(data[0].ts/1000),newColor);
    });
 // IRIDIUM
    $.ajax({
        url: 'https://ird.semipool.com/api/network/stats',
        dataType: 'json',
        cache: 'false'
    }).done(function(data){
		if (!data) exit;
        irdNetworkStats = data;
        updateText('irdNetworkHashrate', getReadableHashRateString(irdNetworkStats.difficulty / 180) + '/S');
		
		var newColor;
		if ((new Date()/ 1000) - data.ts > 30*60) newColor = "Red"; else newColor = false;
		updateText('irdNetworkTS', timeSince(irdNetworkStats.ts), newColor);
    });	
    $.ajax({
        url: 'https://ird.semipool.com/api/pool/stats/pplns',
        dataType: 'json',
        cache: 'false'
    }).done(function(data){
		if (!data) exit;
        irdPool = data;
        irdPrice = data.pool_statistics.price.usd; 
        updateText('irdPrice',(irdPrice * 1).toFixed(4) + ' USD' + " (over 24h : "+data.pool_statistics.price.change24h+"%)");
        updateText('irdProfit',((1000/irdNetworkStats.difficulty)*86400*7*(irdNetworkStats.value / 100000000)*irdPrice).toFixed(3) + ' USD');
        updateText('irdPoolHashrate', getReadableHashRateString(irdPool.pool_statistics.hashRate) + '/S');
		updateText('irdMiners', irdPool.pool_statistics.miners);
		updateText('irdBlockFound', timeSince(irdPool.pool_statistics.lastBlockFoundTime));
    });
	$.ajax({
        url: 'https://ird.semipool.com/api/pool/payments',
        dataType: 'json',
        cache: 'false'
    }).done(function(data){
		if (!data) exit;
		var newColor;
		if (data[0] && data[0].ts/1000 < irdPool.pool_statistics.lastBlockFoundTime) newColor = "Red"; else newColor = false;
		if (data[0]) updateText('irdLastPayment', timeSince(data[0].ts/1000), newColor);
    });
 // TRITON
    $.ajax({
        url: 'https://xtri.semipool.com/api/network/stats',
        dataType: 'json',
        cache: 'false'
    }).done(function(data){
		if (!data) exit;
        tritNetworkStats = data;
        updateText('tritNetworkHashrate', getReadableHashRateString(tritNetworkStats.difficulty / 180) + '/S');
		
		var newColor;
		if ((new Date()/ 1000) - data.ts > 30*60) newColor = "Red"; else newColor = false;
		updateText('tritNetworkTS', timeSince(tritNetworkStats.ts), newColor);
    });	
    $.ajax({
        url: 'https://xtri.semipool.com/api/pool/stats/pplns',
        dataType: 'json',
        cache: 'false'
    }).done(function(data){
		if (!data) exit;
        tritPool = data;
        tritPrice = data.pool_statistics.price.usd; 
        updateText('tritPrice',(tritPrice * 1).toFixed(3) + ' USD' + " (over 24h : "+data.pool_statistics.price.change24h+"%)");
        updateText('tritProfit',((1000/tritNetworkStats.difficulty)*86400*7*(tritNetworkStats.value / 1000000000000)*tritPrice).toFixed(3) + ' USD');
        updateText('tritPoolHashrate', getReadableHashRateString(tritPool.pool_statistics.hashRate) + '/S');
		updateText('tritMiners', tritPool.pool_statistics.miners);
		updateText('tritBlockFound', timeSince(tritPool.pool_statistics.lastBlockFoundTime));
    });
	$.ajax({
        url: 'https://xtri.semipool.com/api/pool/payments',
        dataType: 'json',
        cache: 'false'
    }).done(function(data){
		if (!data) exit;
		var newColor;
		if (data[0] && data[0].ts/1000 < tritPool.pool_statistics.lastBlockFoundTime) newColor = "Red"; else newColor = false;
		if (data[0]) updateText('tritLastPayment', timeSince(data[0].ts/1000), newColor);
    });
 // ARQ
    $.ajax({
        url: 'https://arq.semipool.com/api/network/stats',
        dataType: 'json',
        cache: 'false'
    }).done(function(data){
		if (!data) exit;
        arqNetworkStats = data;
        updateText('arqNetworkHashrate', getReadableHashRateString(arqNetworkStats.difficulty / 240) + '/S');
		
		var newColor;
		if ((new Date()/ 1000) - data.ts > 30*60) newColor = "Red"; else newColor = false;
		updateText('arqNetworkTS', timeSince(arqNetworkStats.ts), newColor);
    });	
    $.ajax({
        url: 'https://arq.semipool.com/api/pool/stats/pplns',
        dataType: 'json',
        cache: 'false'
    }).done(function(data){
		if (!data) exit;
        arqPool = data;
        arqPrice = data.pool_statistics.price.usd; 
        updateText('arqPrice',(arqPrice * 1).toFixed(3) + ' USD' + " (over 24h : "+data.pool_statistics.price.change24h+"%)");
        updateText('arqProfit',((1000/arqNetworkStats.difficulty)*86400*7*(arqNetworkStats.value / 1000000000)*arqPrice).toFixed(3) + ' USD');
        updateText('arqPoolHashrate', getReadableHashRateString(arqPool.pool_statistics.hashRate) + '/S');
		updateText('arqMiners', arqPool.pool_statistics.miners);
		updateText('arqBlockFound', timeSince(arqPool.pool_statistics.lastBlockFoundTime));
    });
	$.ajax({
        url: 'https://arq.semipool.com/api/pool/payments',
        dataType: 'json',
        cache: 'false'
    }).done(function(data){
		if (!data) exit;
		var newColor;
		if (data[0] && data[0].ts/1000 < arqPool.pool_statistics.lastBlockFoundTime) newColor = "Red"; else newColor = false;
		if (data[0]) updateText('arqLastPayment', timeSince(data[0].ts/1000), newColor);
    });
 // MSR
    $.ajax({
        url: 'https://msr.semipool.com/api/network/stats',
        dataType: 'json',
        cache: 'false'
    }).done(function(data){
		if (!data) exit;
        msrNetworkStats = data;
        updateText('msrNetworkHashrate', getReadableHashRateString(msrNetworkStats.difficulty / 120) + '/S');
		
		var newColor;
		if ((new Date()/ 1000) - data.ts > 30*60) newColor = "Red"; else newColor = false;
		updateText('msrNetworkTS', timeSince(msrNetworkStats.ts), newColor);
    });	
    $.ajax({
        url: 'https://msr.semipool.com/api/pool/stats/pplns',
        dataType: 'json',
        cache: 'false'
    }).done(function(data){
		if (!data) exit;
        msrPool = data;
        msrPrice = data.pool_statistics.price.usd; 
        updateText('msrPrice',(msrPrice * 1).toFixed(3) + ' USD' + " (over 24h : "+data.pool_statistics.price.change24h+"%)");
        updateText('msrProfit',((1000/msrNetworkStats.difficulty)*86400*7*(msrNetworkStats.value / 1000000000000)*msrPrice).toFixed(3) + ' USD');
        updateText('msrPoolHashrate', getReadableHashRateString(msrPool.pool_statistics.hashRate) + '/S');
		updateText('msrMiners', msrPool.pool_statistics.miners);
		updateText('msrBlockFound', timeSince(msrPool.pool_statistics.lastBlockFoundTime));
    });
	$.ajax({
        url: 'https://msr.semipool.com/api/pool/payments',
        dataType: 'json',
        cache: 'false'
    }).done(function(data){
		if (!data) exit;
		var newColor;
		if (data[0] && data[0].ts/1000 < msrPool.pool_statistics.lastBlockFoundTime) newColor = "Red"; else newColor = false;
		if (data[0]) updateText('msrLastPayment', timeSince(data[0].ts/1000), newColor);
    });
 // XTL
    $.ajax({
        url: 'https://xtl.semipool.com/api/network/stats',
        dataType: 'json',
        cache: 'false'
    }).done(function(data){
		if (!data) exit;
        xtlNetworkStats = data;
        updateText('xtlNetworkHashrate', getReadableHashRateString(xtlNetworkStats.difficulty / 60) + '/S');
		
		var newColor;
		if ((new Date()/ 1000) - data.ts > 30*60) newColor = "Red"; else newColor = false;
		updateText('xtlNetworkTS', timeSince(xtlNetworkStats.ts), newColor);
    });	
    $.ajax({
        url: 'https://xtl.semipool.com/api/pool/stats/pplns',
        dataType: 'json',
        cache: 'false'
    }).done(function(data){
		if (!data) exit;
        xtlPool = data;
        xtlPrice = data.pool_statistics.price.usd; 
        updateText('xtlPrice',(xtlPrice * 1).toFixed(5) + ' USD' + " (over 24h : "+data.pool_statistics.price.change24h+"%)");
        updateText('xtlProfit',((1000/xtlNetworkStats.difficulty)*86400*7*(xtlNetworkStats.value / 100)*xtlPrice).toFixed(3) + ' USD');
        updateText('xtlPoolHashrate', getReadableHashRateString(xtlPool.pool_statistics.hashRate) + '/S');
		updateText('xtlMiners', xtlPool.pool_statistics.miners);
		updateText('xtlBlockFound', timeSince(xtlPool.pool_statistics.lastBlockFoundTime));
    });
	$.ajax({
        url: 'https://xtl.semipool.com/api/pool/payments',
        dataType: 'json',
        cache: 'false'
    }).done(function(data){
		if (!data) exit;
		var newColor;
		if (data[0] && data[0].ts/1000 < xtlPool.pool_statistics.lastBlockFoundTime) newColor = "Red"; else newColor = false;
		if (data[0]) updateText('xtlLastPayment', timeSince(data[0].ts/1000), newColor);
    });
 // XHV
    $.ajax({
        url: 'https://xhv.semipool.com/api/network/stats',
        dataType: 'json',
        cache: 'false'
    }).done(function(data){
		if (!data) exit;
        xhvNetworkStats = data;
        updateText('xhvNetworkHashrate', getReadableHashRateString(xhvNetworkStats.difficulty / 120) + '/S');
		
		var newColor;
		if ((new Date()/ 1000) - data.ts > 30*60) newColor = "Red"; else newColor = false;
		updateText('xhvNetworkTS', timeSince(xhvNetworkStats.ts), newColor);
    });	
    $.ajax({
        url: 'https://xhv.semipool.com/api/pool/stats/pplns',
        dataType: 'json',
        cache: 'false'
    }).done(function(data){
		if (!data) exit;
        xhvPool = data;
        xhvPrice = data.pool_statistics.price.usd; 
        updateText('xhvPrice',(xhvPrice * 1).toFixed(3) + ' USD' + " (over 24h : "+data.pool_statistics.price.change24h+"%)");
        updateText('xhvProfit',((1000/xhvNetworkStats.difficulty)*86400*7*(xhvNetworkStats.value / 1000000000000)*xhvPrice).toFixed(3) + ' USD');
        updateText('xhvPoolHashrate', getReadableHashRateString(xhvPool.pool_statistics.hashRate) + '/S');
		updateText('xhvMiners', xhvPool.pool_statistics.miners);
		updateText('xhvBlockFound', timeSince(xhvPool.pool_statistics.lastBlockFoundTime));
    });
	$.ajax({
        url: 'https://xhv.semipool.com/api/pool/payments',
        dataType: 'json',
        cache: 'false'
    }).done(function(data){
		if (!data) exit;
		var newColor;
		if (data[0] && data[0].ts/1000 < xhvPool.pool_statistics.lastBlockFoundTime) newColor = "Red"; else newColor = false;
		if (data[0]) updateText('xhvLastPayment', timeSince(data[0].ts/1000), newColor);
    });
 // LOK
    $.ajax({
        url: 'https://lok.semipool.com/api/network/stats',
        dataType: 'json',
        cache: 'false'
    }).done(function(data){
		if (!data) exit;
        lokNetworkStats = data;
        updateText('lokNetworkHashrate', getReadableHashRateString(lokNetworkStats.difficulty / 120) + '/S');
		
		var newColor;
		if ((new Date()/ 1000) - data.ts > 30*60) newColor = "Red"; else newColor = false;
		updateText('lokNetworkTS', timeSince(lokNetworkStats.ts), newColor);
    });	
    $.ajax({
        url: 'https://lok.semipool.com/api/pool/stats/pplns',
        dataType: 'json',
        cache: 'false'
    }).done(function(data){
		if (!data) exit;
        lokPool = data;
        lokPrice = data.pool_statistics.price.usd; 
        updateText('lokPrice',(lokPrice * 1).toFixed(3) + ' USD' + " (over 24h : "+data.pool_statistics.price.change24h+"%)");
        updateText('lokProfit',((1000/lokNetworkStats.difficulty)*86400*7*(lokNetworkStats.value / 1000000000)*lokPrice).toFixed(3) + ' USD');
        updateText('lokPoolHashrate', getReadableHashRateString(lokPool.pool_statistics.hashRate) + '/S');
		updateText('lokMiners', lokPool.pool_statistics.miners);
		updateText('lokBlockFound', timeSince(lokPool.pool_statistics.lastBlockFoundTime));
    });
	$.ajax({
        url: 'https://lok.semipool.com/api/pool/payments',
        dataType: 'json',
        cache: 'false'
    }).done(function(data){
		if (!data) exit;
		var newColor;
		if (data[0] && data[0].ts/1000 < lokPool.pool_statistics.lastBlockFoundTime) newColor = "Red"; else newColor = false;
		if (data[0]) updateText('lokLastPayment', timeSince(data[0].ts/1000), newColor);
    });
 // ETNX
    $.ajax({
        url: 'http://cloud.electronero.org/api/network/stats',
        dataType: 'json',
        cache: 'false'
    }).done(function(data){
		if (!data) exit;
        etnxNetworkStats = data["12090"];
        updateText('etnxNetworkHashrate', getReadableHashRateString(etnxNetworkStats.difficulty / 60) + '/S');
		
		var newColor;
		if ((new Date()/ 1000) - data.ts > 30*60) newColor = "Red"; else newColor = false;
		updateText('etnxNetworkTS', timeSince(etnxNetworkStats.ts), newColor);
    });	
    $.ajax({
        url: 'http://cloud.electronero.org/api/pool/stats/pplns',
        dataType: 'json',
        cache: 'false'
    }).done(function(data){
		if (!data || !etnxNetworkStats) exit;
        etnxPool = data;
        etnxPrice = data.pool_statistics.price.usd; 
        updateText('etnxPrice',(etnxPrice * 1).toFixed(7) + ' USD' + " (over 24h : "+data.pool_statistics.price.change24h+"%)");
        updateText('etnxProfit',((1000/etnxNetworkStats.difficulty)*86400*7*(etnxNetworkStats.value / 100)*etnxPrice).toFixed(3) + ' USD');
        updateText('etnxPoolHashrate', getReadableHashRateString(etnxPool.pool_statistics.hashRate) + '/S');
		updateText('etnxMiners', etnxPool.pool_statistics.miners);
		updateText('etnxBlockFound', timeSince(etnxPool.pool_statistics.lastBlockFoundTime));
    });
	$.ajax({
        url: 'http://cloud.electronero.org/api/pool/payments',
        dataType: 'json',
        cache: 'false'
    }).done(function(data){
		if (!data || !etnxPool) exit;
		var newColor;
		if (data[0] && data[0].ts/1000 < etnxPool.pool_statistics.lastBlockFoundTime) newColor = "Red"; else newColor = false;
		if (data[0]) updateText('etnxLastPayment', timeSince(data[0].ts/1000), newColor);
    });
 // BBS
    $.ajax({
        url: 'https://bbs.semipool.com/api/network/stats',
        dataType: 'json',
        cache: 'false'
    }).done(function(data){
		if (!data) exit;
        bbsNetworkStats = data;
        updateText('bbsNetworkHashrate', getReadableHashRateString(bbsNetworkStats.difficulty / 120) + '/S');
		
		var newColor;
		if ((new Date()/ 1000) - data.ts > 30*60) newColor = "Red"; else newColor = false;
		updateText('bbsNetworkTS', timeSince(bbsNetworkStats.ts), newColor);
    });	
    $.ajax({
        url: 'https://bbs.semipool.com/api/pool/stats/pplns',
        dataType: 'json',
        cache: 'false'
    }).done(function(data){
		if (!data || !bbsNetworkStats) exit;
        bbsPool = data;
        bbsPrice = data.pool_statistics.price.usd; 
        updateText('bbsPrice',(bbsPrice * 1).toFixed(7) + ' USD' + " (over 24h : "+data.pool_statistics.price.change24h+"%)");
        updateText('bbsProfit',((1000/bbsNetworkStats.difficulty)*86400*7*(bbsNetworkStats.value / 100000000)*bbsPrice).toFixed(3) + ' USD');
        updateText('bbsPoolHashrate', getReadableHashRateString(bbsPool.pool_statistics.hashRate) + '/S');
		updateText('bbsMiners', bbsPool.pool_statistics.miners);
		updateText('bbsBlockFound', timeSince(bbsPool.pool_statistics.lastBlockFoundTime));
    });
	$.ajax({
        url: 'https://bbs.semipool.com/api/pool/payments',
        dataType: 'json',
        cache: 'false'
    }).done(function(data){
		if (!data || !bbsPool) exit;
		var newColor;
		if (data[0] && data[0].ts/1000 < bbsPool.pool_statistics.lastBlockFoundTime) newColor = "Red"; else newColor = false;
		if (data[0]) updateText('bbsLastPayment', timeSince(data[0].ts/1000), newColor);
    });
// PRICES AND PROFIT ITNS
    $.ajax({
        url: 'https://api.coinmarketcap.com/v1/ticker/lethean/?convert=USD',
        dataType: 'json',
        cache: 'false'
    }).done(function(data){
		if (!data || !itnsNetworkStats) exit;
        itnsPrice = data;
        updateText('itnsPrice',(itnsPrice[0].price_usd * 1).toFixed(4) + ' USD');
        updateText('itnsProfit',((1000/itnsNetworkStats.difficulty)*86400*7*(itnsNetworkStats.value / 100000000)*itnsPrice[0].price_usd).toFixed(3) + ' USD');	
    });	
//    $.ajax({
//        url: 'https://api.coinmarketcap.com/v1/ticker/ethereum-classic/?convert=USD',
//        dataType: 'json',
//        cache: 'false'
//    }).done(function(data){
//        etcPrice = data;
//		etcReward = 4;
//        updateText('etcPrice',(etcPrice[0].price_usd * 1).toFixed(3) + ' USD');
//        updateText('etcProfit',((10000000/etcNetworkStats[0].difficulty)*86400*7*etcReward*etcPrice[0].price_usd).toFixed(3) + ' USD');	
//    });	
	
// No market at coinmarket
}
fetchLiveStats();
updateText('xmrLastPayment', "N/A");
updateText('tubeLastPayment', "N/A");
updateText('xhvLastPayment', "N/A");
updateText('xtlLastPayment', "N/A");
updateText('msrLastPayment', "N/A");
updateText('lokLastPayment', "N/A");
updateText('etnxLastPayment', "N/A");
updateText('bbsLastPayment', "N/A");
setInterval(function(){
    fetchLiveStats();
}, 15*1000);
