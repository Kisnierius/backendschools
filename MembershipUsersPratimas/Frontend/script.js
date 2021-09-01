
//const selectVilnius = document.getElementById('Vilnius');
//const selectKaunas = document.getElementById('Kaunas');
//const selectKlaipeda = document.getElementById('Klaipeda');
//
const btnID = function reply_click(clicked_id)
{
    return(clicked_id);
}


const handleResponseJSON = response => {
  if (response.ok) {
    return response.json()
  }
  throw new Error('Something went wrong');
};


async function Memberships() {
 // const URI = `http://localhost:3000/`;
 // const response = await fetch(URI);
 // const memberships = await response.json();
 const JSONPLACEHOLDER_URI = 'http://127.0.0.1:3000';
  const response = await fetch(JSONPLACEHOLDER_URI);
  const memberships = await response.json();


  console.log(memberships)
  displayMemberships(memberships);
}

//  displayMemberships(memberships)
//  console.log(objects)
//  selectVilnius.addEventListener('click', () => {
//    const vilniusObjects = objects.filter(object => object.city === 'Vilnius');
//    console.log(vilniusObjects)
//    createApartment(vilniusObjects)
//  })
//selectKaunas.addEventListener('click', () => {
//  const kaunasObjects = objects.filter(object => object.city === 'Kaunas');
//  console.log(kaunasObjects)
//  createApartment(kaunasObjects)
//})
//selectKlaipeda.addEventListener('click', () => {
//  const klaipedaObjects = objects.filter(object => object.city === 'Klaipeda');
//  console.log(klaipedaObjects)
//  createApartment(klaipedaObjects)}
//)
//}


function displayMemberships(memberships) {

  const body = document.querySelector("div#box");
  body.innerHTML = "";



  memberships.forEach(membership => {

    
    const memBox = document.createElement("div");

    //const img = document.createElement('img');
    //img.setAttribute("src", object.image);
    //img.setAttribute("width", "140");

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