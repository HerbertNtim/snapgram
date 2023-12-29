import Loader from "@/components/shared/Loader";
import UserCard from "@/components/shared/UserCard";
import { useToast } from "@/components/ui/use-toast";
import { useGetUsers } from "@/lib/react-query/queriesAndMutations";

const AllUsers = () => {
  const { toast } = useToast();

  const { data: creators, isLoading, isError: isErrorCreators } = useGetUsers(10);

  if (isErrorCreators) {
    toast({ title: "Something went wrong." });
    
    return;
  }

  return (
    <section className="user-container">
      <div className="flex gap-3 py-8 px-16">
        <img src="/assets/icons/people.svg" alt="people" />
        <h2 className="h3-bold md:h2-bold">All Users</h2>
      </div>

      {isLoading && !creators ? (
          <Loader />
        ) : (
          <ul className="user-grid px-16">
            {creators?.documents.map((creator) => (
              <li key={creator?.$id} className="flex-1 min-w-[200px] w-full  ">
                <UserCard user={creator} />
              </li>
            ))}
          </ul>
        )}
    </section>
  )
}

export default AllUsers