addDays = function(date, days) {
    var dat = new Date(date)
    dat.setDate(dat.getDate() + days);
    return dat;
};

getDates = function(startDate, stopDate) {
    var dateArray = new Array();
    var currentDate = startDate;
    while (currentDate <= stopDate) {
        dateArray.push(currentDate)
        currentDate = addDays(currentDate, 1);
    }
    return dateArray;
};

dynamicBarchart = function(svg, data, options) {
  var width = parseInt(svg.attr('width'));
  var height = parseInt(svg.attr('height'));

  var margin = {left: 30, top: 10, right:10, bottom: 20};
  var chartWidth = width - margin.left - margin.right;
  var chartHeight = height - margin.top - margin.bottom;

  svg.append("rect")
     .attr('x',0)
     .attr('y',0)
     .attr('width', '100%')
     .attr('height', '100%')
     .style('fill', '#EDEFEF');

  var chart = svg.append('g')
                 .attr('class', 'chart')
                 .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  data.forEach(function(d) { d.time = new Date(d.timestamp); });

  var dateRange = d3.extent(data, function(d) { return d.time; });

  var fullData = _.map(getDates(dateRange[0],dateRange[1]), function(d) {
    var aData = _.find(data, function(x) { return x.time.getTime() == d.getTime(); });
    return _.isUndefined(aData) ? { time: d, value: 0 } : aData;
  });

  var xScale = d3.scale.ordinal()
                   .domain(fullData.map(function(d) { return d.time; }))
                   .rangeBands([0, chartWidth], 0.3, 0.5);

  var yScale = d3.scale.linear()
                       .domain(d3.extent(data, function(d) { return d.value; }))
                       .range([chartHeight, 0]);

  var valueScale = d3.scale.linear()
                      .domain(data.map(function(d) { return d.time; }))
                      .range(data.map(function(d) { return d.value; }));

  var bars = chart.selectAll("rect").data(fullData);
  bars.enter().append("rect")
              .attr("x", function(d) { return xScale(d.time); })
              .attr("y", function(d) { return yScale(valueScale(d.time)); })
              .attr("width", xScale.rangeBand())
              .attr("height", function(d) { return chartHeight - yScale(valueScale(d.time)); })
              .style("fill", function(d) {
                return d.timestamp ? "#B7DA67" : "#CE6548";
              });

  svg.append("line")
   .style('stroke', 'black')
   .attr("x1", margin.left)
   .attr("y1", margin.top + chartHeight)
   .attr("x2", margin.left + chartWidth)
   .attr("y2", margin.top + chartHeight);


};

$(function(){
  var sampleData1 = [
    {timestamp: "2014-01-04 00:00:00", value: 175},
    {timestamp: "2014-01-07 00:00:00", value: 150},
    {timestamp: "2014-01-08 00:00:00", value: 130},
    {timestamp: "2014-01-11 00:00:00", value: 143},
    {timestamp: "2014-01-12 00:00:00", value: 143},
    {timestamp: "2014-01-14 00:00:00", value: 148},
    {timestamp: "2014-01-17 00:00:00", value: 148},
    {timestamp: "2014-01-20 00:00:00", value: 123},
    {timestamp: "2014-01-28 00:00:00", value: 150}
  ];

  var sampleData2 = [
    {timestamp: "2014-01-04 00:00:00", value: 140},
    {timestamp: "2014-01-07 00:00:00", value: 160},
    {timestamp: "2014-01-08 00:00:00", value: 170},
    {timestamp: "2014-01-11 00:00:00", value: 123},
    {timestamp: "2014-01-12 00:00:00", value: 113},
    {timestamp: "2014-01-14 00:00:00", value: 138},
    {timestamp: "2014-01-17 00:00:00", value: 158},
    {timestamp: "2014-01-20 00:00:00", value: 163},
    {timestamp: "2014-01-28 00:00:00", value: 100}
  ];

  dynamicBarchart(d3.select(".sample1"), sampleData1, {});
  dynamicBarchart(d3.select(".sample2"), sampleData2, {});
});
