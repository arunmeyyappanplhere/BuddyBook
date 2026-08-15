import defaultImage from "/default_avatar.png";
const RecentContactCard = ({
  contactName = "User",
  role = "User role",
  contactNumber = 1234567890,
  contactImage,
}) => {
  return (
    <div className="bg-[#f9f9f934] w-full shadow-xs rounded-sm flex gap-10 items-center py-1 px-4 cursor-pointer">
      <img
        src={
          contactImage
            ? `${import.meta.env.VITE_API_BASE_URL}/public/profileImages/${contactImage}`
            : defaultImage
        }
        alt=""
        className="size-15 rounded-full"
      />
      <div>
        <h1 className="font-medium text-md">{contactName}</h1>
        <h2 className="text-gray-500 text-sm text-wrap">{role}</h2>
      </div>
      <h2 className="font-medium text-sm ml-auto text-nowrap">
        {contactNumber}
      </h2>
    </div>
  );
};

export default RecentContactCard;
