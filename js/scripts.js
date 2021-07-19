const search = document.querySelector('.search-container');
const searchBar = document.querySelector('#search')
const gallery = document.querySelector("#gallery");
let employees = [];

// added search function
search.insertAdjacentHTML('beforeend', 
  `<form action="#" method="get">
      <input type="search" id="search-input" class="search-input" placeholder="Search...">
  </form>`)


// added Modal div and elements that will be used.
document.body.insertAdjacentHTML('beforeend', `    
<div class="overlay hidden">
  <div class="modal">
      <button class="modal-close">X</button>
      <div class="modal-content"></div>
      <button class="prev">Previous</button>
      <button class="next">Next</button>
  </div>
</div>`)

// fetches 12 random users and runs the displayEmployee function.
fetch('https://randomuser.me/api/?nat=us&results=12')
    .then(res => res.json())
    .then(res => res.results)
    .then(displayEmployees)
    .catch(err => console.log(err))

// takes information from fetch request and appends to gallery.
function displayEmployees(employeeData) {
  employees = employeeData;
  let employeeHTML = '';
  employees.forEach((employee, index) => {
      let name = employee.name;
      let email = employee.email;
      let picture = employee.picture;
      let state = employee.location.state
      employeeHTML += `
          <div class="card" data-index="${index}">
              <img class="card-img" src="${picture.large}" />
              <div class="card-info-container">
              <h3 class="name" class="card-name cap">${name.first} ${name.last}</h3>
                  <p class="email">${email}</p>
                  <p class="address">${state}</p>
              </div>
          </div>`
  });
  gallery.innerHTML = employeeHTML;
}


// Takes  selected employee and creates modal with employees information.
function displayModal(index) {
    let {name, dob, phone, email, location:{city, street, state, postcode}, picture } = employees[index];
    let date = new Date(dob.date);
    overlay = document.querySelector('.overlay');
    const modalContainer = document.querySelector(".modal-content");
    const modalHTML = `
    <div>
    <img class="avatar img-thumbnail" src="${picture.large}" />
    <div class="text-container">
        <h2 class="name">${name.first} ${name.last}</h2>
        <p class="email">${email}</p>
        <p class="address">${state}</p>
        <hr />
        <p>${phone}</p>
        <p>Birthday:
        ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}</p>
        <p class="address"> ${street.number} ${street.name}, ${city} ${postcode}</p>
    </div>
    <div>
    `;
    overlay.classList.remove('hidden');
    modalContainer.innerHTML = modalHTML;
    nextIndex = parseInt(index) + 1;
    prevIndex = parseInt(index) - 1; 
}

// Event Listener for gallery which runs displayModal function and creates modal window.
gallery.addEventListener('click', e => {
  if (e.target !== gallery) {
      const card = e.target.closest('.card');
      index = card.getAttribute('data-index');
      displayModal(index);
      nxtBtn =  document.querySelector('.next');
      prvBtn =  document.querySelector('.prev');
      modalClose = document.querySelector(".modal-close");
  }
});

// Event listener for Next button
document.body.addEventListener('click', function(e) {
  if (e.target.classList.contains('next')) {
    if (nextIndex >= 12) {
      displayModal(0)
  } else { 
   displayModal(nextIndex)
  }
  }
})

// Event listener for prev button
document.body.addEventListener('click', function(e) {
  if (e.target.classList.contains('prev')) {
    if (prevIndex <= -1) {
      displayModal(11)   
    } else {
            displayModal(prevIndex)
    }
  }
})

// Event listener for close button
document.body.addEventListener('click', function(e) {
  if (e.target.classList.contains('modal-close')) {
    overlay.classList.add('hidden');
  }
})

// Event listener for Search box
document.body.addEventListener('keyup', function(e) {
    let input = document.querySelector('#search-input')
    if ( input !== '') {
      const search = e.target.value.toLowerCase();
      const names = document.querySelectorAll('.name')
      names.forEach(person => {
          let name = person.innerHTML;
          let parent = person.parentElement.parentElement;
          if (name.toLowerCase().indexOf(search.toLowerCase()) != -1){
              parent.style.display = 'flex'
          } else {
              parent.style.display = 'none';
          };
      });
    }

})



