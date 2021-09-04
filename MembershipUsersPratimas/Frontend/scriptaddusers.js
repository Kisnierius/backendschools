// EXTERNAL API
const JSONPLACEHOLDER_URI = 'http://127.0.0.1:3000/users';
//const JSONPLACEHOLDER_URI = '/';

//-- form
const formCreateusers = document.querySelector('form');

function createUserFETCH(event) {
    event.preventDefault();
    
    const name = document.querySelector('input[name="Firstname"]').value.trim();
    const surname = document.querySelector('input[name="Lastname"]').value.trim();
    const email = document.querySelector('input[name="email"]').value;
    const serviceId = document.querySelector('select[name="selectmem"]').value;

    
    console.log(name, surname, email, serviceId);
    const user = {name, surname, email, serviceId};
    console.log(user);
    const options = {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    };
    fetch(JSONPLACEHOLDER_URI, options)
      .then(response => {
        if(response.ok) {
          return response.json();
        }
        throw new Error("Creating new membership failed");
      })
      .then(data => document.getElementById('message').textContent = `Membership was created`)
      .catch(error => document.getElementById('message').textContent = error.message);
  }

  formCreateusers.addEventListener('submit', createUserFETCH);

  //////////////////////// Get Membership ID:

const handleResponseJSON = response => {
  if (response.ok) {
    return response.json()
  }
  throw new Error('Something went wrong');
};

// paimam membership name pagal id is memberships kolekcijos
async function Memberships() {
 const JSONPLACEHOLDER_URI = 'http://127.0.0.1:3000';
  const response = await fetch(JSONPLACEHOLDER_URI);
  const memberships = await response.json();


  console.log(memberships)
  displayMemberships(memberships);
}

// ikeliam paimto membership name i select boxa
function displayMemberships(memberships) {

  const body = document.querySelector("select#selectmem");
  body.innerHTML = "";
  memberships.forEach(membership => {

    const memBox = document.createElement("option");
    memBox.value = membership._id;
    memBox.innerText = membership.name
      body.append(memBox);
  })
}

  
Memberships()