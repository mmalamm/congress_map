window.ajax_success = function(data) {
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
};

var statesGeoJSON = 'https://d3js.org/us-10m.v1.json';

var svg = d3.select("svg");

var path = d3.geoPath();

d3.json(statesGeoJSON, function(error, us) {
if (error) throw error;

svg.append("g")
    .attr("class", "states")
  .selectAll("path")
  .data(topojson.feature(us, us.objects.states).features)
  .enter().append("path")
    .attr("d", path);

window.mmm = Array.from($(".states")[0].children);

let tooltip = d3.select('body')
                    .append('div')
                    .style('position','absolute')
                    .style('background','#002b55')
                    .style('padding','5px 15px')
                    .style('border','1px #999999 solid')
                    .style('opacity','0')
                    .style('border-radius', '5px');
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
const renderBtn = (num, name, st, party, tw_acc) => {
  // let nameTag = $(`#sen-name-${num}`);
  // let stateTag = $(`#sen-state-${num}`);
  // let twHandleTag = $(`sen-tw-handle-${num}`);
  // nameTag.replaceWith(`<h4 id='sen-name-${num}'>${name}</h4>`);
  // stateTag.replaceWith(`<h5 id='sen-state'>${st}</h5>`);

  let embedCode =  `<a class="twitter-timeline"
                href="https://twitter.com/${tw_acc}"
                data-tweet-limit="20">
                Tweets by ${tw_acc}</a>
                <script async src="https://platform.twitter.com/widgets.js"
                charset="utf-8"></script>`;

  let btnColor = (party) => {
    switch (party) {
      case 'R':
        return '#B24C63';
      case 'D':
        return '#2B5CCE';
      default:
        return '#267543';
    }
  };

  let btnDiv = $(`.btnDiv${num}`);
  btnDiv.empty();
  btnDiv.append(
    `
    <div class='${party}-tag btnDiv${num}'>
      <div class='btn-contents'>
      <img height='150px' width='120px' id='sen-img-${num}' />
      <p id='sen-info'>${name} (${party})
        <br>
        ${st}
      </p>
      </div>
    </div>
    <div id='twitter-timeline-container-${num}' >

    </div>
    `
  );
  renderImg(num, formatName(name));
  $(`#twitter-timeline-container-${num}`).append($(embedCode));
};


const handleClick = (e) => {
  let stateName = e.target.state_abbr;
  let sens = senators.filter( senator => senator.state === stateName );
  let sen_names = sens.map( senator => senator.first_name + ' ' + senator.last_name );

  renderBtn(0, sen_names[0], state_hash[stateName], sens[0].party, sens[0].twitter_account);
  renderBtn(1, sen_names[1], state_hash[stateName], sens[1].party, sens[1].twitter_account);
};

const formatName = (sen_name) => {
  let newname = sen_name.replace('Bob Casey','Bob Casey Jr.')
    .replace('Jack Reed','Jack Reed (politician)')
    .replace('Edward Markey', 'Ed Markey')
    .replace('Margaret Hassan', 'Maggie Hassan')
    .replace('Richard Durbin','Dick Durbin')
    .replace('Gary Peters','Gary Peters (politician)')
    .replace('Shelley Capito', 'Shelley Moore Capito')
    .replace('James Inhofe','Jim Inhofe')
    .replace('Charles Schumer', 'Chuck Schumer')
    .replace('Bernard Sanders', 'Bernie Sanders')
    .replace('Michael Enzi', 'Mike Enzi')
    .replace('Robert Menendez', 'Bob Menendez')
    .replace('Christopher Murphy', 'Chris Murphy (Connecticut politician)')
    .replace('Ron Johnson','Ron Johnson (U.S. politician)')
    .replace('Patrick Toomey','Pat Toomey')
    .replace(' III', '')
    .replace(' ', '%20');
    return newname;
};

const renderImg = (num, sen_name) => {
  $.getJSON(`https://en.wikipedia.org/w/api.php?action=query&titles=${sen_name}&format=json&prop=pageimages&origin=*`, function(data) {
      window.wiki_result = data.query.pages;
      appendImg(num, wiki_result[Object.keys(window.wiki_result)[0]]);
  });
};

const appendImg = (num, { thumbnail }) => {
  let piccy = thumbnail ? thumbnail.source : 'https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-128.png';
  piccy = piccy.replace(/\d+px/, '150px');
  $(`#sen-img-${num}`).attr('src', piccy);
};
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////





const state_ids_obj = { 0: "AR", 1: "CA", 2: "IL", 3: "KS", 4: "MS", 5: "OH", 6: "TX", 7: "AL", 8: "IA", 9: "LA", 10: "MN", 11: "MO", 12: "NE", 13: "AZ", 14: "CO", 15: "IN", 16: "MI", 17: "MT", 18: "NY", 19: "OR", 20: "VA", 21: "WY", 22: "NC", 23: "OK", 24: "TN", 25: "WI", 26: "AK", 27: "VT", 28: "ND", 29: "GA", 30: "ME", 31: "RI", 32: "WV", 33: "ID", 34: "SD", 35: "NM", 36: "WA", 37: "PA", 38: "FL", 39: "UT", 40: "KY", 41: "NH", 42: "SC", 43: "NV", 44: "HI", 45: "NJ", 46: "CT", 47: "MD", 48: "MA", 49: "DE"};
const state_hash = { "AL": "Alabama", "AK": "Alaska", "AS": "American Samoa", "AZ": "Arizona", "AR": "Arkansas", "CA": "California", "CO": "Colorado", "CT": "Connecticut", "DE": "Delaware", "DC": "District Of Columbia", "FM": "Federated States Of Micronesia", "FL": "Florida", "GA": "Georgia", "GU": "Guam", "HI": "Hawaii", "ID": "Idaho", "IL": "Illinois", "IN": "Indiana", "IA": "Iowa", "KS": "Kansas", "KY": "Kentucky", "LA": "Louisiana", "ME": "Maine", "MH": "Marshall Islands", "MD": "Maryland", "MA": "Massachusetts", "MI": "Michigan", "MN": "Minnesota", "MS": "Mississippi", "MO": "Missouri", "MT": "Montana", "NE": "Nebraska", "NV": "Nevada", "NH": "New Hampshire", "NJ": "New Jersey", "NM": "New Mexico", "NY": "New York", "NC": "North Carolina", "ND": "North Dakota", "MP": "Northern Mariana Islands", "OH": "Ohio", "OK": "Oklahoma", "OR": "Oregon", "PW": "Palau", "PA": "Pennsylvania", "PR": "Puerto Rico", "RI": "Rhode Island", "SC": "South Carolina", "SD": "South Dakota", "TN": "Tennessee", "TX": "Texas", "UT": "Utah", "VT": "Vermont", "VI": "Virgin Islands", "VA": "Virginia", "WA": "Washington", "WV": "West Virginia", "WI": "Wisconsin", "WY": "Wyoming" };

const handleHoverOn = (e) => {
  e.target.style.fill = '#FFFC61';
  tooltip.transition().style('opacity',1);
      tooltip.html(state_hash[e.target.state_abbr])
      .style('left',(e.pageX - 50)+'px')
      .style('top',(e.pageY + 50)+'px');
};

const handleHoverOff = (e) => {
  e.target.style.fill = e.target.color;
  tooltip.transition().style('opacity',0);
};

const handleFocus = (e) => {
  e.target.style.fill = '#C7C44B';
};

let iter = 0;

window.mmm.forEach( state => {
  state.special_id = iter;
  iter ++;
  state.state_abbr = state_ids_obj[state.special_id];
  state.onclick = handleClick;
  state.onmouseover = handleHoverOn;
  state.onmouseout = handleHoverOff;
  state.onfocus = handleFocus;

} );
svg.append("path")
    .attr("class", "state-borders")
    .attr("d", path(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; })));
});
