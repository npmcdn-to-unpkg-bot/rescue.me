var shelters = JSON.parse(data);
var imgHTML = '<img alt=\"140x140\" class=\"img-circle\" src=\"data:image\/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI\/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMTQwIiBoZWlnaHQ9IjE0MCIgdmlld0JveD0iMCAwIDE0MCAxNDAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjwhLS0KU291cmNlIFVSTDogaG9sZGVyLmpzLzE0MHgxNDAKQ3JlYXRlZCB3aXRoIEhvbGRlci5qcyAyLjYuMC4KTGVhcm4gbW9yZSBhdCBodHRwOi8vaG9sZGVyanMuY29tCihjKSAyMDEyLTIwMTUgSXZhbiBNYWxvcGluc2t5IC0gaHR0cDovL2ltc2t5LmNvCi0tPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PCFbQ0RBVEFbI2hvbGRlcl8xNTZkODRiYjUzMiB0ZXh0IHsgZmlsbDojQUFBQUFBO2ZvbnQtd2VpZ2h0OmJvbGQ7Zm9udC1mYW1pbHk6QXJpYWwsIEhlbHZldGljYSwgT3BlbiBTYW5zLCBzYW5zLXNlcmlmLCBtb25vc3BhY2U7Zm9udC1zaXplOjEwcHQgfSBdXT48L3N0eWxlPjwvZGVmcz48ZyBpZD0iaG9sZGVyXzE1NmQ4NGJiNTMyIj48cmVjdCB3aWR0aD0iMTQwIiBoZWlnaHQ9IjE0MCIgZmlsbD0iI0VFRUVFRSIvPjxnPjx0ZXh0IHg9IjQ0LjY4NzUiIHk9Ijc0LjM2NDA2MjUiPjE0MHgxNDA8L3RleHQ+PC9nPjwvZz48L3N2Zz4=\" data-holder-rendered=\"true\" style=\"width: 140px; height: 140px;\">'; // temporary gray image as a placeholder until images are addded to the data
var filters = []; // a variable that will hold the current search query
var theQuery = document.getElementById('q-input'); // the HTML item that the user will type in
var theSuggestions = document.getElementById('q-suggestions'); // the HTML list that will display search suggestions
var theSearch = document.getElementById('search');

theSearch.setAttribute('data-action', 'showBreed');

theQuery.addEventListener('input', displaySuggestions);
document.body.addEventListener('click', handleClick);

function handleClick (clicked) {
  var what = '';
  var content = '';
  var target = clicked.target;

  if (target.hasAttribute('data-action')) {
    what = target.getAttribute('data-action');
  }

  if (target.hasAttribute('data-content')) {
    var content = target.getAttribute('data-content');
  }

  switch (what) {
    case 'setQuery':
      setQuery(content);
      break;
    case 'showBreed':
      for (i = 0; i < filters.length; i++) {
        if (filters[i].type === 'breed') {
          filters.splice(i, 1);
        }
      }
      if (content === '') { content = theQuery.value };
      if (content !== '') {
        filters.push({type: 'breed', value: content});
      }
      
      display(shelters);
      break;
  }
}

function setQuery(content) {
    theQuery.value = content;
    query = content;
    clear(theSuggestions);
}

function clear(element) {
  while(element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function displaySuggestions() {
  var value = theQuery.value.toLowerCase();
  matches = [];

  if (value !== '') {
    for (var item in animals) {
      for (var i = 0; i < animals[item].breeds.length; i++) {
        if (animals[item].breeds[i].toLowerCase().indexOf(value) !== -1) {
          matches.push(animals[item].breeds[i]);
        }
      }
    }
  }

  clear(theSuggestions);

  matches.sort(); // sort alphabtically
  matches.sort(function(a,b) { // and then by how soon our query appears
    return (a.toLowerCase().indexOf(value) - b.toLowerCase().indexOf(value));
  });

  for (var j = 0; j < matches.length && j < 10; j++) {
    if (!((matches.length === 1) && (matches[0].toLowerCase() === value))) {
      var theSuggestion = document.createElement('li');
      theSuggestion.classList.add('list-group-item');
      theSuggestion.setAttribute('data-action', 'setQuery');
      theSuggestion.setAttribute('data-content', matches[j]);
      theSuggestion.textContent = matches[j];
      theSuggestions.appendChild(theSuggestion);
    }
  }
}

function display (shelters) {
  var theResults = document.getElementById('results');

  clear(theResults);

  var count = 0;

  for (var i = 0; i < shelters.length; i++) {
    for (j = 0; j < shelters[i].pets.length; j++) {
      if (shouldDisplay(i, j)) {
        var theRow = createPanel(shelters[i], j);
        theResults.appendChild(theRow);
        count++;
      }
    }
  }

  theEntry = document.createElement('div');
  theEntry.textContent = count;
  theResults.appendChild(theEntry);
}

function shouldDisplay(shelter, pet) {
  var should = true;

  for (var i = 0; i < filters.length; i++) {
    switch (filters[i].type) {
      case 'breed':
        should = (shelters[shelter].pets[pet].breed.toLowerCase() === filters[i].value.toLowerCase());
    }
  }

  return should;
}

function createPanel (shelter, pet) {
  var theRow = document.createElement('div');  // create a div for the resulting item
  theRow.classList.add('col-md-4', 'entry');
  var thePanel = document.createElement('div');
  thePanel.classList.add('panel','panel-default');

  var thePanelBody = document.createElement('div');
  thePanelBody.classList.add('panel-body');
  thePanel.appendChild(thePanelBody);

  var theImageRow = document.createElement('div');
  theImageRow.classList.add('row', 'center-contents');
  theImageRow.innerHTML = imgHTML;
  thePanelBody.appendChild(theImageRow);

  var thePetName = document.createElement('h5');
  thePetName.textContent = shelter.pets[pet].name;
  thePetName.classList.add('center-contents');
  thePanelBody.appendChild(thePetName);

  var theHR = document.createElement('hr');
  thePanelBody.appendChild(theHR);

  var theBreed = document.createElement('p');
  theBreed.textContent = shelter.pets[pet].breed;
  thePanelBody.appendChild(theBreed);

  var theAgeGenderSize = document.createElement('p');
  theAgeGenderSize.textContent =
  parseInt(shelter.pets[pet].age/12) + ' yrs '
  + parseInt(shelter.pets[pet].age%12) + ' mos | '
  + shelter.pets[pet].gender + ' | '
  + 'small'; // temp until data includes weight
  // shelters[i].pets[j].weight + ' | ';
  thePanelBody.appendChild(theAgeGenderSize);

  var theRescueName = document.createElement('p');
  theRescueName.textContent = shelter.name;
  thePanelBody.appendChild(theRescueName);

  var theCityState = document.createElement('p');
  theCityState.textContent =
  shelter.address.city + ' '
  + shelter.address.state;

  thePanelBody.appendChild(theCityState);
  theRow.appendChild(thePanel);

  return theRow;
}

display(shelters);
