const liffId = '2007032148-mxreYwe5';//'2007032148-a1zrG2rP';
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwIM0GsAx61Tqfpq7kHMzCYOdC47KjIQVMQO_R9OMa2iHh96RCpAu_-HCPE3m8rxAzcJA/exec';

document.addEventListener('DOMContentLoaded', function () {
  const docType = new URLSearchParams(window.location.search).get('docType');

  if (!docType || !['RFA', 'RFI', 'Letter_IN'].includes(docType)) {
    showError('กรุณาระบุประเภทเอกสารให้ถูกต้อง เช่น ?docType=RFA');
    return;
  }

  liff.init({ liffId })
    .then(async () => {
      if (!liff.isLoggedIn()) {
        // 🔁 Redirect กลับมาหน้าเดิมหลัง login
        liff.login({ redirectUri: window.location.href });
        return;
      }

      const profile = await liff.getProfile();
      const userId = profile.userId;
      const displayName = profile.displayName;

      document.getElementById('loadingText').innerText = `สวัสดีคุณ ${displayName} กำลังโหลดเอกสารประเภท ${docType}...`;

      const url = `${SCRIPT_URL}?userId=${encodeURIComponent(userId)}&displayName=${encodeURIComponent(displayName)}&buttonClicked=${encodeURIComponent(docType)}&cache=${Date.now()}`;

      fetch(url)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.lookerUrl) {
            document.getElementById('loader').style.display = 'none';
            document.getElementById('lookerFrame').src = data.lookerUrl;
            document.getElementById('lookerContainer').style.display = 'block';
          } else {
            showError('ไม่พบ Looker URL สำหรับเอกสารนี้');
          }
        })
        .catch(() => {
          showError('ไม่สามารถติดต่อเซิร์ฟเวอร์ได้');
        });
    })
    .catch((err) => {
      showError('ไม่สามารถเชื่อมต่อกับ LIFF ได้: ' + err.message);
    });
});

function showError(message) {
  document.getElementById('loader').style.display = 'none';
  document.getElementById('loadingText').style.display = 'none';
  const errorEl = document.getElementById('errorMessage');
  errorEl.style.display = 'block';
  errorEl.textContent = message;
}
