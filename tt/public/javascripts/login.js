function login(){
  setTimeout(function(){window.location.href = '/';}, 300)}

function Home(){
    setTimeout(function(){window.location.href = '/homemessage';}, 300)}
function render(id){
  window.location.href = '/viewmessage/' + id;
}
function renderOutbox(id){
  window.location.href = '/viewOutbox/' + id;
}

function logout(){
  window.location.href = '/logout';
}
function AddFriend(email){
  window.location.href = '/friend/' + email;
}
function  Changbutton(){
  window.alert("A");
  document.getElementById('#button').value = "Block";
}
