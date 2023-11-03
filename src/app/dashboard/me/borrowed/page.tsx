import BorrowedTable from "./components/BorrowedTable";

type Props = {};

const Borrowed = async (props: Props) => {
  return (
    <div className="p-6">
      <BorrowedTable />
    </div>
  );
};

export default Borrowed;
