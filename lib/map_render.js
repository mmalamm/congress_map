var statesGeoJSON = 'https://d3js.org/us-10m.v1.json';

var svg = d3.select("svg");

var path = d3.geoPath();

d3.json(statesGeoJSON, (error, us) => {
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
                    .style('border-radius', '5px')
                    .style('transition', 'opacity 0.3s ease');
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
const renderBtn = (num, name, st, sen) => {
  if (st === 'DC') {
    easterEggs(st);
  }

  //proplublica corrections
  switch (sen.first_name + ' ' + sen.last_name) {
    // case 'f_name l_name':
    //   sen.twitter_account = 'twitterAccount';
    //   break;
    case 'Rand Paul':
      sen.twitter_account = 'RandPaul';
      break;
    case 'Amy Klobuchar':
      sen.twitter_account = 'AmyKlobuchar';
      break;
    case 'Todd Young':
      sen.twitter_account = 'SenToddYoung';
      break;
    case 'Bill Cassidy':
      sen.twitter_account = 'BillCassidy';
      break;
    case 'Luther Strange':
      sen.twitter_account = 'LutherStrange';
      break;
    default:
      sen = sen;
  }
  //////
  let votePartyPct = (sen) => {

    switch (sen.title) {
      case 'President':
        return 'President of the United States';
      case 'Vice President':
        return 'Vice President of the United States';
      default:
        return `Votes with party <span style="font-weight:bolder;font-size:18px">${sen.votes_with_party_pct}%</span> of the time`;
    }
  };


  let embedCode =  `<a class="twitter-timeline"
                href="https://twitter.com/${sen.twitter_account}"
                data-tweet-limit="5">
                Tweets by ${sen.twitter_account}</a>
                <script async src="https://platform.twitter.com/widgets.js"
                charset="utf-8"></script>`;
  let btnDiv = $(`.btnDiv${num}`);
  btnDiv.empty().append(
    `
    <div>
      <div style='background-color: ${btnColor(sen.party)}' btnDiv${num}'>
        <div class='btn-contents'>
        <img height='240px' width='auto' class='sen-img'  id='sen-img-${num}' style='border: 10px solid ${btnColor(sen.party)}' />
        <p id='sen-info'><strong>${name} (${sen.party}-${sen.state})</strong>
          <br>
          <br>
          <img class='nav_logo' src='assets/images/twitter_logo.svg' /> ${sen.twitter_account}
          <br>
          Next Election: ${sen.next_election}
          <br>
          Phone: ${sen.phone}
          <br>
          <a href='https://${sen.domain}'>${sen.domain}</a>
          <br>
          <br>
          Office: ${sen.office.replace('Senate Office Building', '')}
          <br>
            ${st === 'USA' ? 'The White House' : 'Senate Office Building'}
          <br>
          <br>
            ${votePartyPct(sen)}
        </p>
      </div>
      <div class='xtra-info xtra-info-${num}'></div>
      </div>
      <div class='tw-feed' style='border: 10px solid ${btnColor(sen.party)};background-color:${btnColor(sen.party)}'  id='twitter-timeline-container-${num}' >

      </div>
    </div>
    `
  );
  renderImg(num, formatName(name));
  renderXtraInfo(num, sen);
  $(`#twitter-timeline-container-${num}`).append($(embedCode));
};

const btnColor = (party) => {
  switch (party) {
    case 'R':
      return '#B24C63';
    case 'D':
      return '#2B5CCE';
    default:
      return '#267543';
  }
};

const handleClick = (e) => {
  document.getElementById('sens-info').scrollIntoView();
  let stateName = e.target.state_abbr;
  easterEggs(stateName);

  let sens = senators.filter( senator => senator.state === stateName );
  let sen_names = sens.map( senator => senator.first_name + ' ' + senator.last_name );
  $('#heading').empty().append(`<h1 id='heading'>${state_hash[stateName]} Senators</h1>`);
  renderBtn(0, sen_names[0], state_hash[stateName], sens[0]);
  renderBtn(1, sen_names[1], state_hash[stateName], sens[1]);
};

const formatName = (sen_name) => {
  //correct names for wikipedia api
  let newname = sen_name
    .replace('Charles Grassley', 'Chuck Grassley') // Iowa
    .replace('John Kennedy', 'John Neely Kennedy') //Louisiana
    .replace('Dan Sullivan', 'Dan Sullivan (U.S. Senator)') //Alaska
    .replace('Michael Crapo', 'Mike Crapo') //Idaho
    .replace('Mike Lee', 'Mike Lee (U.S. politician)') //Utah
    .replace('Christopher Coons', 'Chris Coons')
    .replace('Thomas Carper', 'Tom Carper')
    .replace('Benjamin Cardin', 'Ben Cardin')
    .replace('Bob Casey','Bob Casey Jr.')
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
    .replace('Ron Johnson','Ron Johnson (American politician)')
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
  let profile_pic = thumbnail ? thumbnail.source : 'assets/images/congress-icon.svg';
  profile_pic = profile_pic.replace(/\d+px/, '200px');
  $(`#sen-img-${num}`).attr('src', profile_pic);
};

const renderXtraInfo = (num, sen) => {
  $.ajax({
    url: `https://api.propublica.org/congress/v1/members/${sen.id}.json`,
    beforeSend: function(xhr) {
         xhr.setRequestHeader("X-API-Key", PP_API_KEY);
    }, success: (data) => {
      let committees = '<div class="top-text">Committee Memberships:</div>';
      data.results[0].roles[0].committees.forEach(
        (committee) => {
          console.log(committee);
          committees += `<div>${committee.name}</div>`;
        }
      );
      $(`.xtra-info-${num}`).empty().append(`<div>${committees}</div>`);
    }
  });
  $.ajax({
    url: `https://api.propublica.org/congress/v1/members/${sen.id}/votes.json`,
    beforeSend: function(xhr) {
         xhr.setRequestHeader("X-API-Key", PP_API_KEY);
    }, success: (data) => {
      console.log(`votes for ${sen.last_name} (ID#: ${sen.id})`);
      console.log(data.results[0].votes);
      console.log('-------------------------------');
    }
  });
};
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////




const easterEggs = (stateName) => {
  if (stateName === 'DC') {
    let pres = { first_name: 'Donald',
      last_name: 'Trump',
      twitter_account: 'realDonaldTrump',
      party: 'R', state: 'NY',
      next_election: '2020',
      phone: '202-456-1414',
      domain: 'https://www.whitehouse.gov/',
      office: '1600 Pennsylvania Ave',
      title: 'President'
    };
    let v_pres = { first_name: 'Mike',
      last_name: 'Pence',
      twitter_account: 'VP',
      party: 'R', state: 'IN',
      next_election: '2020',
      phone: '202-456-1414',
      domain: 'https://www.whitehouse.gov/',
      office: '1600 Pennsylvania Ave',
      title: 'Vice President'
    };
    $('#heading').empty().append(`<h1 id='heading'>${state_hash[stateName]} Has No Senators</h1>`);
    renderBtn(0, 'Donald Trump', 'USA', pres);
    renderBtn(1, 'Mike Pence', 'USA', v_pres);

    return;
  }
};
const state_ids_obj = { 0: "AR", 1: "CA", 2: "IL", 3: "KS", 4: "MS", 5: "OH", 6: "TX", 7: "AL", 8: "IA", 9: "LA", 10: "MN", 11: "MO", 12: "NE", 13: "AZ", 14: "CO", 15: "IN", 16: "MI", 17: "MT", 18: "NY", 19: "OR", 20: "VA", 21: "WY", 22: "NC", 23: "OK", 24: "TN", 25: "WI", 26: "AK", 27: "VT", 28: "ND", 29: "GA", 30: "ME", 31: "RI", 32: "WV", 33: "ID", 34: "SD", 35: "NM", 36: "WA", 37: "PA", 38: "FL", 39: "UT", 40: "KY", 41: "NH", 42: "SC", 43: "NV", 44: "HI", 45: "NJ", 46: "CT", 47: "MD", 48: "MA", 49: "DE", 50: "DC"};
const state_hash = { "AL": "Alabama", "AK": "Alaska", "AZ": "Arizona", "AR": "Arkansas", "CA": "California", "CO": "Colorado", "CT": "Connecticut", "DE": "Delaware", "FL": "Florida", "GA": "Georgia", "HI": "Hawaii", "ID": "Idaho", "IL": "Illinois", "IN": "Indiana", "IA": "Iowa", "KS": "Kansas", "KY": "Kentucky", "LA": "Louisiana", "ME": "Maine", "MD": "Maryland", "MA": "Massachusetts", "MI": "Michigan", "MN": "Minnesota", "MS": "Mississippi", "MO": "Missouri", "MT": "Montana", "NE": "Nebraska", "NV": "Nevada", "NH": "New Hampshire", "NJ": "New Jersey", "NM": "New Mexico", "NY": "New York", "NC": "North Carolina", "ND": "North Dakota", "OH": "Ohio", "OK": "Oklahoma", "OR": "Oregon", "PA": "Pennsylvania", "RI": "Rhode Island", "SC": "South Carolina", "SD": "South Dakota", "TN": "Tennessee", "TX": "Texas", "UT": "Utah", "VT": "Vermont", "VA": "Virginia", "WA": "Washington", "WV": "West Virginia", "WI": "Wisconsin", "WY": "Wyoming", "DC": "Washington D.C."};

const handleHoverOn = (e) => {
  e.target.style.transition = 'fill 0.2s ease';
  e.target.style.fill = '#FFFC61';
  e.target.style.cursor = 'pointer';
  tooltip.transition().style('opacity',1);
      tooltip.html(state_hash[e.target.state_abbr])
      .style('pointer-events', 'none')
      .style('left',(e.pageX - 50)+'px')
      .style('top',(e.pageY + 50)+'px');
};

const handleHoverOff = (e) => {
  e.target.style.fill = e.target.color;
  tooltip.transition().style('opacity',0);
};

const handleFocus = (e) => {
  e.target.style.fill = '#C7C44B';
  e.target.style.outline = 'none';
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




    // cached coloring
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
          return '#7c3545';
        case '1,1':
          return '#4D1C72';
        case '0,2':
          return '#1E4090';
        default:
          return '#1A512E';
      }
    };
    state.color = partyColor(sens);
    state.style.fill = state.color;






} );
svg.append("path")
    .attr("class", "state-borders")
    .attr("d", path(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; })));
});
