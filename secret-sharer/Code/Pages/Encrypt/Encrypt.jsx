import React from "react"
import {encryptKey, decryptKey, keyToUInt128, UInt128ToKey} from "../../Helpers/Shamir"
import {saveFile} from "../../Helpers/utils"

export default class Encrypt extends React.Component {
    
    constructor(props) {
        super(props);
        this.fileInput = React.createRef();
        this.state = {
            k: 2,
            n: 3
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event){
        const target = event.target;
        const name = target.name;
        const value = target.value;
        if(name == "nVal"){
            const oldVal = Number(document.getElementById("kVal").value);
            if(oldVal > value){
                document.getElementById("kVal").value = value;
            }
            document.getElementById("kVal").max = value;
            this.setState({n: value});
        }else if(name == "kVal"){
            this.setState({k: value});
        }
    }

    handleSubmit(event){
        event.preventDefault();
        var k = this.state.k;
        var n = this.state.n;
        
        if(this.fileInput.current.files.length == 0){
            M.toast({"html": "Please select a file to encrypt."});
            return;
        }
        
        var inputFile = this.fileInput.current.files[0];
        var nameFile = inputFile.name;
        var name = "", ext = "";
        var idx = nameFile.lastIndexOf(".");
        if(idx != -1){
            name = nameFile.substr(0, idx);
            ext = nameFile.substr(idx);
        }else{
            name = nameFile;
        }
        var outputFile = name + "_encrypted" + ext;

        var reader = new FileReader();
        reader.onload = function(e) {
            var data = e.target.result;
            var iv = crypto.getRandomValues(new Uint8Array(16));
            var key;
          
            crypto.subtle.generateKey({ 'name': 'AES-CBC', 'length': 128 }, true, ['encrypt', 'decrypt'])
                .then(tmp => {
                    crypto.subtle.exportKey("raw", tmp).then(result => {
                        key = new Uint8Array(result);
                        var shares = encryptKey(k, n, key);
                        for(var i = 1; i <= n; ++i){
                            var shareName = name + "_secret" + (i <= 9 ? "0" + i : i.toString()) + ext;
                            var data = new Uint8Array(32);
                            var x = UInt128ToKey([shares[i - 1][0].data[0], shares[i - 1][0].data[1], shares[i - 1][0].data[2], shares[i - 1][0].data[3]]);
                            var y = UInt128ToKey([shares[i - 1][1].data[0], shares[i - 1][1].data[1], shares[i - 1][1].data[2], shares[i - 1][1].data[3]]);
                            data.set(x, 0);
                            data.set(y, 16);
                            saveFile(shareName, data.buffer);
                        }
                        M.toast({"html": "Shares generated correctly."});
                    });

                    crypto.subtle.encrypt({ 'name': 'AES-CBC', 'iv': iv }, tmp, data).then(encrypted => {
                        var buf = new Uint8Array(16 + encrypted.byteLength);
                        buf.set(iv, 0);
                        buf.set(new Uint8Array(encrypted), 16);
                        saveFile(outputFile, buf);
                        M.toast({"html": "File encrypted correctly."});
                    });
                })
                .catch(console.error);
        }
        reader.readAsArrayBuffer(inputFile);
    }

    componentDidMount() {
        let buttons = document.querySelectorAll('.fixed-action-btn')
        let selectors = document.querySelectorAll('select')

        M.FloatingActionButton.init(buttons, {})
        M.FormSelect.init(selectors, {})
        MathJax.Hub.Typeset()
    }

    render () {

        return (
            <React.Fragment>
                <div className="row" style={{display: "grid", gridTemplateColumns: "5% 90% 5%"}}>
                    <div ></div>
                    <div className="col s12 m10 l8 offset-m1 offset-l2">
                        
                        <div className="row">
                            <h3 style={{fontWeight: 200}}> Encryption </h3>
                                
                            <form className = "col s12" onSubmit={this.handleSubmit}>
                                <div className = "row">
                                    <label>Input file to encrypt</label>
                                    <div className = "file-field input-field">
                                        <div className = "btn">
                                            <span>Browse</span>
                                            <input type = "file" name="inputFile" id="inputFile" ref={this.fileInput} />
                                        </div>
                                        
                                        <div className = "file-path-wrapper">
                                            <input className = "file-path validate" type = "text"
                                            placeholder = "Upload file" />
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="input-field col s6">
                                        <input name="kVal" id="kVal" type="number" min="1" max={this.state.n} className="validate" defaultValue={this.state.k} onChange={this.handleInputChange} />
                                        <label htmlFor="kVal">Minimum amount of shares (k)</label>
                                    </div>
                                    <div className="input-field col s6">
                                        <input name="nVal" id="nVal" type="number" min="1" max="50" className="validate" defaultValue={this.state.n} onChange={this.handleInputChange} />
                                        <label htmlFor="nVal">Number of shares (n)</label>
                                    </div>
                                </div>

                                <button className="btn waves-effect waves-light" type="submit" name="encryptBtn">Encrypt!
                                    <i className="material-icons lock">send</i>
                                </button>

                            </form>


                        </div>
                    </div>
                    <div ></div>
                </div>

            </React.Fragment>
        )
    }
}