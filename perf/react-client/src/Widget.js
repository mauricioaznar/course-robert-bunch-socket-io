import React, {Component} from 'react';
import Cpu from './Cpu'
import Mem from './Mem'
import Info from './Info'
import './widget.css'

class Widget extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        const {
            freemem,
            upTime,
            osType,
            totalmem,
            usedmem,
            memusage,
            cpuModel,
            cpuSpeed,
            numCores,
            cpuLoad,
            macA,
            isActive
        } = this.props.data
        const cpuWidgetId = `cpu-widget-${macA}`
        const memWidgetId = `mem-widget-${macA}`
        const cpu = { cpuLoad, cpuWidgetId }
        const mem = {memusage, usedmem, totalmem, freemem, memWidgetId}
        const info = {macA, osType, upTime, cpuModel, cpuSpeed, numCores}

        let notActiveDiv = ''
        if (!isActive) {
            notActiveDiv = <div className="not-active">Offline</div>
        }


        return (
            <div className="widget col-sm-12">
                { notActiveDiv }
                <Cpu cpuData = {cpu} />
                <Mem memData = {mem} />
                <Info infoData = {info} />
            </div>
        );
    }
}

export default Widget;

