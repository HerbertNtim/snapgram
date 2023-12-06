import PostForm from "@/components/forms/PostForm"

const CreatePost = () => {
  return (
    <section className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl flex-start justify-start gap-3 w-full"> 
          <img 
            src="assets/icons/add-post.svg" 
            alt="post"
            width={36}
            height={36} 
          />
          <h2 className="h3-bold md:h2-bold w-full text-left">Create Post</h2>
        </div>

        <PostForm />
      </div>
    </section>
  )
}

export default CreatePost