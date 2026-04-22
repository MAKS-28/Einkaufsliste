let items = JSON.parse(localStorage.getItem("shoppingList")) || [];

function renderList() {

    let sortedItems = [...items].sort((a, b) => a.done - b.done);

    shoppingList.innerHTML = "";

    sortedItems.forEach(function(item) {

        let realIndex = items.indexOf(item);

        shoppingList.innerHTML += `
            <li class="${item.done ? 'done' : ''}">
                <input type="checkbox"
                       ${item.done ? "checked" : ""}
                       onchange="toggleItem(${realIndex})">

                ${item.name}

                <button onclick="deleteItem(${realIndex})">X</button>
            </li>
        `;
    });
}

function addItem() {
    let value = textfield.value;

    if (value.trim() === "") return;

    items.push({
        name: value,
        done: false
    });

    set(ref(db, "shoppingList"), items);

    textfield.value = "";
}

function deleteItem(index) {
    items.splice(index, 1);
    set(ref(db, "shoppingList"), items);
}


function toggleItem(index) {
    items[index].done = !items[index].done;
    set(ref(db, "shoppingList"), items);
}

textfield.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        addItem();
    }
});

function editItem(index) {
    let neuerText = prompt("Neuer Name:", items[index].name);

    if (neuerText === null || neuerText.trim() === "") return;

    items[index].name = neuerText;

    localStorage.setItem("shoppingList", JSON.stringify(items));
    renderList();
}

function clearList() {
    if (!confirm("Wirklich alles löschen?")) return;

    items = [];
    localStorage.setItem("shoppingList", JSON.stringify(items));
    renderList();
}

onValue(ref(db, "shoppingList"), (snapshot) => {
    items = snapshot.val() || [];
    renderList();
});