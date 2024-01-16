document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("container");
  const fileInput = document.getElementById("csv-files");
  const validMimeTypes = ['text/csv', 'application/vnd.ms-excel'];
  fileInput.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    //client side file validation to check uploaded file is csv or not
    
    if (!file) {
      console.log("file does not exist");
      alert('file does not exist');
      return;
    }
    const fileType=file.type;
    if(!validMimeTypes.includes(fileType)){
      alert('not a valid csv file');
      event.target.value='';
      return;
    }
    
    const formData = new FormData();
    formData.append("csvFile", file);
    try {
      const respone = await fetch("http://localhost:3000/file-upload", {
        method: "POST",
        body: formData,
      });
      if (respone.ok) {
        console.log("file uploaded successfully");
        fetchFiles();
      } else {
        console.log("filed upload failed");
      }
    } catch (error) {
      console.log(error + "error");
    }
  });

  async function fetchFiles() {
    try {
      const response = await fetch("http://localhost:3000/get-uploaded-files");

      // Check if the response is successful
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const files = await response.json();

      if (container.innerHTML !== "") {
        container.innerHTML = "";
      }

      console.log(files, "files");

      files.forEach((element) => {
        const listItem = document.createElement("li");
        listItem.classList.add("list-group-item","list-group-item-action","list-group-item-success")
        const items = `<a href="../html/table.html" type="button" class="dynamicData">${element.csvFileName}</a>`;
        listItem.innerHTML = items;
        container.appendChild(listItem);
      });
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  }

  let csvFileData = "";
  container.addEventListener("click", async function (event) {
    if (event.target.className === "dynamicData") {
      const csvFileName = event.target.innerText;
      console.log(csvFileName, "name");

      // API call by passing URL parameter as textData (filename);
      try {
        const response = await fetch(
          `http://localhost:3000/csv-data?filename=${csvFileName}`
        );
        // console.log(typeof response,'response');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data, "data...");
        //putting in local storage
        if (!localStorage.getItem("csvData")) {
          localStorage.setItem("csvData", JSON.stringify(data));
        }else{
          localStorage.clear();
          localStorage.setItem('csvData',JSON.stringify(data));
        }

        createTable(data); // Assuming createTable can handle JSON data
        csvFileData = data; // Store the parsed data
        console.log(csvFileData, "csv data....");
      } catch (error) {
        console.error("Error fetching CSV data:", error);
      }
    }
  });

  function createTable(data) {
    console.log("create table function");
  }
  window.onload = function () {
    fetchFiles();
    createTable(csvFileData);
  };
});



