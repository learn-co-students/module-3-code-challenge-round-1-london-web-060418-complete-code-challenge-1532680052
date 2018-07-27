document.addEventListener('DOMContentLoaded', function() {
  //DOM ELEMENTS ASSIGNMENT
  const imageId = 2 //Enter your assigned imageId here
  const imageURL = `https://randopic.herokuapp.com/images/${imageId}`
  const likeURL = `https://randopic.herokuapp.com/likes/`
  const commentsURL = `https://randopic.herokuapp.com/comments/`

  const imageTag = document.querySelector('#image')
  const imageName = document.querySelector('#name')
  const likeCount = document.querySelector('#likes')
  const likeBtn = document.querySelector('#like_button')
  const commentForm = document.querySelector('#comment_form')
  const commentList = document.querySelector('#comments')

  //PAGE INITIALIZATION
  getPic().then( pic => fullRender(pic) )

  likeBtn.addEventListener('click', handleLike)
  commentForm.addEventListener('submit', handleComment)

  //FUNCTION DEFINITIONS
  // - Adapter functions
  function getPic() {
    return fetch(imageURL)
      .then( r => r.json() )
  }

  function postLike() {
    fetch(likeURL, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image_id: imageId
      })
    })
  }

  function postComment(comment) {
    return fetch(commentsURL, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(comment)
    })
  }

  function deleteCommentBy(commId) {
    return fetch(commentsURL + `/${commId}`, {
      method: "DELETE",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: commId
      })
    })
      .then( r => r.json() )
  }
  // - Controller functions
  function fullRender(pic) {
    imageTag.src = pic.url
    imageName.innerText = pic.name
    likeCount.innerText = pic.like_count
    listComments(pic.comments)
  }

  function listComments(comments) {
    commentList.innerHTML = ""

    comments.sort( (comm1, comm2) => {
      return new Date(comm1.created_at) - new Date(comm2.created_at)
    })

    comments.forEach( comm => {
      const newComment = document.createElement('li')
      newComment.innerHTML = `<button id="${comm.id}">delete</button> - ${comm.content}`
      newComment.querySelector('button').addEventListener('click', handleCommentDelete)
      commentList.append(newComment)
    })
  }
  // - EventListener functions
  function handleLike(e) {
    likeCount.innerText = parseInt(likeCount.innerText) + 1
    postLike()
  }

  function handleComment(e) {
    e.preventDefault()
    const data = {
      image_id: imageId,
      content: e.target.comment.value
    }
    postComment(data)
      .then(getPic().then( pic => listComments(pic.comments) ))
    e.target.comment.value = ""
  }

  function handleCommentDelete(e) {
    deleteCommentBy(e.target.id)
      .then( r => {
        getPic().then( pic => listComments(pic.comments) )
        alert(r.message)
      })
  }
})
