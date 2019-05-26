import React from "react"


export default function SimpleInput (props) {
    return (
        <React.Fragment>
            <h4 style={{fontSize: "2.0rem"}} className={`${props.materializeCSSColorText}`} >{props.title}</h4>
            <div className="input-field blue-grey-text text-darken-3" style={{}}>
                <input 
                    className={`validate ${props.materializeCSSColorText}`} 
                    value={props.value}
                    onChange={e => props.onChange(e)}
                    readOnly ={props.readOnly}
                    style={{
                        fontFamily: "Courier New",
                        fontWeight: "600",
                        fontSize: "3.0rem"
                    }}
                />
            </div>
        </React.Fragment>
    )
}