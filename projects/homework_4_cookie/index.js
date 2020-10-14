/*
 ДЗ 7 - Создать редактор cookie с возможностью фильтрации

 7.1: На странице должна быть таблица со списком имеющихся cookie. Таблица должна иметь следующие столбцы:
   - имя
   - значение
   - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)

 7.2: На странице должна быть форма для добавления новой cookie. Форма должна содержать следующие поля:
   - имя
   - значение
   - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)

 Если добавляется cookie с именем уже существующей cookie, то ее значение в браузере и таблице должно быть обновлено

 7.3: На странице должно быть текстовое поле для фильтрации cookie
 В таблице должны быть только те cookie, в имени или значении которых, хотя бы частично, есть введенное значение
 Если в поле фильтра пусто, то должны выводиться все доступные cookie
 Если добавляемая cookie не соответствует фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 Если добавляется cookie, с именем уже существующей cookie и ее новое значение не соответствует фильтру,
 то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

import './cookie.html';

/*
 app - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то добавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */

const homeworkContainer = document.querySelector('#app');
// текстовое поле для фильтрации cookie
const filterNameInput = document.querySelector('#filter-name-input');
// текстовое поле с именем cookie
const addNameInput = document.querySelector('#add-name-input');
// текстовое поле со значением cookie
const addValueInput = document.querySelector('#add-value-input');
// кнопка "добавить cookie"
const addButton = document.querySelector('#add-button');
// таблица со списком cookie
const listTable = document.querySelector('#list-table tbody');

filterNameInput.addEventListener('input', function(e) {
    if (this.value !== '') {
        updateFilter(this.value);
    } else {
        listTable.innerHTML = '';
        insert()
    }

});


function isMatching(full, chunk) {
    return full.includes(chunk);
}

function updateFilter(filterValue) {

    listTable.innerHTML = '';

    for (const list in listCookie) {

        if (filterValue && isMatching(list, filterValue)) {

            let row = document.createElement("tr");
            const createNew = listTable.appendChild(row);

            createNew.innerHTML = `<td>${list}</td><td> ${listCookie[list]} </td><td><button>Delete</button></td>`;
        }
    }

}


function getCookie() {

    let listCookie = {};
    const decodedCookie = decodeURIComponent(document.cookie).split('; ');
    for (let index = 0; index < decodedCookie.length; index++) {
        const [name, value] = decodedCookie[index].split('=');
        listCookie[name] = value;
    }
    return listCookie;

}
const listCookie = getCookie();

if (addButton) {

    addButton.addEventListener('click', () => {

        let cookieName = addNameInput.value;
        let cookieValue = addValueInput.value;

        if (cookieName in listCookie) {

            document.cookie = encodeURIComponent(cookieName) + '=';
            document.cookie = encodeURIComponent(cookieName) + '=' + encodeURIComponent(cookieValue);

            for (let row of listTable.rows) {
                for (let cell of row.cells) {
                    if (cookieName === cell.innerText) {
                        cell.nextElementSibling.textContent = cookieValue
                    }

                }
            }

        } else {
            if (cookieName && cookieValue) {
                document.cookie = encodeURIComponent(cookieName) + '=' + encodeURIComponent(cookieValue);
                listCookie[cookieName] = cookieValue;
                let row = document.createElement("tr");
                const createNew = listTable.appendChild(row);
                createNew.innerHTML = `<td>${cookieName}</td><td> ${cookieValue} </td><td><button>Delete</button></td>`;

                addNameInput.value = '';
                addValueInput.value = '';

            }
        }

    });


}

function insert() {

    for (const key in listCookie) {
        if (listCookie.hasOwnProperty(key)) {

            const value = listCookie[key];
            let row = document.createElement("tr");
            const createNew = listTable.appendChild(row);

            createNew.innerHTML = `<td>${key}</td><td> ${value} </td><td><button>Delete</button></td>`;

        }
    }
}

insert();

if (listTable) {

    function removeCookie(sKey, sPath, sDomain) {
        document.cookie = encodeURIComponent(sKey) +
            "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" +
            (sDomain ? "; domain=" + sDomain : "") +
            (sPath ? "; path=" + sPath : "");
    }


    listTable.addEventListener('click', (e) => {
        e.preventDefault();
        if (event.target.tagName === 'BUTTON') {
            e.target.parentElement.parentElement.remove();
            let nameRemove = e.target.parentElement.previousElementSibling.previousElementSibling.innerText;
            removeCookie(nameRemove);
            delete listCookie[nameRemove];
        }
    });

}