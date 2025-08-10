var  _token = $('meta[name="csrf-token"]').attr('content');

$(document ).ready(function() {

    bpath = __basepath + "/";
    load_chart();
    load_chart_gender();
    load_chart_tribe();

  });


  function load_chart_gender() {
    var load_main_gender;

    $.ajax({
        url: "dashboard/load/gender",
        type: "POST",
        data: {
            _token:_token,
        },
        cache: false,
        success: function (data) {
            var data = JSON.parse(data);
            // console.log(data);

            $('#chart-male-stats').empty();
            $('#chart-male-stats').append(data.chart_male_stats);

            $('#chart-female-stats').empty();
            $('#chart-female-stats').append(data.chart_female_stats);

            $('#chart-na-stats').empty();
            $('#chart-na-stats').append(data.chart_na_stats);

            var chart_main_gender_options = {
                series: [parseInt( data.percentage_female), parseInt(data.percentage_male), parseInt(data.percentage_n_a)],
                chart: {
                height: 400,
                type: 'radialBar',
              },
              plotOptions: {
                radialBar: {
                  dataLabels: {
                    name: {
                      fontSize: '22px',
                    },
                    value: {
                        show: true,
                        color: '#333',
                        offsetY: 30,
                        fontSize: '22px'
                    },

                    total: {
                      show: true,
                      label: 'Total',
                      formatter: function (w) {
                        // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
                        return data.get_total
                      }
                    }
                  }
                }
              },
            //   fill: {
            //     type: 'image',
            //     image: {
            //       src: ['../../uploads/settings/1_theG1681746608.jpg'],
            //     }
            //   },
              labels: ['Female', 'Male', 'N/A'],
              };

              var chart_main_gender = new ApexCharts(document.querySelector("#chart-main-gender"), chart_main_gender_options);
              chart_main_gender.render();


              var chart_male_count_options = {
                series: [{
                data: data.male_data
              }],
                chart: {
                type: 'line',
                width: '100%',
                height: 35,
                sparkline: {
                  enabled: true
                }
              },
              tooltip: {
                fixed: {
                  enabled: false
                },
                x: {
                  show: false
                },
                y: {
                  title: {
                    formatter: function (seriesName) {
                      return ''
                    }
                  }
                },
                marker: {
                  show: false
                }
              }
              };

              var chart_male_count = new ApexCharts(document.querySelector("#chart-male-count"), chart_male_count_options);
              chart_male_count.render();

              var chart_female_count_options = {
                series: [{
                data: data.female_data
              }],
                chart: {
                type: 'line',
                width: '100%',
                height: 35,
                sparkline: {
                  enabled: true
                }
              },
              tooltip: {
                fixed: {
                  enabled: false
                },
                x: {
                  show: false
                },
                y: {
                  title: {
                    formatter: function (seriesName) {
                      return ''
                    }
                  }
                },
                marker: {
                  show: false
                }
              }
              };

              var chart_female_count = new ApexCharts(document.querySelector("#chart-female-count"), chart_female_count_options);
              chart_female_count.render();

              var chart_na_count_options = {
                series: [{
                data: data.na_data
              }],
                chart: {
                type: 'line',
                width: '100%',
                height: 35,
                sparkline: {
                  enabled: true
                }
              },
              tooltip: {
                fixed: {
                  enabled: false
                },
                x: {
                  show: false
                },
                y: {
                  title: {
                    formatter: function (seriesName) {
                      return ''
                    }
                  }
                },
                marker: {
                  show: false
                }
              }
              };

              var chart_na_count = new ApexCharts(document.querySelector("#chart-na-count"), chart_na_count_options);
              chart_na_count.render();

        }
    });

  }

  function load_chart_tribe() {
    $.ajax({
        url: "dashboard/load/tribe",
        type: "POST",
        data: {
            _token:_token,
        },
        success: function (data) {
            var data = JSON.parse(data);
            console.log(data);



        }
    });

  }

  function load_chart_address() {
    $.ajax({
        url: "dashboard/load/address",
        type: "POST",
        data: {
            _token:_token,
        },
        success: function (data) {
            var data = JSON.parse(data);
            console.log(data);


        }
    });

  }

  function load_chart_leave() {
    $.ajax({
        url: "dashboard/load/leave",
        type: "POST",
        data: {
            _token:_token,
        },
        success: function (data) {
            var data = JSON.parse(data);
            console.log(data);


        }
    });

  }

  function load_chart_SALN() {
    $.ajax({
        url: "dashboard/load/SALN",
        type: "POST",
        data: {
            _token:_token,
        },
        success: function (data) {
            var data = JSON.parse(data);
            console.log(data);

        }
    });
  }

  function load_chart_DTR() {
    $.ajax({
        url: "dashboard/load/DTR",
        type: "POST",
        data: {
            _token:_token,
        },
        success: function (data) {
            var data = JSON.parse(data);
            console.log(data);


        }
    });

  }

  function load_chart_employee() {
    $.ajax({
        url: "dashboard/load/employee",
        type: "POST",
        data: {
            _token:_token,
        },
        success: function (data) {
            var data = JSON.parse(data);
            console.log(data);


        }
    });

  }

  function load_chart_travelorder() {
    $.ajax({
        url: "dashboard/load/travelorder",
        type: "POST",
        data: {
            _token:_token,
        },
        success: function (data) {
            var data = JSON.parse(data);
            console.log(data);


        }
    });

  }

  function load_chart(){

    var options = {
        chart: {
            height: 350,
            type: 'bar',

        },
        colors: ['var(--chart-color1)'],
        series: [{
            name: 'Farmer Count',
            type: 'column',
            data: [18, 28, 47, 57, 77]
        }],
        stroke: { curve: 'bar' },
        // labels: farmer_months,
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        //labels: ['01 Jan 2001', '02 Jan 2001', '03 Jan 2001', '04 Jan 2001', '05 Jan 2001', '06 Jan 2001', '07 Jan 2001', '08 Jan 2001', '09 Jan 2001', '10 Jan 2001', '11 Jan 2001', '12 Jan 2001'],
        xaxis: {
            type: 'date'
        },
        yaxis: [{
            title: {
                text: 'Farmer Count',
            },

        }]
    }
    var chart = new ApexCharts(
        document.querySelector("#apex-chart-line-column"),
        options
    );

    chart.render();



    var options = {
        series: [{
        data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380]
      }],
        chart: {
        type: 'bar',
        height: 350
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: true,
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: ['South Korea', 'Canada', 'United Kingdom', 'Netherlands', 'Italy', 'France', 'Japan',
          'United States', 'China', 'Germany'
        ],
      }
      };

      var chart = new ApexCharts(document.querySelector("#chart"), options);
      chart.render();


      var options = {
        series: [{
        name: 'Net Profit',
        data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
      }, {
        name: 'Revenue',
        data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
      }, {
        name: 'Free Cash Flow',
        data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
      }],
        chart: {
        type: 'bar',
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded'
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
      },
      yaxis: {
        title: {
          text: '$ (thousands)'
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return "$ " + val + " thousands"
          }
        }
      }
      };

      var chart = new ApexCharts(document.querySelector("#chart2"), options);
      chart.render();



      var options = {
        series: [{
          name: "Desktops",
          data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
      }],
        chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight'
      },
      title: {
        text: 'Product Trends by Month',
        align: 'left'
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        },
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
      }
      };

      var chart = new ApexCharts(document.querySelector("#chart3"), options);
      chart.render();





      var options = {
        series: [76, 67, 61, 90],
        chart: {
        height: 390,
        type: 'radialBar',
      },
      plotOptions: {
        radialBar: {
          offsetY: 0,
          startAngle: 0,
          endAngle: 270,
          hollow: {
            margin: 5,
            size: '30%',
            background: 'transparent',
            image: undefined,
          },
          dataLabels: {
            name: {
              show: false,
            },
            value: {
              show: false,
            }
          }
        }
      },
      colors: ['#1ab7ea', '#0084ff', '#39539E', '#0077B5'],
      labels: ['Vimeo', 'Messenger', 'Facebook', 'LinkedIn'],
      legend: {
        show: true,
        floating: true,
        fontSize: '16px',
        position: 'left',
        offsetX: 160,
        offsetY: 15,
        labels: {
          useSeriesColors: true,
        },
        markers: {
          size: 0
        },
        formatter: function(seriesName, opts) {
          return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex]
        },
        itemMargin: {
          vertical: 3
        }
      },
      responsive: [{
        breakpoint: 480,
        options: {
          legend: {
              show: false
          }
        }
      }]
      };

      var chart = new ApexCharts(document.querySelector("#chart4"), options);
      chart.render();



      var options = {
        series: [
        {
          data: [
            {
              x: 'Code',
              y: [
                new Date('2019-03-02').getTime(),
                new Date('2019-03-04').getTime()
              ]
            },
            {
              x: 'Test',
              y: [
                new Date('2019-03-04').getTime(),
                new Date('2019-03-08').getTime()
              ]
            },
            {
              x: 'Validation',
              y: [
                new Date('2019-03-08').getTime(),
                new Date('2019-03-12').getTime()
              ]
            },
            {
              x: 'Deployment',
              y: [
                new Date('2019-03-12').getTime(),
                new Date('2019-03-18').getTime()
              ]
            }
          ]
        }
      ],
        chart: {
        height: 350,
        type: 'rangeBar'
      },
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      xaxis: {
        type: 'datetime'
      }
      };

      var chart = new ApexCharts(document.querySelector("#chart5"), options);
      chart.render();





      var options = {
        series: [{
        name: 'TEAM A',
        type: 'column',
        data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30]
      }, {
        name: 'TEAM B',
        type: 'area',
        data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43]
      }, {
        name: 'TEAM C',
        type: 'line',
        data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39]
      }],
        chart: {
        height: 350,
        type: 'line',
        stacked: false,
      },
      stroke: {
        width: [0, 2, 5],
        curve: 'smooth'
      },
      plotOptions: {
        bar: {
          columnWidth: '50%'
        }
      },

      fill: {
        opacity: [0.85, 0.25, 1],
        gradient: {
          inverseColors: false,
          shade: 'light',
          type: "vertical",
          opacityFrom: 0.85,
          opacityTo: 0.55,
          stops: [0, 100, 100, 100]
        }
      },
      labels: ['01/01/2003', '02/01/2003', '03/01/2003', '04/01/2003', '05/01/2003', '06/01/2003', '07/01/2003',
        '08/01/2003', '09/01/2003', '10/01/2003', '11/01/2003'
      ],
      markers: {
        size: 0
      },
      xaxis: {
        type: 'datetime'
      },
      yaxis: {
        title: {
          text: 'Points',
        },
        min: 0
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: function (y) {
            if (typeof y !== "undefined") {
              return y.toFixed(0) + " points";
            }
            return y;

          }
        }
      }
      };

      var chart = new ApexCharts(document.querySelector("#chart6"), options);
      chart.render();



      var options = {
        series: [{
        name: 'Website Blog',
        type: 'column',
        data: [440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160]
      }, {
        name: 'Social Media',
        type: 'line',
        data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16]
      }],
        chart: {
        height: 350,
        type: 'line',
      },
      stroke: {
        width: [0, 4]
      },
      title: {
        text: 'Traffic Sources'
      },
      dataLabels: {
        enabled: true,
        enabledOnSeries: [1]
      },
      labels: ['01 Jan 2001', '02 Jan 2001', '03 Jan 2001', '04 Jan 2001', '05 Jan 2001', '06 Jan 2001', '07 Jan 2001', '08 Jan 2001', '09 Jan 2001', '10 Jan 2001', '11 Jan 2001', '12 Jan 2001'],
      xaxis: {
        type: 'datetime'
      },
      yaxis: [{
        title: {
          text: 'Website Blog',
        },

      }, {
        opposite: true,
        title: {
          text: 'Social Media'
        }
      }]
      };

      var chart = new ApexCharts(document.querySelector("#chart7"), options);
      chart.render();

  }
