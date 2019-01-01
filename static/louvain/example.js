function createTable(tableData) {
  var table = document.createElement("table");
  var tableBody = document.createElement("tbody");

  tableData.forEach(function(rowData) {
    var row = document.createElement("tr");

    rowData.forEach(function(cellData) {
      var cell = document.createElement("td");
      cell.appendChild(document.createTextNode(cellData));
      row.appendChild(cell);
    });

    tableBody.appendChild(row);
  });

  table.appendChild(tableBody);
  document.body.appendChild(table);
}

function createTableX(tableData) {
  var table = document.createElement("table");
  var tableBody = document.createElement("tbody");

  tableData.forEach(function(rowData) {
    var row = document.createElement("tr");
    console.log(Object.keys(rowData));
    Object.keys(rowData).forEach(function(cellData) {
      console.log(cellData);
      var cell = document.createElement("td");
      cell.appendChild(document.createTextNode(rowData[cellData]));
      row.appendChild(cell);
    });

    tableBody.appendChild(row);
  });

  table.appendChild(tableBody);
  document.body.appendChild(table);
}

function createTableFromX(obj) {
  var table = document.createElement("table");
  var tableBody = document.createElement("tbody");

  for (var i = 0; i < obj.length; i++) {
    var tr = "<tr>";
    console.log(obj[i]);
    /* Verification to add the last decimal 0 */
    // if (obj[i].value.toString().substring(obj[i].value.toString().indexOf('.'), obj[i].value.toString().length) < 2)
    //     obj[i].value += "0";

    /* Must not forget the $ sign */
    tr +=
      "<td>" +
      obj[i].source.toString() +
      "</td>" +
      "<td>" +
      obj[i].target.toString() +
      "</td>" +
      "<td>" +
      obj[i].weight.toString() +
      "</td></tr>";

    /* We add the table row to the table body */
    tableBody.innerHTML += tr;
  }
  table.appendChild(tableBody);
  document.body.appendChild(table);
}
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
function getRandomFloat(max) {
  return Math.random() * Math.floor(max);
}
Array.prototype.sample = function(){
  return this[Math.floor(Math.random()*this.length)];
}
function getRandomSubarray(arr, size) {
  var shuffled = arr.slice(0), i = arr.length, temp, index;
  while (i--) {
      index = Math.floor((i + 1) * Math.random());
      temp = shuffled[index];
      shuffled[index] = shuffled[i];
      shuffled[i] = temp;
  }
  return shuffled.slice(0, size);
}