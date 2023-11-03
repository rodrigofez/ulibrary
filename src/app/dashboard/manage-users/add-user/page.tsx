import { getAuthSession } from "@/lib/nextauth";
import AddUserForm from "./components/add-user-form";

type Props = {};

export const metadata = {
  title: "Add book",
  description: "Add a new book to your library",
};

const AddBook = async (props: Props) => {
  const session = await getAuthSession();

  //   if (!session || session.user.role !== Role.ADMIN) redirect("/");

  return (
    <div className="max-w-lg p-4">
      <AddUserForm />
    </div>
  );
};

export default AddBook;
