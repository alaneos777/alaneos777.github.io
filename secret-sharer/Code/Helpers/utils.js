export function saveFile(filename, data) {
    var file;
    var properties = {type: "application/octet-stream"};
    try{
        file = new File([data], filename, properties);
    }catch(e){
        file = new Blob([data], properties);
    }
    var url = URL.createObjectURL(file);
    var element = document.createElement('a')
    element.setAttribute('href', url)
    element.setAttribute('download', filename)
    
    element.style.display = 'none'
    document.body.appendChild(element)
    
    element.click()
    
    document.body.removeChild(element)
}