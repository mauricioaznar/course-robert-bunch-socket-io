import React, {Component} from 'react';
import drawCircle from "./utilities/canvasLoadAnimation";

class Mem extends Component {
    render() {
        const {memusage, usedmem, totalmem, freemem} = this.props.memData

        const canvas = document.querySelector(`.${this.props.memData.memWidgetId}`)

        const totalMemInGb = (Math.floor(totalmem/1073741824 * 100)) / 100
        const freeMemInGb = (Math.floor(freemem/1073741824 * 100)) / 100

        drawCircle(canvas, memusage * 100)
        return (
            <div className="col-sm-3 mem">
                <h3>
                    Memory usage
                </h3>
                <div className="canvas-wrapper">
                    <canvas className={this.props.memData.memWidgetId} width="200" height="200" />
                    <div className="mem-text">
                        {memusage * 100} %
                    </div>
                </div>
                <div>
                    Total memory: {totalMemInGb } GB
                </div>
                <div>
                    Free mommory: { freeMemInGb } GB
                </div>
            </div>
        );
    }
}

export default Mem;