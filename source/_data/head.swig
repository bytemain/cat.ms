{%- if theme.google_analytics_.tracking_id %}
  <script src="https://cdn.jsdelivr.net/npm/cfga@1.0.1" async></script>
  <script>
    window.ga_tid = "{{ theme.google_analytics_.tracking_id }}"; 
    window.ga_api = "https://ga.artin.workers.dev/"; 
  </script>
{%- endif %}
