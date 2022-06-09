//ipc renderer to get file paths
const { ipcRenderer } = require("electron");
//crypto to encrypt and decrypt
const crypto = require('crypto');
//fs to read and write to files
const { readFileSync, writeFileSync } = require("fs");

//to change pgs based on classes
function swapLoadingPage(from = new String, to = new String, moveLeft = new Boolean) {
    moveLeft == undefined ? moveLeft = true : null;
    from = "." + from
    to = "." + to
    document.querySelectorAll(from)[0].style.opacity = 0
    moveLeft ? document.querySelectorAll(from)[0].style.marginLeft = "100px" : null;
    setTimeout(() => {
        document.querySelectorAll(from)[0].style.display = "none"
        document.querySelectorAll(to)[0].style.display = "flex"
        setTimeout(() => {
            document.querySelectorAll(to)[0].style.opacity = 1
            document.querySelectorAll(to)[0].style.marginLeft = "0px"
        }, 100);
    }, 500);
}

//change the loading text
function changeLoaderText(text = new String) {
    document.querySelectorAll(".loader p")[0].innerHTML = text
}

//when encrypt files is click
document.querySelectorAll("#EncryptFiles")[0].addEventListener("click", () => {
    //set the loader text to
    changeLoaderText("")
    //change the mode
    currentMode = "encrypt"
    //change the mode
    //swap the page animation
    swapLoadingPage("pg1", "loader")
    setTimeout(() => {
        swapLoadingPage("loader", "pg2", false)
        document.querySelectorAll(".pg2 .step .top")[0].style.color = "#fff"
        document.querySelectorAll(".pg2 .step .top")[0].style.backgroundColor = "#008eff"
    }, 2000);
    //change the history of page swaping
    swapOnHistory = { from: "pg2 .sec1", to: "pg2 .sec2" }
})

//declaring vars
var currentMode = "";
var path = "", mx = "", pass = "", savePath = "", swapOnHistory = { from: "", to: "" };

document.querySelectorAll("#DecryptFiles")[0].addEventListener("click", () => {
    //set the loader text to
    changeLoaderText("")
    //change the mode
    currentMode = "decrypt"
    //change the mode
    swapLoadingPage("pg1", "loader")
    setTimeout(() => {
        swapLoadingPage("loader", "pg3", false)
        document.querySelectorAll(".pg3 .step .top")[0].style.color = "#fff"
        document.querySelectorAll(".pg3 .step .top")[0].style.backgroundColor = "#008eff"
    }, 2000);
    //change the history of page swaping
    swapOnHistory = { from: "pg3 .sec1", to: "pg3 .sec2" }
})

//ENCRYPT
//when click on import file btn
document.querySelectorAll(".pg2 #ImportFile")[0].addEventListener("click", async () => {
    //getting path
    var paths = await ipcRenderer.sendSync('getPath', "");
    path = await paths[0] || paths;

    if (path) {
        //adding path to recents
        var recents = JSON.parse(localStorage.getItem("recents")) || [];
        recents.push(path)
        localStorage.setItem("recents", JSON.stringify(recents))
        //displaying file name
        document.querySelectorAll(".pg2 #fileName")[0].innerHTML = path.split("\\")[path.split("\\").length - 1]
        //swaping pg & animation
        swapLoadingPage("pg2 .sec1", "pg2 .sec2")
        document.querySelectorAll(".pg2 .step .top")[1].style.color = "#fff"
        document.querySelectorAll(".pg2 .step .top")[1].style.backgroundColor = "#008eff"
    }
})
//selecting how to save the file
//replace
document.querySelectorAll(".pg2 #encryptAReplace")[0].addEventListener("click", () => {
    //setting mode to replace
    mx = "replace"
    //animation
    swapLoadingPage("pg2 .sec2", "pg2 .sec3")
    document.querySelectorAll(".pg2 .step .top")[2].style.color = "#fff"
    document.querySelectorAll(".pg2 .step .top")[2].style.backgroundColor = "#008eff"
})
//save
document.querySelectorAll(".pg2 #encryptASave")[0].addEventListener("click", async () => {
    //setting mode to save
    mx = "save"
    //getting path
    var path = await ipcRenderer.sendSync('getPath2', "");

    if (path) {
        //adding path to recents
        var recents = JSON.parse(localStorage.getItem("recents")) || [];
        recents.push(path)
        localStorage.setItem("recents", JSON.stringify(recents))
        savePath = path;
        //animation
        swapLoadingPage("pg2 .sec2", "pg2 .sec3")
        document.querySelectorAll(".pg2 .step .top")[2].style.color = "#fff"
        document.querySelectorAll(".pg2 .step .top")[2].style.backgroundColor = "#008eff"
    }
})
//on click on encrypt after entering password/ leave it empty
document.querySelectorAll(".pg2 #finish")[0].addEventListener("click", () => {
    //setting pass to entered password
    pass = document.querySelectorAll(".pg2 #password")[0].value
    //resting ui
    swapLoadingPage("pg2 .sec3", "pg2 .sec1")
    document.querySelectorAll(".pg2 .step .top").forEach(e => [
        e.style.color = "#008eff"
    ])
    document.querySelectorAll(".pg2 .step .top").forEach(e => {
        e.style.backgroundColor = "#fff"
    })
    swapLoadingPage("pg2", "loader")
    //calling process to do the need
    process()
})

//DECRYPT
//when click on import file btn
document.querySelectorAll(".pg3 #ImportFile")[0].addEventListener("click", async () => {
    //getting path
    var paths = await ipcRenderer.sendSync('getPath', "");
    path = await paths[0] || paths;

    if (path) {
        //adding path to recents
        var recents = JSON.parse(localStorage.getItem("recents")) || [];
        recents.push(path)
        localStorage.setItem("recents", JSON.stringify(recents))
        //displaying file name
        document.querySelectorAll(".pg3 #fileName")[0].innerHTML = path.split("\\")[path.split("\\").length - 1]
        //swaping pg & animation
        swapLoadingPage("pg3 .sec1", "pg3 .sec2")
        document.querySelectorAll(".pg3 .step .top")[1].style.color = "#fff"
        document.querySelectorAll(".pg3 .step .top")[1].style.backgroundColor = "#008eff"
    }
})
//selecting how to save the file
//replace
document.querySelectorAll(".pg3 #encryptAReplace")[0].addEventListener("click", () => {
    //setting mode to replace
    mx = "replace"
    //animation
    swapLoadingPage("pg3 .sec2", "pg3 .sec3")
    document.querySelectorAll(".pg3 .step .top")[2].style.color = "#fff"
    document.querySelectorAll(".pg3 .step .top")[2].style.backgroundColor = "#008eff"
})
document.querySelectorAll(".pg3 #encryptASave")[0].addEventListener("click", async () => {
    //setting mode to save
    mx = "save"
    //getting path
    var path = await ipcRenderer.sendSync('getPath2', "");
    if (path) {
        //adding path to recents
        var recents = JSON.parse(localStorage.getItem("recents")) || [];
        recents.push(path)
        localStorage.setItem("recents", JSON.stringify(recents))
        savePath = path;
        //animation
        swapLoadingPage("pg3 .sec2", "pg3 .sec3")
        document.querySelectorAll(".pg3 .step .top")[2].style.color = "#fff"
        document.querySelectorAll(".pg3 .step .top")[2].style.backgroundColor = "#008eff"
    }

})
//on click on encrypt after entering password/ leave it empty
document.querySelectorAll(".pg3 #finish")[0].addEventListener("click", () => {
    //setting pass to entered password
    pass = document.querySelectorAll(".pg3 #password")[0].value
    //resting ui
    swapLoadingPage("pg3 .sec3", "pg3 .sec1")
    document.querySelectorAll(".pg3 .step .top").forEach(e => [
        e.style.color = "#008eff"
    ])
    document.querySelectorAll(".pg3 .step .top").forEach(e => {
        e.style.backgroundColor = "#fff"
    })
    swapLoadingPage("pg3", "loader")
    //calling process to do the need
    process()
})

//this function does all the encryption and decryption
async function process() {
    //reading file contents
    var contents = await readFileSync(path, { "encoding": "base64url", "flag": "r" }), crypted;
    console.log(contents);
    //if mode is encrypt
    if (currentMode == "encrypt") {
        //changing text
        changeLoaderText("Encrypting " + path);
        //getting encrypted content, 
        //NOTE: here the 'encrypt' is added to chk later if the decrypted text is correct or not
        crypted = await encrypt(pass, "encrypt" + contents);
    } else if (currentMode == "decrypt") {
        //changing text
        changeLoaderText("Decrypting " + path);
        try {
            //getting text
            crypted = await decrypt(pass, contents);
        } catch (error) {
            //error means the entered password is wrong
            setTimeout(() => {
                changeLoaderText("")
            }, 5000);
            //alerting wrong password
            alert("Wrong Password");
            return null;

        }
        console.log(crypted);
        //as mentioned above if the decrypred ... 
        // content contains 'encrypt' ...
        //it means it is decrypted correctly
        if (crypted.slice(0, 7) == "encrypt") {
            //contains original content
            crypted = crypted.slice(7, crypted.length);
        } else {
            //false means the entered password is wrong
            setTimeout(() => {
                changeLoaderText("")
            }, 5000);
            //alerting wrong password
            alert("Wrong Password");
            return null;
        }
    }

    //if the mode is replace
    if (mx == "replace") {
        //we write to original file
        await writeFileSync(path, crypted, "base64url");
    } else if (mx == "save") {
        //else we write to given path
        await writeFileSync(savePath, crypted, "base64url");
    }
    //end the process by going back to pg1
    setTimeout(() => {
        swapLoadingPage("loader", "pg1", false)
    }, 5000);
}

//encryption algorithm 'aes-256-cbc'
//pls understand im lazy to write comments, sorry 😅
async function encrypt(password, content) {
    salt = await crypto.randomBytes(16);
    iv = await crypto.randomBytes(16);
    key = await crypto.pbkdf2Sync(password, salt, 100000, 256 / 8, 'sha256');

    cipher = await crypto.createCipheriv('aes-256-cbc', key, iv);

    await cipher.write(content);
    await cipher.end()

    encrypted = await cipher.read();

    return await Buffer.concat([salt, iv, encrypted]).toString('base64')
}

//decryption algorithm 'aes-256-cbc'
//pls understand im lazy to write comments, sorry 😅
async function decrypt(password, content) {
    encrypted = await Buffer.from(content, 'base64');
    const salt_len = iv_len = 16;

    salt = await encrypted.slice(0, salt_len);
    iv = await encrypted.slice(0 + salt_len, salt_len + iv_len);
    key = await crypto.pbkdf2Sync(password, salt, 100000, 256 / 8, 'sha256');

    decipher = await crypto.createDecipheriv('aes-256-cbc', key, iv);

    await decipher.write(encrypted.slice(salt_len + iv_len));
    await decipher.end();

    decrypted = await decipher.read();
    return await decrypted.toString();
}

//swaping tabs
document.querySelectorAll("#FileBased")[0].addEventListener("click", () => {
    swapLoadingPage("pg4", "pg1")
    swapLoadingPage("pg3", "pg1")
    swapLoadingPage("pg2", "pg1")
    document.querySelectorAll("#TextBased")[0].classList.remove("active")
    document.querySelectorAll("#FileBased")[0].classList.add("active")
})
document.querySelectorAll("#TextBased")[0].addEventListener("click", () => {
    swapLoadingPage("pg1", "pg4")
    swapLoadingPage("pg2", "pg4")
    swapLoadingPage("pg3", "pg4")
    document.querySelectorAll("#FileBased")[0].classList.remove("active")
    document.querySelectorAll("#TextBased")[0].classList.add("active")
})

//text based encryption

//styling the iframes
document.querySelectorAll("iframe")[0].contentDocument.body.contentEditable = true
document.querySelectorAll("iframe")[0].contentDocument.body.style.color = "#fff"
document.querySelectorAll("iframe")[0].contentDocument.body.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
document.querySelectorAll("iframe")[1].contentDocument.body.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
document.querySelectorAll("iframe")[1].contentDocument.body.style.color = "#fff"
document.querySelectorAll("iframe")[1].contentDocument.body.contentEditable = true

//when click on encrypt
document.querySelectorAll("#EncTB")[0].addEventListener("click", async () => {
    //getting content to be encrypted
    var content = await document.querySelectorAll("iframe")[0].contentDocument.body.innerHTML
    //gstting pass
    var pass = await document.querySelectorAll(".pg4 #password")[0].value
    //encrypting and display encrypted content
    //AGAIN NOTE THE "encrypt"
    document.querySelectorAll("iframe")[1].contentDocument.body.innerHTML = await encrypt(pass, "encrypt" + content);
})
document.querySelectorAll("#DecTB")[0].addEventListener("click", async () => {
    //getting content to be encrypted
    var content = document.querySelectorAll("iframe")[0].contentDocument.body.innerText
    //gstting pass
    var pass = document.querySelectorAll(".pg4 #password")[0].value
    var crypted;
    try {
        //getting decrypted text
        crypted = await decrypt(pass, content);
    } catch (error) {
        //password is wrong, and alerting it
        alert("Wrong Password");
        return null;
    };
    //same as before, the "encrypt" thing!
    if (crypted.slice(0, 7) == "encrypt") {
        crypted = crypted.slice(7, crypted.length);
    } else {
        //password is wrong, and alerting it
        alert("Wrong Password");
        return null;
    }
    //displaying the decrypted content
    document.querySelectorAll("iframe")[1].contentDocument.body.innerHTML = crypted;
})

//changing of wallpaper
document.querySelectorAll("#ChangeWallpaper")[0].addEventListener("click", () => {
    //path
    var path = ipcRenderer.sendSync("getPath");
    if (path) {
        //setting path to img
        document.querySelectorAll(".bg")[0].src = path;
        //storing path
        localStorage.setItem("bgPath", path);
    }
})

//if path exists then, bg was relpaced
if (localStorage.getItem("bgPath")) {
    //setting path to img
    document.querySelectorAll(".bg")[0].src = localStorage.getItem("bgPath");
}

//getting recents and displaying them
if (localStorage.getItem("recents")) {
    JSON.parse(localStorage.getItem("recents")).forEach(createRecentsOpt)
}

//creating the elm for the recents thing
function createRecentsOpt(p) {
    //this just creating the elm and styling
    var div = document.createElement("div");
    div.innerHTML = `
    <p>${p}</p>
    <span class="material-symbols-rounded">
        close
    </span>`
    div.classList.add("opt")
    document.querySelectorAll(".picker")[0].append(div);
    div.querySelectorAll("span")[0].addEventListener("click", (e) => {
        //when click on remove, we remove it
        div.remove();
        var recents = JSON.parse(localStorage.getItem("recents"))
        var index = recents.indexOf(p);
        if (index !== -1) {
            recents.splice(index, 1);
        }
        localStorage.setItem("recents", JSON.stringify(recents))
    })
    div.addEventListener("click", (e) => {
        //when clicked
        console.log(e);
        if (e.path[0] == div || e.path[0] == div.querySelector("p")) {
            //setting path
            path = p;
            //getting path to file name of choosen file
            document.querySelectorAll(".pg2 #fileName")[0].innerHTML = path.split("\\")[path.split("\\").length - 1]
            document.querySelectorAll(".pg3 #fileName")[0].innerHTML = path.split("\\")[path.split("\\").length - 1]
            //animation
            swapLoadingPage(swapOnHistory.from, swapOnHistory.to);

            //styling
            if (swapOnHistory.from == "pg3 .sec1") {
                document.querySelectorAll(".pg3 .step .top")[1].style.color = "#fff"
                document.querySelectorAll(".pg3 .step .top")[1].style.backgroundColor = "#008eff"
            }
            if (swapOnHistory.from == "pg2 .sec1") {
                document.querySelectorAll(".pg2 .step .top")[1].style.color = "#fff"
                document.querySelectorAll(".pg2 .step .top")[1].style.backgroundColor = "#008eff"
            }
            document.querySelectorAll(".pickerBlocker")[0].style.display = "none"
        }
    })
}

//opening and closing elms
document.querySelectorAll("#closePicker")[0].addEventListener("click", () => {
    document.querySelectorAll(".pickerBlocker")[0].style.display = "none"
})
document.querySelectorAll("#OpenHistory")[0].addEventListener("click", () => {
    document.querySelectorAll(".pickerBlocker")[0].style.display = "flex"
})
document.querySelectorAll("#OpenHistory")[1].addEventListener("click", () => {
    document.querySelectorAll(".pickerBlocker")[0].style.display = "flex"
})