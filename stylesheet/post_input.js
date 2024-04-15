const  selectimg=document.querySelector('#img_in');
const inputfile=document.querySelector('#file');
const imgarea=document.querySelector('.img_display');


selectimg.addEventListener('click',function(){
    inputfile.click();
})



inputfile.addEventListener('change',function(){
    const image=this.files[0];
    console.log(image);
    const reader=new FileReader();
    reader.onload=()=>{
        const imgurl=reader.result;
        const img=document.createElement('img');
        img.src=imgurl;
        imgarea.appendChild(img);
    }
    reader.readAsDataURL(image);
})