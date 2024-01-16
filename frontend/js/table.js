document.addEventListener("DOMContentLoaded", function () {
  // loading google chart package to create charts
  google.charts.load('current', {'packages':['corechart']});

  window.onload = function () {
    const csvData = JSON.parse(localStorage.getItem("csvData"));
    console.log(csvData);
    let tbody = document.getElementById("tbody");
    let thead = document.getElementById("thead");

    //dynamic headers

    const headers = csvData[0] ? Object.keys(csvData[0]) : []; //best practices
    const trheader = document.createElement("tr");
    headers.forEach((headerText) => {
      let th = document.createElement("th");
      // th.innerText = headerText;
      th.innerHTML=`${headerText}`
      const italic=document.createElement('i');
      italic.classList.add("fa-solid" ,"fa-angle-down","down-arrow-icon");
      th.appendChild(italic);
      trheader.appendChild(th);
    });
    thead.appendChild(trheader);

    //for other rows
   
    for(let i=0;i<csvData.length;i++){
        let tr=document.createElement('tr');
        let values=Object.values(csvData[i]);
        for(let j=0;j<values.length;j++){
            let td=document.createElement('td');
            td.innerText=values[j];
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }

    console.log("table created successfully");
    
    // search -bar

    const inputSearch=document.getElementById('input-search');
    inputSearch.addEventListener('input',function(event){
      const query=event.target.value.toLowerCase();
      console.log(query);
      let table=document.getElementById('my-table');
      const rows=table.getElementsByTagName('tr');
      const columnIndex=0;
      for(let i=1;i<rows.length;i++){
        const cell=rows[i].getElementsByTagName('td')[columnIndex];
        if(cell){
          let text=cell.textContent||cell.innerText;
          console.log(text,'text');
          if(text.toLowerCase().indexOf(query)>-1){
            rows[i].style.display=''
          }else{
            rows[i].style.display='none';
          }
        }
        

      }
      console.log("search is successfull");
    })

    //pagination function call
    changePage(0);
    //calling on onload
    populateColumnSelect();

    //based on column option value we are displaying the chart option
    document.getElementById('column-select').addEventListener('change',function(event){
      drawChart();
    
    })
    //sorting functionality
    attachSortListeners();


  };
  let currentPage=1;
  let totalrecordPerpage=100;   
  function changePage(move){
    let tbody=document.getElementById('tbody');
    let rows=tbody.getElementsByTagName('tr');
    let pageCount=Math.ceil((rows.length)/totalrecordPerpage);
    currentPage+=move;
    
    currentPage=Math.max(1,Math.min(currentPage,pageCount));
    for(let i=0;i<rows.length;i++){
      rows[i].style.display=(i>=(currentPage-1)*totalrecordPerpage)&&(i<(currentPage*totalrecordPerpage))?'':'none';
    }
    //updating the pagination status
    document.getElementById('pageInfo').innerText=`page ${currentPage} of ${pageCount}`;
  }
  
  //calling changePage on prev and next function
  
  document.getElementById('prev').addEventListener('click',(e)=>{
    changePage(-1);
  })
  document.getElementById('next').addEventListener('click',(e)=>{
    changePage(1);
  })
  
  // populating dropdown

  function populateColumnSelect(){
    const table=document.getElementById('my-table');
    const dropdown=document.getElementById('column-select')
    const headers=table.rows[0].cells; //get all the th of headers in array
    for(let i=0;i<table.rows.length;i++){
      const option=document.createElement('option');
      option.classList.add("dropdown-item");
      option.value=i;
      option.innerText=headers[i].innerText;
      dropdown.append(option);
    }

  }
  populateColumnSelect();
// function for draw chart
  function drawChart(){
    const selectedColumn = parseInt(document.getElementById('column-select').value);
    const table=document.getElementById('my-table');
    const dropdown=document.getElementById('column-select')
    const data=new google.visualization.DataTable();

    //add columns
    data.addColumn('string','Category');
    data.addColumn('number','Value');

    // Add rows from the selected columns
    for(let i=1;i<table.rows.length;i++){
      const row=table.rows[i];
      const category=row.cells[0].innerText;
      const value=parseFloat(row.cells[selectedColumn].innerText);
      data.addRow([category,value]);
    }

    //define the option
    const option={
      title:'user-selected column chart',
      hAxis:{title:'Category'},
      vAxis:{title:'Value'}
    }

    var chart=new google.visualization.ColumnChart(document.getElementById('chart_div'));
    chart.draw(data,option);
    



  }
   // Set a callback to run when the Google Visualization API is loaded.
  google.charts.setOnLoadCallback(drawChart);
  

  //sorting each column functionality
  function attachSortListeners() {
    // const headers = document.querySelectorAll("#myTable th");
    const table=document.getElementById('my-table');
    const rows=table.rows;
    console.log(rows);

    const headers=rows[0].cells;
    console.log(headers,'headers');
    for(let i=0;i<headers.length;i++){
      headers[i].addEventListener('click',(e)=>{
        sortTable(i);
      })
    }
}

function sortTable(columnIndex) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("my-table");
  switching = true;
  dir = "asc"; 

  while (switching) {
      switching = false;
      rows = table.rows;

      for (i = 1; i < (rows.length - 1); i++) {
          shouldSwitch = false;
          x = rows[i].getElementsByTagName("td")[columnIndex];
          y = rows[i + 1].getElementsByTagName("td")[columnIndex];

          if (dir == "asc") {
              if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                  shouldSwitch = true;
                  break;
              }
          } else if (dir == "desc") {
              if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                  shouldSwitch = true;
                  break;
              }
          }
      }
      if (shouldSwitch) {
          rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
          switching = true;
          switchcount++;
      } else {
          if (switchcount == 0 && dir == "asc") {
              dir = "desc";
              switching = true;
          }
      }
  }
}





























});



