document.addEventListener("DOMContentLoaded", function () {
    loadXMLData();
});

let databases = {};

function loadXMLData() {
    fetch('dashboard.xml')
        .then(response => response.text())
        .then(xmlString => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlString, "text/xml");

            // Process the XML and build the `databases` object
            const databaseNodes = xmlDoc.getElementsByTagName("database");
            const dbSelect = document.getElementById("databaseSelect");
            dbSelect.innerHTML = '<option value="">Select Database</option>'; // Clear previous options

            for (let i = 0; i < databaseNodes.length; i++) {
                const databaseName = databaseNodes[i].getAttribute("name");
                databases[databaseName] = {};

                // Populate the database dropdown
                const option = document.createElement("option");
                option.value = databaseName;
                option.textContent = databaseName;
                dbSelect.appendChild(option);

                const tableNodes = databaseNodes[i].getElementsByTagName("table");
                for (let j = 0; j < tableNodes.length; j++) {
                    const tableName = tableNodes[j].getAttribute("name");
                    databases[databaseName][tableName] = [];

                    const rowNodes = tableNodes[j].getElementsByTagName("row");
                    for (let k = 0; k < rowNodes.length; k++) {
                        let rowData = {};
                        const columns = rowNodes[k].children;
                        for (let col = 0; col < columns.length; col++) {
                            const columnName = columns[col].tagName;
                            rowData[columnName] = columns[col].textContent;
                        }
                        databases[databaseName][tableName].push(rowData);
                    }
                }
            }
        })
        .catch(error => console.error("Error loading XML:", error));
}

function updateTables() {
    const dbSelect = document.getElementById("databaseSelect");
    const tableSelect = document.getElementById("tableSelect");
    const selectedDatabase = dbSelect.value;

    // Clear the previous table options and reset table display
    tableSelect.innerHTML = '';
    document.getElementById("tableContainer").innerHTML = "Tabela";

    if (selectedDatabase) {
        // Remove the "Select Database" option from the dropdown
        if (dbSelect.firstElementChild && dbSelect.firstElementChild.value === "") {
            dbSelect.removeChild(dbSelect.firstElementChild);
        }

        const tables = Object.keys(databases[selectedDatabase]);
        if (tables.length > 0) {
            tables.forEach(table => {
                const option = document.createElement("option");
                option.value = table;
                option.textContent = table;
                tableSelect.appendChild(option);
            });

            // Automatically select the first table if available
            tableSelect.value = tables[0];

            // Display the first table
            showTable();
        } else {
            alert('No tables available for this database.');
        }
    }
}



function showTable() {
    const dbSelect = document.getElementById("databaseSelect");
    const tableSelect = document.getElementById("tableSelect");
    const tableContainer = document.getElementById("tableContainer");

    const selectedDatabase = dbSelect.value;
    const selectedTable = tableSelect.value;

    if (selectedDatabase && selectedTable) {
        const tableData = databases[selectedDatabase][selectedTable];
        let tableHTML = "<table border='1'><tr>";

        // Get the table headers
        const headers = tableData.length ? Object.keys(tableData[0]) : [];
        headers.forEach(header => {
            tableHTML += `<th>${header}</th>`;
        });
        tableHTML += "</tr>";

        // Get the table rows
        tableData.forEach(row => {
            tableHTML += "<tr>";
            headers.forEach(header => {
                tableHTML += `<td>${row[header]}</td>`;
            });
            tableHTML += "</tr>";
        });

        tableHTML += "</table>";

        // Display the table in the container
        tableContainer.innerHTML = tableHTML;
    } else {
        tableContainer.innerHTML = "Tabela";
    }
}
