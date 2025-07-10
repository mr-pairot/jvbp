// script.js

async function getLookerUrl(buttonName) {
  const response = await fetch(`https://script.google.com/macros/s/AKfycbyfGJwJ72tjZ450U6STHXiUVcijGPJ_YNaNIffQjgUMFNZQ47uBJ1DOwhP4zq60tAc4ww/exec?buttonName=${buttonName}`);
  const data = await response.json();
  console.log('Fetched data:', data);
  return data.lookerUrl;
}

async function initLiff() {
  document.getElementById('loader').style.display = 'block';
  await liff.init({ liffId: window.liffId });
  console.log('LIFF initialized');

  if (!liff.isLoggedIn()) {
    liff.login();
  } else {
    const lookerUrl = await getLookerUrl(window.buttonName);
    loadLooker(lookerUrl);
    sendDataToSheet(window.buttonName);
  }
}

function loadLooker(url) {
  document.getElementById('iframe-container').innerHTML = `<iframe src="${url}" width="100%" height="600px" frameborder="0"></iframe>`;
  document.getElementById('loader').style.display = 'none';
}

async function sendDataToSheet(buttonName) {
  if (liff.isLoggedIn()) {
    const profile = await liff.getProfile();
    const userId = profile.userId;
    const displayName = profile.displayName;

    const data = {
      userId: userId,
      displayName: displayName,
      buttonClicked: buttonName
    };

    console.log('Sending data:', data);

    await fetch('https://script.google.com/macros/s/AKfycbyfGJwJ72tjZ450U6STHXiUVcijGPJ_YNaNIffQjgUMFNZQ47uBJ1DOwhP4zq60tAc4ww/exec', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    console.log('Data sent to sheet');
  }
}
