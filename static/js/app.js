// Variable to hold the subjectID input; Value is 0 for Creating the initial first value of Samples.json
var subjectID=0;

d3.selectAll("#selDataset").on("change",optionChanged);


// optionChanged function to read in selected Student_ID and show charts
function optionChanged(){

    // Use D3 to get selected subject ID from dropdown 
    subjectID = d3.select("#selDataset").property("value");
    console.log(subjectID)
    

    // Update Charts based on selected Student_ID
    topOTUBar(subjectID)
    topOTUBubble(subjectID)
    demographTable(subjectID)

    

};

// filterSubject function is used to filter the metadata to match the select SubjectID/name
// function filterSubject(subject){
//     return subject.samples.id === subjectID;
// }



// Call dropdownData function when a change takes place
// dropdownData  function is used to populate the dropdown to select from the samples data. names


function dropdownData(){
    // Select the Dropdown element
    var dropdown = d3.select("#selDataset");

    // Initialize empty array with PatientID
    //var dataID = [];

    // Extract dropdown data from the Samples.json Name field
    d3.json("data/samples.json").then((data) => {
        var dataName = data.names;
        
        //console.log(dataName)

        dataName.forEach(patientID =>
            dropdown.append('option').text(`${patientID}`).property("value",patientID))
            
        
    //optionChanged(dataID)
        })
}

dropdownData()

// topOTUBar function creates the horizontal bar chart to chart top 10 OTU for selected Subject
function topOTUBar(subject){

    // Go through Samples.json data as importedData
    d3.json("data/samples.json").then((data) => {
        var selectData;

        // Filter data to subject
        for (var i = 0; i < data.samples.length; i++){
            if(data.samples[i].id == subject){
                selectData = data.samples[i]
                console.log(selectData)
            }
        }

        // Slice and Reverse for top 10 OTU
        var sampValues = selectData.sample_values.slice(0,10).reverse();
        var otuID = selectData.otu_ids.slice(0,10).reverse();
        var otuLabels = selectData.otu_labels.slice(0,10).reverse();
        var formatLabels = otuID.map(d => "OTU " + d)

        console.log(sampValues)
        console.log(otuID)
        console.log(otuLabels)


        var trace1 = {
            x: sampValues,
            y: formatLabels,
            text: otuLabels,
            name: "TopOTU",
            type: "bar",
            orientation: "h"
        };

        var chartData = [trace1];

        var layout = {
            title:"Top 10 OTUs",
            xaxis: {title: "Values"},
            yaxis: {title: "OTU ID"},
        }
        
        Plotly.newPlot("bar", chartData, layout);
    });
}

function topOTUBubble(subject){
    d3.json("data/samples.json").then((data) => {
        // Declare selectData to hold subject data pulled from Samples.json
        var selectData;

        // Filter data to subject
        for (var i = 0; i < data.samples.length; i++){
            if(data.samples[i].id == subject){
                selectData = data.samples[i]
                console.log(selectData)
            }
        }

        // Slice and Reverse for top 10 OTU
        var sampValues = selectData.sample_values.slice(0,10).reverse();
        var otuID = selectData.otu_ids.slice(0,10).reverse();
        var otuLabels = selectData.otu_labels.slice(0,10).reverse();
        

        var trace2 = {
            x: otuID,
            y: sampValues,
            mode: 'markers',
            marker: {
                size: sampValues,
                color: otuID},
            text: otuLabels
        };

        var chartData = [trace2];

        var layout = {
            title:"OTU Values",
            xaxis: {title: "OTU ID"},

        }
        Plotly.newPlot("bubble", chartData, layout);
    })
}

function demographTable(subject){
    d3.json("data/samples.json").then((data) => {
        var selectData;

        // Filter data to subject
        for (var i = 0; i < data.metadata.length; i++){
            if(data.metadata[i].id == subject){
                selectData = data.metadata[i]
                console.log(selectData)
            }
        }

        var id = selectData.id;
        var ethnicity = selectData.ethnicity;
        var gender = selectData.gender;
        var age = selectData.age;
        var location = selectData.location;
        var bbtype = selectData.bbtype;
        var wfreq = selectData.wfreq;

        var demoTable = d3.select("#sample-metadata");
        // Clear out table before populating
        demoTable.selectAll('tr').remove();

        // Write out html for table 
        for (const [key,value] of Object.entries(selectData)){
            demoTable.append("tr").append('td').text(`${key}:${value}`);
        }



    });
}

//
