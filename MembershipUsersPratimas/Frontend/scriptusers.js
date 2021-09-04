
// order busena sortinimui
const order = {
    isAsc: true
  };

  // patikrinam response
const handleResponseJSON = response => {
  if (response.ok) {
    return response.json()
  }
  throw new Error('Something went wrong');
};

// uzklausiam userius su sortinimu
async function loadUsers() {
 const JSONPLACEHOLDER_URI = `http://localhost:3000/users/${order.isAsc ? 'asc' : 'dsc'}`;
  const response = await fetch(JSONPLACEHOLDER_URI);
  const users = await response.json();
  console.log(users)
  displayUsers(users);
}
// keliam useriu info i html
function displayUsers(users) {

  const body = document.querySelector("div#box");
  body.innerHTML = "";

  users.forEach(user => { 
    const userBox = document.createElement("div");

    const nameSurname = document.createElement('div')
    const name = document.createElement('span')
    name.innerText = user.name;

    const surname = document.createElement('span')
    surname.innerText = user.surname;

    const email = document.createElement('div')
    email.innerText = user.email;

    const membership = document.createElement('div')
    membership.innerText = user.membershipName;

    nameSurname.append(name, surname)
     userBox.append( nameSurname, email, membership);
      body.append(userBox);
  })
}

  loadUsers()

//sortinimo event listeneris

  document.getElementById('sort').addEventListener('click', event => {

    if (order.isAsc) {
      event.target.innerText = 'Sorting by name: DSC';
    } else {
      event.target.innerText = 'Sorting by name: ASC';
    };
    order.isAsc = !order.isAsc;
    console.log(order);
    loadUsers();
  });




