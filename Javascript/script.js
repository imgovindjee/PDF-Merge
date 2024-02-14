var data = [];
var width = 620;
var height = 800;
var pdfName;
var fileName = "";


const createPdf = document.getElementById('create-pdf');

encodeImageFileAsURL = (element) => {
    document.getElementById('input-page').style.display = "none";
    document.getElementById('pdf-page').style.display = "inline-block";

    const length = element.files.length;
    for (var i = 0; i < length; i++) {
        let file = element.files[i];
        let pdfname = element.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(file);

        let obj = {
            list: reader,
            fileName: file.name,
            time: new Date().toString() + i
        }

        reader.onloadend = () => {
            data = [...data, obj];
            pdfName = pdfname.name
        }
    }


    // convert to pdf 
    // function call
    setTimeout(convertToPDF, 1000);

    document.getElementById("upload-file").value = null;

    // save as PDF
    setTimeout(() => {
        document.getElementById('upload-msg').style.display = 'none';
        document.getElementById('convertBtn').style.display = 'inline-block';
    }, 1000);
}


// FUNCTION...
// DISPLAY PDF IMAGES
function convertToPDF() {
    createPdf.innerHTML = '';
    data.map((item, i) => {
        const fileItem = document.createElement('div');
        fileItem.setAttribute('class', 'file-item');

        const modify = document.createElement('div');
        modify.setAttribute('class', 'modify');

        const btn2 = document.createElement('button');
        btn2.setAttribute('class', 'delete-btn');
        btn2.setAttribute('id', item.time);

        const remove = document.createElement('i');
        remove.setAttribute('class', 'fa fa-trash');

        btn2.appendChild(remove);
        btn2.addEventListener('click', (e) => {
            // function to delete the file form the PDF-page
            handleDelete(e);
        });

        modify.appendChild(btn2);

        fileItem.appendChild(modify);

        const imgContainer = document.createElement('div');
        imgContainer.setAttribute('class', 'img-container');
        const img = document.createElement('img');
        img.setAttribute('id', 'img');
        img.src = item.list.result;
        imgContainer.appendChild(img);
        fileItem.appendChild(imgContainer);

        const imgName = document.createElement('p');
        imgName.setAttribute('id', 'img-name');
        imgName.innerHTML = item.fileName;
        fileItem.appendChild(imgName);


        // fileitem is the child of create-pdf
        createPdf.appendChild(fileItem);
    });


    const addMoreFile = document.createElement('div');
    addMoreFile.setAttribute('class', 'add-more-file');

    const addFile = document.createElement('div');
    addFile.setAttribute('class', 'inp-cont');

    const input = document.createElement('input');
    input.setAttribute('id', 'inp');
    input.type = 'file';
    input.multiple = 'true';
    input.onchange = function () {
        encodeImageFileAsURL(this);
    }


    const p = document.createElement('p');
    const i = document.createElement('i');
    i.setAttribute('class', 'fa fa-plus');
    p.appendChild(i);

    const label = document.createElement('label');
    label.htmlFor = 'inp';
    label.innerHTML = 'Add Files';

    addFile.appendChild(p);
    addFile.appendChild(label);
    addFile.appendChild(input);


    //addFile is the child of addMoreFile 
    addMoreFile.appendChild(addFile);

    //createPdf is the child of addMoreFile 
    createPdf.appendChild(addMoreFile);
}


// functin to delete the file from the PDF_page
handleDelete = (e) => {
    data = data.filter((item) => item.time !== e.currentTarget.id);
    if (data.length === 0) {
        location.reload();
    } else {
        convertToPDF();
    }
}


// Initiate file downloading
embedImages = async () => {
    const pdf_Doc = await PDFLib.PDFDocument.create();
    for (var i = 0; i < data.length; i++) {
        const jpgUrl = data[i].list.result;
        const jpgImageBytes = await fetch(jpgUrl).then((res) => res.arrayBuffer())

        const jpgImage = await pdf_Doc.embedJpg(jpgImageBytes);

        // Add a blank page to the document
        const page = pdf_Doc.addPage();
        // set page height, width
        page.setSize(width, height);
        page.drawImage(jpgImage, {
            x: 20,
            y: 50,
            width: page.getWidth() - 40,
            height: page.getHeight() - 100,
        });
    }

    // save the pdf pages
    const pdfBytes = await pdf_Doc.save();

    // download pdf fils
    download(pdfBytes, pdfName.slice(0, -4), "application/pdf");

    // back to home page after download file
    setTimeout(backToHomePage, 1000);
}

// function
// BACK TO HOME AFTER DOWNLOAD IS TERMINATED or Finished
function backToHomePage() {
    location.reload();
}
 