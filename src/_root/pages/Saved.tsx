import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { useGetCurrentUser } from "@/lib/react-query/queriesAndMutations";
import { Models } from "appwrite";

const Saved = () => {
  const { data: currentUser } = useGetCurrentUser();

  const savePosts = currentUser?.save
    .map((savePost: Models.Document) => ({
      ...savePost.post,
      creator: {
        imageUrl: currentUser.imageUrl,
      },
    }))
    .reverse();

  return (
    <section className="saved-container">
      <div className="flex gap-3 width-full max-w-5xl">
        <img src="/assets/icons/save.svg" alt="save" width={36} height={36} className="invert-white"/>

        <h2 className="h3-bold md:h2-bold w-full body-bold">Saved Post</h2>
      </div>

      <div className="flex-between w-full max-w-5xl mt-4 mb-7">
        <div className="w-[561px] h-[46px] flex justify-between items-center">
          <div className="flex gap-2">
            <img src="/assets/icons/posts.svg" alt="posts" width={20} height={20}  />

            <h2 className="font-medium">Posts</h2>
          </div>

          <div className="flex gap-2">
            <img src="/assets/icons/wallpaper.svg" alt="posts" width={20} height={20} />

            <h2 className="font-medium">Reels</h2>
          </div>

          <div className="flex gap-2">
            <img src="/assets/icons/gallery-add.svg" alt="posts" width={20} height={20} />

            <h2 className="font-medium">Collections</h2>
          </div>
        </div>

        <div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer"> 
          <p className="small-medium md:base-medium text-light-2">All</p>

          <img 
            src="/assets/icons/filter.svg" 
            alt="filter"
            width={20}
            height={20} 
          />
        </div>
      </div>

      {!currentUser ? (
        <Loader />
      ) : (
        <ul className="w-full flex justify-center max-w-5xl gap-9">
          {savePosts.length === 0 ? (
            <p className="text-light-4">No available posts</p>
          ) : (
            <GridPostList posts={savePosts} showStats={false} />
          )}
        </ul>
      )}
    </section>
  )
}

export default Saved