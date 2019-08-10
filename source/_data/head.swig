{%- if theme.google_analytics_.tracking_id %}
  <script>
    window.ga_tid = "{{ theme.google_analytics_.tracking_id }}"; 
    window.ga_api = "https://ga.artin.workers.dev/"; 
    (function () {
      function loadcfga() {
        var js = document.createElement('script');
        js.src = 'https://cdn.jsdelivr.net/npm/cfga@1.0.1';
        js.async = true
        document.head.appendChild(js);
      }

      var host = window.location.hostname;
      if (host !== "localhost" || !{{theme.google_analytics_.localhost_ignored}}) {
        loadcfga();
      }
    })();
  </script>
{%- endif %}
