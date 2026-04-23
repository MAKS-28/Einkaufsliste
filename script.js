const firebaseConfig = {
    apiKey: "AIzaSyA...",
    authDomain: "einkaufsliste-3e0d6.firebaseapp.com",
    databaseURL: "https://einkaufsliste-3e0d6-default-rtdb.europe-west1.firebasedatabase.app",
  };
  
  firebase.initializeApp(firebaseConfig);
  const db = firebase.database();
  const params = new URLSearchParams(window.location.search);
  const listName = params.get("list") || "default";
  
  let items = [];
  
  // DOM Elemente
  const input = document.getElementById("textfield");
  const list = document.getElementById("shoppingList");
  
  // ENTER
  input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
          addItem();
      }
  });
  
  // LISTE RENDERN
  function renderList() {
      let sortedItems = [...items].sort((a, b) => a.done - b.done);
  
      list.innerHTML = "";
  
      sortedItems.forEach((item, index) => {
          list.innerHTML += `
              <li class="${item.done ? "done" : ""}">
                  <input type="checkbox" ${item.done ? "checked" : ""}
                  onchange="toggleItem(${index})">
  
                  ${item.name}
  
                  <button onclick="deleteItem(${index})">X</button>
              </li>
          `;
      });
  }
  
  // HINZUFÜGEN
  function addItem() {
      let value = input.value;
  
      if (value.trim() === "") return;
  
      items.push({
          name: value,
          done: false
      });
  
      firebase.database().ref("lists/" + listName).set(items);
  
      input.value = "";
  }
  
  // LÖSCHEN
  function deleteItem(index) {
      items.splice(index, 1);
  
      firebase.database().ref("lists/" + listName).set(items);
  }
  
  // TOGGLE
  function toggleItem(index) {
      items[index].done = !items[index].done;
  
      firebase.database().ref("lists/" + listName).set(items);
  }
  
  // ALLES LÖSCHEN
  function clearList() {
      if (!confirm("Wirklich alles löschen?")) return;
  
      items = [];
  
      firebase.database().ref("lists/" + listName).set(items);
  }
  
  // EDIT
  function editItem(index) {
    let neuerText = prompt("Neuer Name:", items[index].name);

    if (!neuerText || neuerText.trim() === "") return;

    items[index].name = neuerText;

    firebase.database().ref("lists/" + listName).set(items);
}
  
  // DATEN LADEN
  firebase.database().ref("lists/" + listName).on("value", (snapshot) => {
    items = snapshot.val() || [];
    renderList();
});