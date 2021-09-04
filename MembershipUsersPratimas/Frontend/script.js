// clicked id - atskiru memebershipu trynimui
const btnID = function reply_click(clicked_id)
{
    return(clicked_id);
}

// patikrinam response
const handleResponseJSON = response => {
  if (response.ok) {
    return response.json()
  }
  throw new Error('Something went wrong');
};

// uzsiklausiam memberships is db
async function Memberships() {
 const JSONPLACEHOLDER_URI = 'http://127.0.0.1:3000';
  const response = await fetch(JSONPLACEHOLDER_URI);
  const memberships = await response.json();
  console.log(memberships)
  displayMemberships(memberships);
}

// sukeliam memberships data i html
function displayMemberships(memberships) {

  const body = document.querySelector("div#box");
  body.innerHTML = "";

  memberships.forEach(membership => {
    const memBox = document.createElement("div");
    const pricename = document.createElement('div')
    const name = document.createElement('span')
    name.innerText = membership.name;
    const price = document.createElement('span')
    price.innerText = membership.price;
    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.addEventListener('click', async () => {
      await deleteMember(membership._id);
      Memberships();
    })
    const description = document.createElement('div')
    description.innerText = membership.description;
    description.setAttribute("maxwidth", "100");
    pricename.append( price, name)
     memBox.append( pricename, description, deleteButton);
      body.append(memBox);
  })
}

// atskiru membershipu trynimas pagal id
  function deleteMember(id) {
    return fetch(`http://localhost:3000/${id}`, {
      method: 'DELETE'
    }).then(response => {
      if (!response.ok) {
        throw new Error('Failed to delete membership');
      }
      console.log('Membership deleted');
    }).catch(error => alert(error));
  }
  
Memberships()