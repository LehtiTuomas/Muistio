// Get data from UI when Lisää- button is pressed
document.querySelector('.add__btn').addEventListener('click', Input);

// Get data from Ui when "Enter" is pressed
document.addEventListener('keypress', function (event) {

    if (event.keyCode === 13 || event.which === 13) {
        Input();
    }
});

// Create (almost) unique ID (there is a very tiny change it will make the same ID twice)
function IDgenerator() {
    return Math.random().toString(16).slice(2);
};

function Input() {
    let text, ID, ID2, ID3, status;
    // Create random ID numbers
    ID = IDgenerator();
    ID2 = IDgenerator();
    ID3 = IDgenerator();

    // Get the user input and create new item
    text = document.querySelector('.add__note').value;
    status = 0; // status for telling if the note is crossed or not
    newItem = new Data(ID, ID2, ID3, text, status)

    // Pushing all data to arrays
    StorageAll.allID.push(ID);
    StorageAll.allID2.push(ID2);
    StorageAll.allID3.push(ID3);
    StorageAll.allNotes.push(text);
    StorageAll.allStatus.push(status);


    Print(newItem);
};

// Data object for new notes
let Data = function (id, id2, id3, note, status) {
    this.id = id;
    this.id2 = id2;
    this.id3 = id3;
    this.note = note;
    this.status = status;
};

// Store all data to arrays for future use
let StorageAll = {
    allID: [],
    allID2: [],
    allID3: [],
    allNotes: [],
    allStatus: []
};

Init()

function Print(obj) {
    //if (document.querySelector('.add__note').value !== "") {
    if (obj.note !== "") {
        let html, newHtml;

        // Create HTML string with placeholder text
        html = '<div class="output__field"><div id="%id3%" class="output__text">%note%</div><div class="note__btns"><button class="done__btn" id="%id2%"><span class="material-icons">check_circle_outline</span></button><button class="delete__btn" id="%id%" ><span class="material-icons">remove_circle_outline</span></button></div></div>'

        // Replace placeholder text with data
        newHtml = html.replace('%id%', obj.id);
        newHtml = newHtml.replace('%note%', obj.note);
        newHtml = newHtml.replace('%id2%', obj.id2);
        newHtml = newHtml.replace('%id3%', obj.id3);

        // Insert the HTML into the dom
        document.querySelector('.print__list').insertAdjacentHTML('beforeend', newHtml);

        // Clear userinput
        document.querySelector('.add__note').value = '';

        // Delete item
        document.getElementById(obj.id).addEventListener('click', function (event) {
            let removeItem, index;

            // Delete item from the database
            index = StorageAll.allID.indexOf(obj.id)

            if (index > -1) {
                StorageAll.allID.splice(index, 1);
                StorageAll.allID2.splice(index, 1);
                StorageAll.allID3.splice(index, 1);
                StorageAll.allNotes.splice(index, 1);
                StorageAll.allStatus.splice(index, 1);

                // Update local storage
                StoreLocal()
            }

            // Delete from UI
            removeItem = event.currentTarget.parentNode.parentNode;
            removeItem.parentNode.removeChild(removeItem);

            console.log(StorageAll)

        });

        // Mark note done
        document.getElementById(obj.id2).addEventListener('click', function (event) {

            index = StorageAll.allID.indexOf(obj.id)

            if (StorageAll.allStatus[index] === 0) {
                document.getElementById(obj.id3).classList.add('on');

                // update "StorageAll" array
                StorageAll.allStatus[index] = 1;

                // Update local storage
                StoreLocal()


            } else {
                document.getElementById(obj.id3).classList.remove('on');
                obj.status = 0;

                // update "StorageAll" array
                StorageAll.allStatus[index] = 0;

                // Update local storage
                StoreLocal()
            }
        });
        // Save to local storage
        StoreLocal();
    }
};

function StoreLocal() {
    // Make all data array to string and stor them to local store
    window.localStorage.setItem('allItems', JSON.stringify(StorageAll))
}

function Init() {

    // Get data from local store
    let fromMemory = JSON.parse(window.localStorage.getItem('allItems'));

    // Push local store data to "StorageAll" array
    if (fromMemory) {

        for (let i = 0; i < fromMemory.allID.length; i++) {
            StorageAll.allID.push(fromMemory.allID[i]);
        }
        for (let i = 0; i < fromMemory.allID2.length; i++) {
            StorageAll.allID2.push(fromMemory.allID2[i]);
        }
        for (let i = 0; i < fromMemory.allID3.length; i++) {
            StorageAll.allID3.push(fromMemory.allID3[i]);
        }
        for (let i = 0; i < fromMemory.allNotes.length; i++) {
            StorageAll.allNotes.push(fromMemory.allNotes[i]);
        }
        for (let i = 0; i < fromMemory.allStatus.length; i++) {
            StorageAll.allStatus.push(fromMemory.allStatus[i]);
        }

        // Create new memoryObj objects
        for (let i = 0; i < StorageAll.allID.length; i++) {

            let memoryObj = {};

            memoryObj['id'] = StorageAll.allID[i];
            memoryObj['id2'] = StorageAll.allID2[i];
            memoryObj['id3'] = StorageAll.allID3[i];
            memoryObj['note'] = StorageAll.allNotes[i];
            memoryObj['status'] = StorageAll.allStatus[i];


            Print(memoryObj);
            Done(memoryObj);
        }
    }

};

function Done(obj) {
    // Mark note done on start
    index = StorageAll.allID.indexOf(obj.id)

    if (StorageAll.allStatus[index] === 1) {
        document.getElementById(obj.id3).classList.add('on');
    }
};