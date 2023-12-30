import Loader from "@/components/shared/Loader";
import StatBlock from "@/components/shared/StatBlock";
import { useUserContext } from "@/context/AuthContext";
import { useGetUserById } from "@/lib/react-query/queriesAndMutations";
import { useLocation, useParams } from "react-router-dom";

const Profile = () => {
  const { id } = useParams()
  const { user } = useUserContext()
  const { pathname } = useLocation()

  const { data: currentUser } = useGetUserById(id || '')

  if (!currentUser)
  return (
    <div className="flex-center w-full h-full">
      <Loader />
    </div>
  );

  return (
    <section className="profile-container">
      <div className="profile-inner_container">
        <div className="flex xl:flex-row flex-col flex-1 gap-7 items-center">
          <img 
            src={currentUser.imageUrl || '/assets/icons/profile-placeholder.svg'} 
            alt="profile"
            className="w-28 h-28 lg:h-36 lg:w-36 rounded-full" 
          />
          <div className="flex flex-col flex-1 justify-between md:t-2">
            <div className="flex flex-col w-full">
              <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">
                {currentUser.name}
              </h1>
              <p className="small-regular md:body-medium text-light-3 text-center xl:text-left">
                @{currentUser.username}
              </p>
            </div>

            <div>
              <StatBlock value={currentUser.posts.length} label="Posts" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Profile