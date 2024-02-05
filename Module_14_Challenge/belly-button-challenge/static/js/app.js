async function getSample(id) {
  const data = await d3.json(
    "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"
  );
  return data.samples.filter((obj) => obj.id == id)[0];
}

async function plotBar(id) {
  const sample = await getSample(id);
  let yticks = sample.otu_ids.slice(0, 10).map((otuID) => `OTU ${otuID}`).reverse();
  let barData = [
    {
      y: yticks,
      x: sample.sample_values.slice(0, 10).reverse(),
      text: sample.otu_labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h",
    },
  ];
  let barLayout = {
    margin: { t: 30, l: 150 },
  };
  Plotly.newPlot("bar", barData, barLayout);
}

async function plotBubble(id) {
  const sample = await getSample(id);
  let bubbleLayout = {
    title: "Bacteria Cultures Per Sample",
    margin: { t: 0 },
    hovermode: "closest",
    xaxis: { title: "OTU ID" },
    margin: { t: 30 },
  };
  let bubbleData = [
    {
      x: sample.otu_ids,
      y: sample.sample_values,
      text: sample.otu_labels,
      mode: "markers",
      marker: {
        size: sample.sample_values,
        color: sample.otu_ids,
        colorscale: "Earth",
      },
    },
  ];
  Plotly.newPlot("bubble", bubbleData, bubbleLayout);
}

async function optionChanged(value) {
  d3.select("#sample-metadata").text("");
  const data = await d3.json(
    "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"
  );
  const subject = data.metadata.filter((obj) => obj.id == value)[0];
  // Display details information of the selected subject
  Object.keys(subject).forEach((key) => {
    d3.select("#sample-metadata").append("p").text(`${key}: ${subject[key]}`);
  });
  // Plot bar graph
  plotBar(value);
  // Plot bubble chart
  plotBubble(value);
}

async function start() {
  const data = await d3.json(
    "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"
  );
  data.metadata.forEach((subj, idx) => {
    d3.select("#selDataset").append("option").text(subj.id);
    if (idx === 0) {
      optionChanged(subj.id);
    }
  });
}

start();
