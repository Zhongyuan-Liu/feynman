// external imports
import React from 'react'
import { connect } from 'react-redux'
// local imports
import { Header, SliderRow, Row, Label, MultiRow } from '..'
import FermionSummary from './FermionSummary'
import { ColorPicker, Select, Option } from 'components'
import { Propagator } from 'interface/Diagram/Propagator'
import { setElementAttrs } from 'actions/elements'
import styles from './styles'

const PropagatorSummary = ({propagators, setAttrs, elements, ...unusedProps}) => {
    // figure out if the entity needs to be pluralized
    const propagator = propagators.length > 1 ? 'propagators' : 'propagator'
    // grab the first values of the group properties
    const strokeWidth = firstValue({propagators, param: 'strokeWidth', elements})
    const stroke = firstValue({propagators, param: 'stroke', elements})
    // assume that there is only one propagator and grab the appropriate summary component
    const head = elements.propagators[propagators[0]]
    // get the appropriate summary for the head
    const ElementSummary = {
        fermion: FermionSummary,
        dashed: FermionSummary,
    }[head.kind]
        
    // render the component
    return (
        <div {...unusedProps}>
            <Header>
                {`${propagators.length} ${propagator} selected`}
            </Header>
            <Row>
                <Label>color:</Label>
                <ColorPicker
                    color={stroke || Propagator.defaultProps.stroke}
                    onChange={stroke => setAttrs({stroke})}
                />
            </Row>
            <SliderRow
                label="size"
                value={strokeWidth || Propagator.defaultProps.strokeWidth}
                onChange={strokeWidth => setAttrs({strokeWidth})}
                min={1}
                max={10}
                step={1}
            />
            {propagators.length === 1 && (
                <MultiRow>
                    <Row>
                        <Select 
                            value={head.type} 
                            onChange={(event) => setAttrs({kind: event.target.value})}
                        >
                            <Option value="fermion">fermion</Option> 
                            <Option value="dashed">dashed</Option> 
                            <Option value="em">electroweak</Option> 
                        </Select>
                    </Row> 
                    {ElementSummary && <ElementSummary setAttrs={setAttrs} {...head}/>}
                </MultiRow>
            )}
        </div>
    )
}
const firstValue = ({propagators, param, elements}) => {
    // go over every propagator
    for (const id of propagators) {
        // the fill of the propagator
        const val = elements.propagators[id][param]
        // if the propagator has the attr
        if (val) {
            // use it
            return val
        }
    }
}

const mapDispatchToProps = (dispatch, {propagators}) => ({
    setAttrs: (attrs) => (
        dispatch(setElementAttrs(
            ...propagators.map(id => ({type: 'propagators', id, ...attrs}))
        ))
    ),
})
const selector = ({elements}) => ({elements})
export default connect(selector, mapDispatchToProps)(PropagatorSummary)
