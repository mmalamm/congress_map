const PP_API_KEY = 'zUfM4EKVMG0qQPHM6dFZ4p0x6X1XWfQ5fky8voBh';
$.ajax({
  url: 'https://api.propublica.org/congress/v1/115/senate/members.json',
  beforeSend: function(xhr) {
       xhr.setRequestHeader("X-API-Key", PP_API_KEY);
  }, success: (data) => {
    window.result_object = data.results;
    window.senators = data.results[0].members;
    mmm.forEach( state => {
      let sens = senators.filter(senator => senator.state === state.state_abbr);
      const partyColor = (sens) => {
        let repub = 0, dem = 0, othr = 0;
        sens.forEach(sen => {
          switch (sen.party) {
            case "R":
              repub++;
              break;
            case "D":
              dem++;
              break;
            default:
              othr++;
          }
        });
        switch ([repub,dem].toString()) {
          case '2,0':
            return '#B24C63';
          case '1,1':
            return '#6E28A3';
          case '0,2':
            return '#2B5CCE';
          default:
            return '#267543';
        }
      };
      state.color = partyColor(sens);
      state.style.fill = state.color;
    });
  }
});