 let data = d3.json(
  "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"
)




async function getSample(id){
    return (await data).samples.filter((obj) => {
    return obj.id == id;
  })[0];
}

// Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual


async function plotBar(id) {
    sample = await getSample(id);
  let d = [
    {
      type: "bar",
      x: sample.sample_values,
      y: sample.otu_ids.map((a) =>  "OTU " + a),
      orientation: "h",
      text: sample.otu_labels,
    },
  ];
  Plotly.newPlot("bar", d);
}

// Create a bubble chart that displays each sample.

async function plotBubble(id){
    sample = await getSample(id);
    otu_ids = sample.otu_ids.sort((a,b)=>{return a-b})
    var trace1 = {
        x: sample.otu_ids,
        y: sample.sample_values,
        mode: 'markers',
        marker: {
          size: sample.sample_values,
          color: sample.otu_ids,
          text:sample.otu_labels
        }
      };
      
      var data = [trace1];
      
      var layout = {
        
        showlegend: false,
        height: 600,
        width: 600
      };
      
      Plotly.newPlot('bubble', data, layout);
}

// Display the sample metadata, i.e., an individual's demographic information

// Display each key-value pair from the metadata JSON object somewhere on the page.

async function optionChanged(value) {
  d3.select("#sample-metadata").text("");
  let subject = (await data).metadata.filter((obj) => {
    return obj.id == value;
  })[0];

  console.log(subject);

  // Display details information of selected subject
  Object.keys(subject).forEach((key) => {
    d3.select("#sample-metadata")
      .append("p")
      .text(key + ": " + subject[key]);
  });

  // Plot bar graph
  plotBar(value);

  // Plot bubble chart
  plotBubble(value);
}

//To populate the select element
async function start() {
  console.log(await data);
  (await data).metadata.forEach((subj, idx) => {
    d3.select("#selDataset").append("option").text(subj.id);
    if (idx == 0) {
      optionChanged(subj.id);
    }
  });
}


start();

