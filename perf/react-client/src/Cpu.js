import React, {Component} from 'react';
import drawCircle from "./utilities/canvasLoadAnimation";



class Cpu extends Component {

    render() {
        const canvas = document.querySelector(`.${this.props.cpuData.cpuWidgetId}`)
        drawCircle(canvas, this.props.cpuData.cpuLoad)

        return (
            <div className="col-sm-3">
                <h3>Cpu load</h3>
                <div className="canvas-wrapper">
                    <canvas className={this.props.cpuData.cpuWidgetId} width="200" height="200" />
                    <div className="cpu-text">
                        {this.props.cpuData.cpuLoad} %
                    </div>
                </div>
            </div>
        );
    }
}

export default Cpu;