import React from "react"
import {GF} from "../../Helpers/GF"
import {encryptKey, decryptKey, keyToUInt128, UInt128ToKey} from "../../Helpers/Shamir"
import {saveFile} from "../../Helpers/utils"

export default class Decrypt extends React.Component {
    
    constructor(props) {
        super(props)
        this.fileInput = React.createRef();
        this.sharesInput = React.createRef();
        this.state = {
            
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event){
        event.preventDefault();

        if(this.fileInput.current.files.length == 0){
            M.toast({"html": "Please select a file to decrypt."});
            return;
        }

        if(this.sharesInput.current.files.length == 0){
            M.toast({"html": "Please select at least one piece of the key."});
            return;
        }

        var encryptedFile = this.fileInput.current.files[0];
        var nameFile = encryptedFile.name;
        var name = "", ext = "";
        var idx = nameFile.lastIndexOf(".");
        if(idx != -1){
            name = nameFile.substr(0, idx);
            ext = nameFile.substr(idx);
        }else{
            name = nameFile;
        }
        var outputFile = name + "_decrypted" + ext;

        var sharesInput = this.sharesInput.current.files;
        var n = sharesInput.length;
        var shares = [];

        for(let i = 0; i < n; ++i){
            var shareInput = sharesInput[i];
            var reader = new FileReader();
            reader.onload = function(e){
                var x_ = new Uint8Array(e.target.result, 0, 16);
                var y_ = new Uint8Array(e.target.result, 16, 16);
                var x = keyToUInt128(x_);
                var y = keyToUInt128(y_);
                shares.push([new GF(x[3], x[2], x[1], x[0]), new GF(y[3], y[2], y[1], y[0])]);
                if(shares.length == n){
                    var key = decryptKey(shares);
                    var reader2 = new FileReader();
                    reader2.onload = function(e2){
                        var iv = new Uint8Array(e2.target.result, 0, 16);
                        var data = new Uint8Array(e2.target.result, 16);
                        crypto.subtle.importKey("raw", key, "AES-CBC", false, ['decrypt']).then(tmp => {
                            crypto.subtle.decrypt({ 'name': 'AES-CBC', 'iv': iv }, tmp, data).then(decrypted => {
                                saveFile(outputFile, decrypted);
                                M.toast({"html": "File decrypted correctly."});
                            }).catch(e => {
                                M.toast({"html": "Incorrect combination of shares. Maybe the number of shares isn't enough."});
                            });
                        });
                    }
                    reader2.readAsArrayBuffer(encryptedFile);
                }
            }
            reader.readAsArrayBuffer(shareInput);
        }
    }

    render () {

        return (
            <React.Fragment>
                <div className="row" style={{display: "grid", gridTemplateColumns: "5% 90% 5%"}}>
                    <div ></div>
                    <div className="col s12 m10 l8 offset-m1 offset-l2">
                        
                        <div className="row">
                            <h3 style={{fontWeight: 200}}> Decryption </h3>
                                
                            <form className = "col s12" onSubmit={this.handleSubmit}>
                                <div className = "row">
                                    <label>Encrypted file</label>
                                    <div className = "file-field input-field">
                                        <div className = "btn">
                                            <span>Browse</span>
                                            <input type = "file" name="encryptedFile" id="encryptedFile" ref={this.fileInput} />
                                        </div>
                                        
                                        <div className = "file-path-wrapper">
                                            <input className = "file-path validate" type = "text"
                                            placeholder = "Upload file" />
                                        </div>
                                    </div>
                                </div>

                                <div className = "row">
                                    <label>Put here enough pieces of the secret key</label>
                                    <div className = "file-field input-field">
                                        <div className = "btn">
                                            <span>Browse</span>
                                            <input type = "file" name="sharesInput" id="sharesInput" multiple ref={this.sharesInput} />
                                        </div>
                                        
                                        <div className = "file-path-wrapper">
                                            <input className = "file-path validate" type = "text"
                                                placeholder = "Upload multiple files" />
                                        </div>
                                    </div>    
                                </div>

                                <button className="btn waves-effect waves-light" type="submit" name="decryptBtn">Decrypt!
                                    <i className="material-icons lock_open">send</i>
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