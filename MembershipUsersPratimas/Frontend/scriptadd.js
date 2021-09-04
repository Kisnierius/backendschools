// EXTERNAL API
const JSONPLACEHOLDER_URI = 'http://127.0.0.1:3000';
//const JSONPLACEHOLDER_URI = '/';

//-- form
const formCreateMembership = document.querySelector('form');

function createMembershipFETCH(event) {
    event.preventDefault();
    
    const price = parseInt(document.querySelector('input[name="Price"]').value);
    const name = document.querySelector('input[name="Name"]').value.trim();
    const description = document.querySelector('input[name="Description"]').value;
    
    console.log(price, name, description);
    const membership = {description, price, name};
    console.log(membership);
    const options = {
      method: 'POST',
      body: JSON.stringify(membership),
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

// *** Events ***

formCreateMembership.addEventListener('submit', createMembershipFETCH);