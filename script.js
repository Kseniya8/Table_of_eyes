import { myJSON } from "./data.js"; //импортируем массив данных

/* ВЫВОД ДАННЫХ */

for (let key in myJSON) {
  let row = document.createElement('tr')
  row.innerHTML = `
          <td>${myJSON[key].name.firstName}</td>
          <td>${myJSON[key].name.lastName}</td>
          <td><span>${myJSON[key].about}</span></td>
          <td><a style = "background: ${myJSON[key].eyeColor}; 
                          font-size: 0">${myJSON[key].eyeColor}</a></td> `
  //формируем строку, добавляем цвет полю "глаз"
  document.querySelector('.table_eyes tbody').appendChild(row) //выводим данные в таблицу
}

/* ВЫВОД ПО 10 СТРОК */
let rows = document.querySelectorAll('table tr');
// скроем все строки после 11
rows.forEach((e, i) => e.style.display = i > 11 ? 'none' : 'table-row');

const button = document.querySelector(".button_More");
button.addEventListener("click", function more() {
  // счетчик 
  let count = 0;
  // перебираем все строки
  rows.forEach(el => {
    // если строка не видна и счетчик меньше 10
    if (el.style.display === 'none' && count < 10) {
      // показываем строку
      el.style.display = 'table-row';
      // увеличиваем счетчик 
      count++;
    }
  })
});

/* СОРТИРОВКА ПО ВОЗРАСТАНИЮ/УБЫВАНИЮ */

const theads = document.querySelectorAll(".th_captions");
theads.forEach(thead => thead.addEventListener("click", evt => getSort(evt)));

function getSort({ target }) {
  // Доступ к атрибуту data будет задан через объект dataset, можно и через getAttribute
  // Переключение если равен -1, то при -(-1) = 1, если -(1) = -1
  const order = (target.dataset.order = -(target.dataset.order || -1));
  // Событие происходит target -> th, target.parentNode -> tr
  // tr.cells -> всех <th> или <td>  
  const thList = Array.from(target.parentNode.cells);
  // Index - нажатого th
  const index = thList.indexOf(target);
  // Метод для правильного сравнения строк на разных языках
  const collator = new Intl.Collator(["en", "ru"], { numeric: true });
  // Функция сортировки использующая метод compare, и используемая внутри функции sort
  const comparator = (index, order) => (a, b) => {
    return (
      order * // order - переключатель, для того чтобы менять порядок сортировки: "с начала" или "с конца"
      collator.compare(a.children[index].textContent, b.children[index].textContent)
    );
  };
  // Коллекция элементов таблицы <tbody>
  const tablesBodies = Array.from(target.closest("table").tBodies);

  tablesBodies.forEach(tBody => {
    tBody.append(...Array.from(tBody.rows).sort(comparator(index, order))); // Добавляет (несколько) отсортированных узлов или строки в конец
  });
  thList.forEach(th => th.classList.toggle("sorted", th === target));
}

/* СКРЫТЬ/ПОКАЗАТЬ СТОЛБЕЦ */

const theadsSH = document.querySelectorAll(".td_show_hide");
theadsSH.forEach(thead => thead.addEventListener("click", evt => getShowHide(evt)));

function getShowHide({ target }) {
  const thList = Array.from(target.parentNode.cells);
  const index = thList.indexOf(target);

  const tablesBodies = Array.from(target.closest("table").tBodies[0].rows);

  if (index === 3) { //для столбца Цвет глаз
    tablesBodies.forEach(tB => {
      tB.children[index].classList.toggle("hideDisplay");
    });
  }
  else {
    tablesBodies.forEach(tB => {
      tB.children[index].classList.toggle("hideFont");
    });
  }
}

/* РЕДАКТИРОВАНИЕ СТРОКИ ПО КЛИКУ */
const tbody = document.querySelector('tbody');
tbody.addEventListener('click', function (e) {
  let trArray;

  if (e.target.parentElement.nodeName == "TR") { //проверка на выделение строки
    trArray = Array.from(e.target.parentNode.cells);
  }
  else { //иначе для блока span/a
    trArray = Array.from(e.target.parentNode.parentElement.cells);
  }

  document.getElementsByName("firstName")[0].value = trArray[0].innerText;
  document.getElementsByName("lastName")[0].value = trArray[1].innerText;
  document.getElementsByName("about")[0].value = trArray[2].innerText;
  document.getElementsByName("colorOfEye")[0].value = trArray[3].innerText;
});
