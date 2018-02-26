chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    return {
      redirectUrl: details.url.replace(/(ajax\.googleapis|cdnjs\.cloudflare)\.com\/ajax\/libs\//, 'lib.baomitu.com/')
    };
  },
  {
    urls: [
        "*://ajax.googleapis.com/ajax/libs/*", "*://cdnjs.cloudflare.com/ajax/libs/*"
    ],
    types: ["script"]
  },
  ["blocking"]
);
chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    var content = '';
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
		if (0 === response.errno) {
          content = response.data.replace(/\/\*.*?\*\//gm, '').replace(/\s+/gm, ' ').replace(/\s*([;:,\{\}])\s*/g, '$1');
		  console.log(content);
        }
      }
    };
	xhr.open('GET', 'https://cdn.baomitu.com/index/fontGenerator?url=' + encodeURIComponent(details.url), false);
	xhr.send();
	console.log('sent');
	console.log(content);
    return {
      redirectUrl: 'data:text/css;charset=UTF-8,' + encodeURIComponent(content)
    };
  },
  {
    urls: [
        "*://fonts.googleapis.com/*"
    ],
    types: ["stylesheet"]
  },
  ["blocking"]
);