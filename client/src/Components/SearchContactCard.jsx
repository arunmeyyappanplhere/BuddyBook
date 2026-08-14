import defaultImage from "/default_avatar.png";
import { useNavigate } from "react-router";

const SearchContactCard = ({
  contact_id,
  contactImage,
  contactName,
  contactNumber,
}) => {
  const navi = useNavigate();

  return (
    <div
      className="bg-[#f9f9f934] w-full shadow-xs rounded-sm flex gap-10 items-center py-1 px-4 cursor-pointer hover:bg-blue-100/50 transition"
      onClick={() => navi(`/contact-profile/${contact_id}`)}
    >
      <img
        src={
          contactImage
            ? `http://localhost:8000/public/profileImages/${contactImage}`
            : defaultImage
        }
        alt=""
        className="size-15 rounded-full"
      />
      <div>
        <h1 className="font-medium text-md">{contactName}</h1>
        <h2 className="text-gray-500 text-sm">{contactNumber}</h2>
      </div>
    </div>
  );
};

export default SearchContactCard;
