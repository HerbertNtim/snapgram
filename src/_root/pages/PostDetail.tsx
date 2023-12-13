import Loader from '@/components/shared/Loader'
import { useGetPostById } from '@/lib/react-query/queriesAndMutations'
import { multiFormatDateString } from '@/lib/utils'
import { Link, useParams } from 'react-router-dom'

const PostDetail = () => {
  const { id } = useParams()
  const { data: post, isPending } = useGetPostById(id || ' ')

  return (
    <div className="post_details-container">
      {isPending ? <Loader /> : (
        <div className='post_details-card'>
          <img 
            src={post?.imageUrl}
            alt="post" 
            className='post_details-img'
          />
          
          <div className="post_details-info">
            <div className='flex-between w-full'> 
              <Link to={`/profile/${post?.creator.$id}`} className='flex items-center gap-3'>
                <img
                  src={
                    post?.creator?.imageUrl ||
                    "/assets/images/profile.png"
                  }
                  alt="creator"
                  className="w-12 lg:h-12 rounded-full"
                />
            
                <div className="flex flex-col">
                  <p className="base-medium lg:body-bold text-light-1">
                    {post?.creator.name}
                  </p>
                  <div className="flex-center gap-2 text-light-3">
                    <p className="subtle-semibold lg:small-regular ">
                      {multiFormatDateString(post?.$createdAt)}
                    </p>
                    •
                    <p className="subtle-semibold lg:small-regular">
                      {post?.location}
                    </p>
                  </div>
                </div>
              </Link>

              <div className='flex-center'>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PostDetail