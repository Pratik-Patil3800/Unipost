
const media=document.querySelectorAll('.media');
const resetpass=document.querySelector('.pass');
const changepass=document.querySelector('#password');
const mediaexcess=document.querySelector('#socialmedia');
const allInputs = resetpass.querySelectorAll('input');
mediaexcess.addEventListener('click',function(){
    this.style.color = 'burlywood';
    changepass.style.color = '#333';
    media.forEach(function(mediaItem) {
        mediaItem.classList.remove('dactive');
        mediaItem.style.display = '';
    });
    resetpass.style.display = 'none';
    allInputs.forEach(input => input.removeAttribute('required'));
})

changepass.addEventListener('click',function(){
    this.style.color = 'burlywood';
    mediaexcess.style.color = '#333';
    media.forEach(function(mediaItem) {
        mediaItem.style.display='none';
    });
    resetpass.style.display  = '';
    allInputs.forEach(input => input.setAttribute('required', ''));
})