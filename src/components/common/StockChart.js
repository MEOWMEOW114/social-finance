import React, { Component } from 'react';
var ReactHighstock = require('react-highcharts/ReactHighstock.src');
var axios = require('axios');

class StockChart extends Component {


  constructor(props) {
    super(props);

    this.state = {
      backAllPercent: 0,
      layAllPercent: 0,
      data: []
    }

    this.getQuote = this.getQuote.bind(this);
  }


  componentDidMount(){
    this.getQuote()

  }

  getQuote(){
    const url = 'http://query.yahooapis.com/v1/public/yql'
    axios.get(url, {
      params: {
        format: 'json',
        env: 'store://datatables.org/alltableswithkeys',
        q:'select * from yahoo.finance.historicaldata where symbol = "HSBC" and startDate = "2016-01-01" and endDate = "2016-07-12"'
      }
    })
    .then(response => {
      var result = response.data.query.results.quote;
      result = result
      .map( item => {
        return [ Number(new Date(item.Date)), parseFloat(item.Close)]
      })
      .sort((a, b) => a[0] - b[0] )
      this.setState({data: result})
    })
    .catch(function (error) {
      console.log(error);

    });
  }

  render() {


    var config = {
      rangeSelector: {
        selected: 1
      },
      title: {
        text: 'HSBC Stock Price'
      },
      series: [{
        name: 'HSBC',
        data: this.state.data,
        tooltip: {
          valueDecimals: 2
        }
      }]
    };
    return (
      <ReactHighstock config={ config } ref='chart'></ReactHighstock>
    )
  }
}

export default StockChart;
