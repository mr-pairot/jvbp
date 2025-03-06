 <iframe id="myframe" class="responsive-iframe" src="" allowFullScreen></iframe>
 <script>
    const apps = new URL(window.location);
    const formUrl = apps.searchParams.get('apps');
    const url = decodeURIComponent(formUrl)
          document.getElementById('myframe').src = url
  </script>
