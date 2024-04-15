
const handeldelete=document.querySelector('.delete-button');
const shedulpostbtn=document.querySelector('#schedule-post-button');
const closeformbtn=document.querySelector('#closebtn');
const sheduleform=document.querySelector('#form');


const deletePost = async (postId) => {
    try {
        const response = await fetch(`/posts/${postId}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          console.log('Post deleted successfully');
        } else {
          console.error('Failed to delete post:', response.statusText);
        }
      } catch (error) {
        console.error('Error deleting post:', error.message);
      }
};


shedulpostbtn.addEventListener('click',function(event){
  sheduleform.classList.remove('active');
  this.classList.add('active');
});

closeformbtn.addEventListener('click',function(event){
  sheduleform.classList.add('active');
  shedulpostbtn.classList.remove('active');
});

handeldelete.addEventListener('click',function(event){
  const postId = event.target.getAttribute('data-post-id');
  deletePost(postId);
});