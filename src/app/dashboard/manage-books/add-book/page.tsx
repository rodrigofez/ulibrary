import { getAuthSession } from "@/lib/nextauth";
import BookForm from "./components/book-form";

type Props = {};

export const metadata = {
  title: "Add book",
  description: "Add a new book to your library",
};

const AddBook = async (props: Props) => {
  const session = await getAuthSession();

  return (
    <div className="max-w-lg p-4">
      <BookForm />
    </div>
  );
};

export default AddBook;
