import React, {Component} from 'react';
import '../css/App.css';
import axios from 'axios'
import CanvasJSReact from '../assets/canvasjs.react/canvasjs.react';
import Select from 'react-select'
const CanvasJSChart = CanvasJSReact.CanvasJSChart;



var options = {
    animationEnabled: true,
    title: {
        text: "Korona Grafiği"
    },
    axisY: {
        title: "Sayı",
    },
    legend: {
        cursor: "pointer",
    }
}

class Rapor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            options: options,
            selectOptions : [],
            id: "",
            name: ''
        }
        this.ToggleDataSeries = this.ToggleDataSeries.bind(this);
        this.setForChartData = this.setForChartData.bind(this);
    }

    handleChange(e){
        this.setState({id:e.value, name:e.label})
        axios.post("http://localhost:8080/sehir_gonder", e.value).then(res => {
            console.log()
            this.setForChartData(res)
        }, err => {
            alert("Server rejected response with: " + err);
        })

    }

    ToggleDataSeries(e) {
        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        } else {
            e.dataSeries.visible = true;
        }
        this.setState({options: options})

    }

    setForChartData(data2){
        const data_points = data2.data[0]["dataPoints"].map(data_point => {
            const ar = data_point["date"].split(".")
            return {x: new Date(ar[2], ar[1], ar[0]), y: data_point["y"]}
        })
        const data_points_2 = data2.data[1]["dataPoints"].map(data_point => {
            const ar = data_point["date"].split(".")
            return {x: new Date(ar[2], ar[1], ar[0]), y: data_point["y"]}
        })
        const data_points_3 = data2.data[2]["dataPoints"].map(data_point => {
            const ar = data_point["date"].split(".")
            return {x: new Date(ar[2], ar[1], ar[0]), y: data_point["y"]}
        })
        const data = [{
            xValueFormatString: "DD MMM",
            name: data2.data[0]["name"],
            showInLegend: true,
            type: "line",
            dataPoints: data_points
        }, {
            xValueFormatString: "DD MMM",
            name: data2.data[1]["name"],
            showInLegend: true,
            type: "line",
            dataPoints: data_points_2
        }, {
            xValueFormatString: "DD MMM",
            name: data2.data[2]["name"],
            showInLegend: true,
            type: "line",
            dataPoints: data_points_3
        }
        ]
        options = {
            animationEnabled: true,
            title: {
                text: "Korona Grafiği"
            },
            axisX: {
                valueFormatString: "DD MMM YYYY"
            },
            axisY: {
                title: "Sayı",
            },
            legend: {
                cursor: "pointer",
                itemclick: this.ToggleDataSeries
            },
            data: data
        }
        this.setState({options: options})

    }

     componentDidMount() {
         axios.all([axios.get('http://localhost:8080/test3'),axios.get("http://localhost:8080/test")])
            .then(axios.spread((data1, data2) => {
                const select_data = data1.data
                console.log(select_data)
                const select_options = select_data.map(d => ({
                    "value" : d.value,
                    "label" : d.label
                }))
                console.log(select_options)
                this.setState({selectOptions: select_options})
                // output of req.
                this.setForChartData(data2)
            }));
    }

    render() {
        return (
            <div>
                <CanvasJSChart options={this.state.options}
                />
                {/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
                    <div>
                        <Select options={this.state.selectOptions} onChange={this.handleChange.bind(this)} />
                        <p>Seçtiğiniz şehir: <strong>{this.state.name}</strong></p>
                    </div>
            </div>

        );

    }
}

export default Rapor;