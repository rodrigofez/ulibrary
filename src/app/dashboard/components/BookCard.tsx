import { Book } from "@prisma/client";
import clsx from "clsx";
import Image from "next/image";

type Props = Book & {
  onClick?: (book: Book) => void;
  isSelected?: boolean;
};

const BookCard = (props: Props) => {
  const handleClick = () => {
    if (props.onClick) props.onClick(props);
  };

  return (
    <div
      onClick={handleClick}
      className={clsx(
        "w-[160px] group h-auto hover:bg-blue-500 hover:cursor-pointer flex flex-col gap-2 rounded-xl p-3 transition-all hover:scale-95",
        { "bg-blue-500": props.isSelected }
      )}
    >
      <div className=" relative rounded-[--radius] border-border border-[1px] h-52 overflow-hidden">
        <Image
          alt="Book cover"
          fill
          style={{ objectFit: "cover" }}
          src={props.coverImage || "/placeholder.png"}
        ></Image>
      </div>
      <div className="p-1 ">
        <h4
          className={clsx(
            "line-clamp-3 break-words font-semibold text-sm group-hover:text-white",
            {
              "text-white": props.isSelected,
            }
          )}
        >
          {props.title}
        </h4>
        <div
          className={clsx(
            "line-clamp-3 break-words text-xs text-gray-500 group-hover:text-white",
            {
              "text-white": props.isSelected,
            }
          )}
        >
          {props.author}
        </div>
      </div>
    </div>
  );
};

export default BookCard;
