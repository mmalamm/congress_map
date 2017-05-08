const PP_API_KEY = 'zUfM4EKVMG0qQPHM6dFZ4p0x6X1XWfQ5fky8voBh';
$.ajax({
  url: 'https://api.propublica.org/congress/v1/115/senate/members.json',
  beforeSend: function(xhr) {
       xhr.setRequestHeader("X-API-Key", PP_API_KEY);
  }, success: (data) => window.ajax_success(data)
});
