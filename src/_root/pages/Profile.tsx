import Loader from "@/components/shared/Loader";
import { useUserContext } from "@/context/AuthContext";
import { useGetUserById } from "@/lib/react-query/queriesAndMutations";
import { useLocation, useParams } from "react-router-dom";

interface StabBlockProps {
  value: string | number;
  label: string;
}

const StabBlock = ({ value, label }: StabBlockProps) => {
  <div className="flex-center gap-2">
    <p className="small-semibold lg:body-bold text-primary-500">{value}</p>
    <p className="small-medium lg:base-medium text-light-2">{label}</p>
  </div>
}

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

      </div>
    </section>
  )
}

export default Profile